import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {

  constructor(private httpClient: HttpClient) { }

  /* transform a string into an audio content using google */
  textToSpeechGoogle(text: string, endpoint, key, languageCode, ssmlGender = 'NEUTRAL', audioEncoding = 'MP3'): Observable<any> {
    const url = endpoint + '?key=' + key;
    const body = {
      input: {
        text
      },
      voice: {
        languageCode,
        ssmlGender
      },
      audioConfig: {
        audioEncoding
      }
    };
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.post<any>(url, body, {headers: httpHeaders});
  }
}
