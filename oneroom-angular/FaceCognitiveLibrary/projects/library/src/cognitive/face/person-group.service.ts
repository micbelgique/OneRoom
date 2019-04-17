import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndPointGetterService } from '../../utilities/end-point-getter.service';
import { TrainingStatus } from './face-models';

export class Group {
  personGroupId: string;
  name: string;
  userData: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonGroupService {

  private endPoint: string;
  private subscriptionKey: string;
  private headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    private endPointGetter: EndPointGetterService) {
    this.set(endPointGetter.getFaceEndPointUrl(), endPointGetter.getFaceSubscriptionKey());
  }

  set(endPoint: string, key: string) {
    this.endPoint = endPoint;
    this.subscriptionKey = key;
    this.headers = new HttpHeaders({
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Ocp-Apim-Subscription-Key' : this.subscriptionKey
    });
  }

  /*
  Create a new person group with specified personGroupId, name, and user-provided userData.
  A person group is the container of the uploaded person data, including face images and face recognition features.
  */
  create(personGroupId: string, name: string, userData: string = ''): Observable<any> {

    const httpOptions = {
      headers : this.headers
    };

    const body = {
      name : name + '',
      userData : userData + ''
    };

    return this.http.put(this.endPoint + '/persongroups/' + personGroupId.toLowerCase(), body, httpOptions);
  }
  /*
  Delete an existing person group with specified personGroupId. Persisted data in this person group will be deleted.
  */
  delete(personGroupId: string): Observable<any> {

    const httpOptions = {
      headers : this.headers
    };

    return this.http.delete(this.endPoint + '/persongroups/' + personGroupId.toLowerCase(), httpOptions);
  }

  /*
  Retrieve person group name and userData.
  */
  get(personGroupId: string): Observable<Group> {

    const httpOptions = {
      headers : this.headers
    };

    return this.http.get<Group>(this.endPoint + '/persongroups/' + personGroupId.toLowerCase(), httpOptions);
  }

  /*
  To check person group training status completed or still ongoing
  */
  getTrainingStatus(personGroupId: string): Observable<TrainingStatus> {

    const httpOptions = {
      headers : this.headers
    };

    return this.http.get<TrainingStatus>(this.endPoint + '/persongroups/' + personGroupId.toLowerCase() + '/training', httpOptions);
  }

  /*
  List person groups’s pesonGroupId, name, and userData. starting from startPersonGroupId and counting topCount
  */
  list(startPersonGroupId: string = '', topCount: number = 1000): Observable<Group[]> {

    const httpOptions = {
      headers : this.headers
    };

    const parameters = '?start=' + startPersonGroupId + '&top' + topCount;

    return this.http.get<Group[]>(this.endPoint + '/persongroups' + parameters, httpOptions);
  }

  /*
  Submit a person group training task.
  */
  train(personGroupId: string): Observable<any> {

    const httpOptions = {
      headers : this.headers
    };

    return this.http.post(this.endPoint + '/persongroups/' + personGroupId.toLowerCase() + '/train', null, httpOptions);

  }

  /*
  Update an existing person group's name and userData.
  */
  update(personGroupId: string, name: string): Observable<any> {

    const httpOptions = {
      headers : this.headers
    };

    return this.http.patch(this.endPoint + '/persongroups/' + personGroupId.toLowerCase(), {name: name + ''}, httpOptions);

  }
}
