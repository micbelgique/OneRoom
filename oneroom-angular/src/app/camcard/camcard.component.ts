import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
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

  constructor(
    private faceProcess: FaceProcessService,
    private userService: UserService,
    private faceService: FaceService) { }

  ngOnInit() {
  }

  // trigger capture with btn
  triggerCapture() {
    console.log('triggering capture');
    this.trigger.next();
  }

  async imageCapture($webcamImage: WebcamImage) {
    console.log('capturing image');
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
        data.persons.forEach(element => {
          const u = new User();
          u.name = 'test';
          u.userId = element.person.personId;
          u.faces = [];
          element.faces.forEach(face => {
            const f = new Face();
            f.age = face.faceAttributes.age;
            f.baldLevel = face.faceAttributes.hair.bald;
            f.beardLevel = face.faceAttributes.facialHair.beard;
            console.log(face.faceAttributes.glasses);
            f.glassesType = face.faceAttributes.glasses === 'NoGlasses' ?
            GlassesType.NoGlasses : face.faceAttributes.glasses === 'ReadingGlasses' ?
            GlassesType.ReadingGlasses : face.faceAttributes.glasses === 'SunGlasses' ?
            GlassesType.Sunglasses : GlassesType.SwimmingGoggles ;
            f.hairColor = face.faceAttributes.hair.hairColor[0].color;
            f.isMale = face.faceAttributes.gender === 'male';
            f.moustacheLevel = face.faceAttributes.facialHair.moustache;
            f.smileLevel = face.faceAttributes.smile;
            u.faces.push(f);
          });
          u.generateAvatar();
          users.push(u);
        });

        // adding users
        for (const user of users) {
          const user$ = this.userService.addUser(user);
          user$.subscribe(
            (response) => console.log(response)
          , (error) => {
              console.log(error);
              if (error.status === 409 && error.ok === false) {
                // update avatar
                const avatar$ = this.userService.updateAvatar(user.userId, user.urlAvatar);
                // tslint:disable-next-line:no-shadowed-variable
                avatar$.subscribe((response) => console.log(response), (error) => console.log(error));
                // adding face to already existant user
                for (const face of user.faces) {
                    console.log('adding face');
                    const face$ = this.faceService.addFace(face);
                    face$.subscribe(
                    (response) => {
                      console.log('avatar updated');
                      console.log(response);
                    },
                    // tslint:disable-next-line:no-shadowed-variable
                    (error) => {
                      console.log(error);
                    });
                }
              }
          });
        }
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
