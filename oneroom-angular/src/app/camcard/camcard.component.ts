import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Group } from '../services/cognitive/person-group.service';
import { FaceProcessService } from '../utilities/face-process.service';
import { User } from '../services/OnePoint/model/user';
import { Face } from '../services/OnePoint/model/face';
import { GlassesType } from '../services/OnePoint/model/glasses-type.enum';
import { UserService } from '../services/OnePoint/user.service';
import { FaceService } from '../services/OnePoint/face.service';

@Component({
  selector: 'app-camcard',
  templateUrl: './camcard.component.html',
  styleUrls: ['./camcard.component.css']
})
export class CamcardComponent implements OnInit {

  public mirrorImage = 'always';
  // latest snapshot
  public webcamImage: WebcamImage = null;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  constructor(
    private faceProcess: FaceProcessService,
    private userService: UserService,
    private faceService: FaceService) { }


  // trigger capture with btn
  triggerCapture() {
    this.trigger.next();
  }

  async imageCapture($webcamImage: WebcamImage) {
    this.webcamImage = $webcamImage;
    const stream = this.makeblob($webcamImage.imageAsDataUrl);
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
        console.log(users.length);
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
            f.hairColor = face.faceAttributes.hair.hairColor ? face.faceAttributes.hair.hairColor[0].color : null;
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
            (response) => {}, (error) => {
              if (error.status === 409 && error.ok === false) {
                // update avatar
                const avatar$ = this.userService.updateAvatar(user.userId, user.urlAvatar);
                // tslint:disable-next-line:no-shadowed-variable
                console.log(user.faces.length);
                // adding face to already existant user
                for (const face of user.faces) {
                    console.log(face);
                    const face$ = this.faceService.addFace(user.userId, face);
                    face$.subscribe();
                }
              }
          });
        }
        data = null;
      }
    );
  }

  // capture picture with webcam
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
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
