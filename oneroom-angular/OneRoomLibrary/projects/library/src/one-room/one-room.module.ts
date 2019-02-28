import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Face } from './model/face';
import { FaceService } from './face.service';
import { Game } from './model/game';
import { GameService } from './game.service';
import { GroupService } from './group.service';
import { LeaderboardService } from './leaderboard.service';
import { Team } from './model/team';
import { TeamService } from './team.service';
import { User } from './model/user';
import { UserService } from './user.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
exports: [
  Face,
  FaceService,
  Game,
  GameService,
  GroupService,
  LeaderboardService,
  Team,
  TeamService,
  User,
  UserService
]})
export class OneRoomModule { }
