import { User } from './user';
import { Team } from './team';
import { Configuration } from './configuration';
import { GameState } from './game-state.enum';

export class Game {
  gameId: number;
  groupName: string;
  creationDate: Date;
  state: GameState;
  users: User[] = [];
  teams: Team[] = [];
  config: Configuration = new Configuration();
}
