import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import * as faceapi from 'face-api.js';
// tslint:disable-next-line:max-line-length
import { Group, FaceProcessService, VisioncomputerService, HairlengthService, CustomVisionPredictionService, EndPointGetterService, ImagePrediction } from '@oneroomic/facecognitivelibrary';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
// tslint:disable-next-line:max-line-length
import { User, UserService, FaceService, LeaderboardService, GameService, Game, Face, GlassesType, GameState } from '@oneroomic/oneroomlibrary';
// patch electron
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
  selector: 'app-facecam',
  templateUrl: './facecam.component.html',
  styleUrls: ['./facecam.component.css']
})
export class FacecamComponent implements OnInit, OnDestroy {

  /* input stream devices */
  /* selector devices */
  public selectors;
  // containers
  @ViewChild('canvas2')
  public overlay;
  // canvas 2D context
  private ctx;
  @ViewChild('webcam')
  public video;

  // stream video
  private stream;
  // face detections options
  private options;

  // loading models and stream not available
  displayStream = 'none';
  isLoading = true;

  private detectId;

  private lock = false;

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

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private faceProcess: FaceProcessService,
    private userService: UserService,
    private faceService: FaceService,
    private customVisionPredictionService: CustomVisionPredictionService,
    private endpointService: EndPointGetterService,
    private hubService: LeaderboardService,
    private gameService: GameService) {
      this.opencam();
      this.loadModels();
    }

  ngOnInit() {
    // init lock
    this.lastUsers = [];
    this.alertContainer = false;
    this.stateContainer = false;
    this.lock = false;
    if (localStorage.getItem('videoSource')) {
      this.videoSource = localStorage.getItem('videoSource');
    }
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

  private async loadModels() {
    this.options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.60});

    await faceapi.loadSsdMobilenetv1Model('assets/models/').then(
        async () => await faceapi.loadFaceLandmarkModel('assets/models/')).then(
          async () => {
            // init stream
            this.initStreamDetection();
          }
        );
  }

  initStreamDetection() {
    if (!this.stream) {
      this.startStream();
      if (!this.detectId) {
        // detection interval: default 3000
        this.detectId = setInterval( () => {
          // state still registering
          if (!this.stateContainer) {
            this.detectFaces();
          }
        }, this.refreshRate);
      }
    }
  }

  public async detectFaces() {
        this.clearOverlay();
        // const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.65 });
        const fullFaceDescriptions = await faceapi.detectAllFaces(this.video.nativeElement, this.options)
                                    // .withFaceExpressions();
                                    .withFaceLandmarks();
                                    // .withFaceDescriptor();
        if (fullFaceDescriptions.length > 0) {
          // if (fullFaceDescriptions !== undefined && fullFaceDescriptions !== null) {
          const detectionsArray = fullFaceDescriptions.map(fd => fd.detection);
          await faceapi.drawDetection(this.overlay.nativeElement, detectionsArray, { withScore: false });
          // tslint:disable-next-line:max-line-length
          // await faceapi.drawFaceExpressions(this.canvas2.nativeElement, ({ position: fullFaceDescriptions.detection.box, expressions: fullFaceDescriptions.expressions }));
          // const landmarksArray = fullFaceDescriptions.map(fd => fd.landmarks);
          // await faceapi.drawLandmarks(this.canvas2.nativeElement, landmarksArray, { drawLines: true });
          if (this.lock === false) {
              this.lock = true;
              const imgData = faceapi.createCanvasFromMedia(this.video.nativeElement);
              this.imageCapture(imgData);
          }
        }

        if (this.displayStream === 'none') {
          this.displayStream = 'block';
          this.isLoading = false;
        }
  }

  // clear canvas overlay
  private clearOverlay() {
    this.ctx.clearRect(0, 0, this.overlay.nativeElement.width, this.overlay.nativeElement.height);
    this.ctx.stroke();
  }

  /* initialize capture webcam */
  private opencam() {
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

async imageCapture(canvas) {
  return;
  // face api calls enabled ?
  if (localStorage.getItem('cognitiveStatus') === 'false') {
    console.log('calls FACE disabled');
    return;
  }
  if (localStorage.getItem('customVisionStatus') === 'false') {
    console.log('calls VISION disabled');
    return;
  }
  let sub$;
  try {
    const stream = this.makeblob(canvas.toDataURL('image/png'));
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
    const res$ = this.faceProcess.byImg(stream.blob, group);
    sub$ = res$.subscribe(
        (data) => {
          sub$.unsubscribe();
          if (data === null) {
                // nothing detected
                console.log('lock disabled');
                this.lock = false;
                return;
          }
          const users: User[] = [];
          data.persons.forEach(element => {
          const u = new User();
          u.name = 'user_' + Math.random();
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
                  if (face.faceAttributes.emotion.anger < face.faceAttributes.emotion.contempt) {
                    emotion = face.faceAttributes.emotion.contempt;
                    emotionType = 'contempt';
                  } else {
                    emotion = face.faceAttributes.emotion.anger;
                    emotionType = 'anger';
                  }
                  if (emotion < face.faceAttributes.emotion.disgust) {
                    emotion =  face.faceAttributes.emotion.disgust;
                    emotionType = 'disgust';
                  }
                  if (emotion < face.faceAttributes.emotion.fear) {
                    emotion = face.faceAttributes.emotion.fear;
                    emotionType = 'fear';
                  }
                  if (emotion < face.faceAttributes.emotion.happiness) {
                    emotion = face.faceAttributes.emotion.happiness;
                    emotionType = 'happiness';
                  }
                  if (emotion < face.faceAttributes.emotion.neutral) {
                    emotion = face.faceAttributes.emotion.neutral;
                    emotionType = 'neutral';
                  }
                  if (emotion < face.faceAttributes.emotion.sadness) {
                    emotion = face.faceAttributes.emotion.sadness;
                    emotionType = 'sadness';
                  }
                  if (emotion < face.faceAttributes.emotion.surprise) {
                    emotion = face.faceAttributes.emotion.surprise;
                    emotionType = 'surprise';
                  }
                  f.emotionDominant = emotionType;

                  // crop face for skin and hairlength
                  // tslint:disable-next-line:max-line-length
                  const faceCanvas = this.crop(canvas, face.faceRectangle.left, face.faceRectangle.top, face.faceRectangle.width, face.faceRectangle.height);
                  const faceBlob = this.makeblob(faceCanvas.toDataURL('image/png'));
                  // call to custom vision
                  this.getSkinColor(faceBlob.blob).subscribe(
                    (sc) => {
                      f.skinColor = sc;
                      console.log(f.skinColor);
                      this.getHairLength(faceBlob.blob).subscribe(
                        (hl) => {
                          f.hairLength = hl;
                          console.log(f.hairLength);
                          u.faces.push(f);
                          // save user
                          this.saveUsers(u);
                          this.lock = false;
                        }
                      );
                    }
                  );
                });
          });
        },
        () => {
            sub$.unsubscribe();
            console.log('Error 429');
            // unlock capture
            this.lock = false;
        }
      );
    } catch (e) {
      console.log('Error : ' + e.message);
      console.log(e);
      // unlock capture
      this.lock = false;
    }
}


