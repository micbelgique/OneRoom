import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImagePrediction } from './custom-vision-models';

@Injectable({
  providedIn: 'root'
})
export class CustomVisionPredictionService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
      this.headers = new HttpHeaders({
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': '*'
      });
  }

  predictImageWithNoStore(stream: Blob, endpoint: string, key: string): Observable<ImagePrediction> {
    let url;
    let h = this.headers.set('Content-Type', 'application/octet-stream');
    h = h.set('Prediction-Key', key);
    url = endpoint + '/image/nostore';
    return this.http.post<ImagePrediction>(url, stream, {headers: h});
  }

  predictImage(stream: Blob, endpoint: string, key: string): Observable<ImagePrediction> {
    let url;
    let h = this.headers.set('Content-Type', 'application/octet-stream');
    h = h.set('Prediction-Key', key);
    url = endpoint + '/image';
    return this.http.post<ImagePrediction>(url, stream, {headers: h} );
  }

  predictImageUrl(urlImage: string, endpoint: string, key: string): Observable<ImagePrediction> {
    let url;
    let h = this.headers.set('Content-Type', 'application/json');
    h = h.set('Prediction-Key', key);
    url = endpoint + '/url';
    return this.http.post<ImagePrediction>(url, {Url: urlImage}, {headers: h});
  }

  predictImageUrlWithNoStore(urlImage: string, endpoint: string, key: string): Observable<ImagePrediction> {
    let url;
    let h = this.headers.set('Content-Type', 'application/json');
    h = this.headers.set('Prediction-Key', key);
    url = endpoint + '/url/nostore';
    return this.http.post<ImagePrediction>(url, {Url: urlImage}, {headers: h});
  }
}
