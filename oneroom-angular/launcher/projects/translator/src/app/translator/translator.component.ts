import { Component, OnInit } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css']
})
export class TranslatorComponent implements OnInit {

<<<<<<< HEAD
  @ViewChild('player')
  player;
  private lastBlob;
=======
  // Lets initiate Record OBJ
  private record;
  // Will use this flag for detect recording
  recording = false;
  // Url of Blob
  url: string;
  private error;

  constructor(private domSanitizer: DomSanitizer) {
  }
>>>>>>> TranslatorApp

  ngOnInit(): void {
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

<<<<<<< HEAD
  ngOnInit() {
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
=======
  initiateRecording() {
      this.url = null;
      this.recording = true;
      const mediaConstraints = {
           video: false,
           audio: true
      };
      navigator.mediaDevices
           .getUserMedia(mediaConstraints)
           .then(this.successCallback.bind(this), this.errorCallback.bind(this));
>>>>>>> TranslatorApp
  }

  successCallback(stream) {
      const options = {
           mimeType: 'audio/wav',
           numberOfAudioChannels: 1
      };
      // Start Actuall Recording
      const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
      this.record = new StereoAudioRecorder(stream, options);
      this.record.record();
  }

<<<<<<< HEAD
  stop() {
    console.log('stoping');
    this.audioRecorder.stop();
    // or pass external blob/file
    // this.audioRecorder.save();
    this.speechToText();
  }

  speechToText() {
    // TODO : utiliser src pour speech to text
    console.log(this.lastBlob);
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
      console.log(pushStream);

      // now create the audio-config pointing to our stream and
      // the speech config specifying the language.
      let audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
      let speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

      // setting the recognition language to English.
      speechConfig.speechRecognitionLanguage = 'en-US';

      // create the speech recognizer.
      let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      console.log('hey');
      // start the recognizer and wait for a result.
      recognizer.recognizeOnceAsync(
        (result) => {
          console.log(result);

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
=======
  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));

    /// TODO : call speech to text microsoft using blob url
  }

  processRecording(blob) {
    this.url = URL.createObjectURL(blob);
  }

  errorCallback(error) {
       this.error = 'Cannot play audio';
>>>>>>> TranslatorApp
  }
  private makeblob(dataURL) {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
        // tslint:disable-next-line:no-shadowed-variable
        const parts = dataURL.split(',');
        // tslint:disable-next-line:no-shadowed-variable
        const contentType = parts[0].split(':')[1];
        // tslint:disable-next-line:no-shadowed-variable
        const raw = decodeURIComponent(parts[1]);
        return {
          rawlength: raw.length,
          blob: new Blob([raw], { type: contentType })
        };
    }
    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return {
      rawlength: raw.length,
      blob: new Blob([uInt8Array], { type: contentType })
    };
    }
}
