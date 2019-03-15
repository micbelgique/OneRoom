import { User } from './user';

export class Team {
  teamId: number;
  creationDate: Date;
  users: User[];
  teamColor: string;
  teamName: string;
}
