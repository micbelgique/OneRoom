import { Component, OnInit } from '@angular/core';
import { AudioRecordingService } from '../services/audio-recording.service';
@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css']
})
export class TranslationComponent implements OnInit {

  untranslated: string;
  translated: string;
  data: Blob;

  constructor(
    private record: AudioRecordingService,
    ) { }

  ngOnInit() {
  }
  translate() {
    if (this.data != null) {

    }
  }
  register() {
    this.record.startRecording();
  }
  async stopRegister() {
    this.record.stopRecording();
    this.record.getRecordedBlob().subscribe((result) => {
    this.data = result.blob;
    });
    const speech = require('@google-cloud/speech');
    const fs = require('fs');

    // Creates a client
    const client = new speech.SpeechClient();

    // The name of the audio file to transcribe
    const fileName = './resources/audio.raw';

    // Reads a local audio file and converts it to base64
    const file = fs.readFileSync(fileName);
    const audioBytes = this.data.toString();

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
      content: audioBytes,
    };
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    const request = {
      audio,
      config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
    }
}
