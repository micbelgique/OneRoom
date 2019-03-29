import { User } from './user';
import { Team } from './team';
import { GameState } from './game-state.enum';
import { Configuration } from './configuration';
import { Scenario } from './scenario';

export class Game {
  gameId: number;
  groupName: string;
  creationDate: Date;
  state: GameState;
  users: User[] = [];
  teams: Team[] = [];
  scenario: Scenario;
  config: Configuration = new Configuration();
}
