import { Component, OnInit } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';

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

  title = 'OneRoom';
  opened = false;
  private hubConnection;

  constructor() { }

  // async ngOnInit() {
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //   .withUrl(localStorage.getItem('endpoint').replace('/api', '') + '/CoordinatorHub')
  //   .build();

  //   this.hubConnection.on('send', data => {
  //     console.log(data);
  //   });

  //   this.hubConnection.start({withCredentials: false}).then(() => this.hubConnection.invoke('send', 'Hello'));
  // }

  toggleMenu(): void {
    this.opened = !this.opened;
  }
}
