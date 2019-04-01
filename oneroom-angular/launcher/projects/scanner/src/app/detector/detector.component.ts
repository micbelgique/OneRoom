import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { User, LeaderboardService, GameService, Game, GameState } from '@oneroomic/oneroomlibrary';
import { MatDialog, MatSnackBar, MatBottomSheet } from '@angular/material';
import { CustomVisionPredictionService } from '@oneroomic/facecognitivelibrary';
import { BottomSheetDetailComponent } from '../bottom-sheet-detail/bottom-sheet-detail.component';

export class Objects {
  label: string;
  description: string;
  hint: string;

  constructor(label, description, hint) {
    this.label = label;
    this.description = description;
    this.hint = hint;
  }
}

@Component({
  selector: 'app-detector',
  templateUrl: './detector.component.html',
  styleUrls: ['./detector.component.css']
})
export class DetectorComponent implements OnInit, OnDestroy {


  /* input stream devices */
  /* selector devices */
  public selectors = [];
  // containers
  @ViewChild('overlay')
  public overlay;
  // canvas 2D context
  private ctx;
  @ViewChild('webcam')
  public video;

  // stream video
  private stream;

  // loading models and stream not available
  displayStream = 'none';
  isLoading = true;

  private detectId;

  // preview
  lastUsers: User[];

  // alert
  alertContainer = false;
  alertMessage = '';

  // state game
  stateContainer = false;
  stateMessage = '';

  // signalR
  private hubServiceSub;
  private gameSub;

  // refresh rate
  refreshRate: number;

  // camid
  videoSource;

  // detection overlay objects detected
  objectsOverlay: Objects[] = [];
  objectsDictionary: Objects[] = [];

  constructor(
    public dialog: MatDialog,
    private hubService: LeaderboardService,
    private gameService: GameService,
    private predictionService: CustomVisionPredictionService,
    private bottomSheet: MatBottomSheet) {
      // TODO : get from challenge in API
      this.objectsDictionary.push(
        new Objects('cup', 'J aime boire du café pendant que je code, pratique pour rester concentrer !' , ''),
        new Objects('plant', 'Du vert pour un environnement plus agréable', ''),
        // tslint:disable-next-line:max-line-length
        new Objects('phone', 'J ai besoin d appeler un client japonais pour regenerer mes identifiants', '+3225882695'),
        new Objects('glasses', 'Mes lunettes de lectures, je ne les utilise pas tout le temps', '')
      );
      this.stream = null;
      this.opencam();
    }

  ngOnInit() {
    this.detectId = null;
    if (localStorage.getItem('videoSource')) {
      this.videoSource = localStorage.getItem('videoSource');
    }
    // init detected objects array
    this.objectsOverlay = [];
    // init lock
    this.lastUsers = [];
    this.alertContainer = false;
    this.stateContainer = false;
    // save canvas context
    this.ctx = this.overlay.nativeElement.getContext('2d');
    // refreshRate
    this.refreshRate = 3000;
    if (localStorage.getItem('refreshRate')) {
      this.refreshRate = Number(localStorage.getItem('refreshRate'));
      if (this.refreshRate < 250) {
        this.refreshRate = 3000;
      }
    }
    // game context
    if (localStorage.getItem('gameData')) {
      const game: Game = JSON.parse(localStorage.getItem('gameData'));
      this.hubServiceSub = this.hubService.run().subscribe();
      this.gameSub = this.hubService.refreshGameState.subscribe(
      (gameId) => {
        if (gameId === game.gameId) {
          console.log('Updating state ...');
          this.refreshGameState(game);
        }
      });

      this.refreshGameState(game);
    }
  }

  initStreamDetection() {
    if (this.stream === null) {
      this.startStream();
      if (this.detectId === null) {
        // detection interval: default 3000
        this.detectId = setInterval( () => {
          // state still registering
          if (!this.stateContainer) {
            if (this.stream !== null) {
              this.detectObjects();
            } else {
              clearInterval(this.detectId);
            }
          }
        }, 1000);
      }
    }
  }

  detectObjects() {
        console.log('calling custom vision');
        this.clearOverlay();

        this.imageCapture(this.video.nativeElement);

        if (this.displayStream === 'none') {
          this.displayStream = 'block';
          this.isLoading = false;
        }
  }

  // clear canvas overlay
  private clearOverlay() {
    this.ctx.clearRect(0, 0, this.overlay.nativeElement.width, this.overlay.nativeElement.height);
  }

  private drawOverlay(x, y, w, h, title = null) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    if (title !== null) {
      this.ctx.font = '20px Arial';
      this.ctx.fillText(title, x + (w * 0.05), y + (h / 1.05));
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }

