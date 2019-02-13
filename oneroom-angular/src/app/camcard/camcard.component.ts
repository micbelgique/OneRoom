import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { FaceService } from '../services/cognitive/face.service';
import { PersonGroupPersonService } from '../services/cognitive/person-group-person.service';
import { PersonGroupService } from '../services/cognitive/person-group.service';

@Component({
  selector: 'app-camcard',
  templateUrl: './camcard.component.html',
  styleUrls: ['./camcard.component.css']
})
export class CamcardComponent implements OnInit {

  // latest snapshot
  public webcamImage: WebcamImage = null;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  constructor(
    private faceService: FaceService,
    private personService: PersonGroupPersonService,
    private groupService: PersonGroupService) { }

  ngOnInit() {
  }

  triggerCapture() {
    console.log('triggering capture');
    this.trigger.next();
  }

  imageCapture($webcamImage: WebcamImage) {
    console.log($webcamImage.imageAsDataUrl);
    this.webcamImage = $webcamImage;
    const stream = this.makeblob($webcamImage.imageAsDataUrl);
    // 0. Create group or not if exists
    // const group$ = this.groupService.create();
    // 1. Detect
    const detect$ = this.faceService.detect(stream.blob, stream.rawlength);
    detect$.subscribe((faces) => {
      for (const face of faces) {
        // 2. Identify
        console.log('face detected : ');
        console.log(face);
        console.log('------------');
        const identify$ = this.faceService.identify([face.faceId], 'SectInformatik01Id', 1, 0.5);
      }
    });

    // 3. Create person or not if exists
    // const person$ = this.personService.create();
    // 4. Add Face to person
    // const face$ = this.personService.addFace();
    // 5. train group
    // const train$ = this.groupService.train();
    // 6. training status
    // const trainStatus$ = this.groupService.getTrainingStatus();
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
