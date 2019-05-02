import { User } from './user';
import { Challenge } from './challenge';

export class Team {
  teamId: number;
  teamName: string;
  description: string;
  descriptionAlreadyShowed: boolean;
  teamColor: string;
  creationDate: Date;
  users: User[];
  challenges: Challenge[];
}
