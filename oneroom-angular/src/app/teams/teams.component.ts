import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../services/OnePoint/teams.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  nbTeams: number;

  constructor(private snackBar: MatSnackBar,private teamsService: TeamsService) { }

  ngOnInit() {
    this.nbTeams = 5;
  }

  createTeam() {
    const res$ = this.teamsService.createTeam(this.nbTeams);
    res$.subscribe( x => {
      this.snackBar.open('Teams Created', 'Ok', {
        duration: 3000
      });
      console.log(x);
    });
  }
}
