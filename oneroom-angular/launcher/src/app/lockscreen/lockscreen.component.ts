
import * as faceapi from 'face-api.js';

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Group, FaceProcessService } from '@oneroomic/facecognitivelibrary';
import { UserService, Game } from '@oneroomic/oneroomlibrary';
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
  buttonLock = false;

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
  }

  initStreamDetection(videoSource = null) {
      this.startStream(videoSource);
      console.log('starting scan');
      if (!this.detectId) {
        // detection interval: default 3000
        this.detectId = setInterval( () => {
          console.log('Scanning for faces');
          this.detectFaces();
        }, 1000);
      }
  }

  public unLock(videoSource = null) {
    if (this.buttonLock === false) {
      this.lock = false;
      this.toast.open('Scan en cours', 'Ok', {
        duration : 3000
      });
      this.initStreamDetection(videoSource);
    } else {
      this.toast.open('Scan interrompu', 'Ok', {
        duration : 3000
      });
      this.stopCapture();
    }
    this.buttonLock = !this.buttonLock;
  }

  public async detectFaces() {
        this.clearOverlay();
        const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.75});
        const fullFaceDescriptions = await faceapi.detectSingleFace(this.video.nativeElement, options)
                                    .withFaceLandmarks();
        if (fullFaceDescriptions !== undefined && fullFaceDescriptions !== null) {
        if (this.lock === false) {
              this.toast.open('Visage détecté', 'Ok', {
                duration : 1000
              });
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
        if (this.selectors.map(s => s.id).indexOf(this.videoSource) === -1) {
          // check if prefered cam is available in the list
          this.videoSource = null;
        }
        // select specific camera on mobile
        this.videoSource = videoSource === null ?
        ( this.videoSource ? this.videoSource : this.selectors[0].id) : videoSource;

        // save prefered cam
        localStorage.setItem('camId', this.videoSource);

        // access the web cam
        navigator.mediaDevices.getUserMedia({
            audio : false,
            video: {
                // selfie mode
                // facingMode: 'user',
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

  imageCapture(dataUrl) {
  // face api calls enabled ?
  if (localStorage.getItem('cognitiveStatus') === 'false') {
    this.toast.open('Appels Face désactivés', 'Ok', {
      duration : 1000
    });
    return;
  }
  try {
    const stream = this.makeblob(dataUrl);
    // set du groupe
    const group = new Group();
    if (localStorage.getItem('gameData')) {
      const currentGame = JSON.parse(localStorage.getItem('gameData'));
      group.personGroupId = currentGame.groupName;
      group.name = currentGame.groupName;
      group.userData = '';
    } else {
      this.lock = false;
      return;
    }
    // timeout to unlock detection
    setTimeout(() => {
      this.lock = false;
    }, 2500);
    // traitement face API
    // return an observable;
    this.faceProcess.detectOnly(stream.blob, group).subscribe(
    (result) => {
      console.log(result);
      if (result === null) {
        this.lock = false;
      } else {
        this.userService.getUser(result).subscribe(
          (result1) => {
            localStorage.setItem('user', JSON.stringify(result1));
            this.route.navigate(['/nav']);
          });
      }
    });
  } catch (e) {
    console.log('Error : ' + e.message);
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
      clearTimeout(this.streamId);
      this.stopCapture();
    }

    private stopCapture() {
      clearInterval(this.detectId);
      this.detectId = null;
      // stop camera capture
      if (this.stream !== undefined && this.stream !== null) {
        this.stream.getTracks().forEach(
          (track) => {
          track.stop();
      });
      }
    }
}
