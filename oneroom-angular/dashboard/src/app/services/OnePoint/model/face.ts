import { GlassesType } from './glasses-type.enum';

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
