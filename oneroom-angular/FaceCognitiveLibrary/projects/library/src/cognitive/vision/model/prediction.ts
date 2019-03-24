import { Region } from './region';

export class Prediction {
  probability: number;
  tagId: string;
  tagName: string;
  boundingBox: Region;
}
