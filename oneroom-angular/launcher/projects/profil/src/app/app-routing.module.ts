import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './form/form.component';

const routes: Routes = [
  { path: 'profil/home', component: FormComponent},
  { path: 'profil', redirectTo: 'profil/home' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
