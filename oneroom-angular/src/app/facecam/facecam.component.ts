import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from 'canvas';

import * as faceapi from 'face-api.js';
import { GlassesType } from '../services/OnePoint/model/glasses-type.enum';
import { Face } from '../services/OnePoint/model/face';
import { User } from '../services/OnePoint/model/user';
import { Group } from '../services/cognitive/person-group.service';
import { FaceProcessService } from '../utilities/face-process.service';
import { UserService } from '../services/OnePoint/user.service';
import { FaceService } from '../services/OnePoint/face.service';

@Component({
  selector: 'app-facecam',
  templateUrl: './facecam.component.html',
  styleUrls: ['./facecam.component.css']
})
export class FacecamComponent implements OnInit {

  /* input stream devices */
  @ViewChild('devices')
  public videoSelect;
  /* selector */
  public selectors;

  @ViewChild('canvas')
  public canvas;
  @ViewChild('webcam')
  public video;
  private stream;

  private lock = false;

  constructor(
    private faceProcess: FaceProcessService,
    private userService: UserService,
    private faceService: FaceService
  ) {}

  ngOnInit() {
    this.opencam();
    this.loadModels();
    this.startStream();
  }

  async loadModels() {
    await faceapi.loadSsdMobilenetv1Model('../../assets/models/');
    await faceapi.loadTinyFaceDetectorModel('../../assets/models/');
    await faceapi.loadFaceLandmarkModel('../../assets/models/');
    await faceapi.loadFaceLandmarkTinyModel('../../assets/models/');

    setTimeout( () => {
      setInterval(() => { this.detectFaces(); }, 1500);
    }, 1000);

  }

