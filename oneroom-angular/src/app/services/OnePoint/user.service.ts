import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { User } from './model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = 'https://oneroom-api20190213113008.azurewebsites.net/api/users';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });

  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl, { headers: this.headers })
      .pipe(tap(data => console.log('all: ' + JSON.stringify(data))),
      catchError(this.handleError)
      );
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
