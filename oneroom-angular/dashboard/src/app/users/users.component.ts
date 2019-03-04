import { Component, OnInit } from '@angular/core';
import { User } from '../services/OnePoint/model/user';
import { UserService } from '../services/OnePoint/user.service';
import { GameService } from '../services/OnePoint/game.service';
import { Game } from '../services/OnePoint/model/game';
import { MatSnackBar } from '@angular/material';

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
    private toast: MatSnackBar
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

  loadUsers(idGame: number = null) {
    if (idGame !== null) {
      localStorage.setItem('gameId', '' + idGame);
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
    this.userService.deleteUser(idUser).subscribe(
      () => {
        this.loadUsers();
        this.toast.open('Player deleted', 'Ok', {
          duration: 1000
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
