import { Component, OnInit } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css']
})
export class TranslatorComponent implements OnInit {

  // Lets initiate Record OBJ
  private record;
  // Will use this flag for detect recording
  recording = false;
  // Url of Blob
  url: string;
  private error;

  constructor(private domSanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

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
  }
}
