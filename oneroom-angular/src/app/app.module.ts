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
  MatListModule,
  MatTabsModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatProgressBarModule,
  MatSnackBarModule
} from '@angular/material';

import { UsercardComponent } from './usercard/usercard.component';
import { CamcardComponent } from './camcard/camcard.component';
import {WebcamModule} from 'ngx-webcam';
import { FaceService } from './services/cognitive/face.service';
import { HttpClientModule } from '@angular/common/http';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PersonGroupPersonService } from './services/cognitive/person-group-person.service';
import { PersonGroupService } from './services/cognitive/person-group.service';
import { FaceProcessService } from './utilities/face-process.service';
import { FilterComponent } from './filter/filter.component';
import { FacecamComponent } from './facecam/facecam.component';
import { TeamsComponent } from './teams/teams.component';

@NgModule({
  declarations: [
    AppComponent,
    UsercardComponent,
    CamcardComponent,
    LeaderBoardComponent,
    SettingsComponent,
    FilterComponent,
    FacecamComponent,
    TeamsComponent
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
    MatProgressBarModule,
    FormsModule,
    MatSnackBarModule,
    RouterModule.forRoot([
      { path: 'leaderboard', component: LeaderBoardComponent },
      { path: 'welcome', component: FacecamComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'filter', component: FilterComponent },
      { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
    ]),
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSidenavModule
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