// detection hair length with custom vision
private getHairLength(stream) {
  const sub = new Subject<string>();
  // tslint:disable-next-line:max-line-length
  this.customVisionPredictionService.set('https://westeurope.api.cognitive.microsoft.com/customvision/v2.0/', '8139b0c8c2a54b59861bbe5e7e089d2b');
  this.customVisionPredictionService.predictImageWithNoStore(stream, '3ae9a19d-fa15-4b44-bfb5-b02bb11b3efc').subscribe(
    (result: ImagePrediction) => {
      // this.deleteHairLength(result.id);
      // sub.next(result.predictions[0].tagName);
      if (result.predictions.length > 0) {
        sub.next(result.predictions[0].tagName);
        console.log(result.predictions[0].region);
      } else {
        sub.next(null);
      }
    },
    (err) => {
      console.log(err);
    }
  );
  return sub;
}

/*
private deleteHairLength(id) {
  this.customVisionPredictionService.deleteImg(id)
  .subscribe(
    () => console.log('deleted'),
    (err) => console.log(err)
  );
}*/

// detection skin color with custom vision
private getSkinColor(stream) {
  const sub = new Subject<string>();
  // tslint:disable-next-line:max-line-length
  this.customVisionPredictionService.set('https://westeurope.api.cognitive.microsoft.com/customvision/v2.0/', '8139b0c8c2a54b59861bbe5e7e089d2b');
  this.customVisionPredictionService.predictImageWithNoStore(stream, 'a1cb0694-4bdb-4def-a20f-52226ced6ded').subscribe(
      (result: ImagePrediction) => {
      // this.deleteSkinColor(result.id);
      // sub.next(result.predictions[0].tagName);
      if (result.predictions.length > 0) {
        sub.next(result.predictions[0].tagName);
        console.log(result.predictions[0].region);
      } else {
        sub.next(null);
      }
    },
    (err) => {
      console.log(err);
    }
  );
  return sub;
}

/*
// delete detection
private deleteSkinColor(id) {
  this.visonComputerService.deleteImg(id)
  .subscribe(
    () => console.log('deleted'),
    (err) => console.log(err)
  );
}*/

private saveUsers(user: User) {
  // adding user
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

    /* Update the game state and stop registering candidates when done */
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
      clearInterval(this.detectId);
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
