import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, Game, Team, GameState } from '@oneroomic/oneroomlibrary';
import { environment } from '../../environments/environment';
import { Subject } from 'launcher-win32-x64/resources/app/node_modules/rxjs';

export interface MessageStyle {
  name: string;
  color: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private silentMode = false;
  private botGender = 'MALE';
  // sidenav is open
  @Input()
  isOpen: Subject<boolean>;
  @Output()
  close = new EventEmitter<boolean>();

  private firstOpening = true;
  // chat colors
  private botColor = '#9fa8da';
  private userColor = '#b0bec5';

  private intents = [
    'Aide',
    'Discussion',
    'Game',
    'Profil',
    'Salutation',
    'Navigation',
    'Remerciement'
  ];

  messages: MessageStyle[] = [];

  question: string;

  // current context
  user: User;
  game: Game;
  team: Team;

  // audio response
  @ViewChild('player')
  player;

  // tslint:disable-next-line:max-line-length
  private endpoint = 'https://centralus.api.cognitive.microsoft.com/luis/v2.0/apps/8d7cdfe9-46c3-4c10-b70d-341b65f5ed20?verbose=true&timezoneOffset=-360&subscription-key=3cf37cea3fb845ac82c53dedfd8e9f1f&q=';

  constructor(private router: Router,
              private httpClient: HttpClient) {
  }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.user = JSON.parse(localStorage.getItem('user'));
    this.game = JSON.parse(localStorage.getItem('gameData'));
    if ( localStorage.getItem('teamData')) {
      this.team = JSON.parse(localStorage.getItem('teamData'));
    }
    const welcomeMessage: MessageStyle = {
      name: 'Bonjour ' + this.user.name + ', Je suis Stéphane, le chatbot, que puis-je faire pour vous ?',
      color: this.botColor
    };
    this.messages.push(welcomeMessage);
    this.isOpen.subscribe(
      (isOpen) => {
        if (isOpen === true && this.firstOpening === true && this.messages.length === 1) {
          // welcome message from bot
          this.textToSpeechGoogle(welcomeMessage.name);
          this.firstOpening = false;
        }
      }
    );
  }

  askStephane() {
    if (this.question === null || this.question === '' || this.question.length < 3) {
      return;
    }
    const obs$ = this.httpClient.get<any>(this.endpoint + this.question);
    obs$.subscribe(
      (res) => {
        console.log(res);
        // add to message list
        this.messages.push({
          name: res.query,
          color: this.userColor
        } as MessageStyle);
        // process response
        const responseChatbot = this.processResponse(res);
        this.messages.push({
          name: responseChatbot,
          color: this.botColor
        } as MessageStyle);
        // clear input
        this.question = '';
        // voice return
        if (this.silentMode === false) {
          this.textToSpeechGoogle(responseChatbot);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }


  processResponse(response: any) {
    let responseChatbot = '';
    // retrieve target action for the intent
    const targetAction = response.entities.filter(e => e.type.indexOf('Actions') > -1);
    // switch between possibles intents
    switch (response.topScoringIntent.intent) {
      case this.intents[0]: {
        // fonctionnement
        if (response.entities.length > 0) {
          const targetHelp = response.entities.filter(e => e.type.indexOf('Applications') > -1);
          if (targetHelp.length > 0) {
            switch (targetHelp[0].entity) {
              case 'scanner': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'expliquer': {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = 'Pointez la camera vers l\'objet à scanner, attendez un petit instant, vous devriez voir apparaitre une image de l\'objet scanné, cliquez sur le bouton information pour une description plus détaillée.';
                      break;
                    }
                    default: {
                      // tslint:disable-next-line:max-line-length
                      responseChatbot = 'Le scanner capture et analyse les objets dans une pièce, il est capable de donner des descriptions succinctes des objets scannés, pointez la camera vers l\'objet à scanner pour avoir sa fiche d\'informations';
                    }
                  }
                }
                break;
              }
              case 'chatbot': {
                // tslint:disable-next-line:max-line-length
                responseChatbot = 'Je suis Stéphane le chatbot, je peux vous guider et répondre à vos questions alors n\'hesitez pas à faire appel à moi !';
                break;
              }
              case 'horloge': {
                responseChatbot = 'Cette application permet de vérifier le temps restant avant la fin de la partie, organisez-vous bien !';
                break;
              }
              case 'traducteur':  {
                // tslint:disable-next-line:max-line-length
                responseChatbot = 'Le traducteur analyse les flux audios et les traduit dans la langue selectionnée, appuyez sur le bouton "démarrer la capture" puis "arretez" et cliquez sur "traduire" en sélectionnant la langue finale souhaitée';
                break;
              }
              case 'coffre': {
                // tslint:disable-next-line:max-line-length
                responseChatbot = 'Le coffre contient un trésor numérique, des mots de passes y sont stockés, mais pour l\'ouvrir il vous faut le mot de passe principal';
                break;
              }
              default: {
                // tslint:disable-next-line:max-line-length
                responseChatbot = 'Demandez-moi de l aide pour les applications suivantes : coffre, traducteur, horloge, chatbot, scanner...';
              }
            }
          }
        } else {
          // tslint:disable-next-line:max-line-length
          responseChatbot = 'Demandez-moi de l aide pour les applications présentes dans le launcher : coffre, traducteur, horloge, chatbot, scanner...';
        }
        break;
      }
      case this.intents[1]: {
        // discussion
        if (response.entities.length > 0 ) {
          const targetDiscussion = response.entities.filter(e => e.type.indexOf('Divers') > -1);
          if (targetDiscussion.length > 0) {
            switch (targetDiscussion[0].resolution.values[0]) {
              case 'blague': {
                const jokes = [
                  'Désolé, les blagues IPv4 sont épuisées.',
                  // tslint:disable-next-line:max-line-length
                  'Je te raconterai cette blague TCP jusqu\'à ce que tu la captes, Je te raconterai cette blague TCP jusqu\'à ce que tu la captes, Je te raconterai cette blague TCP jusqu\'à ce que tu la captes.',
                  // tslint:disable-next-line:max-line-length
                  'Vous connaissez la blague du mec qui a oublié d\'incrementer la variable dans sa boucle while, Vous connaissez la blague du mec qui a oublié d\'incrementer la variable dans sa boucle while, Vous connaissez la blague du mec qui a oublié d\'incrementer la variable dans sa boucle while',
                  'Je voulais te raconter une blague sur les erreurs 404, mais je ne la retrouve plu.',
                  'Il y a deux types de personnes dans le monde : ceux qui finissent leur histoire.',
                  'Refusée au bar, la requête SQL veut aller en boîte et le videur lui dit : « Non, dehors ! C\'est select ici.',
                  'J\'ai une blague sur UDP, mais je suis pas sûr que tu la captes, est L\'ordre pour critique UDP. faire bonne blague une'
                ];
                const joke = jokes[Math.floor(Math.random() * jokes.length)];
                responseChatbot = 'Une blague ? ok, ' + joke;
                break;
              }
              case 'citation': {
                const citations = [
                  'Exige beaucoup de toi-même et attends peu des autres. Ainsi beaucoup d\'ennuis te seront épargnés. Confucius',
                  'Dans la vie on ne fait pas ce que l\'on veut mais on est responsable de ce que l\'on est. Jean-Paul Sartre',
                  'La vie est un mystère qu\'il faut vivre, et non un problème à résoudre. Gandhi',
                  'La vie, c\'est comme une bicyclette, il faut avancer pour ne pas perdre l\'équilibre. Albert Einstein',
                  'Choisissez un travail que vous aimez et vous n\'aurez pas à travailler un seul jour de votre vie. Confucius',
                  // tslint:disable-next-line:max-line-length
                  'Il ne faut avoir aucun regret pour le passé, aucun remords pour le présent, et une confiance inébranlable pour l\'avenir. Jean Jaurès',
                  'Agis avec gentillesse, mais n\'attends pas de la reconnaissance. Confucius'
                ];
                const citation = citations[Math.floor(Math.random() * citations.length)];
                responseChatbot = 'Une citation ? en voici une, ' + citation;
                break;
              }
              default: {
                responseChatbot = 'Je peux vous raconter des blagues ou des citations';
              }
            }
          } else {
            const targetVoice = response.entities.filter(e => e.type.indexOf('Voix') > -1);
            if (targetVoice.length > 0) {
              if (targetAction.length > 0) {
                switch (targetAction[0].resolution.values[0]) {
                  case 'fermer':
                  case 'desactiver': {
                    responseChatbot = 'Bien reçu, vous ne m\'entendrez plus, pour me réactiver, precisez "mode vocal"';
                    setTimeout( () => {
                      this.silentMode = true;
                    }, 2000);
                    break;
                  }
                  case 'ouvrir':
                  case 'activer': {
                    responseChatbot = 'Synthèse vocale réactivée, me revoila, que puis-je faire pour vous ?';
                    this.silentMode = false;
                    break;
                  }
                  default: {
                    responseChatbot = 'Je suis Stéphane, votre fidèle et valeureux companion d\'aventure !';
                  }
                }
              } else {
                switch (targetVoice[0].resolution.values[0]) {
                    case 'muet': {
                      responseChatbot = 'Bien reçu, vous ne m\'entendrez plus, pour me réactiver, precisez "mode vocal"';
                      setTimeout( () => {
                        this.silentMode = true;
                      }, 2000);
                      break;
                    }
                    case 'vocal': {
                      responseChatbot = 'Synthèse vocale réactivée, me revoila, que puis-je faire pour vous ?';
                      this.silentMode = false;
                      break;
                    }
                }
              }
            } else {
              const targetGender = response.entities.filter(e => e.type.indexOf('Genres') > -1);
              if (targetGender.length > 0) {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'desactiver': {
                      if (targetGender[0].resolution.values[0] === 'masculin') {
                        responseChatbot = 'Bonjour, je suis Stéphanie, je remplace Stéphane, que puis-je faire pour vous ?';
                        this.botGender = 'FEMALE';
                      } else {
                        responseChatbot = 'Bonjour, je suis Stéphane, je remplace Stéphanie, que puis-je faire pour vous ?';
                        this.botGender = 'MALE';
                      }
                      break;
                    }
                    case 'activer': {
                      if (targetGender[0].resolution.values[0] === 'masculin') {
                        responseChatbot = 'Bonjour, je suis Stéphane, je remplace Stéphanie, que puis-je faire pour vous ?';
                        this.botGender = 'MALE';
                      } else {
                        responseChatbot = 'Bonjour, je suis Stéphanie, je remplace Stéphane, que puis-je faire pour vous ?';
                        this.botGender = 'FEMALE';
                      }
                      break;
                    }
                    default: {
                      responseChatbot = 'Je suis Stéphane, votre fidèle et valeureux companion d\'aventure !';
                    }
                  }
                } else {
                  if (targetGender[0].resolution.values[0] === 'feminin') {
                    responseChatbot = 'Bonjour, je suis Stéphanie, je remplace Stéphane, que puis-je faire pour vous ?';
                    this.botGender = 'FEMALE';
                  } else {
                    responseChatbot = 'Bonjour, je suis Stéphane, je remplace Stéphanie, que puis-je faire pour vous ?';
                    this.botGender = 'MALE';
                  }
                }
              } else {

              }
            }

          }
        } else {
          responseChatbot = 'Je suis Stéphane, votre fidèle et valeureux companion d\'aventure !';
        }

        break;
      }
      case this.intents[2]: {
        // game
        if (response.entities.length > 0) {
          switch (response.entities[0].entity) {
            case 'etat': {
              const states = Object.keys(GameState).filter(key => !isNaN(Number(GameState[key])));
              responseChatbot = 'L\'état de la partie est le suivant : ' + states[this.game.state] ;
              break;
            }
            case 'lieu': {
              responseChatbot = 'TODO : LIEU';
              break;
            }
            case 'scenario': {
              responseChatbot = 'TODO : SCENARIO';
              break;
            }
            case 'temps': {
              responseChatbot = 'Le temps restant pour vous échapper est de 30 minutes';
              break;
            }
            default: {
              // tslint:disable-next-line:max-line-length
              responseChatbot = 'Vous pouvez me demander des informations sur la partie en cours tels que l\'état de celle-ci, le lieu dans lequelle vous êtes et le temps restant';
            }
          }
        } else {
            // tslint:disable-next-line:max-line-length
            responseChatbot = 'Vous pouvez me demander des informations sur la partie en cours tels que l\'état de celle-ci, le lieu dans lequelle vous êtes et le temps restant';
        }
        break;
      }
      case this.intents[3]: {
        // profil
        if (response.entities.length > 0) {
          switch (response.entities[0].entity) {
            case 'avatar': {
              responseChatbot = 'Vous voulez personnaliser votre avatar, rendez-vous dans l\'application profil, je la lance pour vous';
              this.router.navigateByUrl('/profil');
              break;
            }
            case 'nom': {
              responseChatbot = 'Pour modifier votre nom, rendez-vous dans l\'application profil, je la lance pour vous';
              this.router.navigateByUrl('/profil');
              break;
            }
            default: {
              responseChatbot = 'Vous êtes connecté en tant que ' + this.user.name;
            }
          }
        } else {
          responseChatbot = 'Je peux vous aider à gérer votre profil si vous le souhaitez';
        }
        break;
      }
      case this.intents[4]: {
        // salutation
        responseChatbot = 'Salut ' + this.user.name;
        break;
      }
      case this.intents[5]: {
        // navigation
        if (response.entities.length > 0) {
          const targetApp = response.entities.filter(e => e.type.indexOf('Applications') > -1);
          if (targetApp.length > 0) {
            switch (targetApp[0].resolution.values[0]) {
              case 'scanner': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'ouvrir': {
                      responseChatbot = 'Je lance l\'application scanner';
                      this.router.navigateByUrl('/scanner');
                      break;
                    }
                    case 'fermer': {
                      responseChatbot = 'Je quitte l\'application';
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      responseChatbot = 'Merci de préciser une action valide concernant cette application';
                    }
                  }
                } else {
                  responseChatbot = 'Merci de préciser une action concernant cette application';
                }
                break;
              }
              case 'traducteur': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'ouvrir': {
                      responseChatbot = 'Je démarre l\'application traducteur';
                      this.router.navigateByUrl('/translator');
                      break;
                    }
                    case 'fermer': {
                      responseChatbot = 'Je quitte l\'application';
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      responseChatbot = 'Merci de préciser une action valide concernant cette application';
                    }
                  }
                } else {
                  responseChatbot = 'Merci de préciser une action concernant cette application';
                }
                break;
              }
              case 'profil': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'ouvrir': {
                      responseChatbot = 'Je lance l\'application profil';
                      this.router.navigateByUrl('/profil');
                      break;
                    }
                    case 'fermer': {
                      responseChatbot = 'Je quitte l\'application';
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      responseChatbot = 'Merci de préciser une action valide concernant cette application';
                    }
                  }
                } else {
                  responseChatbot = 'Merci de préciser une action concernant cette application';
                }
                break;
              }
              case 'coffre': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'ouvrir': {
                      responseChatbot = 'Je lance l\'application coffre';
                      this.router.navigateByUrl('/vault');
                      break;
                    }
                    case 'fermer': {
                      responseChatbot = 'Je quitte l\'application';
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      responseChatbot = 'Merci de préciser une action valide concernant cette application';
                    }
                  }
                } else {
                  responseChatbot = 'Merci de préciser une action concernant cette application';
                }
                break;
              }
              case 'parametres': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'ouvrir': {
                      responseChatbot = 'Je lance l\'application parametres';
                      this.router.navigateByUrl('/settings');
                      break;
                    }
                    case 'fermer': {
                      responseChatbot = 'Je quitte l\'application';
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      responseChatbot = 'Merci de préciser une action valide concernant cette application';
                    }
                  }
                } else {
                  responseChatbot = 'Merci de préciser une action concernant cette application';
                }
                break;
              }
              case 'horloge': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'ouvrir': {
                      responseChatbot = 'Je lance l\'application horloge';
                      // this.router.navigateByUrl('/clock');
                      break;
                    }
                    case 'fermer': {
                      responseChatbot = 'Je quitte l\'application';
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      responseChatbot = 'Merci de préciser une action valide concernant cette application';
                    }
                  }
                } else {
                  responseChatbot = 'Merci de préciser une action concernant cette application';
                }
                break;
              }
              case 'menu': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'fermer': {
                      responseChatbot = 'Je vous redirige vers le menu principal';
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                    default: {
                      responseChatbot = 'Je vous redirige vers le menu principal';
                      this.router.navigateByUrl('/nav');
                      break;
                    }
                  }
                } else {
                  responseChatbot = 'Je vous redirige vers le menu principal';
                  this.router.navigateByUrl('/nav');
                  break;
                }
                break;
              }
              case 'session': {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'fermer': {
                      responseChatbot = 'Cloture de votre session en cours, à bientôt !... Terminé';
                      localStorage.removeItem('user');
                      // send signal to close
                      this.close.emit(false);
                      this.router.navigateByUrl('/lock');
                      break;
                    }
                    default: {
                      responseChatbot = 'Vous possédez une session en cours, precisez "fermer" pour vous deconnecter';
                    }
                  }
                } else {
                  responseChatbot = 'Merci de préciser une action concernant cette application';
                }
                break;
              }
              default: {
                if (targetAction.length > 0) {
                  switch (targetAction[0].resolution.values[0]) {
                    case 'fermer': {
                      responseChatbot = 'Cloture de votre session en cours, à bientôt !... Terminé';
                      localStorage.removeItem('user');
                      // send signal to close
                      this.close.emit(false);
                      this.router.navigateByUrl('/lock');
                      break;
                    }
                    default: {
                      responseChatbot = 'Vous possédez une session en cours, precisez "fermer" pour vous deconnecter';
                    }
                  }
                } else {
                  responseChatbot = 'Je suis désolé, je ne peux lancer cette application';
                }
              }
            }
          } else {
            if (targetAction.length > 0) {
              switch (targetAction[0].resolution.values[0]) {
                case 'fermer': {
                  responseChatbot = 'Cloture de votre session en cours, à bientôt !... Terminé';
                  localStorage.removeItem('user');
                  // send signal to close
                  this.close.emit(false);
                  this.router.navigateByUrl('/lock');
                  break;
                }
                default: {
                  responseChatbot = 'Merci de préciser une application à lancer et je me charge du reste';
                  break;
                }
              }
            }
          }
        } else {
          responseChatbot = 'Merci de préciser l\'application à lancer et je me charge du reste';
        }
        break;
      }
      case this.intents[6]: {
        responseChatbot = 'A votre service !';
        break;
      }
      default: {
        responseChatbot = 'Je n\'ai pas compris, pouvez-vous reformuler votre phrase';
      }
    }

    if (responseChatbot === '') {
      responseChatbot = 'Je ne comprends pas votre demande, pouvez-vous reformuler votre phrase pour moi';
    }
    return responseChatbot;
  }


  textToSpeechGoogle(text: string) {
    const url = 'https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=' + environment.googleSubTextKey;
    const body = {
      input: {
        text
      },
      voice: {
        languageCode: 'fr-FR',
        ssmlGender: this.botGender
      },
      audioConfig: {
        audioEncoding: 'MP3'
      }
    };
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.httpClient.post<any>(url, body, {headers: httpHeaders}).subscribe((result) => {
      this.player.nativeElement.src = 'data:audio/mpeg;base64,' + result.audioContent;
    });
  }

}
