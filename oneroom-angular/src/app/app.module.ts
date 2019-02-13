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
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
} from '@angular/material';

import { UsercardComponent } from './usercard/usercard.component';
import { CamcardComponent } from './camcard/camcard.component';
import {WebcamModule} from 'ngx-webcam';
import { FaceService } from './services/cognitive/face.service';
import { HttpClientModule } from '@angular/common/http';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    UsercardComponent,
    CamcardComponent,
    LeaderBoardComponent,
    SettingsComponent
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
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  providers: [FaceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
