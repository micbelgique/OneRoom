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
  currentAnswer = '';
  currentHint = '';
  mapConfig = new Map<string, string>();
  currentKey = '';
  currentValue = '';
  mapData = new Map<string, string>();
  currentKeyData = '';
  currentValueData = '';

  config = [];
  // challenge to add
  challenge: Challenge;
  // list of challenges available
  challenges: Challenge[];
  // Challenge currently expended
  expandedChallenge: Challenge | null;
  // column order
  displayedColumns: string[] = ['id', 'title', 'appName', 'order', 'timeBox', 'delete'];
  // apps available for challenges
  appSelections = ['scanner', 'traducteur', 'coffre', 'chatbot'];

  constructor(private challengeService: ChallengeService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.mapConfig.clear();
    this.mapData.clear();
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
    this.mapConfig.set(this.currentKey, this.currentValue);
    this.currentKey = '';
    this.currentValue = '';
  }
  removeConfig(key: string) {
    this.mapConfig.delete(key);
  }
  addData() {
    this.mapData.set(this.currentKeyData, this.currentValueData);
    this.currentKeyData = '';
    this.currentValueData = '';
  }
  removeData(key: string) {
    this.mapData.delete(key);
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
    this.mapConfig.forEach((value, key) => {
      this.challenge.config[key] = value;
    });
    this.mapData.forEach((value, key) => {
      this.challenge.data[key] = value;
    });
    // clear entries
    this.mapConfig.clear();
    this.mapData.clear();
    //
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
