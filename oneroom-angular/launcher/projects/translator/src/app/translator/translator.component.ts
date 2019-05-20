import { Component, OnInit, ViewChild } from '@angular/core';
import MediaStreamRecorder from 'msr';
import { TextToSpeechService, SpeechToTextService, TranslateService } from '@oneroomic/facecognitivelibrary';
import { Challenge, ChallengeService, Team } from '@oneroomic/oneroomlibrary';
import { Lang } from '../utilities/lang';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css']
})
export class TranslatorComponent implements OnInit {

  recording = false;
  processing = false;
  @ViewChild('player')
  player;
  private lastBlob: Blob;
  untranslated: string;
  translated: string;
  languageOne: string;
  languageTwo: string;
  private audioRecorder: MediaStreamRecorder;
  private mediaConstraints = {
    audio: true,
    video: false
  };
  lang: Lang[] = [];

  private challenge: Challenge;
  private team: Team;

  private translateEndpoint = '';
  private translateKey = '';
  private textToSpeechEndpoint = '';
  private textToSpeechKey = '';
  private speechToTextEndpoint = '';
  private speechToTextKey = '';

  constructor(
    private textToSpeechService: TextToSpeechService,
    private speechToTextService: SpeechToTextService,
    private translateService: TranslateService,
    private challengeService: ChallengeService) {
    this.lang.push(new Lang('Français', 'fr-FR'));
    this.lang.push(new Lang('Anglais', 'en-US'));
    this.lang.push(new Lang('Japonais', 'ja-JP'));
    this.lang.push(new Lang('Italien', 'it-IT'));
    this.lang.push(new Lang('Allemand', 'de-DE'));
    this.lang.push(new Lang('Chinois', 'zh-HK'));
    this.lang.push(new Lang('Néerlandais', 'nl-NL'));
    this.lang.push(new Lang('Vietnamien', 'vi-VN'));
    this.lang.push(new Lang('Espagnol', 'es-ES'));
  }


  ngOnInit() {
    // tslint:disable-next-line:max-line-length

    // endpoints
    this.translateEndpoint = 'https://api.cognitive.microsofttranslator.com/translate';
    this.translateKey = '14d3566a4d5b48e98d63ac050434d641';
    this.speechToTextEndpoint = 'https://speech.googleapis.com/v1/speech:recognize';
    this.speechToTextKey = 'AIzaSyD-o-DM6CuiRWwZxToT6Lc1TkuHotexC_w';
    this.textToSpeechEndpoint = 'https://texttospeech.googleapis.com/v1beta1/text:synthesize';
    this.textToSpeechKey = 'AIzaSyDw7Iszaf27ChL3ztdso7lBssFBdLEeDJA';

    if (localStorage.getItem('challengesData')) {
      const filteredChallenge = JSON.parse(localStorage.getItem('challengesData')).filter(x => x.appName === 'traducteur');
      if (filteredChallenge.length > 0) {
        this.challenge = filteredChallenge[0];
        this.translateEndpoint = this.challenge.config.translateEndpoint;
        this.translateKey = this.challenge.config.translateKey;
        this.speechToTextEndpoint = this.challenge.config.speechToTextEndpoint;
        this.speechToTextKey = this.challenge.config.speechToTextKey;
        this.textToSpeechEndpoint = this.challenge.config.textToSpeechEndpoint;
        this.textToSpeechKey = this.challenge.config.textToSpeechKey;
      }
    }
    if (localStorage.getItem('teamData')) {
      this.team = JSON.parse(localStorage.getItem('teamData'));
    }
    this.languageOne = 'fr-FR';
    this.languageTwo = 'en-US';

    this.recording = false;
    this.processing = false;

    navigator.getUserMedia(this.mediaConstraints,
      (stream) => {
        this.audioRecorder = new MediaStreamRecorder(stream);
        this.audioRecorder.stream = stream;
        this.audioRecorder.mimeType = 'audio/wav';
        this.audioRecorder.ondataavailable = (blob) => {
            this.lastBlob = blob;
            // this.player.nativeElement.controls = true;
            // this.player.nativeElement.srcObject = null;
            // this.player.nativeElement.src = URL.createObjectURL(blob);
        };
    },
      (error) => {
        console.log(error);
    });
  }

  start() {
    this.recording = true;
    // max length audio 100 000 milli sec
    this.audioRecorder.start(100000);
  }

  stop() {
    this.audioRecorder.stop();
    this.recording = false;
    if (!this.processing) {
      this.processing = true;
      this.speechToText();
    }
  }

  speechToText() {
    if (this.lastBlob) {
    const fileReader = new FileReader();
    fileReader.onload = (event: any) => {
      this.speechToTextService.speechToTextGoogle(event.target.result, this.speechToTextEndpoint, this.speechToTextKey, this.languageOne)
      .subscribe(
        (result) => {
        console.log('speechtotext');
        this.untranslated = result.results[0].alternatives[0].transcript;
        this.processing = false;
        this.translate();
      }, () => {
        this.processing = false;
      });
    };
    fileReader.readAsArrayBuffer(this.lastBlob);
    }
  }

  translate() {
    if (this.untranslated && this.untranslated !== '') {
    this.translateService.translate(this.untranslated, this.languageOne, this.languageTwo, this.translateEndpoint, this.translateKey)
    .subscribe(
      (result) => {
        console.log('translate');
        this.translated = result[0].translations[0].text;
        this.talk(this.translated);
        // remove all chars
        const num = this.translated.replace(/[^0-9]/g, '');
        if (this.challenge.answers.includes(num) && this.team) {
          console.log('code found');
          this.challengeService.setCompleted(this.team.teamId, this.challenge.challengeId).subscribe(
            () => {
              console.log('challenge completed');
            }
          );
        }
      }
    );
    }
  }

  talk(text: string) {
    this.textToSpeechService.textToSpeechGoogle(text, this.textToSpeechEndpoint, this.textToSpeechKey, this.languageTwo, 'NEUTRAL')
    .subscribe((result) => {
      console.log('talk');
      this.player.nativeElement.src = 'data:audio/mpeg;base64,' + result.audioContent;
    });
  }

}

