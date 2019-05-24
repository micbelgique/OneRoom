import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Face } from './models';
import { EndPointGetterService } from '../utilities/end-point-getter.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaceService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient, private EPGetter: EndPointGetterService) {
    this.headers = new HttpHeaders({
      'Content-Type' : 'application/json'
    });
  }

  addFace(userId: string, face: Face): Observable<boolean> {
    return this.http.post<boolean>(this.EPGetter.getEndPointUrlWithId() + '/Users/' + userId + '/Faces', face, { headers: this.headers });
  }

}
