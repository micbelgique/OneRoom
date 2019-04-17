
/*
* Public API Surface of face-cognitive-library
*/

export * from './lib/library.component';
export * from './lib/library.module';
export * from './lib/library.service';

export * from './utilities/end-point-getter.service';
export * from './utilities/face-process.service';
// Custom Vision
export * from './cognitive/vision/custom-vision-models';
export * from './cognitive/vision/custom-vision-prediction.service';
// Face
export * from './cognitive/face/face-models';
export * from './cognitive/face/face-list.service';
export * from './cognitive/face/face.service';
export * from './cognitive/face/person-group-person.service';
export { Group } from './cognitive/face/person-group.service';
export * from './cognitive/face/person-group.service';
// Voice
export * from './cognitive/voice/speech-to-text.service';
export * from './cognitive/voice/text-to-speech.service';
// text
export * from './cognitive/text/luis.service';
export * from './cognitive/text/translate.service';
