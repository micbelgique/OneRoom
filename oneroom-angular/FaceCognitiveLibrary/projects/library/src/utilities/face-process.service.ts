import { Injectable } from '@angular/core';
import { FaceService } from '../cognitive/face/face.service';
import { Person } from '../cognitive/face/face-models';
import { PersonGroupService, Group } from '../cognitive/face/person-group.service';
import { Face } from '../cognitive/face/face-models';
import { Observable, Subject } from 'rxjs';
import { PersonGroupPersonService } from '../cognitive/face/person-group-person.service';

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


  public resForDuplicate$: Subject<any> = new Subject<any>();
  private duplicatePersons: string[][] = [];

  constructor(
    private faceService: FaceService,
    private personService: PersonGroupPersonService,
    private groupService: PersonGroupService) {}

  cleanResult() {
    this.result = new PersonGroup();
  }

  byImg(stream: Blob, group: Group, createGroupIfNotExists = false ): Observable<PersonGroup> {
    if (!this.result) {
      this.cleanResult();
    }
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
          console.log(faces.map(f => f.faceId));
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
    if (faces.length === 0) {
      this.result$.next(null);
    } else {
      const identify$ = this.faceService.identify(faces.map(f => f.faceId), group.personGroupId, 10, minConfidence);
      identify$.subscribe(
      (faceCandidates) => {
        for (const candidate of faceCandidates) {
          const idxFace = faces.map(f => f.faceId).indexOf(candidate.faceId);
          if (candidate.candidates.length === 1) {
           this.addFace(group, candidate.candidates[0].personId, stream, faces[idxFace]);
          } else if (candidate.candidates.length > 1) {
           console.log('Possible duplicates');
           let keepId = null;
           let maxConfidence = 0;
           candidate.candidates.forEach(c => {
             if (c.confidence > maxConfidence) {
               maxConfidence = c.confidence;
               keepId = c.personId;
             } else if (c.confidence > 0.80) {
               // delete possible duplicate
               const del$ = this.personService.delete(group.personGroupId, c.personId);
               del$.subscribe(
                 () => {
                   console.log('Duplicate deleted');
                   // emit person ID deleted
                   this.resForDuplicate$.next({keepId, delId: c.personId});
                 },
                 () => console.log('Error deleting duplicate')
               );
             }
           });
           // optimise results
           // this.duplicatePersons.push(candidate.candidates.map( (c) => { if (c.confidence > 0.80) { return c.personId; } }));
           // adds face and retrain
           this.addFace(group, keepId, stream, faces[idxFace]);
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
  private addFace(group: Group, personId: string, stream: Blob, face: Face, isFirstFace = false) {
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
                if (this.result.persons[idx].faces.map(f => f.faceId).indexOf(face.faceId) === -1) {
                  this.result.persons[idx].faces.push(face);
                  this.result.persons[idx].person.persistedFaceIds.push(data.persistedFaceId);
                }
            } else {
              if (this.result.persons.map(per => per.person.personId).indexOf(personId) === -1) {
                const p = new PersonGroupPerson();
                p.person = new Person();
                p.person.personId = personId;
                this.result.persons.push(p);
                this.result.persons[this.result.persons.length - 1].faces.push(face);
                this.result.persons[this.result.persons.length - 1].person.persistedFaceIds.push(data.persistedFaceId);
              }
            }

            if (isFirstFace) {
              this.train(group.personGroupId);
            } else {
              this.result$.next(this.result);
            }
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
            this.addFace(group, data.personId, stream, face, true);
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
    // checking if training is running
    const status = this.groupService.getTrainingStatus(groupId);

    status.subscribe(
      (res) => {
        if (res.status === 'notstarted' || res.status === 'succeeded' || res.status === 'failed') {
          // 5. train group
          const train$ = this.groupService.train(groupId);
          train$.subscribe(
          (result) => {
            console.log('training');
            console.log(result);
            this.result$.next(this.result);
          },
          () => {
            // 6. training status
            this.result$.next(null);
          });
        }
      }
    );

  }

  // list person with their face
  reduceDuplicate(groupId): Observable<string> {

    if (this.duplicatePersons.length >= 1) {

    const obs$ = this.personService.list(groupId);

    console.log('reducing duplicates');
    obs$.subscribe(
      (list) => {
        console.log(list);
        console.log('----');
        console.log(this.duplicatePersons);

        for (const candidates of this.duplicatePersons) {
          let amountFaces = 0;
          const pId = [];
          console.log(candidates);
          for (const candidate of candidates) {
            console.log('candidate');
            console.log(candidate);

            const idxPerson = list.map(p => p.personId).indexOf(candidate);
            console.log('idx: ' + idxPerson);
            if (idxPerson !== -1 ) {
              const person = list[idxPerson];
              if ( person.persistedFaceIds.length > amountFaces ) {
                amountFaces = person.persistedFaceIds.length;
              } else {
                console.log('pushing ' + person.personId);
                pId.push(person.personId);
              }
            }
          }

          pId.forEach(id => {
            console.log('p: ' + id);
            const del$ = this.personService.delete(groupId, id);
            del$.subscribe(
                () => {
                    console.log('Duplicate person deleted');
                    this.resForDuplicate$.next(id);
                },
                (err) => {
                    console.log(err);
                }
            );
          });

          this.duplicatePersons = [];

        }
      },
      (err) => {
        console.log(err);
      }
    );

    }

    return this.resForDuplicate$;
  }

}
