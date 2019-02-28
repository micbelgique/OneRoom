import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndPointGetterService } from '../../utilities/end-point-getter.service';

@Injectable({
  providedIn: 'root'
})
export class VisioncomputerService {

  private endPoint: string;
  private subscriptionKey: string;
  private headers: HttpHeaders;
  constructor(private http: HttpClient,
              private endPointGetter: EndPointGetterService) {
    // tslint:disable-next-line:max-line-length
    this.endPoint = endPointGetter.getVisionPredictionEndPoint();
    this.subscriptionKey = endPointGetter.getVisionPredictionKey();
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Prediction-Key' : this.subscriptionKey,
      'Content-Type' : 'application/octet-stream'
    });
   }

  getSkinColor(stream: Blob) {
    return this.http.post<any>(this.endPoint, stream, {headers: this.headers} );
  }

  deleteImg(id: string) {
    return this.http.delete<any>(
      // tslint:disable-next-line:max-line-length
      this.endPointGetter.getVisionTrainingEndPoint + '?ids=' + id,
      {headers: new HttpHeaders({
        'Training-key' : this.endPointGetter.getVisionTrainingKey()
      })}
      );
  }
}
