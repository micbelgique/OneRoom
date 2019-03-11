import { Component, OnInit } from '@angular/core';
import { Challenge, ChallengeService } from '@oneroomic/oneroomlibrary';
import { MatSnackBar } from '@angular/material';

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
  displayedColumns: string[] = ['id', 'title', 'description', 'urlDocumentation', 'delete'];

  constructor(private challengeService: ChallengeService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.challenges = [];
    this.challenge = new Challenge();
    this.refreshChallenges();
  }

  refreshChallenges() {
    const res$ = this.challengeService.getChallenges();
    res$.subscribe(
      (challenges) => {
        this.challenges = challenges;
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
