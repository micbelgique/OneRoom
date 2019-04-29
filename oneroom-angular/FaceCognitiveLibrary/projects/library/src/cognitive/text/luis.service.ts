import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QueryResponse } from './text-models';

@Injectable({
  providedIn: 'root'
})
export class LuisService {

  constructor(private httpClient: HttpClient) { }

  query(text: string, endpoint: string, key: string): Observable<QueryResponse> {
    return this.httpClient.get<QueryResponse>(endpoint + '?verbose=true&timezoneOffset=-360&subscription-key=' + key + '&q=' + text);
  }
}
