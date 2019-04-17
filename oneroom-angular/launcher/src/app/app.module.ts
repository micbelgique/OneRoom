import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SettingsComponent } from './settings/settings.component';
import { ModalChangeNameComponent } from './modal-change-name/modal-change-name.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ControlComponent } from './control/control.component';
// Sub Module for apps
import { VaultAppSharedModule } from 'projects/vault/src/app/app.module';
import { ScannerAppSharedModule } from 'projects/scanner/src/app/app.module';
import { ProfilAppSharedModule } from 'projects/profil/src/app/app.module';
import { TranslatorAppSharedModule } from 'projects/translator/src/app/app.module';
import { ChatbotAppSharedModule } from 'projects/chatbot/src/app/app.module';
import { PhoneSharedModule } from 'projects/phone/src/app/app.module';
import { NotepadSharedModule } from 'projects/notepad/src/app/app.module';
import { BatterySharedModule } from 'projects/battery/src/app/app.module';
import { RadioSharedModule } from 'projects/radio/src/app/app.module';

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
  MatSnackBarModule,
  MatDialogModule,
  MatSelectModule,
  MatTooltipModule,
  MatStepperModule
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LockscreenComponent,
    SettingsComponent,
    ModalChangeNameComponent,
    ControlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // Sub module for apps
    ScannerAppSharedModule,
    ProfilAppSharedModule,
    VaultAppSharedModule,
    TranslatorAppSharedModule,
    ChatbotAppSharedModule,
    PhoneSharedModule,
    NotepadSharedModule,
    BatterySharedModule,
    RadioSharedModule,
    // other
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatGridListModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatSidenavModule,
    FormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    HttpClientModule,
    MatSelectModule,
    MatTooltipModule,
    MatStepperModule
  ],
  entryComponents: [
    ModalChangeNameComponent
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
