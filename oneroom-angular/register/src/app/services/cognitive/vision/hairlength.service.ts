import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

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
  constructor(private http: HttpClient) {
    // tslint:disable-next-line:max-line-length
    this.endPointPrediction = 'https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/7e0f5d3c-58cd-45ba-bd1e-e53e26e0e72b/image';
    this.subscriptionKeyPrediction = 'f011cedabc6749a6bebd8cede806948d';
    this.headersPrediction = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Prediction-Key' : this.subscriptionKeyPrediction,
      'Content-Type' : 'application/octet-stream'
    });
    // delete image after processing
    this.endPointTraining = 'https://southcentralus.api.cognitive.microsoft.com/customvision/v2.2/Training/';
    this.projectId = '7e0f5d3c-58cd-45ba-bd1e-e53e26e0e72b';
    this.subscriptionKeyTraining = 'cc45e01b8c6f4e438411f339a78ead09';
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
