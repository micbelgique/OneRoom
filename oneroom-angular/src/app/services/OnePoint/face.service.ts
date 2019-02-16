import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Face } from './model/face';

@Injectable({
  providedIn: 'root'
})
export class FaceService {

  private userUrl = 'http://localhost:54218/api/faces';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200/welcome',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });
  }

  addFace(userId: string, face: Face) {
    const url = this.userUrl + '/' + userId;
    console.log(url);
    return this.http.post<boolean>(url, face, { headers: this.headers });
  }

}
