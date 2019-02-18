import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = localStorage.getItem('endpoint') + '/Users';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      // 'Access-Control-Allow-Origin': 'http://localhost:4200/welcome',
      // 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      // 'Access-Control-Allow-Headers': '*',
    });

  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  addUser(user: User): Observable<boolean> {
    // tslint:disable-next-line:object-literal-shorthand
    return this.http.post<boolean>(this.userUrl, user, { headers: this.headers });
  }

  updateAvatar(userId: string, urlAvatar: string): Observable<any> {
    return this.http.put<any>(this.userUrl + '/' + userId, {urlAvatar} , { headers: this.headers });
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = 'An error occured:' + err.error.message;
    } else {
      errorMessage = 'server returnerd code ' + err.status + ' error message is: ' + err.message;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
