import { Prediction } from './prediction';

export class ImagePrediction {
  id: string;
  project: string;
  iteration: string;
  created: string;
  predictions: Prediction[];
}
