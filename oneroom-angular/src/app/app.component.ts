import { Component, OnInit } from '@angular/core';
import { FaceService } from './services/cognitive/face.service';
import { PersonGroupService } from './services/cognitive/person-group.service';

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

  constructor(private groupService: PersonGroupService) {
  }

  ngOnInit(): void {
    // creation group lobby pour stockage de personnes
    const group$ = this.groupService.create('SectInformatik01Id', 'SectInformatik', 'Group de test en developpement pour oneroom');
    group$.subscribe(() => {
      console.log('groupe SectInformatik créé');
    }, (error) => {
      console.log('group déjà existant !');
    });
  }

}
