import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeechToTextService {

  constructor(private httpClient: HttpClient) { }

  /* Transform audio content in array buffer to text using google */
  speechToTextGoogle(arrayBuffer, endpoint, key, languageCode): Observable<any> {
    const url = endpoint + '?key=' + key;
    const audio = this.arrayBufferToBase64(arrayBuffer);
    const body = {
      config : {
        audioChannelCount: 2,
        languageCode
      },
      audio : {
        content: audio
      }
      };

    return this.httpClient.post<any>(url, body);
  }

  /* transform array buffer into base 64 encoding */
  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array( buffer );
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }
}
