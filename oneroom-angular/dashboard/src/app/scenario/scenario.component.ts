import { Component, OnInit } from '@angular/core';
import { ChallengeService, ScenarioService, Scenario, Challenge } from '@oneroomic/oneroomlibrary';
import { NotifierService } from 'angular-notifier';

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
              private notifierService: NotifierService) { }

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
        this.notifierService.notify( 'success', 'Scenario created' );
        this.scenario = new Scenario();
        this.refreshScenario();
      },
      (err) => {
        this.notifierService.notify( 'error', err.message );
      }
    );
  }

  deleteScenario(scenario: Scenario) {
    this.scenarioService.deleteScenario(scenario.scenarioId).subscribe( (s: Scenario) => {
        this.notifierService.notify( 'warning', 'Scenario removed' );
        this.refreshScenario();
      },
      (err) => {
        this.notifierService.notify( 'error', err.message );
      }
    );
  }

  refreshScenario() {
    this.scenarioService.getScenarios().subscribe( (scenarios) => {
        this.scenarios = scenarios;
        scenarios.forEach(s => this.getChallengesIdByScenario(s));
      },
      (err) => {
        this.notifierService.notify( 'error', err.message );
      }
    );
  }

  refreshChallenges() {
    this.challengeService.getChallenges().subscribe((challenges) => {
        this.challenges = challenges;
      },
      (err) => {
        this.notifierService.notify( 'error', err.message );
      }
    );
  }

  getChallengesIdByScenario(scenario: Scenario) {
    this.challengeService.getChallengesByScenario(scenario.scenarioId).subscribe( (challenges) => {
        scenario.challengesId = challenges.map(c => c.challengeId);
      },
      (err) => {
        this.notifierService.notify( 'error', err.message );
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
          this.notifierService.notify( 'succes', 'Challenge(s) added' );
        },
        (err) => {
          this.notifierService.notify( 'error', err.message );
        }
      );
    }
  }

  removeChallengesFromScenario( scenario: Scenario, challenges: Challenge[]) {
    if (challenges.length > 0) {
      console.log(challenges);
      this.challengeService.deleteChallengeFromScenario( scenario.scenarioId, challenges).subscribe(() => {
          this.notifierService.notify( 'warning', 'Challenge(s) deleted' );
        },
        (err) => {
          this.notifierService.notify( 'error', err.message );
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
