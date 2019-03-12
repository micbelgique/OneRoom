import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetectorComponent } from './detector/detector.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: 'scanner/detect', component: DetectorComponent },
  { path: 'scanner/home', component: AppComponent},
  { path: 'scanner', redirectTo: 'scanner/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
