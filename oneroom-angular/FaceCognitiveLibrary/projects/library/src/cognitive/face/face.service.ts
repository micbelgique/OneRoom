import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Face, FaceSimilar, Group, FaceCandidate, FaceConfidence } from './face-models';
import { Observable } from 'rxjs';
import { EndPointGetterService } from '../../public_api';


@Injectable({
  providedIn: 'root'
})
export class FaceService {

  private endPoint: string;
  private subscriptionKey: string;
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private endPointGetter: EndPointGetterService) {
    this.set(endPointGetter.getFaceEndPointUrl(), endPointGetter.getFaceSubscriptionKey());
  }

  set(endPoint: string, key: string, recognitionModel = 'recognition_02') {
    this.endPoint = endPoint;
    this.subscriptionKey = key;
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Ocp-Apim-Subscription-Key' : this.subscriptionKey,
      recognitionModel,
      returnRecognitionModel: 'true'
    });
  }

  /*
  Detect human faces in an image, return face rectangles, and optionally with faceIds, landmarks, and attributes.
  */
  detect(stream: Blob): Observable<Face[]> {
    // prepare http header options
    const customHeaders = this.headers.append('Content-Type', 'application/octet-stream');
    // customHeaders = customHeaders.append('Content-Length', contentLength + '' );

    const httpOptions = {
      headers: customHeaders
    };

    // tslint:disable-next-line:max-line-length
    const parameters = '?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise';

    // tslint:disable-next-line:max-line-length
    return this.http.post<Face[]>( this.endPoint + '/detect' + parameters, stream, httpOptions);
  }

  /*
  Given query face's faceId, to search the similar-looking faces from a faceId array, a face list or a large face list.
  */
  findSimilar(faceId: string, facesIds: string[], maxReturn = 10, matchMode = 'matchPerson'): Observable<FaceSimilar[]> {

    const httpOptions = {
      headers: this.headers
    };

    const body = {
      faceId: faceId + '',
      faceIds: facesIds,
      maxNumOfCandidatesReturned: maxReturn,
      mode: matchMode
    };

    return this.http.post<FaceSimilar[]>(this.endPoint + '/findsimilars', body, httpOptions);
  }

  /*
  Divide candidate faces into groups based on face similarity.
  */
  group(facesIds: string[]): Observable<Group> {

    const httpOptions = {
      headers: this.headers
    };

    return this.http.post<Group>(this.endPoint + '/group', {faceIds: facesIds}, httpOptions);
  }

  /*
  1-to-many identification to find the closest matches of the specific query person face from a person group or large person group.
  */
  identify(facesIds: string[], personGroupId: string = '', maxReturn = 1, confidence = 0.5): Observable<FaceCandidate[]> {

    const httpOptions = {
      headers: this.headers
    };

    const body = {
      personGroupId: personGroupId.toLowerCase(),
      faceIds: facesIds,
      maxNumOfCandidatesReturned: maxReturn,
      confidenceThreshold: confidence
    };

    return this.http.post<FaceCandidate[]>(this.endPoint + '/identify', body, httpOptions);
  }

  /*
  Verify whether two faces belong to a same person or whether one face belongs to a person.
  */
  verify(faceId: string, personId: string, personGroupId: string = ''): Observable<FaceConfidence> {

    const httpOptions = {
      headers: this.headers
    };

    const body = {
      faceId: faceId + '',
      personId: personId + '',
      personGroupId: personGroupId.toLowerCase()
    };

    return this.http.post<FaceConfidence>(this.endPoint + '/verify', body, httpOptions);
  }

}
