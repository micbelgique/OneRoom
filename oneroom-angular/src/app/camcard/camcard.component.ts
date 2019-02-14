import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { Group, PersonGroupService } from '../services/cognitive/person-group.service';
import { FaceProcessService } from '../utilities/face-process.service';

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

  constructor(private faceProcess: FaceProcessService) { }

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
    // REMOVE this to call the API and get results in console
    // this.faceProcess.byImg(stream.blob, group);
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
