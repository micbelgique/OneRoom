import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndPointGetterService } from '../../utilities/end-point-getter.service';
import { ImagePrediction } from './model/image-prediction';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomVisionPredictionService {

  private endPoint: string;
  private subscriptionKey: string;
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private endPointGetter: EndPointGetterService) {
      this.set(endPointGetter.getVisionPredictionEndPoint(), endPointGetter.getVisionPredictionKey());
  }

  set(endPoint: string, key: string) {
    this.endPoint = endPoint;
    this.subscriptionKey = key;
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Prediction-Key' : this.subscriptionKey,
      'Content-Type' : 'application/octet-stream'
    });
  }

  predictImageWithNoStore(stream: Blob, projectId: string): Observable<ImagePrediction> {
    const url = this.endPoint + '/Prediction/' + projectId + '/image/nostore';
    return this.http.post<ImagePrediction>(url, stream, {headers: this.headers});
  }

  predictImage(stream: Blob, projectId: string): Observable<ImagePrediction> {
    const url = this.endPoint + '/Prediction/' + projectId + '/image';
    return this.http.post<ImagePrediction>(url, stream, {headers: this.headers} );
  }

  predictImageUrl(urlImage: string, projectId: string): Observable<ImagePrediction> {
    const url = this.endPoint + '/Prediction/' + projectId + '/url';
    return this.http.post<ImagePrediction>(url, {Url: urlImage}, {headers: this.headers});
  }

  predictImageUrlWithNoStore(urlImage: string, projectId: string): Observable<ImagePrediction> {
    const url = this.endPoint + '/Prediction/' + projectId + '/url/nostore';
    return this.http.post<ImagePrediction>(url, {Url: urlImage}, {headers: this.headers});
  }
}
