import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslatorComponent } from './translator/translator.component';

const routes: Routes = [
  { path: 'translator/home', component: TranslatorComponent},
  { path: 'translator', redirectTo: 'translator/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
