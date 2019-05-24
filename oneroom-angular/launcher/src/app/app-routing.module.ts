import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SettingsComponent } from './settings/settings.component';

import { VaultAppSharedModule } from 'projects/vault/src/app/app.module';
import { ProfilAppSharedModule } from 'projects/profil/src/app/app.module';
import { ScannerAppSharedModule } from 'projects/scanner/src/app/app.module';
import { TranslatorAppSharedModule } from 'projects/translator/src/app/app.module';
import { ChatbotAppSharedModule } from 'projects/chatbot/src/app/app.module';
import { PhoneSharedModule } from 'projects/phone/src/app/app.module';
import { NotepadSharedModule } from 'projects/notepad/src/app/app.module';
import { BatterySharedModule } from 'projects/battery/src/app/app.module';
import { RadioSharedModule } from 'projects/radio/src/app/app.module';
import { ClockAppSharedModule } from 'projects/clock/src/app/app.module';
import { BrowserAppSharedModule } from 'projects/browser/src/app/app.module';

const routes: Routes = [
  {path: 'scanner',
    loadChildren: '../../projects/scanner/src/app/app.module#ScannerAppSharedModule'},
  {path: 'profil',
    loadChildren: '../../projects/profil/src/app/app.module#ProfilAppSharedModule'},
  {path: 'translator',
    loadChildren: '../../projects/translator/src/app/app.module#TranslatorAppSharedModule'},
  {path: 'vault',
    loadChildren: '../../projects/vault/src/app/app.module#VaultAppSharedModule'},
  {path: 'chatbot',
    loadChildren: '../../projects/chatbot/src/app/app.module#ChatbotAppSharedModule'},
  { path: 'phone',
    loadChildren: '../../projects/phone/src/app/app.module#PhoneSharedModule'},
  { path: 'notepad',
    loadChildren: '../../projects/notepad/src/app/app.module#NotepadSharedModule'},
  { path: 'battery',
    loadChildren: '../../projects/battery/src/app/app.module#BatterySharedModule'},
  { path: 'radio',
    loadChildren: '../../projects/radio/src/app/app.module#RadioSharedModule'},
  { path: 'clock',
    loadChildren: '../../projects/clock/src/app/app.module#ClockAppSharedModule'},
  { path: 'browser',
    loadChildren: '../../projects/browser/src/app/app.module#BrowserAppSharedModule'},
  { path: 'nav', component: NavComponent },
  { path: 'lock', component: LockscreenComponent },
  { path: 'settings', component : SettingsComponent},
  { path: '**', redirectTo: '/lock'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ProfilAppSharedModule.forRoot(),
    ScannerAppSharedModule.forRoot(),
    TranslatorAppSharedModule.forRoot(),
    ScannerAppSharedModule.forRoot(),
    VaultAppSharedModule.forRoot(),
    ChatbotAppSharedModule.forRoot(),
    PhoneSharedModule.forRoot(),
    NotepadSharedModule.forRoot(),
    BatterySharedModule.forRoot(),
    RadioSharedModule.forRoot(),
    ClockAppSharedModule.forRoot(),
    BrowserAppSharedModule.forRoot()
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
