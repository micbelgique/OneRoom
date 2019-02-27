import { User } from './user';
import { Team } from './team';
import { Configuration } from './configuration';

export class Game {
  gameId: number;
  groupName: string;
  creationDate: Date;
  users: User[];
  teams: Team[];
  config: Configuration;
}
