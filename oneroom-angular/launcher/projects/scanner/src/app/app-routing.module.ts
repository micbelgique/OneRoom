import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetectorComponent } from './detector/detector.component';

const routes: Routes = [
  { path: 'scanner/home', component: DetectorComponent},
  { path: 'scanner', redirectTo: 'scanner/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
