import { Face } from './face';
import { GlassesType } from './glass-type.enum';
import { Gender } from './gender.enum';
import { SkinColorType } from './skin-color-type.enum';
import { HairlengthType } from './hair-length-type.enum';
import { HairColorType } from './hair-color-type.enum';

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
