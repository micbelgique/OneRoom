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
        this.notifierService.notify( 'error', err.error );
      }
    );
  }

  loadUsers(game: Game = null, notify = true) {
    if (game !== null) {
      localStorage.setItem('gameData', JSON.stringify(game));
    }
    this.userService.getUsers().subscribe((users) => {
        if (notify) {
          this.notifierService.notify( 'success', users.length + ' players retrived' );
        }
        this.users = users;
      },
      (err) => {
        this.notifierService.notify( 'error', err.error );
      }
    );
  }

  deleteUser(idUser, notify = true) {
    if (localStorage.getItem('gameData')) {
      const game: Game = JSON.parse(localStorage.getItem('gameData'));
      this.personService.set(game.config.faceEndpoint, game.config.faceKey);

      // delete face
      this.personService.delete(game.groupName, idUser).subscribe(() => {
          if (notify) {
            this.notifierService.notify( 'success', 'Player deleted' );
          }
        },
        (err) => {
          this.notifierService.notify( 'error', err.error );
        }
      );

      // delete oneroom
      this.userService.deleteUser(idUser).subscribe(
        () => {
          this.loadUsers(null, false);
          // const idx = this.users.map(u => u.userId).indexOf(idUser);
          // this.users.splice(idx, 1);
          // TODO : recreate team from api
          /*this.teamService.deleteTeams().subscribe( () => {
            if (notify) {
              this.notifierService.notify( 'warning', 'Teams deleted' );
            }
          },
          (err) => {
            this.notifierService.notify( 'error', err.error );
          });*/
        },
        (err) => {
          this.notifierService.notify( 'error', err.error );
        }
      );
    }
  }

  deleteUsers() {
    const count = this.users.length;
    this.users.forEach( (u, idx) => {
      this.deleteUser(u.userId, false);
      console.log('deleting');
      if (idx === count - 1) {
        this.notifierService.notify( 'success', 'All users were deleted' );
      }
    });
  }

}
