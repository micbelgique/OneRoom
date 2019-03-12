import { User } from './user';
import { Team } from './team';
import { GameState } from './game-state.enum';
import { Configuration } from './configuration';
import { Challenge } from './challenge';

export class Game {
  gameId: number;
  groupName: string;
  creationDate: Date;
  state: GameState;
  users: User[] = [];
  teams: Team[] = [];
  challenges: Challenge[] = [];
  config: Configuration = new Configuration();
}
