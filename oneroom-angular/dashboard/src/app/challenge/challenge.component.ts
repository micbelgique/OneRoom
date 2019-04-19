import { Component, OnInit, ɵConsole } from '@angular/core';
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
  currentAnswer = '';
  currentHint = '';
  currentKey = '';
  currentValue = '';
  config = [];
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
    this.challenge.answers = [];
    this.challenge.hints = [];
    this.refreshChallenges();
    console.log(this.challenge.config);
  }
  addAnswer() {
    this.challenge.answers.push(this.currentAnswer);
    this.currentAnswer = '';
  }
  addHint() {
    this.challenge.hints.push(this.currentHint);
    this.currentHint = '';
  }
  addConfig() {
    this.challenge.config.set(this.currentKey, this.currentValue);
    this.currentKey = '';
    this.currentValue = '';
    console.log(this.challenge.config);
  }
  removeConfig(key: string) {
    this.challenge.config.delete(key);
  }
  removeHint() {
    this.challenge.hints.pop();
  }
  removeAnswer() {
    this.challenge.answers.pop();
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
