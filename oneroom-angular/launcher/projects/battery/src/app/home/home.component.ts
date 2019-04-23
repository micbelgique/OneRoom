import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  batteryLevel = 0;
  batteryIsCharging = false;
  constructor() { }

  ngOnInit() {
    this.getBatteryLevel();
  }

  // NOT SUPPORTED ON FIREFOX ONLY CHROMIUM
  getBatteryLevel() {
    try {
    // @ts-ignore
    navigator.getBattery().then(
      (result) => {
        this.batteryIsCharging = result.charging;
        this.batteryLevel = (result.level);
        this.refreshLevel(this.batteryLevel);
        result.addEventListener('levelchange', () => {
          this.refreshLevel(result.level);
          console.log('levelchange');
        });
        result.addEventListener('chargingchange', () => {
          this.batteryIsCharging = result.charging;
          this.refreshLevel(result.level);
          console.log('chargingchange');

        });
      });
    } catch {
      console.log('battery status error');
    }
  }
  refreshLevel(level: number) {
    try {

      document.getElementById('level').style.setProperty('--acid-height', (level * document.getElementById('battery').clientHeight) + 'px');

      if (level < 0.25) {
        document.getElementById('level').style.setProperty('background-color', '#c0392b');
        document.getElementById('percentage').style.setProperty('color', '#c0392b');
        document.getElementById('battery').style.setProperty('border', ' 4px solid #c0392b');
      } else if (level < 0.5) {
        document.getElementById('level').style.setProperty('background-color', '#f39c12');
        document.getElementById('percentage').style.setProperty('color', '#f39c12');
        document.getElementById('battery').style.setProperty('border', ' 4px solid #f39c12');
      } else {
        document.getElementById('level').style.setProperty('background-color', '#27ae60');
        document.getElementById('percentage').style.setProperty('color', '#27ae60');
        document.getElementById('battery').style.setProperty('border', ' 4px solid #27ae60');
      }
      document.getElementById('percentage').innerHTML = level * 100 + '%';

      document.getElementById('icon').style.setProperty('--display-charging', this.batteryIsCharging ? 'initial' : 'none');

    } catch {
      console.log('refreshing level error');
    }
  }

}
