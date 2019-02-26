import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetectorComponent } from './detector/detector.component';

const routes: Routes = [
  { path: 'scanner/detect', component: DetectorComponent },
  { path: 'scanner', redirectTo: 'scanner/detect' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
