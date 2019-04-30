import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Challenge, Team, Game, ChallengeService } from '@oneroomic/oneroomlibrary';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.css']
})
export class LockscreenComponent implements OnInit {

  password: string;
  background = 'white';
  hint = '';

  game: Game;
  challenge: Challenge;
  team: Team;

  constructor(
    private router: Router,
    private challengeService: ChallengeService
    ) {
  }

  ngOnInit() {
    this.background = 'white';
    this.hint = '';

    if ( localStorage.getItem('gameData') ) {
      this.game = JSON.parse(localStorage.getItem('gameData'));
    }

    if (localStorage.getItem('challengesData')) {
      let challenges = JSON.parse(localStorage.getItem('challengesData'));
      challenges = challenges.filter( c => c.appName === 'coffre');
      if (challenges.length > 0) {
        this.challenge = challenges[0];
        if (this.challenge.hints.length > 0) {
          this.hint = this.challenge.hints[0];
        }
      }
    }

    if (localStorage.getItem('teamData')) {
      this.team = JSON.parse(localStorage.getItem('teamData'));
    }

  }

  unlock() {
    if (this.team && this.challenge && this.game) {
      if (this.challenge.answers.indexOf(this.password) !== -1) {
        // success
        this.background = '#66bb6a';
        this.challengeService.setCompleted(this.team.teamId, this.challenge.challengeId).subscribe(
          () => {
            console.log('challenge completed');
          }
        );
        setTimeout(() =>  this.router.navigateByUrl('/vault/main'), 2000);
      } else {
        // fail
        this.background = '#ef5350';
      }
    } else {
      console.log('Game, équipe, challenge non configuré');
    }
  }

}
