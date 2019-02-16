import { Component, OnInit } from '@angular/core';
import { FaceService } from './services/cognitive/face.service';
import { PersonGroupService } from './services/cognitive/person-group.service';
import { environment } from 'src/environments/environment.prod';

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

  constructor() { }

  async ngOnInit() {}

  toggleMenu(): void {
    this.opened = !this.opened;
  }
}
