import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Face } from './model/face';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FaceService {

  private faceUrl = localStorage.getItem('endpoint') + '/faces';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200/welcome',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });
  }

  addFace(userId: string, face: Face) {
    return this.http.post<boolean>(this.faceUrl + '/' + userId, face, { headers: this.headers });
  }

}
