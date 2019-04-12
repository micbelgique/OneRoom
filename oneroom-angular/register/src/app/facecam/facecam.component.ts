import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import * as faceapi from 'face-api.js';
// tslint:disable-next-line:max-line-length
import { Group, FaceProcessService, CustomVisionPredictionService, ImagePrediction } from '@oneroomic/facecognitivelibrary';
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

  // current game
  private game: Game;
  private group: Group;

  // refresh rate
  refreshRate: number;

  // camid
  videoSource;

  // start processing stream
  private modelsReady = false;

  private faceCallsDisabled = false;
  private customVisionCallsDisabled = false;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private faceProcess: FaceProcessService,
    private userService: UserService,
    private faceService: FaceService,
    private customVisionPredictionService: CustomVisionPredictionService,
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

    if (localStorage.getItem('cognitiveStatus')) {
      this.faceCallsDisabled = localStorage.getItem('cognitiveStatus') === 'false' ? false : true;
    } else {
      this.faceCallsDisabled = false;
    }

    if (localStorage.getItem('customVisionStatus')) {
      console.log(localStorage.getItem('customVisionStatus'));
      this.customVisionCallsDisabled = localStorage.getItem('customVisionStatus') === 'false' ? false : true;
    } else {
      this.customVisionCallsDisabled = false;
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
      this.game = JSON.parse(localStorage.getItem('gameData'));
      // set du groupe
      this.group = new Group();
      this.group.personGroupId = this.game.groupName;
      this.group.name = this.game.groupName;
      this.group.userData = this.game.groupName;

      // join new group
      this.hubServiceSub = this.hubService.run().subscribe(
        () => this.hubService.joinGroup(this.game.gameId.toString())
      );

      // new game state
      this.gameSub = this.hubService.refreshGameState.subscribe(
      (gameId) => {
        if (gameId === this.game.gameId) {
          this.refreshGameState(this.game);
        }
      },
      (err) => {
        console.log(err);
      });

      this.refreshGameState(this.game);
    } else {
      this.game = null;
      this.group = null;
    }
  }

  private async loadModels() {
    this.options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.60});

    await faceapi.loadSsdMobilenetv1Model('assets/models/').then(
        async () => await faceapi.loadFaceLandmarkModel('assets/models/')).then(
          async () => {
            this.modelsReady = true;
          }
        );
  }

  initStreamDetection() {
    if (!this.stream) {
      this.startStream();
      if (!this.detectId) {
        this.detectId = setInterval( () => {
          // state still registering
          if (!this.stateContainer) {
            if (this.modelsReady === true) {
              this.detectFaces();
            }
          }
        }, this.refreshRate);
      }
    }
  }

  public async detectFaces() {
        this.clearOverlay();

        const fullFaceDescriptions = await faceapi.detectAllFaces(this.video.nativeElement, this.options)
                                    .withFaceLandmarks();
        if (fullFaceDescriptions.length > 0) {

          const detectionsArray = fullFaceDescriptions.map(fd => fd.detection);
          await faceapi.drawDetection(this.overlay.nativeElement, detectionsArray, { withScore: false });

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
                // init stream
                this.initStreamDetection();
              })
              .catch(this.handleError);
  }

   /* Start or restart the stream using a specific videosource and inject it in a container */
  public startStream(videoSource = null) {

    if (navigator.mediaDevices) {
        // select specific camera on mobile
        if (this.selectors.map(s => s.id).indexOf(this.videoSource) === -1) {
          // check if prefered cam is available in the list
          this.videoSource = null;
        }
        this.videoSource = videoSource ? videoSource : (this.videoSource ? this.videoSource : this.selectors[0].id);
        localStorage.setItem('videoSource', this.videoSource);
        // access the web cam
        navigator.mediaDevices.getUserMedia({
            audio : false,
            video: {
                // selfie mode
                deviceId: this.videoSource ? { exact: this.videoSource } : undefined
            }
        })
            // permission granted:
            .then( (stream) => {
                this.video.nativeElement.addEventListener('loadedmetadata', () => {
                  // set canvas size = video size when known
                  this.overlay.nativeElement.width = this.video.nativeElement.videoWidth;
                  this.overlay.nativeElement.height = this.video.nativeElement.videoHeight;
                });
                this.stream = stream;
                this.alertContainer = false;
                // on getUserMedia
                this.video.nativeElement.srcObject = this.stream;
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

  private crop(canvas, x1, y1, width, height) {
    // get your canvas and a context for it
    const ctx = canvas.getContext('2d');
    // get the image data you want to keep.
    const imageData = ctx.getImageData(x1, y1, width, height);
    // create a new cavnas same as clipped size and a context
    const newCan = document.createElement('canvas');
    // define sizes
    newCan.width = width;
    newCan.height = height;
    const newCtx = newCan.getContext('2d');
    // put the clipped image on the new canvas.
    newCtx.putImageData(imageData, 0, 0);
    return newCan;
  }

  imageCapture(canvas) {

    if (!this.faceCallsDisabled) {
      this.snackBar.open('Face calls disabled', 'Ok', {
        duration: 2000
      });
      return;
    }
    if (!this.customVisionCallsDisabled) {
      this.snackBar.open('Custom vision calls disabled', 'Ok', {
        duration: 2000
      });
      return;
    }

    if (this.group === null || this.game === null) {
      this.snackBar.open('Game not set', 'Ok', {
        duration: 2000
      });
      return;
    }

    try {
      canvas.toBlob((blob) => {
        const stream = blob;
        const res$ = this.faceProcess.byImg(stream, this.group);
        // traitement face API
        res$.subscribe(
        (data) => {
          if (data === null) {
            // nothing detected
            console.log('lock disabled');
            this.lock = false;
            return;
          }
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
                  const faceCanvas = this.crop(canvas,
                    face.faceRectangle.left / 1.5,
                    face.faceRectangle.top / 1.5,
                    face.faceRectangle.width * 1.5,
                    face.faceRectangle.height * 1.5);

                  faceCanvas.toBlob(
                    (faceBlob) => {
                      // call to custom vision
                      this.getSkinColor(faceBlob).subscribe(
                        (sc) => {
                          f.skinColor = sc;
                          this.getHairLength(faceBlob).subscribe(
                            (hl) => {
                              f.hairLength = hl;
                              u.faces.push(f);
                              // save user
                              this.saveUsers(u);
                              this.lock = false;
                            }
                          );
                        }
                      );
                    }
                  );

          });
        });
        },
        () => {
          console.log('Error 429');
          // unlock capture
          this.lock = false;
        }
      );

        // Optimisation
        this.faceProcess.resForDuplicate$.subscribe(
        (result) => {
          console.log(result);
          this.userService.mergeUser(result.keepId, result.delId).subscribe(
            (res) => console.log(res)
          );
          // console.log('Deleting user from oneroom: ' + result.delId);
          // const d$ = this.userService.deleteUser(result.delId);
          // d$.subscribe(
          //   () => console.log('user deleted')
          // );
        });

    });
  } catch (e) {
    console.log('Error : ' + e.message);
    // unlock capture
    this.lock = false;
  }
}


