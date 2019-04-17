import { Component, OnInit } from '@angular/core';
import { ChallengeService, ScenarioService, Scenario, Challenge } from '@oneroomic/oneroomlibrary';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})
export class ScenarioComponent implements OnInit {

  scenario: Scenario;
  scenarios: Scenario[];

  challengesIdBefore: number[];
  challenges: Challenge[];

  displayedColumns: string[] = ['id', 'name', 'description', 'challenge', 'delete'];

  constructor(private scenarioService: ScenarioService,
              private challengeService: ChallengeService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.scenario = new Scenario();
    this.scenarios = [];
    this.challenges = [];
    this.challengesIdBefore = [];
    this.refreshScenario();
    this.refreshChallenges();
  }

  createScenario() {
    this.scenarioService.createScenario(this.scenario).subscribe( () => {
      this.snackBar.open('Scenario created', 'Ok', {
        duration: 3000
      });
      this.scenario = new Scenario();
      this.refreshScenario();
    });
  }

  deleteScenario(scenario: Scenario) {
    this.scenarioService.deleteScenario(scenario.scenarioId).subscribe( (s: Scenario) => {
        this.snackBar.open('Scenario removed', 'Ok', {
          duration: 1000
        });
        this.refreshScenario();
      });
  }

  refreshScenario() {
    this.scenarioService.getScenarios().subscribe( (scenarios) => {
        this.scenarios = scenarios;
        scenarios.forEach(s => this.getChallengesIdByScenario(s));
      },
      (err) => {
        console.log(err);
      }
    );
  }

  refreshChallenges() {
    this.challengeService.getChallenges().subscribe((challenges) => {
        this.challenges = challenges;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getChallengesIdByScenario(scenario: Scenario) {
    this.challengeService.getChallengesByScenario(scenario.scenarioId).subscribe( (challenges) => {
        scenario.challengesId = challenges.map(c => c.challengeId);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateChallengesInScenario(open: boolean, scenario: Scenario) {
    if (!open) {
      this.addChallengesToScenario( scenario, this.challenges.filter(c => scenario.challengesId.includes(c.challengeId)
                                && !this.challengesIdBefore.includes(c.challengeId)));
      this.removeChallengesFromScenario( scenario, this.challenges.filter(c => !scenario.challengesId.includes(c.challengeId)
                                      && this.challengesIdBefore.includes(c.challengeId)));
    } else {
      this.challengesIdBefore = scenario.challengesId;
    }
  }

  addChallengesToScenario( scenario: Scenario, challenges: Challenge[]) {
    if (challenges.length > 0) {
      this.challengeService.addChallengeToScenario( scenario.scenarioId, challenges).subscribe(() => {
        this.snackBar.open('Challenges added', 'Ok', {
          duration: 1000
        });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  removeChallengesFromScenario( scenario: Scenario, challenges: Challenge[]) {
    if (challenges.length > 0) {
      console.log(challenges);
      this.challengeService.deleteChallengeFromScenario( scenario.scenarioId, challenges).subscribe(() => {
        this.snackBar.open('Challenges deleted', 'Ok', {
          duration: 1000
        });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  getChallengeTitleById(id: number): string {
    if (this.challenges.findIndex(c => c.challengeId === id) !== -1) {
      return this.challenges.find(c => c.challengeId === id).title;
    } else {
      return '';
    }
  }

}
