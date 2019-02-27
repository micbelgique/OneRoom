import { Accessory } from './accessory';
import { Blur } from './blur';
import { Emotion } from './emotion';
import { Exposure } from './exposure';
import { FacialHair } from './facial-hair';
import { Hair } from './hair';
import { HeadPose } from './head-pose';
import { Makeup } from './makeup';
import { Noise } from './noise';
import { Occlusion } from './occlusion';

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
