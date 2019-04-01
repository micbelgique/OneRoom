import { Component, OnInit, ViewChild } from '@angular/core';

import MediaStreamRecorder from 'msr';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'projects/translator/src/environments/environment';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css']
})
export class TranslatorComponent implements OnInit {

  @ViewChild('player')
  player;
  private lastBlob: Blob;
  private headers;
  untranslated: string;
  translated: string;
  languageOne: string;
  languageTwo: string;
  private audioRecorder: MediaStreamRecorder;
  private mediaConstraints = {
    audio: true,
    video: false
  };

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.headers = new HttpHeaders({
      'Ocp-Apim-Subscription-Key': '14d3566a4d5b48e98d63ac050434d641',
      'Content-Type': 'application/json'
    });
    navigator.getUserMedia(this.mediaConstraints,
      (stream) => {
        this.audioRecorder = new MediaStreamRecorder(stream);
        this.audioRecorder.stream = stream;
        this.audioRecorder.mimeType = 'audio/wav';
        this.audioRecorder.ondataavailable = (blob) => {
            this.lastBlob = blob;
            this.player.nativeElement.controls = true;
            this.player.nativeElement.srcObject = null;
            this.player.nativeElement.src = URL.createObjectURL(blob);
        };
    },
      (error) => {
        console.log(error);
    });
  }

  start() {
    console.log('starting');
    // max length audio 100 000 milli sec
    this.audioRecorder.start(100000);
  }

  stop() {
    console.log('stoping');
    this.audioRecorder.stop();
    this.speechToText();
  }
  speechToText() {
    let arrayBuffer;
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      arrayBuffer = event.target.result;
      const url = 'https://speech.googleapis.com/v1/speech:recognize?key=' + environment.googleSubKeySpeech;
      const audio = this.arrayBufferToBase64(arrayBuffer);
      const body = {
        config : {
          audioChannelCount: 2,
          languageCode: this.languageOne
        },
        audio : {
          content: audio
        }
      };
      this.http.post<any>(url, body).subscribe((result) => {
        this.untranslated = result.results[0].alternatives[0].transcript;
      });
    };
    fileReader.readAsArrayBuffer(this.lastBlob);
  }
  translate() {
    const body = [{Text: this.untranslated}];
    // tslint:disable-next-line:max-line-length
    this.http.post<any>('https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=' + this.languageOne + '&to=' + this.languageTwo, body, {headers: this.headers}).subscribe(
      (result) => {
        this.translated = result[0].translations[0].text;
        this.textToSpeechGoogle(this.translated);
      }
    );
  }
  textToSpeechGoogle(text: string) {
    const url = 'https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=' + environment.googleSubTextKey;
    const body = {
      input: {
        text
      },
      voice: {
        languageCode: this.languageTwo,
        ssmlGender: 'NEUTRAL'
      },
      audioConfig: {
        audioEncoding: 'MP3'
      }
    };
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.post<any>(url, body, {headers: httpHeaders}).subscribe((result) => {
      this.player.nativeElement.src = 'data:audio/mpeg;base64,' + result.audioContent;
    });
  }
  arrayBufferToBase64( buffer ) {
    let binary = '';
    const bytes = new Uint8Array( buffer );
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}
}

