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

  challengesBefore: Challenge[];
  challenges: Challenge[];

  displayedColumns: string[] = ['id', 'name', 'description', 'challenge', 'delete'];

  constructor(private scenarioService: ScenarioService,
              private challengeService: ChallengeService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.scenario = new Scenario();
    this.scenarios = [];
    this.challenges = [];
    this.refreshScenario();
    this.refreshChallenges();
  }

  createScenario() {
    this.scenarioService.createScenario(this.scenario).subscribe( () => {
      this.snackBar.open('Challenge created', 'Ok', {
        duration: 3000
      });
      this.scenario = new Scenario();
      this.refreshScenario();
    });
  }

  public deleteScenario(scenario: Scenario) {
    this.scenarioService.deleteScenario(scenario.ScenarioId).subscribe( (s: Scenario) => {
        this.snackBar.open('Game removed', 'Ok', {
          duration: 1000
        });
        this.refreshScenario();
      });
  }

  refreshScenario() {
    this.scenarioService.getScenarios().subscribe( (scenarios) => {
        this.scenarios = scenarios;
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
    this.challengeService.getChallengesByScenario(scenario.ScenarioId).subscribe( (challenges) => {
        scenario.challenges = challenges;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateChallengesInScenario(open: boolean, scenario: Scenario) {
    if (!open) {
      this.addChallengesToScenario( scenario, this.challenges.filter(c => scenario.challenges.includes(c)
                                && !this.challengesBefore.includes(c)));
      this.removeChallengesFromScenario( scenario, this.challenges.filter(c => !scenario.challenges.includes(c)
                                      && this.challengesBefore.includes(c)));
    } else {
      this.challengesBefore = scenario.challenges;
    }
  }

  addChallengesToScenario( scenario: Scenario, challenges: Challenge[]) {
    if (challenges.length > 0) {
      this.challengeService.addChallengeToScenario( scenario.ScenarioId, challenges).subscribe(() => {
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
      this.challengeService.deleteChallengeFromScenario( scenario.ScenarioId, challenges).subscribe(() => {
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

}
