import * as faceapi from 'face-api.js';

import { Component, OnInit, ViewChild } from '@angular/core';
import { Team, TeamService, User, GlassesType, Gender, UserService, Game } from '@oneroomic/oneroomlibrary';
import { MatDialog, MatSnackBar } from '@angular/material';
import { GeneratorService } from '../services/generator.service';
import { Group, FaceProcessService, FaceService, CustomVisionPredictionService, ImagePrediction } from '@oneroomic/facecognitivelibrary';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // preferred camera
  private videoSource;

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
  private firstScan = true;

  // refresh rate
  refreshRate: number;

  teams: Team[];
  team = new Team();
  UserWanted = new User();
  imgString: string;
  game: Game;
  constructor(
    public dialog: MatDialog,
    private toast: MatSnackBar,
    private faceProcess: FaceProcessService,
    private faceService: FaceService,
    private userService: UserService,
    private teamService: TeamService,
    private generatorService: GeneratorService,
    private customVisionPredictionService: CustomVisionPredictionService
    ) { this.loadModels(); }

  ngOnInit() {
    this.game = JSON.parse(localStorage.getItem('gameData'));
    if (localStorage.getItem('camId')) {
      this.videoSource = localStorage.getItem('camId');
    }
    // init lock
    this.lock = false;
    // refreshRate
    this.refreshRate = 1500;
    if (localStorage.getItem('refreshRate')) {
      this.refreshRate = Number(localStorage.getItem('refreshRate'));
    }
    this.opencam();
    this.getTeams();
  }
  private async loadModels() {
    await faceapi.loadSsdMobilenetv1Model('assets/models/').then(
        async () => await faceapi.loadFaceLandmarkModel('assets/models/'));
    this.firstScanning();
  }
  initStreamDetection(videoSource = null) {
      this.startStream(videoSource);
      if (!this.detectId) {
        // detection interval: default 3000
        this.detectId = setInterval( () => {
          this.detectFaces();
        }, 1000);
      }
  }

  public firstScanning(videoSource = null) {
    this.lock = false;
    this.toast.open('Scan en cours', 'Ok', {
      duration : 3000
    });
    this.initStreamDetection(videoSource);
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

  opencam() {
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
    console.log('calls disabled');
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
    console.log(group);
    // group.name = 'mic_stage_2019';
    // group.userData = 'Group de test en developpement pour oneroom';
    // timeout to unlock detection
    setTimeout(() => {
      this.lock = false;
    }, 2500);
    // traitement face API
    // return an observable;
    if (this.firstScan) {
      this.faceProcess.detectOnly(stream.blob, group).subscribe(
        (result) => {
          if (result === null) {
            console.log(result);
            this.lock = false;
          } else {
              this.userService.getUser(result).subscribe(
                (result1) => {
                    let teamWanted: Team;
                    // tslint:disable-next-line:prefer-for-of
                    for (let index = 0; index < this.teams.length; index++) {
                      if (this.teams[index].users.filter(u => u.userId === result1.userId).length >= 1) {
                        teamWanted = this.teams[index];
                      }
                    }
                    this.getTeam(teamWanted.teamName);
                });
          }
        });
    } else {
      this.faceService.detect(stream.blob).subscribe(
        (result) => {
          this.getHairLength(stream.blob).subscribe(
            (hl) => {
              this.getSkinColor(stream.blob).subscribe(
                (sc) => {
                  this.unlock(result, hl, sc);
                }
              );
            }
          );
        }
      )
    }
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

  getTeams() {
    this.teamService.getTeams().subscribe(
      (result) => {
        this.teams = result;
      }
    );
  }
  getTeam(teamName: string) {
    this.team = null;
    this.team = this.teams.filter(t => t.teamName === teamName)[0];
    this.UserWanted = this.generatorService.generateUserForTeam(this.team.users);
    const img = this.generatorService.generateAvatar(this.UserWanted);
    this.stopCapture();
    this.imgString = img;
    this.firstScan = false;
  }
  // detection hair length with custom vision
  private getHairLength(stream) {
    const sub = new Subject<string>();
    // tslint:disable-next-line:max-line-length
    this.customVisionPredictionService.predictImageWithNoStore(stream, this.game.config.visionEndpoint, this.game.config.visionKey).subscribe(
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
    this.customVisionPredictionService.predictImageWithNoStore(stream, this.game.config.visionEndpointSkinColor, this.game.config.visionKeySkinColor).subscribe(
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
  unlock(result: any, hairLength: any, skinColor: any) {
    const userResult = new User();
    userResult.glassesType = result[0].faceAttributes.glasses === 'ReadingGlasses' ? GlassesType.ReadingGlasses : GlassesType.NoGlasses;
    userResult.gender = result[0].faceAttributes.gender;
    userResult.hairColor = result[0].faceAttributes.hair.hairColor[0].color;
    userResult.skinColor = skinColor;
    userResult.hairLength = hairLength;
    userResult.baldLevel = result[0].faceAttributes.hair.bald;
    console.log(userResult);
    if (userResult.glassesType === this.UserWanted.glassesType) {
      if (userResult.hairColor === this.UserWanted.hairColor) {
        if (userResult.gender === this.UserWanted.gender) {
          if (userResult.hairLength === this.UserWanted.hairLength) {
            if (userResult.skinColor === this.UserWanted.skinColor) {
              this.toast.open('Le code est ***', 'OK', {
                duration : 3000
              });
            } else {
              this.toast.open('mauvais utilisateur!', 'OK', {
                duration : 3000,
              });
            }
          } else {
            this.toast.open('mauvais utilisateur!', 'OK', {
              duration : 3000,
            });
          }
        } else {
          this.toast.open('mauvais utilisateur!', 'OK', {
            duration : 3000,
          });
        }
      } else {
        this.toast.open('mauvais utilisateur!', 'OK', {
          duration : 3000,
        });
      }
    } else {
      this.toast.open('mauvais utilisateur!', 'OK', {
        duration : 3000,
      });
    }
    this.stopCapture();
  }
}
