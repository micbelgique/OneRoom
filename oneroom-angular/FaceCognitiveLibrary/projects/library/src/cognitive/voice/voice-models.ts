// speech to text google

export class Alternative {
  alternatives: Transcription[];

}

export class Transcription {
  confidence: number;
  transcript: string;
}

export class SpeechToTextResponse {
  results: Alternative[];
}


// text to speech

export class TextToSpeechResponse {
  audioContent: string;
}
