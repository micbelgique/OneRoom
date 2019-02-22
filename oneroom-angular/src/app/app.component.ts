import { Component, OnInit } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { HttpHeaders } from '@angular/common/http';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private headers: HttpHeaders;
  title = 'OneRoom';
  opened = false;
  private hubConnection;

  constructor() {
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
    });
   }

  async ngOnInit() {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(localStorage.getItem('endpoint').replace('/api', '') + '/CoordinatorHub')
    .build();

    // this.hubConnection.on('send', data => {
    //   console.log(data);
    // });

    this.hubConnection.start({withCredentials: true}).then(() => console.log('Connection started'))
    .catch(err => console.log('Error while starting connection: ' + err));
  }
  toggleMenu(): void {
    this.opened = !this.opened;
  }
}
