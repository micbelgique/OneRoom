import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatCardModule,
  MatGridListModule,
  MatIconModule,
  MatExpansionModule
} from '@angular/material';

import { UsercardComponent } from './usercard/usercard.component';
import { CamcardComponent } from './camcard/camcard.component';
import {WebcamModule} from 'ngx-webcam';
import { FaceService } from './services/cognitive/face.service';
import { HttpClientModule } from '@angular/common/http';
import { PersonGroupPersonService } from './services/cognitive/person-group-person.service';
import { PersonGroupService } from './services/cognitive/person-group.service';
import { FaceProcessService } from './utilities/face-process.service';

@NgModule({
  declarations: [
    AppComponent,
    UsercardComponent,
    CamcardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatExpansionModule,
    WebcamModule,
    HttpClientModule
  ],
  providers: [
    FaceService,
    PersonGroupPersonService,
    PersonGroupService,
    FaceProcessService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
