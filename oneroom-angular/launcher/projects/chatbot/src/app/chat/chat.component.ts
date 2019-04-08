import { Component, OnInit, ViewChild, Input } from '@angular/core';
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

  // sidenav is open
  @Input()
  isOpen: Subject<boolean>;
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
    'Action'
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
    const welcomeMessage: MessageStyle = {
      name: 'Bonjour, Je suis Stéphane, le chatbot, que puis-je faire pour vous ?',
      color: this.botColor
    };
    this.messages.push(welcomeMessage);
    this.user = JSON.parse(localStorage.getItem('user'));
    this.game = JSON.parse(localStorage.getItem('gameData'));
    if ( localStorage.getItem('teamData')) {
      this.team = JSON.parse(localStorage.getItem('teamData'));
    }
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
        this.textToSpeechGoogle(responseChatbot);
      },
      (err) => {
        console.log(err);
      }
    );
  }


  processResponse(response: any) {
    let responseChatbot = '';
    switch (response.topScoringIntent.intent) {
      case this.intents[0]: {
        // fonctionnement
        if (response.entities.length > 0) {
          switch (response.entities[0].entity) {
            case 'scanner': {
              // tslint:disable-next-line:max-line-length
              responseChatbot = 'Le scanner capture et analyse les objets dans une pièce, il est capable de donner des descriptions succinctes des objets scannés';
              break;
            }
            case 'chatbot': {
              // tslint:disable-next-line:max-line-length
              responseChatbot = 'Je suis Stéphane le chatbot, je peux vous guider et répondre à vos questions alors n hesitez pas à faire appel à moi !';
              break;
            }
            case 'horloge': {
              responseChatbot = 'Cette application permet de vérifier le temps restant avant la fin de la partie';
              break;
            }
            case 'traducteur':  {
              responseChatbot = 'Le traducteur analyse les flux audios et les traduit dans la langue souhaitée';
              break;
            }
            case 'coffre': {
              responseChatbot = 'Le coffre contient un trésor numérique, des mots de passes y sont stockés';
              break;
            }
            default: {
              // tslint:disable-next-line:max-line-length
              responseChatbot = 'Demandez-moi de l aide pour les applications suivantes : coffre, traducteur, horloge, chatbot, scanner...';
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
        responseChatbot = 'Je suis Stéphane, votre fidèle et valeureux companion d\'aventure !';
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
        // action
        if (response.entities.length > 0) {
          switch (response.entities[0].entity) {
            case 'scanner': {
              responseChatbot = 'Je lance l\'application scanner';
              this.router.navigateByUrl('/scanner');
              break;
            }
            case 'traducteur': {
              responseChatbot = 'Je lance l\'application traducteur';
              this.router.navigateByUrl('/translator');
              break;
            }
            case 'profil': {
              responseChatbot = 'Je lance l\'application profil';
              this.router.navigateByUrl('/profil');
              break;
            }
            case 'coffre': {
              responseChatbot = 'Je lance l\'application coffre';
              this.router.navigateByUrl('/vault');
              break;
            }
            case 'parametres': {
              responseChatbot = 'Je lance l\'application parametres';
              this.router.navigateByUrl('/settings');
              break;
            }
            case 'horloge': {
              responseChatbot = 'Je lance l\'application horloge';
              break;
            }
            default: {
              responseChatbot = 'Je suis désolé, je ne peux lancer cette application';
            }
          }
        } else {
          responseChatbot = 'Merci de préciser l\'application à lancer et je me charge du reste';
        }
        break;
      }
      default: {
        responseChatbot = 'Je n\'ai pas compris, pouvez-vous reformuler votre phrase';
      }
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
        ssmlGender: 'MALE'
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
