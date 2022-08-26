import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Participant } from  '../models/participant'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  constructor(private _httpClient : HttpClient) { }

  GetAllUserFromAuth(): Observable<Participant[]>{

    return this._httpClient.get<Participant[]>(`https://authentificator-0822fa.azurewebsites.net/api/users`);

  }

}
