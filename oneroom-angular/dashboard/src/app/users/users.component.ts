import { Component, OnInit } from '@angular/core';
import { User } from '@oneroomic/oneroomlibrary/one-room/model/user';
import { Game } from '@oneroomic/oneroomlibrary/one-room/model/game';
import { UserService, GameService, TeamService } from '@oneroomic/oneroomlibrary';
import { PersonGroupPersonService } from '@oneroomic/facecognitivelibrary';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[];
  games: Game[];
  // column order
  displayedColumns: string[] = ['avatar', 'name', 'recognized', 'delete'];

  constructor(private userService: UserService,
              private gameService: GameService,
              private notifierService: NotifierService,
              private personService: PersonGroupPersonService,
              private teamService: TeamService) { }

  ngOnInit() {
    this.users = [];
    this.games = [];
    this.loadGames();
  }

  loadGames() {
    this.gameService.getGames().subscribe( (games) => {
        this.notifierService.notify( 'success', games.length + ' games found' );
        this.games = games;
      },
      (err) => {
        this.notifierService.notify( 'error', err.message );
      }
    );
  }

  loadUsers(game: Game = null) {
    if (game !== null) {
      localStorage.setItem('gameData', JSON.stringify(game));
    }
    this.userService.getUsers().subscribe((users) => {
        this.notifierService.notify( 'success', users.length + ' players retrived' );
        this.users = users;
      },
      (err) => {
        this.notifierService.notify( 'error', err.message );
      }
    );
  }

  deleteUser(idUser) {
    if (localStorage.getItem('gameData')) {
      const game: Game = JSON.parse(localStorage.getItem('gameData'));
      this.personService.set(game.config.faceEndpoint, game.config.faceKey);

      // delete face
      this.personService.delete(game.groupName, idUser).subscribe(() => {
          this.notifierService.notify( 'warning', 'Player deleted' );
        },
        (err) => {
          this.notifierService.notify( 'error', err.message );
        }
      );

      // delete oneroom
      this.userService.deleteUser(idUser).subscribe(() => {
          this.loadUsers();
          // TODO : recreate team from api
          this.teamService.deleteTeams().subscribe( () => {
            this.notifierService.notify( 'warning', 'Teams deleted' );
          },
          (err) => {
            this.notifierService.notify( 'error', err.message );
          });
        },
        (err) => {
          this.notifierService.notify( 'error', err.message );
        }
      );
    }
  }

}
