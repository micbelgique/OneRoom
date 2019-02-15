import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Group } from './model/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private userUrl = 'http://localhost:54218/api/groups';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });
  }

  getGroups() {

  }

  addGroup(group: Group) {
    return this.http.post(this.userUrl, group, { headers: this.headers });
  }


}
