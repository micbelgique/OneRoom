import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FaceProcessService, Group } from '@oneroomic/facecognitivelibrary';
import { UserService } from '@oneroomic/oneroomlibrary';
import {Router} from '@angular/router';

faceapi.env.monkeyPatch({
  Canvas: HTMLCanvasElement,
  Image: HTMLImageElement,
  // tslint:disable-next-line:object-literal-shorthand
  ImageData: ImageData,
  Video: HTMLVideoElement,
  createCanvasElement: () => document.createElement('canvas'),
  createImageElement: () => document.createElement('img')
});

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.css']
})
export class LockscreenComponent implements OnInit {


  // preferred camera
  private videoSource;

  /* input stream devices */
  @ViewChild('devices')
  public videoSelect;
  /* selector devices */
  public selectors;

  // containers
  @ViewChild('canvas2')
  public canvas2;
  @ViewChild('webcam')
  public video;

  // stream video
  private stream;

  // loading models and stream not available
  displayStream = 'none';
  isLoading = true;

  private streamId;
  private detectId;

  private lock = false;
  private buttonLock = false;

  // refresh rate
  refreshRate: number;

  constructor(
    public dialog: MatDialog,
    private toast: MatSnackBar,
    private faceProcess: FaceProcessService,
    private userService: UserService,
    private route: Router
    ) { this.loadModels(); }

  ngOnInit() {
    if (localStorage.getItem('camId')) {
      this.videoSource = localStorage.getItem('camId');
      console.log(this.videoSource);
    }
    if (localStorage.getItem('user') != null) {
      this.route.navigate(['/nav']);
    } else {
      // init lock
      this.lock = false;
      // refreshRate
      this.refreshRate = 1500;
      if (localStorage.getItem('refreshRate')) {
        this.refreshRate = Number(localStorage.getItem('refreshRate'));
      }
      this.opencam();
    }
  }

  private async loadModels() {
    await faceapi.loadSsdMobilenetv1Model('assets/models/').then(
        async () => await faceapi.loadFaceLandmarkModel('assets/models/'));

    /* FACE RECOGNITION
                // async () => faceapi.loadFaceExpressionModel('assets/models/').then(
         //  async () => await faceapi.loadFaceRecognitionModel('assets/models/')
    */
  }

  initStreamDetection(videoSource = null) {
    if (!this.stream) {
      this.startStream(videoSource);
      if (!this.detectId) {
        // detection interval: default 3000
        this.detectId = setInterval( () => {
          this.detectFaces();
        }, this.refreshRate);
      }
    }
  }

  public unLock(videoSource = null) {
    if (this.buttonLock === false) {
      this.toast.open('Scan en cours', 'Ok');
      this.initStreamDetection(videoSource);
    } else {
      this.toast.open('Scan interrompu', 'Ok');
      this.stopCapture();
    }
    this.buttonLock = !this.buttonLock;
  }

  public async detectFaces() {
        this.clearOverlay();
        const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.75});
        // const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.65 });
        const fullFaceDescriptions = await faceapi.detectSingleFace(this.video.nativeElement, options)
                                    // .withFaceExpressions();
                                    .withFaceLandmarks();
                                    // .withFaceDescriptor();
        // if (fullFaceDescriptions.length > 0) {
        if (fullFaceDescriptions !== undefined && fullFaceDescriptions !== null) {
        // const detectionsArray = fullFaceDescriptions.map(fd => fd.detection);
        await faceapi.drawDetection(this.canvas2.nativeElement, fullFaceDescriptions.detection, { withScore: false });
        // tslint:disable-next-line:max-line-length
        // await faceapi.drawFaceExpressions(this.canvas2.nativeElement, ({ position: fullFaceDescriptions.detection.box, expressions: fullFaceDescriptions.expressions }));
        // const landmarksArray = fullFaceDescriptions.map(fd => fd.landmarks);
        // await faceapi.drawLandmarks(this.canvas2.nativeElement, fullFaceDescriptions.landmarks, { drawLines: true });
        if (this.lock === false) {
              console.log('Preparing call and locking');
              // const imgData = this.capture();
              const imgData = faceapi.createCanvasFromMedia(this.video.nativeElement).toDataURL('image/png');
              this.lock = true;
              this.imageCapture(imgData);
            }
        }

        if (this.displayStream === 'none') {
          this.displayStream = 'block';
          this.isLoading = false;
        }
  }

  private clearOverlay() {
    // clear overlay
    const ctx = this.canvas2.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvas2.nativeElement.width, this.canvas2.nativeElement.height);
    ctx.stroke();
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
  public startStream(videoSource = null) {

    if (navigator.mediaDevices) {
        // select specific camera on mobile
        this.videoSource = videoSource === null ?
        ( this.videoSource ? this.videoSource : this.videoSelect.nativeElement.value) : videoSource;

        // save prefered cam
        localStorage.setItem('camId', this.videoSource);

        // access the web cam
        navigator.mediaDevices.getUserMedia({
            audio : false,
            video: {
                // selfie mode
                facingMode: 'user',
                deviceId: this.videoSource ? { exact: this.videoSource } : undefined
            }
        })
            // permission granted:
            .then( (stream) => {
                this.stream = stream;
                // on getUserMedia
                this.video.nativeElement.srcObject = stream;
                this.video.nativeElement.play();
                // set canvas size = video size when known
                this.video.nativeElement.addEventListener('loadedmetadata', () => {
                  // overlay
                  this.canvas2.nativeElement.width = this.video.nativeElement.videoWidth;
                  this.canvas2.nativeElement.height = this.video.nativeElement.videoHeight;
                });
            })
            // permission denied:
            .catch( (error) => {
              console.log('Camera init failed : ' + error.name);
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
  // face api calls enabled ?
  if (localStorage.getItem('cognitiveStatus') === 'false') {
    console.log('calls disabled');
    return;
  }
  // button not pressed
  if (!this.buttonLock) {
    console.log('locked');
    this.lock = false;
    return;
  }
  try {
    const stream = this.makeblob(dataUrl);
    // set du groupe
    const group = new Group();
    if (localStorage.getItem('gameData')) {
      group.personGroupId = JSON.parse(localStorage.getItem('gameData')).groupName;
    }
    console.log('group : ' + group.personGroupId);
    group.name = 'mic_stage_2019';
    group.userData = 'Group de test en developpement pour oneroom';
    // timeout to unlock detection
    setTimeout(() => {
      this.lock = false;
    }, 2500);
    // traitement face API
    // return an observable;
    this.faceProcess.detectOnly(stream.blob, group).subscribe((result) => {
      if (result === null) {
        console.log(result);
        this.lock = false;
        return;
      } else {
        this.userService.getUser(result).subscribe(
          (result1) => {
            console.log(result1);
            this.toast.open('Hello ' + result1.name, 'Ok', {duration: 5000});
            localStorage.setItem('user', JSON.stringify(result1));
            this.route.navigate(['/nav']);
          });
      }
    });
  } catch (e) {
    console.log('Error : ' + e.message);
    console.log(e);
    // unlock capture
    this.lock = false;
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
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnDestroy(): void {
      clearInterval(this.detectId);
      clearTimeout(this.streamId);
      this.stopCapture();
    }

    private stopCapture() {
      // stop camera capture
      if (this.stream !== undefined && this.stream !== null) {
        this.stream.getTracks().forEach(
          (track) => {
          track.stop();
      });
      }
    }
}
