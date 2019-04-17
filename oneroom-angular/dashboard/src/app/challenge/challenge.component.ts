import { Component, OnInit } from '@angular/core';
import { Challenge, ChallengeService } from '@oneroomic/oneroomlibrary';
import { MatSnackBar } from '@angular/material';
import { trigger, state, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ChallengeComponent implements OnInit {

  // challenge to add
  challenge: Challenge;
  // list of challenges available
  challenges: Challenge[];
  // Challenge currently expended
  expandedChallenge: Challenge | null;
  // column order
  displayedColumns: string[] = ['id', 'title', 'appName', 'order', 'timeBox', 'delete'];

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
        console.log(this.challenges);
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