// detection hair length with custom vision
private getHairLength(stream) {
  const sub = new Subject<string>();
  // tslint:disable-next-line:max-line-length
  this.customVisionPredictionService.set('https://westeurope.api.cognitive.microsoft.com/customvision/v2.0/Prediction/3ae9a19d-fa15-4b44-bfb5-b02bb11b3efc', '8139b0c8c2a54b59861bbe5e7e089d2b');
  this.customVisionPredictionService.predictImageWithNoStore(stream).subscribe(
    (result: ImagePrediction) => {
      if (result.predictions.length > 0) {
        sub.next(result.predictions[0].tagName);
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

// detection skin color with custom vision
private getSkinColor(stream) {
  const sub = new Subject<string>();
  // tslint:disable-next-line:max-line-length
  this.customVisionPredictionService.set('https://westeurope.api.cognitive.microsoft.com/customvision/v2.0/Prediction/a1cb0694-4bdb-4def-a20f-52226ced6ded', '8139b0c8c2a54b59861bbe5e7e089d2b');
  this.customVisionPredictionService.predictImageWithNoStore(stream).subscribe(
      (result: ImagePrediction) => {
      if (result.predictions.length > 0) {
        sub.next(result.predictions[0].tagName);
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

private saveUsers(user: User) {
  // adding user
    const user$ = this.userService.addUser(user);
    user$.subscribe(
      () => {
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
          if (user.faces[user.faces.length - 1]) {
            console.log(user.faces);
            const face = user.faces[user.faces.length - 1];
            const face$ = this.faceService.addFace(user.userId, face);
            face$.subscribe(
                () => {
                  this.lock = false;
                },
                (err) => {
                  console.log(err);
                  this.lock = false;
            });
          }
        }
    });
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
            this.startStream();
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
      }
    }

}
