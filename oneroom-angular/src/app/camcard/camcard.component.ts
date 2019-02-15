import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { Group } from '../services/cognitive/person-group.service';
import { FaceProcessService } from '../utilities/face-process.service';
import { User } from '../services/OnePoint/model/user';
import { Face } from '../services/OnePoint/model/face';
import { GlassesType } from '../services/OnePoint/model/glasses-type.enum';
import { UserService } from '../services/OnePoint/user.service';

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

  constructor(private faceProcess: FaceProcessService, private userService: UserService) { }

  ngOnInit() {
  }

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
            f.glassesType = face.faceAttributes.glasses === GlassesType.NoGlasses.toString() ?
            GlassesType.NoGlasses : face.faceAttributes.glasses === GlassesType.ReadingGlasses.toString() ?
            GlassesType.ReadingGlasses : face.faceAttributes.glasses === GlassesType.Sunglasses.toString() ?
            GlassesType.Sunglasses : GlassesType.SwimmingGoggles ;
            f.hairColor = face.faceAttributes.hair.hairColor[0].color;
            f.isMale = face.faceAttributes.gender === 'male';
            f.moustacheLevel = face.faceAttributes.facialHair.moustache;
            f.smileLevel = face.faceAttributes.smile;
            u.faces.push(f);
          }
          );
          u.generateAvatar();
          users.push(u);
          console.log(u);
        });
        console.log('coucou');
        this.userService.addUsers(users).subscribe();
      }
    );
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

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
