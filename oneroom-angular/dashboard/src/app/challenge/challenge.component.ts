import { Component, OnInit } from '@angular/core';
import { Challenge, ChallengeService } from '@oneroomic/oneroomlibrary';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { NotifierService } from 'angular-notifier';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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
  appSelections = ['scanner', 'traducteur', 'coffre', 'chatbot', 'voice'];

  appPlaceholderConfig = {
    scanner: ['customVisionEndpoint', 'customVisionKey'],
    traducteur: ['translateEndpoint', 'translateKey', 'speechToTextEndpoint', 'speechToTextKey', 'textToSpeechEndpoint', 'textToSpeechKey'],
    coffre: [],
    chatbot: ['luisEndpoint', 'luisKey', 'textToSpeechEndpoint', 'textToSpeechKey'],
    voice: ['language', 'gender', 'loop']
  };

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  placeholderConfig: string[];

  constructor(private challengeService: ChallengeService,
              private notifierService: NotifierService) { }

  ngOnInit() {
    this.challenges = [];
    this.challenge = new Challenge();
    this.challenge.answers = [];
    this.challenge.hints = [];

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        this.currentConfigKey = value;
        console.log('value changed to : ' + value);
        this.placeholderConfig = this.appPlaceholderConfig[this.challenge.appName];
        if (!this.placeholderConfig) {
          this.placeholderConfig = [];
        }
        return this.filter(value, this.placeholderConfig);
      })
    );

    this.refreshChallenges();
  }

  appSelected() {
    this.placeholderConfig = this.appPlaceholderConfig[this.challenge.appName];
    // remove previous config
    this.challenge.config = {};
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
        this.notifierService.notify( 'error', err.message );
      }
    );
  }

  createChallenge() {
    this.challengeService.createChallenge(this.challenge).subscribe( () => {
        this.notifierService.notify( 'success', 'Challenge created' );
        this.challenge = new Challenge();
        this.refreshChallenges();
      }, (err) => {
        this.notifierService.notify( 'error', err.message );
      }
    );
  }

  public deleteChallenge(challenge: Challenge) {
    this.challengeService.deleteChallenge(challenge.challengeId).subscribe( (c: Challenge) => {
        this.notifierService.notify( 'warning', 'Challenge removed' );
        this.refreshChallenges();
      }, (err) => {
        this.notifierService.notify( 'error', err.message );
      }
    );
  }

  private filter(value: string, array: string[]): string[] {
    const filterValue = value.toLowerCase();

    return array.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}
