import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import * as faceapi from 'face-api.js';
import { GlassesType } from '../services/OnePoint/model/glasses-type.enum';
import { Face } from '../services/OnePoint/model/face';
import { User } from '../services/OnePoint/model/user';
import { Group } from '../services/cognitive/person-group.service';
import { FaceProcessService } from '../utilities/face-process.service';
import { UserService } from '../services/OnePoint/user.service';
import { FaceService } from '../services/OnePoint/face.service';
import { VisioncomputerService } from '../services/cognitive/vision/visioncomputer.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { HairlengthService } from '../services/cognitive/vision/hairlength.service';
import { LeaderboardService } from '../services/OnePoint/leaderboard.service';
import { GameService } from '../services/OnePoint/game.service';
import { Game } from '../services/OnePoint/model/game';
import { GameState } from '../services/OnePoint/model/game-state.enum';
import { Subject } from 'rxjs';

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

  // preview
  lastUsers: User[];

  // alert
  alertContainer = false;
  alertMessage = '';

  // signalR
  private hubServiceSub;
  private gameSub;

  // refresh rate
  refreshRate: number;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private faceProcess: FaceProcessService,
    private userService: UserService,
    private faceService: FaceService,
    private visonComputerService: VisioncomputerService,
    private hairLengthService: HairlengthService,
    private hubService: LeaderboardService,
    private gameService: GameService) { this.loadModels(); }

  ngOnInit() {
    // init lock
    this.lastUsers = [];
    this.alertContainer = false;
    this.lock = false;
    // refreshRate
    this.refreshRate = 3000;
    if (localStorage.getItem('refreshRate')) {
      this.refreshRate = Number(localStorage.getItem('refreshRate'));
    }

    this.opencam();
    this.initStreamDetection();

    this.hubServiceSub = this.hubService.run().subscribe();
    this.gameSub = this.hubService.refreshGameState.subscribe(
    () => {
      this.refreshGameState();
    });
    this.refreshGameState();
  }

  private async loadModels() {
    await faceapi.loadSsdMobilenetv1Model('assets/models/').then(
        async () => await faceapi.loadFaceLandmarkModel('assets/models/'));

    /* FACE RECOGNITION
                // async () => faceapi.loadFaceExpressionModel('assets/models/').then(
         //  async () => await faceapi.loadFaceRecognitionModel('assets/models/')
    */
  }

  initStreamDetection() {
    if (!this.stream) {
      this.startStream();
      if (!this.detectId) {
        // detection interval: default 3000
        this.detectId = setInterval( () => {
          this.detectFaces();
        }, this.refreshRate);
      }
    }
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
  public startStream() {

    if (navigator.mediaDevices) {
        // select specific camera on mobile
        const videoSource = this.videoSelect.nativeElement.value;
        // access the web cam
        navigator.mediaDevices.getUserMedia({
            audio : false,
            video: {
                // selfie mode
                facingMode: 'user',
                deviceId: videoSource ? { exact: videoSource } : undefined
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
                  this.canvas2.nativeElement.width = this.video.nativeElement.videoWidth;
                  this.canvas2.nativeElement.height = this.video.nativeElement.videoHeight;
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

  imageCapture(dataUrl) {
  // face api calls enabled ?
  if (localStorage.getItem('cognitiveStatus') === 'false') {
    console.log('calls disabled');
    return;
  }
  // TODO :  vision api calls enabled ?
  let sub$;
  try {
    const stream = this.makeblob(dataUrl);
    // set du groupe
    const group = new Group();
    group.personGroupId = localStorage.getItem('groupName');
    group.name = 'mic_stage_2019';
    group.userData = 'Group de test en developpement pour oneroom';
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
                  // call to custom vision
                  this.getSkinColor(stream.blob).subscribe(
                    (sc) => {
                      f.skinColor = sc;
                      console.log(f.skinColor);
                      this.getHairLength(stream.blob).subscribe(
                        (hl) => {
                          f.hairLength = hl;
                          console.log(f.hairLength);
                          u.faces.push(f);
                          users.push(u);
                          User.generateAvatar(u);
                          // preview
                          this.lastUsers = users;
                          // save user
                          this.saveUsers(u);
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
  this.hairLengthService.detectLength(stream).subscribe(
    (result) => {
      this.deleteHairLength(result.id);
      sub.next(result.predictions[0].tagName);
    }
  );
  return sub;
}

private deleteHairLength(id) {
  this.hairLengthService.deleteImg(id)
  .subscribe(
    () => console.log('deleted'),
    (err) => console.log(err)
  );
}

// detection skin color with custom vision
private getSkinColor(stream) {
  const sub = new Subject<string>();
  this.visonComputerService.getSkinColor(stream).subscribe(
      (result) => {
      this.deleteSkinColor(result.id);
      sub.next(result.predictions[0].tagName);
    }
  );
  return sub;
}

// delete detection
private deleteSkinColor(id) {
  this.visonComputerService.deleteImg(id)
  .subscribe(
    () => console.log('deleted'),
    (err) => console.log(err)
  );
}

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
    refreshGameState() {
      // game
      console.log('refreshing state');
      let game: Game = new Game();
      game.groupName = '';
      if (localStorage.getItem('gameData')) {
        game = JSON.parse(localStorage.getItem('gameData'));
      } else {
        return;
      }
      const res$ = this.gameService.getStateGame(game.groupName);
      res$.subscribe(
        (state) => {
          console.log(state);
          if (state !== GameState.REGISTER) {
            console.log('REGISTERING IS NOW CLOSED');
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }

    ngOnDestroy(): void {
      clearInterval(this.detectId);
      clearTimeout(this.streamId);
      // stop camera capture
      if (this.stream) {
        this.stream.getTracks().forEach(
          (track) => {
          track.stop();
        });
      }
      // stop game state signal
      if (this.hubServiceSub) {
        this.hubServiceSub.unsubscribe();
      }
      if (this.gameSub) {
        this.gameSub.unsubscribe();
      }
      if (this.hubService.connected.isStopped) {
        this.hubService.stop();
      }
    }

}
