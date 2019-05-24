import { Component } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Register';
  opened = false;

  constructor() {
    // tslint:disable-next-line:max-line-length
    localStorage.setItem('endpointVisionPrediction', 'https://westeurope.api.cognitive.microsoft.com/customvision/v2.0/Prediction/a1cb0694-4bdb-4def-a20f-52226ced6ded/image');
    localStorage.setItem('keyVisionPrediction', '8139b0c8c2a54b59861bbe5e7e089d2b');
    // tslint:disable-next-line:max-line-length
    localStorage.setItem('endpointVisionTraining', 'https://westeurope.api.cognitive.microsoft.com/customvision/v2.2/Training/projects/a1cb0694-4bdb-4def-a20f-52226ced6ded/predictions');
    localStorage.setItem('keyVisionTraining', '3e55ee24eb094201bc29899a1f515843');

    // tslint:disable-next-line:max-line-length
    localStorage.setItem('endpointHairLengthPrediction', 'https://westeurope.api.cognitive.microsoft.com/customvision/v2.0/Prediction/3ae9a19d-fa15-4b44-bfb5-b02bb11b3efc/image');
    localStorage.setItem('keyHairLengthPrediction', '8139b0c8c2a54b59861bbe5e7e089d2b');

    localStorage.setItem('endpointHairLengthTraining', 'https://westeurope.api.cognitive.microsoft.com/customvision/v2.2/Training/');
    localStorage.setItem('keyHairLengthTraining', '3e55ee24eb094201bc29899a1f515843');
    localStorage.setItem('projectIdHairLength', '3ae9a19d-fa15-4b44-bfb5-b02bb11b3efc');

  }

  toggleMenu(): void {
    this.opened = !this.opened;
  }
}
