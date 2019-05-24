import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TextToSpeechResponse } from './voice-models';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {

  constructor(private httpClient: HttpClient) { }

  /* transform a string into an audio content using google */
  // tslint:disable-next-line:max-line-length
  textToSpeechGoogle(text: string, endpoint, key, languageCode, ssmlGender = 'NEUTRAL', audioEncoding = 'MP3'): Observable<TextToSpeechResponse> {
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
    return this.httpClient.post<TextToSpeechResponse>(url, body, {headers: httpHeaders});
  }
}
