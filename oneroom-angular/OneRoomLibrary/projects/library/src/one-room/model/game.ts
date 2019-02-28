import { User } from './user';
import { Team } from './team';

export class Game {
  gameId: number;
  groupName: string;
  creationDate: Date;
  users: User[];
  teams: Team[];
}
