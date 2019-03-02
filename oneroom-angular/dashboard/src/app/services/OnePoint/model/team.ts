import { User } from './user';

export class Team {
  teamId: number;
  teamColor: string;
  teamName: string;
  creationDate: Date;
  users: User[];
}
