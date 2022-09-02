import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { User } from  '../models/user'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _httpClient : HttpClient) { }

    AddUser(gameId: string, user : User): Observable<User>{

      return this._httpClient.post<User>(`https://oneroom-coordinator-dev.azurewebsites.net/api/Games/${gameId}/Users/newuser`, user);

    }



}
