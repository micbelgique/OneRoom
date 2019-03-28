import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { User } from '@oneroomic/oneroomlibrary/one-room/model/user';
import { Game } from '@oneroomic/oneroomlibrary/one-room/model/game';
import { UserService, GameService, TeamService } from '@oneroomic/oneroomlibrary';
import { PersonGroupPersonService } from '@oneroomic/facecognitivelibrary';

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

  constructor(
    private userService: UserService,
    private gameService: GameService,
    private toast: MatSnackBar,
    private personService: PersonGroupPersonService,
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.users = [];
    this.games = [];
    this.loadGames();
  }

  loadGames() {
    this.gameService.getGames().subscribe(
        (games) => {
          this.toast.open(games.length + ' games found', 'Ok', {
            duration: 1000
          });
          this.games = games;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  loadUsers(game: Game = null) {
    if (game !== null) {
      localStorage.setItem('gameData', JSON.stringify(game));
    }
    this.userService.getUsers().subscribe(
        (users) => {
          this.toast.open(users.length + ' players retrived', 'Ok', {
            duration: 1000
          });
          this.users = users;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  deleteUser(idUser) {
    if (localStorage.getItem('gameData')) {
      const game: Game = JSON.parse(localStorage.getItem('gameData'));
      this.personService.set(game.config.faceEndpoint, game.config.faceKey);

      // delete face
      const faceUser$ = this.personService.delete(game.groupName, idUser);
      faceUser$.subscribe(
            (suc) => {
              this.toast.open('Player deleted', 'Ok', {
                duration: 1000
              });
              console.log(suc);
            },
            () => {
              console.log('error');
            }
      );

      // delete oneroom
      this.userService.deleteUser(idUser).subscribe(
      () => {
          this.loadUsers();
          // TODO : recreate team from api
          const res$ = this.teamService.deleteTeams();
          res$.subscribe( x => {
            this.toast.open('Teams deleted', 'Ok', {
              duration: 1000
            });
            // recreating teams
          },
          (err) => {
            // teams don't exist
          });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

}
