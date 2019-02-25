import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Face } from './model/face';
import { EndPointGetterService } from 'src/app/utilities/end-point-getter.service';

@Injectable({
  providedIn: 'root'
})
export class FaceService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient, private EPGetter: EndPointGetterService) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200/welcome',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });
  }

  addFace(userId: string, face: Face) {
    return this.http.post<boolean>(this.EPGetter.getEndPointUrlWithId() + '/Users/' + userId + '/Faces', face, { headers: this.headers });
  }

}
