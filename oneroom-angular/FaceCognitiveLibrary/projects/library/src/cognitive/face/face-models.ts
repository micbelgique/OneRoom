export class Accessory {
  confidence: number;
  type: string;
}

export class Blur {
  blurLevel: string;
  value: number;
}

export class Emotion {
  anger: number;
  contempt: number;
  disgust: number;
  fear: number;
  happiness: number;
  neutral: number;
  sadness: number;
  surprise: number;
}

export class Exposure {
  exposureLevel: string;
  value: number;
}

export class FaceAttribute {
  accessories: Accessory[];
  age: number;
  blur: Blur;
  emotion: Emotion;
  exposure: Exposure;
  facialHair: FacialHair;
  gender: string;
  glasses: string;
  hair: Hair;
  headPose: HeadPose;
  makeup: Makeup;
  noise: Noise;
  occlusion: Occlusion;
  smile: number;
}

export class FaceRectangle {
  height: number;
  left: number;
  top: number;
  width: number;
}

export class Face {
  faceAttributes: FaceAttribute;
  faceId: string;
  faceRectangle: FaceRectangle;
}

export class FacialHair {
  beard: number;
  moustache: number;
  sideburns: number;
}

export class HairColor {
  color: string;
  confidence: number;
}

export class Hair {
  bald: number;
  hairColor: HairColor[];
  invisible: boolean;
}

export class HeadPose {
  pitch: number;
  roll: number;
  yaw: number;
}

export class Makeup {
  eyeMakeup: boolean;
  lipMakeup: boolean;
}

export class Noise {
  noiseLevel: string;
  value: number;
}

export class Occlusion {
  eyeOccluded: boolean;
  foreheadOccluded: boolean;
  mouthOccluded: boolean;
}

export class FaceList {
  faceListId: string;
  name: string;
  userData: string;
  persistedFaces: PersistedFace[];
}


export class FaceSimilar {
  persistedFaceId: string;
  confidence: number;
  faceId: string;
}

export class Group {
  groups: string[][];
  messyGroup: string[];
}

export class Candidate {
  personId: string;
  confidence: number;
}

export class FaceCandidate {
  faceId: string;
  candidates: Candidate[];
}

export class FaceConfidence {
  isIdentical: boolean;
  confidence: number;
}

export class PersistedFace {
  persistedFaceId: string;
  userData: string;
}

export class PersistedPerson {
  personId: string;
}

export class Person {
  personId: string;
  persistedFaceIds: string[] = [];
  name: string;
  userData: string;
}

export class TrainingStatus {
  status: string;
  createdDateTime: Date;
  lastActionDateTime: Date;
  message: string;
}


