import { Component, OnInit, ViewChild } from '@angular/core';
import MediaStreamRecorder from 'msr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  radioUrl = ['http://audiostream.rtl.be/contactfr192',
  'https://radios.rtbf.be/classic21-128.mp3',
  'http://streamingp.shoutcast.com/NRJPremium'
  ];
  radioLaunched = [false, false, false];
  currentSource = this.radioUrl[0];
  private audioRecorder: MediaStreamRecorder;
  private mediaConstraints = {
    audio: true,
    video: false
  };
  @ViewChild('player')
  player;
  constructor() { }

  ngOnInit() {
    navigator.getUserMedia(this.mediaConstraints,
      (stream) => {
        this.audioRecorder = new MediaStreamRecorder(stream);
        this.audioRecorder.stream = stream;
        this.audioRecorder.mimeType = 'audio/mpeg';
        this.player.nativeElement.src = this.currentSource;
    },
      (error) => {
        console.log(error);
    });
  }
  launchRadio(num: number) {
    this.currentSource = this.radioUrl[num];
    this.player.nativeElement.src = this.currentSource;
    for (let i = 0; i < this.radioLaunched.length; i++) {
      this.radioLaunched[i] = false;
  }
    this.radioLaunched[num] = true;
  }
}
