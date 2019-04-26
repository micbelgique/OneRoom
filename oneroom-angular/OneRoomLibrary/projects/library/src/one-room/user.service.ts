import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { User } from './models';
import { EndPointGetterService } from '../utilities/end-point-getter.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient, private EPGetter: EndPointGetterService) {
    this.headers = new HttpHeaders({
      'Content-Type' : 'application/json'
    });

  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.EPGetter.getEndPointUrlWithId() + '/Users', { headers: this.headers });
  }

  getUser(userID: string): Observable<User> {
    return this.http.get<User>(this.EPGetter.getEndPointUrlWithId() + '/Users/' + userID, { headers: this.headers });
  }

  addUser(user: User): Observable<boolean> {
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post<boolean>(this.EPGetter.getEndPointUrlWithId() + '/Users', user, { headers: this.headers });
  }

  deleteUser(userId: string): Observable<User> {
    return this.http.delete<User>(this.EPGetter.getEndPointUrlWithId() + '/Users/' + userId, { headers: this.headers });
  }

  updateNameUser(user: User): Observable<User> {
    return this.http.post<User>(this.EPGetter.getEndPointUrlWithId() + '/Users/updateNameUser', user, { headers: this.headers });
  }

  updateUser(user: User): Observable<any> {
    return this.http.put<User>(this.EPGetter.getEndPointUrlWithId() + '/Users/' + user.userId, user, { headers: this.headers });
  }

  mergeUser(user1: string, user2: string): Observable<User> {
    return this.http.put<User>(this.EPGetter.getEndPointUrlWithId() + '/Users?userId1=' + user1 + '&userId2=' + user2,
      null, { headers: this.headers });
  }
}
