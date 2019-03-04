import { User } from './user';
import { Team } from './team';
import { GameState } from './game-state.enum';
import { Configuration } from './configuration';

export class Game {
  gameId: number;
  groupName: string;
  creationDate: Date;
  state: GameState;
  users: User[] = [];
  teams: Team[] = [];
  config: Configuration = new Configuration();
}
