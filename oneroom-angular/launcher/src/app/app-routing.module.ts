import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScannerAppSharedModule } from 'projects/scanner/src/app/app.module';
import { NavComponent } from './nav/nav.component';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {path: 'scanner',
  loadChildren: '../../projects/scanner/src/app/app.module#ScannerAppSharedModule'},
  { path: 'nav', component: NavComponent },
  { path: 'lock', component: LockscreenComponent },
  { path: 'settings', component : SettingsComponent},
  { path: '**', redirectTo: '/lock'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ScannerAppSharedModule.forRoot()
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
