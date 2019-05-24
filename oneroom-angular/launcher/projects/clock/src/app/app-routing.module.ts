import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClockComponent } from './clock/clock.component';

const routes: Routes = [
  { path: 'clock/home', component: ClockComponent},
  { path: 'clock', redirectTo: 'clock/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
