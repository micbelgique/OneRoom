
export class ImagePrediction {
  id: string;
  project: string;
  iteration: string;
  created: string;
  predictions: Prediction[];
}


export class Prediction {
  probability: number;
  tagId: string;
  tagName: string;
  boundingBox: Region;
}


export class Region {
  left: number;
  top: number;
  width: number;
  height: number;
}

