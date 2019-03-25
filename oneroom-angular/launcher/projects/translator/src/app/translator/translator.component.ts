import { Component, OnInit, ViewChild } from '@angular/core';

import MediaStreamRecorder from 'msr';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css']
})
export class TranslatorComponent implements OnInit {

  @ViewChild('player')
  player;

  private audioRecorder: MediaStreamRecorder;
  private mediaConstraints = {
    audio: true,
    video: false
  };

  constructor() {
  }

  ngOnInit() {
    navigator.getUserMedia(this.mediaConstraints,
      (stream) => {
        this.audioRecorder = new MediaStreamRecorder(stream);
        this.audioRecorder.stream = stream;
        this.audioRecorder.mimeType = 'audio/wav';
        this.audioRecorder.ondataavailable = (blob) => {
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
    this.audioRecorder.save();
  }

  speechToText() {
    // TODO : utiliser src pour speech to text
    console.log(this.player.nativeElement.src);

    // TODO : SPEECH TO TEXT MICROSOFT WITH SDK HERE
  }
}
