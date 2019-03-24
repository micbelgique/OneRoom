import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SettingsComponent } from './settings/settings.component';

import { VaultAppSharedModule } from 'projects/vault/src/app/app.module';
import { ProfilAppSharedModule } from 'projects/profil/src/app/app.module';
import { ScannerAppSharedModule } from 'projects/scanner/src/app/app.module';

const routes: Routes = [
  {path: 'scanner',
    loadChildren: '../../projects/scanner/src/app/app.module#ScannerAppSharedModule'},
  {path: 'profil',
    loadChildren: '../../projects/profil/src/app/app.module#ProfilAppSharedModule'},
  {path: 'vault',
    loadChildren: '../../projects/vault/src/app/app.module#VaultAppSharedModule'},
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
    VaultAppSharedModule.forRoot()
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
