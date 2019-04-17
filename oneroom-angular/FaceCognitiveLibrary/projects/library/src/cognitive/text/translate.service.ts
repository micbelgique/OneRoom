import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor(private httpClient: HttpClient) { }

  translate(text: string, from: string, to: string, endpoint: string, key: string ): Observable<any> {
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/json'
    });
    const body = [
      { Text: text }
    ];
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post<any>(endpoint + '?api-version=3.0&from=' + from + '&to=' + to, body, {headers});
  }
}
