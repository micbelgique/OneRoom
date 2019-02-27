import { Component, OnInit } from '@angular/core';
import { PersonGroupService } from '../services/cognitive/person-group.service';
import { MatSnackBar } from '@angular/material';
import { GameService } from '../services/OnePoint/game.service';
import { Game } from '../services/OnePoint/model/game';
import { LeaderboardService } from '../services/OnePoint/leaderboard.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // coordinator
  endPoint: string;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    // coordinator
    this.endPoint = localStorage.getItem('endpoint');
  }

  saveCoordinatorSettings(): void {
    localStorage.setItem('endpoint', this.endPoint);
    this.snackBar.open('Settings updated', 'Ok', {
      duration: 2000
    });
  }

}
