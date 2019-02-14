import { Injectable } from '@angular/core';
import { FaceService, FaceCandidate } from '../services/cognitive/face.service';
import { PersonGroupPersonService } from '../services/cognitive/person-group-person.service';
import { PersonGroupService, Group } from '../services/cognitive/person-group.service';
import { Face } from '../services/cognitive/face/model/face';

@Injectable({
  providedIn: 'root'
})
export class FaceProcessService {


  constructor(
    private faceService: FaceService,
    private personService: PersonGroupPersonService,
    private groupService: PersonGroupService) {}


  async byImg(stream: Blob, group: Group) {
    // 0. Create group or not if exists
    const getGroup$ = this.groupService.get(group.personGroupId);
    getGroup$.subscribe(
    (g) => {
      this.detect(stream, group);
    },
    (error) => {
      console.log('CREATING GROUP');
      const group$ = this.groupService.create(group.personGroupId, group.name, group.userData);
      group$.subscribe(
      () => this.detect(stream, group),
      () => {}
      );
    });

  }

  private detect(stream: Blob, group: Group) {
        // 1. Detect
        const detect$ = this.faceService.detect(stream);
        detect$.subscribe(
        (faces) => {
          // data
          console.log('face detected : ' + faces.length);
          for (const face of faces) {
              this.identify(face, group, stream);
          }
        },
        () => {
          // error
          console.log('ERROR : Detect faces');
        });
  }

  private identify(face: Face, group: Group, stream: Blob) {
            // 2. Identify person
            console.log(face);
            const identify$ = this.faceService.identify([face.faceId], group.personGroupId, 1, 0.7);
            identify$.subscribe(
            (faceCandidates) => {
              console.log('identified candidates : ' + faceCandidates.length);
              for (const candidate of faceCandidates) {
                console.log('Face ID : ' + candidate.faceId);
                if (candidate.candidates.length === 1) {
                    this.addFace(group, candidate.candidates[0].personId, stream, face);
                } else {
                    this.createPerson(group, stream, face);
                }
              }
            },
            (error) => {
              // 3. Create person AI not trained
              console.log('ERROR : Identify person');
              this.createPerson(group, stream, face);
            });
  }

  private addFace(group: Group, personId: string, stream: Blob, face: Face) {
          // person identified matching the face
          // 4. Add Face to person
          // tslint:disable-next-line:max-line-length
          const face$ = this.personService.addFace(group.personGroupId, personId, stream, face.faceRectangle);
          face$.subscribe(
          (data) => {
            console.log('ADDING FACE');
            console.log('persisted Face ID : ' + data.persistedFaceId);
            this.train(group.personGroupId);
          },
          () => {
            console.log('ERROR : Adding face');
          });
  }

 private createPerson(group: Group, stream: Blob, face: Face) {
    // 3. Create person and add face
    // tslint:disable-next-line:max-line-length
    const person$ = this.personService.create(group.personGroupId, 'user_' + Math.random(), 'test person created to train a model');

    person$.subscribe(
          (data) => {
            console.log('CREATING PERSON');
            console.log('Person created persisted ID : ' + data.personId);
            this.addFace(group, data.personId, stream, face);
          },
          () => {
              console.log('ERROR : Create person');
          });
 }

  private train(groupId) {
    // 5. train group
    const train$ = this.groupService.train(groupId);
    train$.subscribe(
    () => {
      console.log('TRAINING');
      console.log('Group trained ! ');
      this.list(groupId);
    },
    () => {
      console.log('ERROR : Training group');
      // 6. training status
      const trainStatus$ = this.groupService.getTrainingStatus(groupId);
      trainStatus$.subscribe(
      (status) => {
          console.log('TRAINING STATUS');
          console.log('Status : ' + status.status);
          console.log('Action Date : ' + status.lastActionDateTime);
          console.log('Creation Date : ' + status.createdDateTime);
      });
    });
  }

  private list(groupId) {
    // list person with their face
    const $persons = this.personService.list(groupId);
    $persons.subscribe(
    (data) => {
      console.log('LISTING');
      console.log('total person in group : ' + data.length);
      for (const p of data) {
          console.log('person : ' + p.name);
          console.log(p);
      }
    });
  }

}
