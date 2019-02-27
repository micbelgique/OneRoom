import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VisioncomputerService {

  private endPoint: string;
  private subscriptionKey: string;
  private headers: HttpHeaders;
  constructor(private http: HttpClient) {
    // tslint:disable-next-line:max-line-length
    this.endPoint = 'https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/aa05f819-5d11-453f-9603-88e919abb71d/image';
    this.subscriptionKey = 'f011cedabc6749a6bebd8cede806948d';
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
      'https://southcentralus.api.cognitive.microsoft.com/customvision/v2.2/Training/projects/aa05f819-5d11-453f-9603-88e919abb71d/predictions?ids=' + id,
      {headers: new HttpHeaders({
        'Training-key' : 'cc45e01b8c6f4e438411f339a78ead09'
      })}
      );
  }
}
