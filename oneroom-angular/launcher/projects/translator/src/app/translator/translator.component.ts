import { Component, OnInit, ViewChild } from '@angular/core';

import MediaStreamRecorder from 'msr';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css']
})
export class TranslatorComponent implements OnInit {

  @ViewChild('player')
  player;
  private lastBlob;
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
    // or pass external blob/file
    // this.audioRecorder.save();
    this.speechToText();
    /// TODO : call speech to text microsoft using blob url
  }
  speechToText() {
    // TODO : utiliser src pour speech to text
      // pull in the required packages.
    let sdk = require('microsoft-cognitiveservices-speech-sdk');

    // replace with your own subscription key,
    // service region (e.g., "westus"), and
    // the name of the file you want to run
    // through the speech recognizer.
    let subscriptionKey = '3e17428195894a8f9de3e76ee431ff80';
    let serviceRegion = 'westeurope'; // e.g., "westus"
    // let filename = "YourAudioFile.wav"; // 16000 Hz, Mono
    let arrayBuffer;
    let fileReader = new FileReader();
    fileReader.onload = (event) => {
      arrayBuffer = event.target.result;
      let pushStream = sdk.AudioInputStream.createPushStream();
      pushStream.write(arrayBuffer);
      // open the file and push it to the push stream.
      // fs.createReadStream(filename).on('data', function(arrayBuffer) {
      //   pushStream.write(arrayBuffer.buffer);
      // }).on('end', function() {
      //   pushStream.close();
      // });

      // we are done with the setup
      // now create the audio-config pointing to our stream and
      // the speech config specifying the language.
      let audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
      let speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

      // setting the recognition language to English.
      speechConfig.speechRecognitionLanguage = this.languageOne;

      // create the speech recognizer.
      let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      // start the recognizer and wait for a result.
      recognizer.recognizeOnceAsync(
        (result) => {
          this.untranslated = result.privText;
          recognizer.close();
          recognizer = undefined;
        },
        (err) => {
          console.log('err - ' + err);

          recognizer.close();
          recognizer = undefined;
        });
    };
    fileReader.readAsArrayBuffer(this.lastBlob);
    // create the push stream we need for the speech sdk.
        // TODO : SPEECH TO TEXT MICROSOFT WITH SDK HERE
  }
  translate() {
    let body = [{Text: this.untranslated}];
    // tslint:disable-next-line:max-line-length
    this.http.post<any>('https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=' + this.languageOne + '&to=' + this.languageTwo, body, {headers: this.headers}).subscribe(
      (result) => { this.translated = result[0].translations[0].text; console.log(result)}
    );
  }
}
