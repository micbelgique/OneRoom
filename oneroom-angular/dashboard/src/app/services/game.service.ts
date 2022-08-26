import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private _httpClient : HttpClient) { }

  GetAllGames(): Observable<any[]>{

    return this._httpClient.get<any[]>(`https://waoneroomapi.azurewebsites.net/api/Games`);

  }

}
