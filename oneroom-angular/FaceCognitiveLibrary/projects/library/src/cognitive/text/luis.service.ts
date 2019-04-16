import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LuisService {

  constructor(private httpClient: HttpClient) { }

  luis(text: string, endpoint: string, key: string): Observable<any> {
    return this.httpClient.get<any>(endpoint + '?verbose=true&timezoneOffset=-360&subscription-key=' + key + '&q=' + text);
  }
}
