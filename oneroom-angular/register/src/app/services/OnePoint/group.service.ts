import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EndPointGetterService } from 'src/app/utilities/end-point-getter.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private header: HttpHeaders;
  constructor(private http: HttpClient,
              private endPointGetter: EndPointGetterService) {
    this.header = new HttpHeaders(
      {
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': '*',
      }
    );
   }
   getGroups(): Observable<string[]> {
     return this.http.get<string[]>(this.endPointGetter.getEndPointUrl() + '/Client/GetGroups', { headers: this.header});
   }
   setGroup() {
     return this.http.post<any>(this.endPointGetter.getEndPointUrl() + '/Client/SetGroup', {headers: this.header});
   }
}
