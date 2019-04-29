import { Component, OnInit } from '@angular/core';
import { Challenge, ChallengeService } from '@oneroomic/oneroomlibrary';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { NotifierService } from 'angular-notifier';

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

  currentConfigKey = '';
  currentConfigValue = '';

  currentDataKey = '';
  currentDataValue = '';

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
              private notifierService: NotifierService) { }

  ngOnInit() {
    this.challenges = [];
    this.challenge = new Challenge();
    this.challenge.answers = [];
    this.challenge.hints = [];
    this.refreshChallenges();
  }

  addAnswer() {
    if (this.currentAnswer.trim() !== '') {
      this.challenge.answers.push(this.currentAnswer);
      this.currentAnswer = '';
    } else {
      this.notifierService.notify( 'error', 'La réponse doit contenir au moins un caractère' );
    }
  }

  removeAnswer(i: number) {
    this.challenge.answers.splice(i, 1);
  }

  addHint() {
    if (this.currentHint.trim() !== '') {
      this.challenge.hints.push(this.currentHint);
      this.currentHint = '';
    } else {
      this.notifierService.notify( 'error', 'Un indice doit contenir au moins un caractère' );
    }
  }

  removeHint(i: number) {
    this.challenge.hints.splice(i, 1);
  }

  addConfig() {
    if (this.currentConfigKey.trim() !== '' && this.currentConfigValue.trim() !== '') {
      this.challenge.config[this.currentConfigKey] = this.currentConfigValue;
      this.currentConfigKey = '';
      this.currentConfigValue = '';
    } else {
      this.notifierService.notify( 'error', 'La clé et la valeur de la config doivent contenir au moins un caractère' );
    }
  }

  removeConfig(key: string) {
    delete this.challenge.config[key];
  }

  addData() {
    if (this.currentDataKey.trim() !== '' && this.currentDataValue.trim() !== '') {
      this.challenge.data[this.currentDataKey] = this.currentDataValue;
      this.currentDataKey = '';
      this.currentDataValue = '';
    } else {
      this.notifierService.notify( 'error', 'La clé et la valeur des données doivent contenir au moins un caractère' );
    }
  }

  removeData(key: string) {
    delete this.challenge.data[key];
  }

  refreshChallenges() {
    this.challengeService.getChallenges().subscribe((challenges) => {
        this.challenges = challenges;
      },
      (err) => {
        this.notifierService.notify( 'error', err.error );
      }
    );
  }

  createChallenge() {
    this.challengeService.createChallenge(this.challenge).subscribe( () => {
        this.notifierService.notify( 'success', 'Challenge created' );
        this.challenge = new Challenge();
        this.refreshChallenges();
      }, (err) => {
        this.notifierService.notify( 'error', err.error );
      }
    );
  }

  public deleteChallenge(challenge: Challenge) {
    this.challengeService.deleteChallenge(challenge.challengeId).subscribe( (c: Challenge) => {
        this.notifierService.notify( 'warning', 'Challenge removed' );
        this.refreshChallenges();
      }, (err) => {
        this.notifierService.notify( 'error', err.error );
      }
    );
  }
}
