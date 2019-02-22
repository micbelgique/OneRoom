import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

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
import { FaceRectangle } from '../services/cognitive/face/model/face-rectangle';
import { VisioncomputerService } from '../services/cognitive/vision/visioncomputer.service';
import { MatSnackBar, MatDialog } from '@angular/material';

@Component({
  selector: 'app-facecam',
  templateUrl: './facecam.component.html',
  styleUrls: ['./facecam.component.css']
})
export class FacecamComponent implements OnInit, OnDestroy {

  /* input stream devices */
  @ViewChild('devices')
  public videoSelect;
  /* selector */
  public selectors;

  @ViewChild('canvas2')
  public canvas2;
  @ViewChild('webcam')
  public video;
  private stream;

  displayStream = 'none';
  isLoading = true;

  private streamId;
  private detectId;

  private lock = false;

  // alert
  alertContainer = false;
  alertMessage = '';

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private faceProcess: FaceProcessService,
    private userService: UserService,
    private faceService: FaceService,
    private visonComputerService: VisioncomputerService
  ) {}

  async ngOnInit() {
    // init lock
    this.alertContainer = false;
    this.lock = false;
    this.opencam();
    await this.loadModels();
  }

  private async loadModels() {
    await faceapi.loadSsdMobilenetv1Model('assets/models/').then(
      async () => await faceapi.loadFaceLandmarkModel('assets/models/').finally(
        async () => {
            this.initStreamDetection();
        }
      )
    );
    //
    // await faceapi.loadTinyFaceDetectorModel('../../assets/models/');
    // await faceapi.loadFaceLandmarkTinyModel('../../assets/models/');
  }

  initStreamDetection() {
    if (!this.stream) {
      this.startStream();
      if (!this.detectId) {
        this.detectId = setInterval( () => {
          this.detectFaces();
        }, 1000);
      }
    }
  }

  public async detectFaces() {
        // clear overlay
        const ctx = this.canvas2.nativeElement.getContext('2d');
        ctx.clearRect(0, 0, this.canvas2.nativeElement.width, this.canvas2.nativeElement.height);
        ctx.stroke();
        const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.65});
        // const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.65 });
        const fullFaceDescriptions = await faceapi.detectSingleFace(this.video.nativeElement, options).withFaceLandmarks();
        // if (fullFaceDescriptions.length > 0) {
        if (fullFaceDescriptions !== undefined && fullFaceDescriptions !== null) {
        // const detectionsArray = fullFaceDescriptions.map(fd => fd.detection);
        await faceapi.drawDetection(this.canvas2.nativeElement, fullFaceDescriptions.detection, { withScore: false });
        // const landmarksArray = fullFaceDescriptions.map(fd => fd.landmarks);
        // await faceapi.drawLandmarks(this.canvas2.nativeElement, fullFaceDescriptions.landmarks, { drawLines: true });
        if (this.lock === false) {
              console.log('Preparing call and locking');
              // const imgData = this.capture();
              const imgData = faceapi.createCanvasFromMedia(this.video.nativeElement).toDataURL('image/png');
              this.lock = true;
              setTimeout( () => {
                this.imageCapture(imgData);
              }, 6000);
            }
        }

        if (this.displayStream === 'none') {
          this.displayStream = 'block';
          this.isLoading = false;
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

   /* Start or restart the stream using a specific videosource and inject it in a container */
  public startStream() {

    if (navigator.mediaDevices) {
        // select specific camera on mobile
        const videoSource = this.videoSelect.nativeElement.value;
        // access the web cam
        navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: videoSource ? { exact: videoSource } : undefined
            }
        })
            // permission granted:
            .then( (stream) => {
                this.alertContainer = false;
                // on getUserMedia
                this.video.nativeElement.srcObject = stream;
                this.video.nativeElement.play();
                // set canvas size = video size when known
                this.video.nativeElement.addEventListener('loadedmetadata', () => {
                  // OLD
                  // this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
                  // this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
                  // overlay
                  this.canvas2.nativeElement.width = this.video.nativeElement.videoWidth;
                  this.canvas2.nativeElement.height = this.video.nativeElement.videoHeight;
                });

                /* NOT NEEDED ANYMORE
                const loop = () => {
                  if (!this.video.nativeElement.paused && !this.video.nativeElement.ended) {
                    this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement,
                      0, 0, this.video.nativeElement.videoWidth, this.video.nativeElement.videoHeight);
                  }
                  this.streamId = setTimeout(loop, 1000 / 30); // drawing at 30fps
                };

                this.video.nativeElement.addEventListener('play', () => {
                  // requestAnimationFrame(loop);
                }, 0);*/
            })
            // permission denied:
            .catch( (error) => {
              console.log('Camera init failed : ' + error.name);
              this.alertContainer = true;
              this.alertMessage = 'Could not access the camera. Error: ' + error.name;
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

  imageCapture(dataUrl) {
  if (localStorage.getItem('cognitiveStatus') === 'false') {
    console.log('calls disabled');
    return;
  }
  let sub$;
  try {
  console.log('starting');
  const stream = this.makeblob(dataUrl);
  const group = new Group();
  let skinColor = '';
  this.visonComputerService.getSkinColor(stream.blob).subscribe(
    (result) => {
      skinColor = result.predictions[0].tagName;
      console.log(skinColor);
    }
  );

  group.personGroupId = localStorage.getItem('groupid');
  group.name = 'mic_stage_2019';
  group.userData = 'Group de test en developpement pour oneroom';
  // traitement face API
  // return an observable;
  const res$ = this.faceProcess.byImg(stream.blob, group);
  sub$ = res$.subscribe(
    (data) => {
      sub$.unsubscribe();
      if (data === null) {
        console.log('lock disabled');
        this.lock = false;
        return;
      }

      console.log('detection');
      let users: User[] = [];
      data.persons.forEach(element => {
        console.log('person');
        const u = new User();
        u.name = 'user_' + Math.random();
        u.userId = element.person.personId;
        u.faces = [];
        element.faces.forEach(face => {
          console.log('face');
          const f = new Face();
          f.faceId = face.faceId;
          f.age = face.faceAttributes.age;
          f.baldLevel = face.faceAttributes.hair.bald;
          f.beardLevel = face.faceAttributes.facialHair.beard;
          f.glassesType = face.faceAttributes.glasses === 'NoGlasses' ?
          GlassesType.NoGlasses : face.faceAttributes.glasses === 'ReadingGlasses' ?
          GlassesType.ReadingGlasses : face.faceAttributes.glasses === 'SunGlasses' ?
          GlassesType.Sunglasses : GlassesType.SwimmingGoggles ;
          // check haircolor
          if (face.faceAttributes.hair.hairColor.length > 0) {
            f.hairColor = face.faceAttributes.hair.hairColor[0].color;
          } else {
            f.hairColor = '';
          }
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
          f.skinColor = skinColor;
          u.faces.push(f);
        });
        u.generateAvatar();
        users.push(u);
      });

      // adding users
      for (const user of users) {
        const user$ = this.userService.addUser(user);
        user$.subscribe(
          (response) => {
            this.snackBar.open('User created', 'Ok', {
              duration: 2000
            });
            this.lock = false;
          }
        , (error) => {
            if (error.status === 409 && error.ok === false) {
              this.snackBar.open('User recognized', 'Ok', {
                duration: 2000
              });
              // update avatar
              const avatar$ = this.userService.updateAvatar(user.userId, user.urlAvatar);
              // tslint:disable-next-line:no-shadowed-variable
              avatar$.subscribe(
                (response) => console.log('avatar updated'),
                // tslint:disable-next-line:no-shadowed-variable
                (error) => console.log('avatar not updated')
              );
              // adding face to already existant user
              // for (const face of user.faces) {
              if (user.faces[user.faces.length - 1]) {
                const face = user.faces[user.faces.length - 1];
                console.log('adding face');
                const face$ = this.faceService.addFace(user.userId, face);
                face$.subscribe(
                    () => {
                      console.log('Face added');
                      this.lock = false;
                    },
                    (err) => {
                      console.log(err);
                      this.lock = false;
                });
              }
              // }
            }
        });
      }
      users = null;
    },
    () => {
      sub$.unsubscribe();
      console.log('Error 429');
      this.lock = false;
    }
  );
  } catch (e) {
    console.log('Error : ' + e.message);
    console.log(e);
  }
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

    ngOnDestroy(): void {
      clearInterval(this.detectId);
      clearTimeout(this.streamId);
    }

}