  /* initialize capture webcam */
  private opencam() {
    navigator.mediaDevices
              .enumerateDevices()
              .then((d) => {
                this.selectors = this.getCaptureDevices(d);
                this.initStreamDetection();
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
        this.videoSource = videoSource ? videoSource : (this.videoSource ? this.videoSource : this.selectors[0].id);
        localStorage.setItem('videoSource', this.videoSource);
        // access the web cam
        navigator.mediaDevices.getUserMedia({
            audio : false,
            video: {
                // selfie mode
                // facingMode: {exact: 'user' },
                deviceId: this.videoSource ? { exact: this.videoSource } : undefined
            }
        })
            // permission granted:
            .then( (stream) => {
                this.stream = stream;
                this.alertContainer = false;
                // on getUserMedia
                this.video.nativeElement.srcObject = stream;
                this.video.nativeElement.play();
                // set canvas size = video size when known
                this.video.nativeElement.addEventListener('loadedmetadata', () => {
                  // overlay
                  this.overlay.nativeElement.width = this.video.nativeElement.videoWidth;
                  this.overlay.nativeElement.height = this.video.nativeElement.videoHeight;
                });
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

  private crop(canvas, x1, y1, width, height) {
    // get your canvas and a context for it
    const ctx = canvas.getContext('2d');
    // get the image data you want to keep.
    const imageData = ctx.getImageData(x1 / 1.5, y1 / 1.5, width * 1.5, height * 1.5);
    // create a new cavnas same as clipped size and a context
    const newCan = document.createElement('canvas');
    // define sizes
    newCan.width = width * 1.5;
    newCan.height = height * 1.5;
    const newCtx = newCan.getContext('2d');
    // put the clipped image on the new canvas.
    newCtx.putImageData(imageData, 0, 0);
    return newCan;
  }

  imageCapture(video) {
    const canvas = document.createElement('canvas');
    canvas.width = this.overlay.nativeElement.width;
    canvas.height = this.overlay.nativeElement.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const blob = this.makeblob(canvas.toDataURL());
    this.predictionService.set('https://westeurope.api.cognitive.microsoft.com/customvision/v2.0/', '8139b0c8c2a54b59861bbe5e7e089d2b');
    const detection$ = this.predictionService.predictImageWithNoStore(blob.blob, '5ab1f20a-0826-4d7f-8c6c-093a37e2e93a');
    detection$.subscribe(
      (predictions: any) => {
        predictions.predictions.forEach(
          p => {
            if (p.probability >= 0.50) {
              this.drawOverlay(
                p.boundingBox.left * this.overlay.nativeElement.width,
                p.boundingBox.top * this.overlay.nativeElement.height,
                p.boundingBox.width * this.overlay.nativeElement.width,
                p.boundingBox.height * this.overlay.nativeElement.height,
                p.tagName
                );

              if (this.objectsOverlay.map(o => o.label).indexOf(p.tagName) === -1) {
                const idx = this.objectsDictionary.map(o => o.label).indexOf(p.tagName);
                const obj = this.objectsDictionary[idx];
                this.objectsOverlay.push(obj);
                setTimeout(() => {
                  this.objectsOverlay.pop();
                }, 5000);
              }
              console.log(p.tagName + ' ' + (p.probability * 100) + ' % ');
            }
          }
        );
      }
    );
    /*const result = this.objects.predict(canvas);
    const label = result.argMax(1).get([0]);
    console.log(label);
    const prediction = this.objects.getTopKClasses(result, 1);
    this.detection = ' Found : ' + prediction[0].label + ' with ' + prediction[0].value + '';
    console.log(this.detection);*/
  }

  openBottomSheet(o: Objects) {
    this.bottomSheet.open(BottomSheetDetailComponent, { data: o });
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

    /* Update the game state */
    refreshGameState(game: Game) {
      const res$ = this.gameService.getStateGame(game.groupName);
      res$.subscribe(
        (state) => {
          console.log(state);
          if (state !== GameState.REGISTER) {
            this.stopCaptureStream();
            this.stateMessage = 'Enregistrement des participants désormais cloturé !';
            this.stateContainer = true;
            this.displayStream = 'none';
          } else {
            this.stateMessage = '';
            this.stateContainer = false;
            this.detectId = null;
            this.stream = null;
            this.opencam();
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }

    private stopCaptureStream() {
      // stop camera capture
      if (this.stream) {
        this.stream.getTracks().forEach(
          (track) => {
          track.stop();
        });
      }
    }

    ngOnDestroy(): void {
      this.stopCaptureStream();
      clearInterval(this.detectId);
      this.detectId = null;
      this.stream = null;
      // stop game context signal
      if (localStorage.getItem('gameData')) {
        if (this.hubServiceSub) {
          this.hubServiceSub.unsubscribe();
        }
        if (this.gameSub) {
          this.gameSub.unsubscribe();
        }
        if (this.hubService.connected.isStopped) {
          this.hubService.stopService();
        }
      }
    }


}
