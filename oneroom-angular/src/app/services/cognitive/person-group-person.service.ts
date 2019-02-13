import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class PersistedFace {
  persistedFaceId: string;
  userData: string;
}

export class PersistedPerson {
  personId: string;
}

export class Person {
  personId: string;
  persistedFaceIds: string[];
  name: string;
  userData: string;
}


@Injectable({
  providedIn: 'root'
})
export class PersonGroupPersonService {

  private endPoint: string;
  private subscriptionKey: string;
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.endPoint = environment.faceApi.EndPoint;
    this.subscriptionKey = environment.faceApi.SubscriptionKey;
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Ocp-Apim-Subscription-Key' : this.subscriptionKey
    });
   }

  /*
  Add a face image to a person into a person group for face identification or verification.
  */
  addFace(personGroupId: string, personId: string, stream: Blob, contentLength: number): Observable<PersistedFace> {

    let customHeaders = this.headers.append('Content-Type', 'application/octet-stream');
    customHeaders = customHeaders.append('Content-Length', contentLength + '' );

    const httpOptions = {
      headers: customHeaders
    };

    // tslint:disable-next-line:max-line-length
    return this.http.post<PersistedFace>(this.endPoint + '/persongroups/' + personGroupId + '/persons/' + personId + '/persistedFaces', stream, httpOptions);
  }

  /*
  Create a new person in a specified person group
  */
  create(personGroupId: string, name: string): Observable<PersistedPerson> {

    const httpOptions = {
      headers: this.headers
    };

    return this.http.post<PersistedPerson>(this.endPoint + '/persongroups/' + personGroupId + '/persons', {name: name + ''}, httpOptions);
  }

  /*
  Delete an existing person from a person group. All stored person data, and face images in the person entry will be deleted.
  */
  delete(personGroupId: string, personId: string): Observable<any> {

    const httpOptions = {
      headers: this.headers
    };

    return this.http.delete(this.endPoint + '/persongroups/' + personGroupId + '/persons/' + personId, httpOptions);
  }

  /*
  Delete a face from a person in a person group. Face data and image related to this face entry will be also deleted.
  */
  deleteFace(personGroupId: string, personId: string, persistedFaceId: string): Observable<any> {

    const httpOptions = {
      headers: this.headers
    };

    // tslint:disable-next-line:max-line-length
    return this.http.delete(this.endPoint + '/persongroups/' + personGroupId + '/persons/' + personId + '/persistedFaces/' + persistedFaceId, httpOptions);
  }

  /*
  Retrieve a person's name and userData, and the persisted faceIds representing the registered person face image.
  */
  get(personGroupId: string, personId: string): Observable<Person> {

    const httpOptions = {
      headers: this.headers
    };

    return this.http.get<Person>(this.endPoint + '/persongroups/' + personGroupId + '/persons/' + personId, httpOptions);
  }

  /*
  Retrieve person face information. The persisted person face is specified by its personGroupId, personId and persistedFaceId.
  */
  getFace(personGroupId: string, personId: string, persistedFaceId: string): Observable<PersistedFace> {

    const httpOptions = {
      headers: this.headers
    };

    // tslint:disable-next-line:max-line-length
    return this.http.get<PersistedFace>(this.endPoint + '/persongroups/' + personGroupId + '/persons/' + personId + '/persistedFaces/' + persistedFaceId, httpOptions);
  }

  /*
  List all persons’ information in the specified person group.
  */
  list(personGroupId: string, startPersonGroupId: string = '', topCount: number = 1000): Observable<Person> {

    const httpOptions = {
      headers: this.headers
    };

    // tslint:disable-next-line:max-line-length
    return this.http.get<Person>(this.endPoint + '/persongroups/' + personGroupId + '/persons?start=' + startPersonGroupId + '&top=' + topCount, httpOptions);
  }

  /*
  Update name or userData of a person.
  */
  update(personGroupId: string, personId: string, name: string): Observable<any> {

    const httpOptions = {
      headers: this.headers
    };

    return this.http.patch(this.endPoint + '/persongroups/' + personGroupId + '/persons/' + personId, {name: name + ''}, httpOptions);
  }

  /*
  Update a person persisted face's userData field.
  */
  updateFace(personGroupId: string, personId: string, persistedFaceId: string, userData: string): Observable<any> {

    const httpOptions = {
      headers: this.headers
    };

    // tslint:disable-next-line:max-line-length
    return this.http.patch(this.endPoint + '/persongroups/' + personGroupId + '/persons/' + personId + '/persistedFaces/' + persistedFaceId, { userData: userData + ''}, httpOptions);
  }
}
