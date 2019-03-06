export class Configuration {
  id: number;
  faceEndpoint: string;
  faceKey: string;
  visionEndpoint: string;
  visionKey: string;
  refreshRate: number;
  minimumRecognized = 3;
}
