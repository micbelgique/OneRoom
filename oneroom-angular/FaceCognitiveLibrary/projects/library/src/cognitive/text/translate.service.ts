import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslationResponse } from './text-models';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor(private httpClient: HttpClient) { }

  translate(text: string, from: string, to: string, endpoint: string, key: string ): Observable<TranslationResponse[]> {
    const headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/json'
    });
    const body = [
      { Text: text }
    ];
    // tslint:disable-next-line:max-line-length
    return this.httpClient.post<TranslationResponse[]>(endpoint + '?api-version=3.0&from=' + from + '&to=' + to, body, {headers});
  }
}