  public async detectFaces() {
        // small input size => near the webcam
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.65 });
        const fullFaceDescriptions = await faceapi.detectAllFaces(this.canvas.nativeElement, options).withFaceLandmarks(true);
        const detectionsArray = fullFaceDescriptions.map(fd => fd.detection);
        await faceapi.drawDetection(this.canvas.nativeElement, detectionsArray, { withScore: false });
        const landmarksArray = fullFaceDescriptions.map(fd => fd.landmarks);
        await faceapi.drawLandmarks(this.canvas.nativeElement, landmarksArray, { drawLines: true });
        console.log('Detected : ' + fullFaceDescriptions.length);
        if (fullFaceDescriptions.length > 0) {
            const imgData = this.capture();
            if (!this.lock) {
              this.lock = true;
              setTimeout( () => {
                console.log('Sending to face API');
                this.imageCapture(imgData);
                this.lock = false;
              }, 20000);
            }
        }
  }

  private opencam() {
    /* initialize lib */
    navigator.mediaDevices
              .enumerateDevices()
              .then((d) => {
                this.selectors = this.getCaptureDevices(d);
              })
              .catch(this.handleError);
  }

  /* Crop image from canvas and returns a new canvas : call capture first ! */
  private crop(x1, y1, x2, y2) {
    // get your canvas and a context for it
    const ctx = this.canvas.getContext('2d');
    // get the image data you want to keep.
    const imageData = ctx.getImageData(x1, y1, x2, y2);
    // create a new cavnas same as clipped size and a context
    const newCan = document.createElement('canvas');
    // define sizes
    newCan.width = x2 - x1;
    newCan.height = y2 - y1;
    const newCtx = newCan.getContext('2d');
    // put the clipped image on the new canvas.
    newCtx.putImageData(imageData, 0, 0);
    return newCan;
  }

  /* take a capture of the video stream and returns an image element : call stream first ! */
  private capture() {
    return this.canvas.nativeElement.toDataURL('image/png');
  }

  /* record a video from the camera and returns a video element : call stream first !*/
  private record(btnStop, container) {
    const ctx = canvas.getContext('2d');
    let rafId = null;
    const frames = [];
    const CANVAS_WIDTH = canvas.width;
    const CANVAS_HEIGHT = canvas.height;

    function drawVideoFrame(time) {
        rafId = requestAnimationFrame(drawVideoFrame);
        ctx.drawImage(this.video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const dataVid = canvas.toDataURL('image/webp', 1);
        const frame = dataVid.split(',');
        frames.push(frame[1]);
    }

    rafId = requestAnimationFrame(drawVideoFrame); // Note: not using vendor prefixes!

    btnStop.addEventListener('click', function stop() {
        // Note: not using vendor prefixes!
        cancelAnimationFrame(rafId);
        // 2nd param: framerate for the video file.
        const webmBlob = this.base64ToBlobVideo(frames, 'video/webm', 1000 / 60);
        const video = document.createElement('video');
        const url = URL.createObjectURL(webmBlob);
        video.src = url;
        container.appendChild(video);
    });
  }

   /* Start or restart the stream using a specific videosource and inject it in a container */
  public startStream() {

    if (navigator.mediaDevices) {
        // select specific camera on mobile
        const videoSource = this.videoSelect.nativeElement.value;
        console.log(videoSource);
        // access the web cam
        navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: videoSource ? { exact: videoSource } : undefined
            }
        })
            // permission granted:
            .then( (stream) => {
                // on getUserMedia
                this.video.nativeElement.srcObject = stream;
                this.video.nativeElement.play();
                // set canvas size = video size when known
                this.video.nativeElement.addEventListener('loadedmetadata', () => {
                  this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
                  this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
                });

                this.video.nativeElement.addEventListener('play', () => {
                  // tslint:disable-next-line:only-arrow-functions
                  const $this = this.video.nativeElement;
                  const $ctx = this.canvas.nativeElement.getContext('2d');
                  function loop() {
                    if (!$this.paused && !$this.ended) {
                      $ctx.drawImage($this, 0, 0, $this.videoWidth, $this.videoHeight);
                      setTimeout(loop, 1000 / 30); // drawing at 30fps
                    }
                  }
                  requestAnimationFrame(loop);
                }, 0);
                // edge
                // video.src = window.URL.createObjectURL(stream);
            })
            // permission denied:
            .catch( (error) => {
              console.log(error);
              document.body.textContent = 'Could not access the camera. Error: ' + error.name;
            });
    }
    return this.video;
  }

   /* Detect possible capture devices */
  private getCaptureDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    const videouputs = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < deviceInfos.length; i++) {
        if (deviceInfos[i].kind === 'videoinput') {
          videouputs.push({ id: deviceInfos[i].deviceId, label: deviceInfos[i].label});
        }
    }

    return videouputs;
  }

  /* handles all type of errors from usermedia API */
  private handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
  }

  /* convert img|video element into blob to send using ajax */
  private convertToBlob(img) {
    if (img === null || img === undefined) {
      return false;
    }
    // get image url data
    const ImageURL = img.src;
    // Split the base64 string in data and contentType
    const block = ImageURL.split(';');
    // Get the content type of the image
    const contentType = block[0].split(':')[1];
    // In this case "image/png"
    // get the real base64 content of the file
    const realData = block[1].split(',')[1];
    // Convert it to a blob to upload
    const blob = this.base64ToBlob(realData, contentType, null);
    return blob;
}

  /* convert base 64 string into blob img */
  private base64ToBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }


    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

  /* convert base 64 array of string into blob video */
  private base64ToBlobVideo(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    const byteArrays = [];
    // tslint:disable-next-line:prefer-for-of
    for (let idx = 0; idx < b64Data.length; idx++) {

        const byteCharacters = atob(b64Data[idx]);

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

async imageCapture(dataUrl) {
  console.log('capturing image');
  const stream = this.makeblob(dataUrl);
  const group = new Group();
  group.personGroupId = 'mic2019';
  group.name = 'mic_stage_2019';
  group.userData = 'Group de test en developpement pour oneroom';
  // traitement face API
  // return an observable;
  const res$ = this.faceProcess.byImg(stream.blob, group);
  res$.subscribe(
    (data) => {
      const users: User[] = [];
      data.persons.forEach(element => {
        const u = new User();
        u.name = 'test';
        u.userId = element.person.personId;
        u.faces = [];
        element.faces.forEach(face => {
          const f = new Face();
          f.faceId = face.faceId;
          f.age = face.faceAttributes.age;
          f.baldLevel = face.faceAttributes.hair.bald;
          f.beardLevel = face.faceAttributes.facialHair.beard;
          f.glassesType = face.faceAttributes.glasses === 'NoGlasses' ?
          GlassesType.NoGlasses : face.faceAttributes.glasses === 'ReadingGlasses' ?
          GlassesType.ReadingGlasses : face.faceAttributes.glasses === 'SunGlasses' ?
          GlassesType.Sunglasses : GlassesType.SwimmingGoggles ;
          f.hairColor = face.faceAttributes.hair.hairColor[0].color;
          f.isMale = face.faceAttributes.gender === 'male';
          f.moustacheLevel = face.faceAttributes.facialHair.moustache;
          f.smileLevel = face.faceAttributes.smile;
          let emotion = 0;
          let emotionType = '';
          if (face.faceAttributes.emotion.anger > face.faceAttributes.emotion.contempt) {
            emotion = face.faceAttributes.emotion.anger;
            emotionType = 'anger';
          } else {
            emotion = face.faceAttributes.emotion.contempt;
            emotionType = 'contempt';
          }
          if (emotion > face.faceAttributes.emotion.disgust) {
            emotion =  face.faceAttributes.emotion.disgust;
            emotionType = 'disgust';
          }
          if (emotion > face.faceAttributes.emotion.fear) {
            emotion = face.faceAttributes.emotion.fear;
            emotionType = 'fear';
          }
          if (emotion > face.faceAttributes.emotion.happinness) {
            emotion = face.faceAttributes.emotion.happinness;
            emotionType = 'happinness';
          }
          if (emotion > face.faceAttributes.emotion.neutral) {
            emotion = face.faceAttributes.emotion.neutral;
            emotionType = 'neutral';
          }
          if (emotion > face.faceAttributes.emotion.sadness) {
            emotion = face.faceAttributes.emotion.sadness;
            emotionType = 'sadness';
          }
          if (emotion > face.faceAttributes.emotion.surprise) {
            emotion = face.faceAttributes.emotion.surprise;
            emotionType = 'surprise';
          }
          f.emotionDominant = emotionType;
          u.faces.push(f);
        });
        u.generateAvatar();
        users.push(u);
      });

      // adding users
      for (const user of users) {
        const user$ = this.userService.addUser(user);
        user$.subscribe(
          (response) => console.log(response)
        , (error) => {
            console.log(error);
            if (error.status === 409 && error.ok === false) {
              // update avatar
              const avatar$ = this.userService.updateAvatar(user.userId, user.urlAvatar);
              // tslint:disable-next-line:no-shadowed-variable
              avatar$.subscribe((response) => console.log(response), (error) => console.log(error));
              // adding face to already existant user
              for (const face of user.faces) {
                  console.log('adding face');
                  const face$ = this.faceService.addFace(user.userId, face);
                  face$.subscribe(
                  (response) => {
                    console.log('Avatar updated');
                    console.log(response);
                  },
                  // tslint:disable-next-line:no-shadowed-variable
                  (error) => {
                    console.log(error);
                  });
              }
            }
        });
      }
      data = null;
    }
  );
}

  // transform dataUrl in blob
  private makeblob(dataURL) {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
        // tslint:disable-next-line:no-shadowed-variable
        const parts = dataURL.split(',');
        // tslint:disable-next-line:no-shadowed-variable
        const contentType = parts[0].split(':')[1];
        // tslint:disable-next-line:no-shadowed-variable
        const raw = decodeURIComponent(parts[1]);
        return {
          rawlength: raw.length,
          blob: new Blob([raw], { type: contentType })
        };
    }
    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return {
      rawlength: raw.length,
      blob: new Blob([uInt8Array], { type: contentType })
    };
    }

}
