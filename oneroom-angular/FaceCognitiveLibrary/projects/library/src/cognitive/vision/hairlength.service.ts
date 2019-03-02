import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { EndPointGetterService } from '../../utilities/end-point-getter.service';

@Injectable({
  providedIn: 'root'
})
export class HairlengthService {
  private endPointPrediction: string;
  private subscriptionKeyPrediction: string;
  private endPointTraining: string;
  private subscriptionKeyTraining: string;
  private projectId: string;
  private headersPrediction: HttpHeaders;
  private headersTraining: HttpHeaders;
  constructor(private http: HttpClient,
              private endPointGetter: EndPointGetterService) {
    // tslint:disable-next-line:max-line-length
    this.endPointPrediction = endPointGetter.getHairLenghtPredictionEndPoint();
    this.subscriptionKeyPrediction = endPointGetter.getHairLengthPredictionKey();
    this.headersPrediction = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Prediction-Key' : this.subscriptionKeyPrediction,
      'Content-Type' : 'application/octet-stream'
    });
    // delete image after processing
    this.endPointTraining = endPointGetter.getHairLengthTrainingEndPoint();
    this.projectId = endPointGetter.getHairLengthProjectID();
    this.subscriptionKeyTraining = endPointGetter.getHairLengthTrainingKey();
    this.headersTraining = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Training-Key' : this.subscriptionKeyTraining,
    });
   }
   detectLength(stream: Blob) {
    return this.http.post<any>(this.endPointPrediction, stream, {headers: this.headersPrediction} );
   }
   deleteImg(id: string) {
     return this.http.delete<any>(this.endPointTraining + '/projects/' + this.projectId + '/predictions?ids=' + id,
     { headers: this.headersTraining }
     );
   }
}
