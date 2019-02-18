import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from 'canvas';

import * as faceapi from 'face-api.js';

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

  constructor() {}

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
        const fullFaceDescriptions = await faceapi.detectAllFaces(this.canvas.nativeElement).withFaceLandmarks();
        const detectionsArray = fullFaceDescriptions.map(fd => fd.detection);
        await faceapi.drawDetection(this.canvas.nativeElement, detectionsArray, { withScore: false });
        console.log('Detected : ' + fullFaceDescriptions.length);
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
    const width = this.video.offsetWidth;
    const height = this.video.offsetHeight;

    this.canvas = this.canvas || document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;

    const context = this.canvas.getContext('2d');
    context.drawImage(this.video, 0, 0, width, height);
    const img = document.createElement('img');
    img.src = this.canvas.toDataURL('image/png');
    return img;
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
  private startStream() {

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

}
