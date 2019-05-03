export class Dictionary {
  [key: string]: string;
}

export class Challenge {
  challengeId: number;
  title: string;
  description: string;
  appName: string;
  order: number;
  timeBox: number;
  hints: string[] = [];
  answers: string[] = [];
  config: Dictionary = {};
  data: Dictionary = {};
  completed: boolean;
}

export class Configuration {
  id: number;
  // face
  faceEndpoint: string;
  faceKey: string;
  // hairlength
  visionEndpoint: string;
  visionKey: string;
  // skincolor
  visionEndpointSkinColor: string;
  visionKeySkinColor: string;
  // millisec
  refreshRate = 0.0;
  // minimum recognition
  minimumRecognized = 3;
}

export class Face {
  faceId: string;
  age: number;
  isMale: boolean;
  smileLevel: number;
  moustacheLevel: number;
  beardLevel: number;
  baldLevel: number;
  hairColor: string;
  hairLength: string;
  glassesType: GlassesType;
  emotionDominant: string;
  skinColor: string;
}

export enum GameState {
  REGISTER,
  LAUNCH,
  END
}

export class Game {
  gameId: number;
  groupName: string;
  creationDate: Date;
  state: GameState;
  users: User[] = [];
  teams: Team[] = [];
  scenarioId: number;
  scenario: Scenario;
  config: Configuration = new Configuration();
}

export enum Gender {
  MALE = 0,
  FEMALE = 1,
  OTHER = 2
}

export enum GlassesType {
  NoGlasses = 'noGlasses',
  ReadingGlasses = 'readingGlasses',
  Sunglasses = 'sunglasses',
  SwimmingGoggles = 'swimmingGoggles'
}

export enum HairColorType {
  OTHER = 'other',
  UNKNOWN = 'unknown',
  BLOND = 'blond',
  RED = 'red',
  WHITE = 'white'
}

export enum HairlengthType {
  LONG = 'long',
  MID = 'mid',
  SHORT = 'short'
}

export class Scenario {
  scenarioId: number;
  title: string;
  description: string;
  challengesId: number[];
}

export enum SkinColorType {
  AZIAN = 'azian',
  CAUCASIAN = 'caucasian',
  BLACK = 'black'
}

export class Team {
  teamId: number;
  teamName: string;
  description: string;
  descriptionAlreadyShowed: boolean;
  teamColor: string;
  creationDate: Date;
  users: User[];
  challenges: Challenge[];
}


export class User {
  userId: string;
  urlAvatar: string;
  name: string;
  faces: Face[];
  // stats recalculated
  age: number;
  gender: Gender;
  moustacheLevel: number;
  beardLevel: number;
  baldLevel: number;
  smileLevel: number;
  hairColor: HairColorType;
  hairLength: HairlengthType;
  skinColor: SkinColorType;
  glassesType: GlassesType;
  emotionDominant: string;
  recognized: number;
  isFirstConnected: boolean;

  constructor() {
    this.faces = [];
  }
}

