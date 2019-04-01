import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Team } from '@oneroomic/oneroomlibrary';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.css']
})
export class LockscreenComponent implements OnInit {

  password: string;

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  ngOnInit() {
  }

  unlock() {
    if (localStorage.getItem('gameData') && localStorage.getItem('teamData')) {
      // tslint:disable-next-line:max-line-length
      const endpoint = localStorage.getItem('endpoint') + '/Vault/' + JSON.parse(localStorage.getItem('gameData')).gameId + '/' + JSON.parse(localStorage.getItem('teamData')).teamId;
      // tslint:disable-next-line:max-line-length
      const res$ = this.httpClient.post<boolean>(endpoint, this.password, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
      res$.subscribe(
      (res: boolean) => {
        if (res === true) {
          console.log('success');
          this.router.navigateByUrl('/vault/main');
        } else {
          console.log('fail');
        }
      },
      () => {
        console.log('fail');
      });
    }
  }

}
