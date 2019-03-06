import { Face } from './face';
import { GlassesType } from './glass-type.enum';
import { Gender } from './gender.enum';

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
  hairColor: string;
  hairLength: string;
  skinColor: string;
  glassesType: GlassesType;
  emotionDominant: string;
  recognized: number;

  constructor() {
    this.faces = [];
  }
}
