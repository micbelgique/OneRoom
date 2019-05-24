import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { MainscreenComponent } from './mainscreen/mainscreen.component';

const routes: Routes = [
  { path: 'vault/main', component: MainscreenComponent},
  { path: 'vault/lock', component: LockscreenComponent},
  { path: 'vault', redirectTo: 'vault/lock' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
