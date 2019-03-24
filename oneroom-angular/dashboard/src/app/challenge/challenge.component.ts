import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    this.challengeService.getChallenges().subscribe((challenges) => {
        this.challenges = challenges;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  createChallenge() {
    this.challengeService.createChallenge(this.challenge).subscribe( () => {
      this.snackBar.open('Challenge created', 'Ok', {
        duration: 3000
      });
      this.challenge = new Challenge();
      this.refreshChallenges();
    });
  }

  public deleteChallenge(challenge: Challenge) {
    this.challengeService.deleteChallenge(challenge.challengeId).subscribe( (c: Challenge) => {
        this.snackBar.open('Game removed', 'Ok', {
          duration: 1000
        });
        this.refreshChallenges();
      });
  }
}
