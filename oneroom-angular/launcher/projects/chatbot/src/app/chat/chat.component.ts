import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { User, Game, Team, GameState, Challenge } from '@oneroomic/oneroomlibrary';
import { environment } from '../../environments/environment';
import { replies } from '../utilities/reply-fr';
import { Subject } from 'rxjs';
import { TextToSpeechService, LuisService } from '@oneroomic/facecognitivelibrary';
import { Bot } from '../utilities/bot';
import { MessageStyle } from '../utilities/message-style';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  bots: Bot[] = [
    new Bot('Stéphane', 'MALE', '#9fa8da'),
    new Bot('Stéphanie', 'FEMALE', '#bc477b')
  ];

  currentBot: Bot;

  // sidenav is open
  @Input()
  isOpen: Subject<boolean>;
  @Output()
  close = new EventEmitter<boolean>();

  private firstOpening = true;

  // chat colors
  private userColor = '#b0bec5';

  private intents = [
    'Aide',
    'Discussion',
    'Game',
    'Profil',
    'Salutation',
    'Navigation',
    'Remerciement',
    'Commande',
    'Compliment'
  ];

  messages: MessageStyle[] = [];

  question: string;

  // current context
  user: User;
  game: Game;
  team: Team;
  challenges: Challenge[] = [];
  challenge: Challenge;
  dialog = false;

  // audio response
  @ViewChild('player')
  player;

  // tslint:disable-next-line:max-line-length
  private luisEndpoint = 'https://centralus.api.cognitive.microsoft.com/luis/v2.0/apps/8d7cdfe9-46c3-4c10-b70d-341b65f5ed20';
  private luisKey = '3cf37cea3fb845ac82c53dedfd8e9f1f';
  private textToSpeechEndpoint = 'https://texttospeech.googleapis.com/v1beta1/text:synthesize';
  private textToSpeechKey =  environment.googleSubTextKey;

  constructor(private router: Router,
              private textToSpeechService: TextToSpeechService,
              private luisService: LuisService) {
  }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
    if (localStorage.getItem('gameData')) {
      this.game = JSON.parse(localStorage.getItem('gameData'));
    }
    if ( localStorage.getItem('teamData')) {
      this.team = JSON.parse(localStorage.getItem('teamData'));
    }
    if (localStorage.getItem('challengesData')) {
      this.challenges = JSON.parse(localStorage.getItem('challengesData'));
      const idx = this.challenges.map(c => c.appName).indexOf('chatbot');
      if ( idx !== -1 ) {
        // config endpoints and keys
        this.challenge = this.challenges[idx];
        this.luisEndpoint = this.challenge.config.luisEndpoint;
        this.luisKey = this.challenge.config.luisKey;
        this.textToSpeechEndpoint = this.challenge.config.textToSpeechEndpoint;
        this.textToSpeechKey =  this.challenge.config.textToSpeechKey;
      }
    }
    // selection of bot
    this.currentBot = this.bots[0];
    // welcome message
    const welcomeMessage: MessageStyle = {
      name: 'Bonjour ' + this.user.name + ', Je suis ' + this.currentBot.name +  ', le chatbot, que puis-je faire pour vous ?',
      color: this.currentBot.color
    };
    this.messages.push(welcomeMessage);
    // when first opened play introduction
    this.isOpen.subscribe(
      (isOpen) => {
        if (isOpen === true && this.firstOpening === true && this.messages.length === 1) {
          // welcome message from bot
          // tslint:disable-next-line:max-line-length
          this.textToSpeechService.textToSpeechGoogle(welcomeMessage.name, this.textToSpeechEndpoint, this.textToSpeechKey, 'fr-FR', this.currentBot.gender).subscribe(
            (result) => this.talk(result.audioContent)
          );
          this.firstOpening = false;
        }
      }
    );
  }

  talk(audioBase64) {
    this.player.nativeElement.src = 'data:audio/mpeg;base64,' + audioBase64;
  }

  askStephane() {

    if (this.question === null || this.question === '' || this.question.length < 3) {
      return;
    }

    // add to message list
    this.messages.push({
      name: this.question,
      color: this.userColor
    } as MessageStyle);

    const query = this.question;

    // clear input
    this.question = '';

    const obs$ = this.luisService.query(query, this.luisEndpoint, this.luisKey);
    obs$.subscribe(
      (res) => {
        console.log(res);

        // process response
        const responseChatbot = this.processResponse(res);
        console.log(responseChatbot);

        this.messages.push({
            name: responseChatbot,
            color: this.currentBot.color
        } as MessageStyle);

        // voice return
        if (this.currentBot.silentMode === false) {
          // tslint:disable-next-line:max-line-length
          this.textToSpeechService.textToSpeechGoogle(responseChatbot, this.textToSpeechEndpoint, environment.googleSubTextKey, 'fr-FR', this.currentBot.gender).subscribe(
            (result) => this.talk(result.audioContent)
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  processResponse(response: any): string {
    console.log(response);
    let responseChatbot = '';

    /*if (this.question.includes(this.challenge.data.trigger)) {
      // asking question
      this.dialog = true;
      return this.challenge.data.question;
    }

    // console.log(this.question);
    // console.log(this.challenge.answers);
    if (this.dialog === true && this.challenge.answers[0].includes(this.question)) {
      // success
      this.dialog = false;
      return 'Bonne réponse, voici le code du cadenas de la porte';
    } else if (this.dialog === true) {
      return 'Mauvaise réponse ! Réessayer';
    }*/

    // retrieve target action for the intent
    const intent = response.topScoringIntent.intent;
    const targetAction = response.entities.filter(e => e.type.indexOf('Actions') > -1);
    const targetDiscussion = response.entities.filter(e => e.type.indexOf('Divers') > -1);
    const targetVoice = response.entities.filter(e => e.type.indexOf('Voix') > -1);
    const targetGender = response.entities.filter(e => e.type.indexOf('Genres') > -1);
    const targetApp = response.entities.filter(e => e.type.indexOf('Applications') > -1);
    const targetGame = response.entities.filter(e => e.type.indexOf('Partie') > -1);
    const targetProfil = response.entities.filter(e => e.type.indexOf('Utilisateur') > -1);
    const targetCalendar = response.entities.filter(e => e.type.indexOf('Calendrier') > -1);

    // switch between possibles intents
    switch (intent) {
      case this.intents[0]: {
        // aide apps
        if (targetApp.length > 0 && targetApp[0].resolution.values[0]) {
          let apps;
          const app = targetApp[0].resolution.values[0];
          if (targetAction.length > 0 && targetAction[0].resolution.values[0]) {
            const action = targetAction[0].resolution.values[0];
            apps = replies.intents.aide[action];
          } else {
            apps = replies.intents.aide.expliquer;
          }
          if (app in apps) {
            responseChatbot = apps[app][Math.floor(Math.random() * apps.default.length)];
          } else {
            // default
            responseChatbot = apps.default[Math.floor(Math.random() * apps.default.length)];
          }
        } else {
          // default
          // tslint:disable-next-line:max-line-length
          responseChatbot = replies.intents.aide.default[Math.floor(Math.random() * replies.intents.aide.default.length)];
        }
        break;
      }
      case this.intents[1]: {
        // discussion
        if (targetCalendar.length > 0 && targetCalendar[0].resolution.values[0]) {
            const calendar = replies.intents.discussion[targetCalendar[0].resolution.values[0]];
            // calendar
            if ('default' in calendar) {
              responseChatbot = calendar.default[Math.floor(Math.random() * calendar.default.length)];
            } else {
              responseChatbot = calendar[Math.floor(Math.random() * calendar.length)];
            }
        } else if (targetAction.length > 0 && targetAction[0].resolution.values[0]) {
          const action = targetAction[0].resolution.values[0];
          const discussion = replies.intents.discussion[action];
          if (targetDiscussion.length > 0 && targetDiscussion[0].resolution.values[0]) {
            // citation, blagues, poeme, fable
            const subject = targetDiscussion[0].resolution.values[0];
            responseChatbot = discussion[subject][Math.floor(Math.random() * discussion[subject].length)];
          } else {
            // default
            responseChatbot = discussion.default[Math.floor(Math.random() * discussion.default.length)];
          }
        } else {
          responseChatbot = replies.intents.discussion.default[Math.floor(Math.random() * replies.intents.discussion.default.length)];
        }
        break;
      }
      case this.intents[2]: {
        // game
        if (targetGame.length > 0 && targetGame[0].resolution.values[0]) {
          let partie;
          const ctx = targetGame[0].resolution.values[0];
          if (targetAction.length > 0 && targetAction[0].resolution.values[0]) {
            const action = targetAction[0].resolution.values[0];
            partie = replies.intents.game[action];
          } else {
            partie = replies.intents.game;
          }

          if (ctx in partie) {
            if ('default' in partie[ctx]) {
              responseChatbot = partie[ctx].default[Math.floor(Math.random() * partie[ctx].default.length )];
            } else {
              responseChatbot = partie[ctx][Math.floor(Math.random() * partie[ctx].length )];
            }
          } else {
            // default
            responseChatbot = partie.default[Math.floor(Math.random() * partie.default.length)];
          }
        } else {
          // default
          // tslint:disable-next-line:max-line-length
          responseChatbot = replies.intents.game.default[Math.floor(Math.random() * replies.intents.game.default.length)];
        }
        break;
      }
      case this.intents[3]: {
        // profil
        if (targetProfil.length > 0 && targetProfil[0].resolution.values[0]) {
          switch (targetProfil[0].resolution.values[0]) {
            case 'avatar': {
              // tslint:disable-next-line:max-line-length
              responseChatbot =  replies.intents.profil.configurer.avatar[Math.floor(Math.random() * replies.intents.profil.configurer.avatar.length)];
              this.router.navigateByUrl('/profil');
              break;
            }
            case 'nom': {
              // tslint:disable-next-line:max-line-length
              responseChatbot = replies.intents.profil.configurer.nom[Math.floor(Math.random() * replies.intents.profil.configurer.nom.length)];
              this.router.navigateByUrl('/profil');
              break;
            }
            default: {
              // tslint:disable-next-line:max-line-length
              responseChatbot = replies.intents.profil.configurer.default[Math.floor(Math.random() * replies.intents.profil.configurer.default.length)];
            }
          }
        } else {
          responseChatbot = replies.intents.profil.default[Math.floor(Math.random() * replies.intents.profil.default.length)];
        }
        break;
      }
      case this.intents[4]: {
        // salutation
        responseChatbot = replies.intents.salutation.default[Math.floor(Math.random() * replies.intents.salutation.default.length)];
        // this.user.name;
        break;
      }
      case this.intents[5]: {
        // navigation
        if (response.entities.length > 0) {
          if (targetApp.length > 0) {
            switch (targetApp[0].resolution.values[0]) {
              case 'scanner': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'ouvrir': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.ouvrir.scanner[Math.floor(Math.random() * replies.intents.navigation.ouvrir.scanner.length)];
                      this.router.navigateByUrl('/scanner');
                      break;
                    }
                    case 'fermer': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.fermer.scanner[Math.floor(Math.random() * replies.intents.navigation.fermer.scanner.length)];
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
                    }
                  }
                } else {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
                }
                break;
              }
              case 'traducteur': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'ouvrir': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.ouvrir.traducteur[Math.floor(Math.random() * replies.intents.navigation.ouvrir.traducteur.length)];
                      this.router.navigateByUrl('/translator');
                      break;
                    }
                    case 'fermer': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.fermer.traducteur[Math.floor(Math.random() * replies.intents.navigation.fermer.traducteur.length)];
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
                    }
                  }
                } else {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
                }
                break;
              }
              case 'profil': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'ouvrir': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.ouvrir.profil[Math.floor(Math.random() * replies.intents.navigation.ouvrir.profil.length)];
                      this.router.navigateByUrl('/profil');
                      break;
                    }
                    case 'fermer': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.fermer.profil[Math.floor(Math.random() * replies.intents.navigation.fermer.profil.length)];
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
                    }
                  }
                } else {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
                }
                break;
              }
              case 'coffre': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'ouvrir': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.ouvrir.coffre[Math.floor(Math.random() * replies.intents.navigation.ouvrir.coffre.length)];
                      this.router.navigateByUrl('/vault');
                      break;
                    }
                    case 'fermer': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.fermer.coffre[Math.floor(Math.random() * replies.intents.navigation.fermer.coffre.length)];
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
                    }
                  }
                } else {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
                }
                break;
              }
              case 'parametres': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'ouvrir': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.ouvrir.parametres[Math.floor(Math.random() * replies.intents.navigation.ouvrir.parametres.length)];
                      this.router.navigateByUrl('/settings');
                      break;
                    }
                    case 'fermer': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.fermer.parametres[Math.floor(Math.random() * replies.intents.navigation.fermer.parametres.length)];
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
                    }
                  }
                } else {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
                }
                break;
              }
              case 'horloge': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'ouvrir': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.ouvrir.horloge[Math.floor(Math.random() * replies.intents.navigation.ouvrir.horloge.length)];
                      // this.router.navigateByUrl('/clock');
                      break;
                    }
                    case 'fermer': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.fermer.horloge[Math.floor(Math.random() * replies.intents.navigation.fermer.horloge.length)];
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
                    }
                  }
                } else {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
                }
                break;
              }
              case 'menu': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'fermer': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.fermer.menu[Math.floor(Math.random() * replies.intents.navigation.fermer.menu.length)];
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.fermer.menu[Math.floor(Math.random() * replies.intents.navigation.fermer.menu.length)];
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                  }
                } else {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.navigation.fermer.menu[Math.floor(Math.random() * replies.intents.navigation.fermer.menu.length)];
                  this.router.navigateByUrl('/nav');
                  break;
                }
                break;
              }
              case 'session': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'fermer': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.fermer.session[Math.floor(Math.random() * replies.intents.navigation.fermer.session.length)];
                      localStorage.removeItem('user');
                      // send signal to close
                      this.close.emit(false);
                      this.router.navigateByUrl('/lock');
                      break;
                    }
                    default: {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.session.default[Math.floor(Math.random() * replies.intents.navigation.session.default.length)];
                    }
                  }
                } else {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.navigation.session.default[Math.floor(Math.random() * replies.intents.navigation.session.default.length)];
                }
                break;
              }
              default: {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'fermer': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.fermer.session[Math.floor(Math.random() * replies.intents.navigation.fermer.session.length)];
                      localStorage.removeItem('user');
                      // send signal to close
                      this.close.emit(false);
                      this.router.navigateByUrl('/lock');
                      break;
                    }
                    default: {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.navigation.session.default[Math.floor(Math.random() * replies.intents.navigation.session.default.length)];
                    }
                  }
                } else {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.navigation.ouvrir.default[Math.floor(Math.random() * replies.intents.navigation.ouvrir.default.length)];
                }
              }
            }
          } else {
            if (targetAction.length > 0) {
              switch (targetAction[0].resolution.values[0]) {
                case 'fermer': {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.navigation.fermer.session[Math.floor(Math.random() * replies.intents.navigation.fermer.session.length)];
                  localStorage.removeItem('user');
                  // send signal to close
                  this.close.emit(false);
                  this.router.navigateByUrl('/lock');
                  break;
                }
                default: {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
                  break;
                }
              }
            }
          }
        } else {
          // tslint:disable-next-line:max-line-length
          responseChatbot = responseChatbot = replies.intents.navigation.default[Math.floor(Math.random() * replies.intents.navigation.default.length)];
        }
        break;
      }
      case this.intents[6]: {
        responseChatbot = replies.intents.remerciement.default[Math.floor(Math.random() * replies.intents.remerciement.default.length)];
        break;
      }
      case this.intents[7]: {
        // autres commandes
        if (response.entities.length > 0 ) {
          if (targetVoice.length > 0) {
            if (targetAction.length > 0) {
              switch (targetAction[0].resolution.values[0]) {
                case 'fermer': {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.commande.fermer.voix[Math.floor(Math.random() * replies.intents.commande.fermer.voix.length)];
                  setTimeout( () => {
                    this.currentBot.silentMode = true;
                  }, 2000);
                  break;
                }
                case 'desactiver': {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.commande.desactiver.voix[Math.floor(Math.random() * replies.intents.commande.desactiver.voix.length)];
                  setTimeout( () => {
                    this.currentBot.silentMode = true;
                  }, 2000);
                  break;
                }
                case 'ouvrir': {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.commande.ouvrir.voix[Math.floor(Math.random() * replies.intents.commande.ouvrir.voix.length)];
                  this.currentBot.silentMode = false;
                  break;
                }
                case 'activer': {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.commande.activer.voix[Math.floor(Math.random() * replies.intents.commande.activer.voix.length)];
                  this.currentBot.silentMode = false;
                  break;
                }
                default: {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.commande.default[Math.floor(Math.random() * replies.intents.commande.default.length)];
                }
              }
            } else {
              switch (targetVoice[0].resolution.values[0]) {
                  case 'muet': {
                    // tslint:disable-next-line:max-line-length
                    responseChatbot = replies.intents.commande.muet.default[Math.floor(Math.random() * replies.intents.commande.muet.default.length)];
                    setTimeout( () => {
                      this.currentBot.silentMode = true;
                    }, 2000);
                    break;
                  }
                  case 'vocal': {
                    // tslint:disable-next-line:max-line-length
                    responseChatbot = replies.intents.commande.vocal.default[Math.floor(Math.random() * replies.intents.commande.vocal.default.length)];
                    this.currentBot.silentMode = false;
                    break;
                  }
              }
            }
          } else {
            if (targetGender.length > 0) {
              if (targetAction.length > 0) {
                switch (targetAction[0].resolution.values[0]) {
                  case 'desactiver': {
                    if (targetGender[0].resolution.values[0] === 'masculin') {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.commande.feminin.default[Math.floor(Math.random() * replies.intents.commande.feminin.default.length)];
                      this.currentBot = this.bots.filter(b => b.gender === 'FEMALE')[0];
                    } else {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.commande.masculin.default[Math.floor(Math.random() * replies.intents.commande.masculin.default.length)];
                      this.currentBot = this.bots.filter(b => b.gender === 'MALE')[0];
                    }
                    break;
                  }
                  case 'activer': {
                    if (targetGender[0].resolution.values[0] === 'masculin') {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.commande.masculin.default[Math.floor(Math.random() * replies.intents.commande.masculin.default.length)];
                      this.currentBot = this.bots.filter(b => b.gender === 'MALE')[0];
                    } else {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = replies.intents.commande.feminin.default[Math.floor(Math.random() * replies.intents.commande.feminin.default.length)];
                      this.currentBot = this.bots.filter(b => b.gender === 'FEMALE')[0];
                    }
                    break;
                  }
                  default: {
                    // tslint:disable-next-line:max-line-length
                    responseChatbot = replies.intents.commande.default[Math.floor(Math.random() * replies.intents.commande.default.length)];
                  }
                }
              } else {
                if (targetGender[0].resolution.values[0] === 'feminin') {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.commande.feminin.default[Math.floor(Math.random() * replies.intents.commande.feminin.default.length)];
                  this.currentBot = this.bots.filter(b => b.gender === 'FEMALE')[0];
                } else {
                  // tslint:disable-next-line:max-line-length
                  responseChatbot = replies.intents.commande.masculin.default[Math.floor(Math.random() * replies.intents.commande.masculin.default.length)];
                  this.currentBot = this.bots.filter(b => b.gender === 'MALE')[0];
                }
              }

            } else {
              responseChatbot = replies.intents.commande.default[Math.floor(Math.random() * replies.intents.commande.default.length)];
            }
          }
          } else {
            responseChatbot = replies.intents.commande.default[Math.floor(Math.random() * replies.intents.commande.default.length)];
          }
        break;
      }
      case this.intents[8]: {
        responseChatbot = replies.intents.compliment.default[Math.floor(Math.random() * replies.intents.compliment.default.length)];
        break;
      }
      default: {
        responseChatbot = replies.intents.default[Math.floor(Math.random() * replies.intents.default.length)];
      }
    }

    if (responseChatbot === '') {
      responseChatbot = replies.intents.default[Math.floor(Math.random() * replies.intents.default.length)];
    }

    // replace values with context
    // nom utilisateur
    if (responseChatbot.includes('%user::name%')) {
      responseChatbot = responseChatbot.replace('%user::name%', this.user.name);
    }
    // temps restant
    if (responseChatbot.includes('%game::timeleft%')) {
      responseChatbot = responseChatbot.replace('%game::timeleft%', '30');
    }
    // histoire
    if (responseChatbot.includes('%game::story%')) {
      // tslint:disable-next-line:max-line-length
      let scenario = 'Aucun scénario configuré';
      if ( this.game.scenario.description ) {
        scenario = this.game.scenario.description;
      }
      responseChatbot = responseChatbot.replace('%game::story%', scenario);
      // tslint:disable-next-line:max-line-length
      // Bienvenue dans une expérience unique, vous allez être confronter à différentes énigmes, pour les résoudre faites preuve de créativité et de bon sens, vous êtes enfermez dans cette pièce, pour en sortir, trouvez la clé, vous avez des outils votre disposition. C\'est tout pour le moment, bonne chance...
    }
    // lieu
    if (responseChatbot.includes('%game::place%')) {
      responseChatbot = responseChatbot.replace('%game::place%', 'bureau du mic');
    }
    // etat
    if (responseChatbot.includes('%game::state%')) {
      const states = Object.keys(GameState).filter(key => !isNaN(Number(GameState[key])));
      responseChatbot = responseChatbot.replace('%game::state%', states[this.game.state]);
    }
    // indice
    if (responseChatbot.includes('%game::hint%')) {
      // tslint:disable-next-line:max-line-length
      const challengesNotCompleted = this.challenges.sort( (c1, c2) => Number(c1.order) - Number(c2.order) ); // filter(c => c.completed === false)
      if (challengesNotCompleted.length > 0) {
        const idx = Math.floor(Math.random() * challengesNotCompleted.length);
        // tslint:disable-next-line:no-unused-expression
        const hint = challengesNotCompleted[idx].hints[Math.floor(Math.random() * challengesNotCompleted[idx].hints.length)];
        responseChatbot = responseChatbot.replace('%game::hint%', hint);
      } else {
        responseChatbot = responseChatbot.replace('%game::hint%', 'Aucun challenge en cours');
      }
    }
    // nom bot
    if (responseChatbot.includes('%bot::name%')) {
      responseChatbot = responseChatbot.replace('%bot::name%', this.currentBot.name);
    }
    // calendar infos
    const date = new Date();
    if (responseChatbot.includes('%calendar::year%')) {
      const options = { year: 'numeric' };
      responseChatbot = responseChatbot.replace('%calendar::year%', date.toLocaleDateString('fr-FR', options));
    }
    if (responseChatbot.includes('%calendar::date%')) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      responseChatbot = responseChatbot.replace('%calendar::date%', date.toLocaleDateString('fr-FR', options));
    }
    if (responseChatbot.includes('%calendar::time%')) {
      responseChatbot = responseChatbot.replace('%calendar::time%', date.toLocaleTimeString('fr-FR'));
    }
    if (responseChatbot.includes('%calendar::day%')) {
      const options = { weekday: 'long', day: 'numeric' };
      responseChatbot = responseChatbot.replace('%calendar::day%', date.toLocaleDateString('fr-FR', options));
    }
    if (responseChatbot.includes('%calendar::month%')) {
      const options = { month: 'long' };
      responseChatbot = responseChatbot.replace('%calendar::month%', date.toLocaleDateString('fr-FR', options));
    }

    return responseChatbot;
  }
}
