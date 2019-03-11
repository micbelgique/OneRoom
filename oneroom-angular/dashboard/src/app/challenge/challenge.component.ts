import { Component, OnInit } from '@angular/core';
import { Challenge } from '@oneroomic/oneroomlibrary';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css']
})
export class ChallengeComponent implements OnInit {

  // challenge to add
  challenge: Challenge;
  // list of challenges available
  challenges: Challenge[];
  // column order
  displayedColumns: string[] = ['id', 'name', 'date', 'update', 'delete'];


  constructor() { }

  ngOnInit() {
  }

}
