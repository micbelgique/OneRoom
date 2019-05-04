import { Component, OnInit, OnDestroy } from '@angular/core';
import {User, Team, UserService, TeamService, HubService, Game, GameService, GameState} from '@oneroomic/oneroomlibrary';
import { timer } from 'rxjs';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit, OnDestroy {

  users: User[];
  teams: Team[];
  game: Game;
  errorMessage: string;
  refreshBtn = true;
  minimumRecognized: number;
  cols = 4;
  rows = 2;

  // winner teams
  private winners: number[] = [];

  // timer 30 min
  timeLeft = 30 * 60;
  time = 1;

  private timeSubscription;
  private userSub;
  private userNotifySub;
  private usersNotifySub;
  private userCreateSub;
  private userDeleteSub;
  private teamSub;
  private teamCreateSub;
  private teamDeleteSub;
  private hubServiceSub;
  private challengeSub;
  private gameStateSub;
  private timesub;

  private hightlightUserSub;
  private detectedUserId;

  constructor(
    private userService: UserService,
    private teamService: TeamService,
    private gameService: GameService,
    private hubService: HubService
    ) { }

  ngOnInit() {
    this.users = [];
    this.teams = [];

    if (localStorage.getItem('gameData')) {
      this.game = JSON.parse(localStorage.getItem('gameData'));
      this.minimumRecognized = Number(this.game.config.minimumRecognized);
      this.getGame(this.game.groupName);
    } else {
      this.game = new Game();
    }

    this.detectedUserId = '';
    // attach to event from hub
    this.hubServiceSub = this.hubService.run().subscribe( () => {
      this.hubService.joinGroup(this.game.gameId.toString()).subscribe(
        () => console.log('successfully connected to hub'),
        (err) => console.log(err)
      );
    }
    );
    this.userNotifySub = this.hubService.refreshUser.subscribe( (result) => {
      this.updateUser(result);
    });
    this.usersNotifySub = this.hubService.refreshUserList.subscribe( (result) => {
      this.updateUsers(result);
    });
    this.userCreateSub = this.hubService.createUser.subscribe( (result) => {
      this.createUser(result);
    });
    this.userDeleteSub = this.hubService.deleteUser.subscribe( (result) => {
      this.deleteUser(result);
    });
    this.teamCreateSub = this.hubService.refreshTeamList.subscribe((result) => {
      this.refreshTeamList(result);
    });
    this.gameStateSub = this.hubService.refreshGameState.subscribe((newState) => {
      this.switchState(newState);
    });
    this.teamDeleteSub = this.hubService.deleteTeamList.subscribe((result) => {
      this.deleteTeamList(result);
    });
    this.challengeSub = this.hubService.hasCompletedChallenge.subscribe((result) => {
      this.challengeCompleted(result.teamId, result.challengeId);
    });
    this.hightlightUserSub = this.hubService.highlightUser.subscribe((userId: number) => {
      this.detectedUserId = userId;
      setTimeout( () => {
        this.detectedUserId = '';
      }, 5000);
    });

    this.getUserList();
    this.getTeams();
  }

  private getUserList() {
    this.userSub = this.userService.getUsers().subscribe(
      (usersList) => {
        this.users = [];
        usersList.forEach( u => {
          // User.generateAvatar(u);
          if (u.recognized >= this.minimumRecognized) {
            this.users.push(u);
          }
        });
      },
      error => this.errorMessage = error as any
    );
  }

  private challengeCompleted(teamId, challengeId) {
    this.teams.find( t => t.teamId === teamId).challenges.find(c => c.challengeId === challengeId).completed = true;
    this.sortTeam();
    this.playAudio();
  }

  playAudio() {
    let audio = new Audio();
    audio.src = '../assets/sounds/notification.mp3';
    audio.load();
    audio.play();
  }

  private sortTeam( isAsc: boolean = false) {
    // tslint:disable-next-line:max-line-length
    this.teams.sort((a, b) => (a.challenges.filter(c => c.completed).length < b.challenges.filter(c => c.completed).length ? -1 : 1) * (isAsc ? 1 : -1));
    this.sortChallenge();// No matter which challenge is completed, always sort to view the completed before the not completed
  }

  private sortChallenge( isAsc: boolean = false) {
    // tslint:disable-next-line:max-line-length
    this.teams.forEach(t => t.challenges.sort((a, b) => (a.completed < b.completed ? -1 : 1) * (isAsc ? 1 : -1)));
  }

  private switchState(state: GameState) {
    this.game.state = state;
    if (this.game.state === GameState.LAUNCH) {
      // Set the presentation to TeamView
      this.cols = 1;
      this.rows = 7;
      this.setTimer();
    } else if (this.game.state === GameState.REGISTER) {
      this.cols = 4;
      this.rows = 2;
    }
  }

  private updateUser(user: User) {
    const u = this.users.findIndex(e => e.userId === user.userId);
    this.users[u] = user;
  }

  private updateUsers(users: User[]) {
    for (const user of users) {
      this.updateUser(user);
    }
  }

  private createUser(user: User) {
    this.users.push(user);
  }
  private deleteUser(user: User) {
    const u = this.users.findIndex(e => e.userId === user.userId);
    this.users.splice(u, 1);
  }
  private getTeams() {
    this.teamService.getTeams().subscribe((result) => {
      this.teams = result;
      this.sortTeam();
    });
  }

  private refreshTeamList(teams: Team[]) {
    this.teams = teams;
  }
  private deleteTeamList(idGame: number) {
    if (idGame === this.game.gameId) {
      this.teams = [];
    }
  }

  isHighLighted(userId: number): string {
    if (userId === this.detectedUserId) {
      return '15px 15px 5px grey';
    } else {
      return '';
    }
  }

  hasFinished(teamId: number) {
    return this.teams && teamId ? this.teams.find(t => t.teamId === teamId).challenges.every( c => c.completed === true) : false;
  }

  truncateName(name: string) {
    let truncateName = name.slice(0, 10);
    if (name.length > 15) {
      truncateName += '...';
    }
    return truncateName;
  }

  setTimer() {
    if (!this.timesub) {
      this.timesub = timer(1000, 1000).subscribe(val => {
        if (this.time > 0) {
          this.time = this.timeLeft - val;
        }
      });
    }
  }

  getTeamColor(color: string) {
    if (color) {
      return 'rgb(' + color + ')';
    }
  }

  getGame(groupName: string) {
    this.gameService.getGame(groupName).subscribe( (game: Game) => {
      this.game = game;
      if (game.state === GameState.LAUNCH) {
        // Set the presentation to TeamView
        this.cols = 1;
        this.rows = 7;
        this.setTimer();
      }
      this.minimumRecognized = game.config.minimumRecognized;
    });
  }

  ngOnDestroy() {
    if (this.hubServiceSub) {
      this.hubServiceSub.unsubscribe();
    }
    if (this.userNotifySub) {
      this.userNotifySub.unsubscribe();
    }
    if (this.usersNotifySub) {
      this.usersNotifySub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.userCreateSub) {
      this.userCreateSub.unsubscribe();
    }
    if (this.userDeleteSub) {
      this.userDeleteSub.unsubscribe();
    }
    if (this.teamSub) {
      this.teamSub.unsubscribe();
    }
    if (this.teamCreateSub) {
      this.teamCreateSub.unsubscribe();
    }
    if (this.teamDeleteSub) {
      this.teamDeleteSub.unsubscribe();
    }
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
    if (this.hightlightUserSub) {
      this.hightlightUserSub.unsubscribe();
    }
    if (this.challengeSub) {
      this.challengeSub.unsubscribe();
    }
    if (this.gameStateSub) {
      this.gameStateSub.unsubscribe();
    }
    if (this.timesub) {
      this.timesub.unsubscribe();
    }
    if (!this.hubService.connected.isStopped) {
      this.hubService.leaveGroup(this.game.gameId.toString());
      this.hubService.stopService();
    }
  }
}
