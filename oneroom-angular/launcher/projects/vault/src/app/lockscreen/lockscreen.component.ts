import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Team } from '@oneroomic/oneroomlibrary';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.css']
})
export class LockscreenComponent implements OnInit {

  password: string;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
  }

  unlock() {
    if (localStorage.getItem('gameData') && localStorage.getItem('teamData')) {
      // tslint:disable-next-line:max-line-length
      const endpoint = localStorage.getItem('endpoint') + '/Vault/' + JSON.parse(localStorage.getItem('gameData')).gameId + '/' + JSON.parse(localStorage.getItem('teamData')).teamId;
      const res$ = this.httpClient.post<boolean>(endpoint, this.password, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
      res$.subscribe(
      (res: boolean) => {
        if (res === true) {
          console.log('success');
        } else {
          console.log('fail');
        }
      });
    }
  }

}
