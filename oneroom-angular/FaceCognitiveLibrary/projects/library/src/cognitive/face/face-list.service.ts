import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersistedFace, FaceList } from './face-models';
import { FaceRectangle } from './face-models';
import { EndPointGetterService } from '../../public_api';

@Injectable({
  providedIn: 'root'
})
export class FaceListService {

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
      recognitionModel
    });
  }
  /*
  Add a face to a specified face list, up to 1,000 faces.
  */
  // tslint:disable-next-line:max-line-length
  addFace(faceListId: string, userData: string = '', targetFace: FaceRectangle = null, stream: Blob, contentLength: number): Observable<PersistedFace> {

    let parameters = '?';

    // prepare http header options
    let customHeaders = this.headers.set('Content-Type', 'application/octet-stream');
    customHeaders = customHeaders.set('Content-Length', contentLength + '' );

    const httpOptions = {
      headers: customHeaders
    };

    if (userData !== '') {
      parameters += 'userData=' + userData + '&';
    }

    if (targetFace !== null) {
      parameters += 'targetFace=' + targetFace.left + ',' + targetFace.top + ',' + targetFace.width + ',' + targetFace.height;
    }

    return this.http.post<PersistedFace>(this.endPoint + '/facelists/' + faceListId + '/persistedFaces' + parameters, stream, httpOptions);
  }

  /*
  Create an empty face list with user-specified faceListId, name and an optional userData
  */
  create(faceListId: string, name: string, userData: string = ''): Observable<any> {

    const httpOptions = {
      headers: this.headers
    };

    const body = {
      name: name + '',
      userData: userData + ''
    };

    return this.http.put(this.endPoint + '/facelists/' + faceListId, body, httpOptions);
  }

  /*
  Delete a specified face list. The related face images in the face list will be deleted, too.
  */
  delete(faceListId: string): Observable<any> {

    const httpOptions = {
      headers: this.headers
    };

    return this.http.delete(this.endPoint + '/facelists/' + faceListId, httpOptions);
  }

  /*
  Delete a face from a face list by specified faceListId and persisitedFaceId. The related face image will be deleted
  */
  deleteFace(faceListId: string, persistedFaceId: string): Observable<any> {

    const httpOptions = {
      headers: this.headers
    };

    return this.http.delete(this.endPoint + '/facelists/' + faceListId + '/persistedFaces/' + persistedFaceId, httpOptions);
  }

  /*
  Retrieve a face list’s faceListId, name, userData and faces in the face list.
  */
  get(faceListId: string): Observable<FaceList> {

    const httpOptions = {
      headers: this.headers
    };

    return this.http.get<FaceList>(this.endPoint + '/facelists/' + faceListId, httpOptions);
  }

  /*
  List face lists’ faceListId, name and userData.
  */
  list(): Observable<FaceList[]> {

    const httpOptions = {
      headers: this.headers
    };

    return this.http.get<FaceList[]>(this.endPoint + '/facelists', httpOptions);
  }

  /*
  Update information of a face list, including name and userData.
  */
  update(faceListId: string, name: string, userData: string = ''): Observable<any> {

    const httpOptions = {
      headers: this.headers
    };

    const body = {
      name : name + '',
      userData: userData + ''
    };

    return this.http.patch(this.endPoint + '/facelists/' + faceListId, body, httpOptions);
  }
}
