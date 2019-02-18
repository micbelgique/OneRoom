import { Injectable } from '@angular/core';
import { FaceService, FaceCandidate } from '../services/cognitive/face.service';
import { PersonGroupPersonService, PersistedPerson, Person } from '../services/cognitive/person-group-person.service';
import { PersonGroupService, Group } from '../services/cognitive/person-group.service';
import { Face } from '../services/cognitive/face/model/face';
import { Observable, Subject } from 'rxjs';

export class PersonGroup {
  group: Group;
  persons: PersonGroupPerson[] = [];
}

export class PersonGroupPerson {
  person: Person;
  faces: Face[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class FaceProcessService {


  result$: Subject<PersonGroup> = new Subject<PersonGroup>();
  private result: PersonGroup = new PersonGroup();

  constructor(
    private faceService: FaceService,
    private personService: PersonGroupPersonService,
    private groupService: PersonGroupService) {}


  byImg(stream: Blob, group: Group): Observable<PersonGroup> {
    this.result = new PersonGroup();
    // 0. Create group or not if exists
    const getGroup$ = this.groupService.get(group.personGroupId);
    getGroup$.subscribe(
    (g) => {
      // saving group
      this.result.group = g;
      this.detect(stream, g);
    },
    (error) => {
      console.log('CREATING GROUP');
      const group$ = this.groupService.create(group.personGroupId, group.name, group.userData);
      group$.subscribe(
      () => {
        // saving group
        this.result.group = group;
        this.detect(stream, group);
      },
      () => {}
      );
    });

    return this.result$;
  }

  private detect(stream: Blob, group: Group) {
        // 1. Detect
        const detect$ = this.faceService.detect(stream);
        detect$.subscribe(
        (faces) => {
          // data
          console.log('face detected : ' + faces.length);
          // Simple message with an action.
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
            const identify$ = this.faceService.identify([face.faceId], group.personGroupId, 1, 0.6);
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
            // saving candidates info
            const idx = this.result.persons.map(per => per.person.personId).indexOf(personId);
            if ( idx > -1) {
                // person already exists in array
                this.result.persons[idx].faces.push(face);
                this.result.persons[idx].person.persistedFaceIds.push(data.persistedFaceId);
            } else {
              const p = new PersonGroupPerson();
              p.person = new Person();
              p.person.personId = personId;
              this.result.persons.push(p);
              this.result.persons[this.result.persons.length - 1].faces.push(face);
              this.result.persons[this.result.persons.length - 1].person.persistedFaceIds.push(data.persistedFaceId);
            }

            this.train(group.personGroupId);
          },
          () => {
            console.log('ERROR : Adding face');
          });
  }

 private createPerson(group: Group, stream: Blob, face: Face) {
    // 3. Create person
    // tslint:disable-next-line:max-line-length
    const person$ = this.personService.create(group.personGroupId, 'user_' + Math.random(), 'test person created to train a model');

    person$.subscribe(
          (data) => {
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
      this.list(groupId);
    },
    () => {
      // 6. training status
      const trainStatus$ = this.groupService.getTrainingStatus(groupId);
      trainStatus$.subscribe();
    });
  }

  private list(groupId) {
    // list person with their face
    this.result$.next(this.result);
    /*
    const $persons = this.personService.list(groupId);
    $persons.subscribe(
    (data) => {
      console.log('LISTING');
      console.log('total person in group : ' + data.length);
      for (const p of data) {
          console.log('person : ' + p.name);
          console.log(p);
      }
    });*/
  }

}
