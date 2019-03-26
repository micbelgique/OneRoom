import { Injectable } from '@angular/core';
import { FaceService, FaceCandidate } from '../cognitive/face.service';
import { PersonGroupPersonService, PersistedPerson, Person } from '../cognitive/person-group-person.service';
import { PersonGroupService, Group } from '../cognitive/person-group.service';
import { Face } from '../cognitive/face/model/face';
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
  resForDetect$: Subject<string> = new Subject<string>();
  private resultForDetect: string;

  constructor(
    private faceService: FaceService,
    private personService: PersonGroupPersonService,
    private groupService: PersonGroupService) {}


  byImg(stream: Blob, group: Group, createGroupIfNotExists = false ): Observable<PersonGroup> {
    this.result = new PersonGroup();
    // 0. Create group or not if exists
    const getGroup$ = this.groupService.get(group.personGroupId);
    getGroup$.subscribe(
    (g) => {
      // saving group
      console.log('group exists');
      this.result.group = g;
      this.detect(stream, g);
    },
    (error) => {
      if (createGroupIfNotExists === true) {
        console.log('CREATING GROUP');
        const group$ = this.groupService.create(group.personGroupId, group.name, group.userData);
        group$.subscribe(
        () => {
          // saving group
          this.result.group = group;
          this.detect(stream, group);
        },
        () => {
          this.result$.next(null);
        }
        );
      }
    });

    return this.result$;
  }

  detectOnly(stream: Blob, group: Group): Subject<string> {
    const detect$ = this.faceService.detect(stream);
    detect$.subscribe(
      (faces) => {
        // data
        console.log('face detected : ' + faces.length);
        if (faces.length === 0) {
          this.result$.next(null);
        } else {
          this.identifyOnly(faces[0], group);
        }
      },
      () => {
        // error
        console.log('ERROR : Detect faces');
        this.result$.next(null);
      });
    return this.resForDetect$;
  }

  private identifyOnly(face: Face, group: Group) {
    console.log(face);
    const identify$ = this.faceService.identify([face.faceId], group.personGroupId, 1, 0.6);
    identify$.subscribe(
    (faceCandidates) => {
      console.log('identified candidates : ' + faceCandidates.length);
      console.log(faceCandidates);
      if (faceCandidates.length > 0 && faceCandidates[0].candidates.length > 0) {
        this.resultForDetect = faceCandidates[0].candidates[0].personId;
        this.getString();
      } else {
        this.resForDetect$.next(null);
      }
    },
    () => {
      console.log('ERROR : Identify');
      this.resForDetect$.next(null);
    });
  }

  private getString() {
    this.resForDetect$.next(this.resultForDetect);
  }

  private detect(stream: Blob, group: Group) {
        // 1. Detect
        const detect$ = this.faceService.detect(stream);
        detect$.subscribe(
        (faces) => {
          // data
          console.log('face detected : ' + faces.length);
          if (faces.length === 0) {
            this.result$.next(null);
          }
          // Simple message with an action.
          this.identifyFaces(faces, group, stream, 0.6);
          /*for (const face of faces) {
              this.identify(face, group, stream, 0.6);
          }*/
        },
        () => {
          // error
          console.log('ERROR : Detect faces');
          this.result$.next(null);
        });
  }

  /*
    Identify multiple faces : use this to make less calls
  */
  private identifyFaces(faces: Face[], group: Group, stream: Blob, minConfidence = 0.5) {
     // 2. Identify person
     console.log(group.personGroupId);
     const identify$ = this.faceService.identify(faces.map(f => f.faceId), group.personGroupId, 10, minConfidence);
     identify$.subscribe(
     (faceCandidates) => {
       for (const candidate of faceCandidates) {
         const idxFace = faces.map(f => f.faceId).indexOf(candidate.faceId);
         if (candidate.candidates.length === 1) {
          this.addFace(group, candidate.candidates[0].personId, stream, faces[idxFace]);
         } else if (candidate.candidates.length > 1) {
          console.log(candidate.candidates);
          // optimise results
          for (let i = 1; i < candidate.candidates.length; i++) {
            if (candidate.candidates[i].confidence > 0.80) {
              // delete duplicate where confidence is greater than 80 %
              // TODO (improvement): GET faces from this person and assigned them to the most known person
              const del$ = this.personService.delete(group.personGroupId, candidate.candidates[i].personId);
              del$.subscribe(
                () => {
                  console.log('Duplicate person deleted');
                },
                (err) => {
                  console.log(err);
                }
              );
            }
          }
          // adds face and retrain
          this.addFace(group, candidate.candidates[0].personId, stream, faces[idxFace]);
         } else {
          this.createPerson(group, stream, faces[idxFace]);
         }
       }
     },
     (error) => {
       // 3. Create person group not trained
       for (const f of faces) {
        this.createPerson(group, stream, f);
       }
     });
  }

  /*
    Identify one face only
  */
  private identify(face: Face, group: Group, stream: Blob, minConfidence = 0.5) {
            // 2. Identify person
            console.log(group.personGroupId);
            const identify$ = this.faceService.identify([face.faceId], group.personGroupId, 1, minConfidence);
            identify$.subscribe(
            (faceCandidates) => {
              for (const candidate of faceCandidates) {
                if (candidate.candidates.length === 1) {
                  this.addFace(group, candidate.candidates[0].personId, stream, face);
                } else {
                  this.createPerson(group, stream, face);
                }
              }
            },
            (error) => {
              // 3. Create person group not trained
              this.createPerson(group, stream, face);
            });
  }

  /*
   Add Face to an existant person
  */
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
            this.result$.next(null);
          });
  }

  /*
    Create person and adds a face to this person
  */
 private createPerson(group: Group, stream: Blob, face: Face) {
    // 3. Create person
    // tslint:disable-next-line:max-line-length
    const person$ = this.personService.create(group.personGroupId, group.name, group.userData);

    person$.subscribe(
          (data) => {
            this.addFace(group, data.personId, stream, face);
          },
          () => {
              console.log('ERROR : Create person');
              this.result$.next(null);
          });
 }

  /*
    Train the group : must be done every time a new person is added
  */
  private train(groupId) {
    // 5. train group
    const train$ = this.groupService.train(groupId);
    train$.subscribe(
    () => {
      this.result$.next(this.result);
    },
    () => {
      // 6. training status
      const trainStatus$ = this.groupService.getTrainingStatus(groupId);
      trainStatus$.subscribe();
      this.result$.next(null);
    });
  }

  // list person with their face
  list(groupId) {
    return this.personService.list(groupId);
  }

}
