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
  title: string;
  minimumRecognized: number;

  // winner teams
  private winners: number[] = [];

  // timer 30 min
  timeLeft = 30 * 60;
  time = 1;
  displayTimer = false;

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
    this.sortedData = this.teams.slice();
    this.title = localStorage.getItem('groupName');
    this.game = JSON.parse(localStorage.getItem('gameData'));
    // minimum face
    if (localStorage.getItem('minimumRecognized')) {
      this.minimumRecognized = Number(localStorage.getItem('minimumRecognized'));
    } else {
      this.minimumRecognized = 3;
    }

    this.detectedUserId = '';
    // attach to event from hub
    this.hubServiceSub = this.hubService.run().subscribe( () => this.hubService.joinGroup(this.game.gameId.toString()));
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
    this.hubService.refreshGameState.subscribe((newState) => {
      this.gameService.getStateGame(this.game.groupName).subscribe((state) => {
        if (state === GameState.LAUNCH) {
          this.setTimer();
        } else {
          this.displayTimer = false;
        }
      });
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
  }

  private sortTeam( isAsc: boolean = false) {
    // tslint:disable-next-line:max-line-length
    this.teams.sort((a, b) => (a.challenges.filter(c => c.completed).length < b.challenges.filter(c => c.completed).length ? -1 : 1) * (isAsc ? 1 : -1));
  }

  private updateUser(user: User) {
    console.log(user);
    const u = this.users.findIndex(e => e.userId === user.userId)
    this.users[u] = user;
  }

  private updateUsers(users: User[]) {
    for (const user of users) {
      this.updateUser(user);
    }
  }

  private createUser(user: User) {
    console.log(user);
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

  hasFinished(teamId: number): string {
    return this.teams.find(t => t.teamId === teamId).challenges.every( c => c.completed === true);
  }

  truncateName(name: string) {
    let truncateName = name.slice(0, 10);
    if (name.length > 15) {
      truncateName += '...';
    }
    return truncateName;
  }

  setTimer() {
    this.displayTimer = true;
    const timers = timer(1000, 1000);
    const abc = timers.subscribe(val => {
      if (this.time > 0) {
        this.time = this.timeLeft - val;
      }
    });
  }

  getTeamColor(color: string) {
    if (color) {
      return 'rgb(' + color + ')';
    }
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
    if (!this.hubService.connected.isStopped) {
      this.hubService.leaveGroup(this.game.gameId.toString());
      this.hubService.stopService();
    }
  }
}
