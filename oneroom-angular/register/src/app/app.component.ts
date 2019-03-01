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
    localStorage.setItem('endpointVisionPrediction', 'https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/aa05f819-5d11-453f-9603-88e919abb71d/image');
    localStorage.setItem('keyVisionPrediction', 'f011cedabc6749a6bebd8cede806948d');
    // tslint:disable-next-line:max-line-length
    localStorage.setItem('endpointVisionTraining', 'https://southcentralus.api.cognitive.microsoft.com/customvision/v2.2/Training/projects/aa05f819-5d11-453f-9603-88e919abb71d/predictions');
    localStorage.setItem('keyVisionTraining', 'cc45e01b8c6f4e438411f339a78ead09');

    // tslint:disable-next-line:max-line-length
    localStorage.setItem('endpointHairLengthPrediction', 'https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/7e0f5d3c-58cd-45ba-bd1e-e53e26e0e72b/image');
    localStorage.setItem('keyHairLengthPrediction', 'f011cedabc6749a6bebd8cede806948d');

    localStorage.setItem('endpointHairLengthTraining', 'https://southcentralus.api.cognitive.microsoft.com/customvision/v2.2/Training/');
    localStorage.setItem('keyHairLengthTraining', 'cc45e01b8c6f4e438411f339a78ead09');
    localStorage.setItem('projectIdHairLength', '7e0f5d3c-58cd-45ba-bd1e-e53e26e0e72b');

  }

  toggleMenu(): void {
    this.opened = !this.opened;
  }
}
