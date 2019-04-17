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
