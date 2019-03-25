import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslationComponent } from './translation/translation.component';

const routes: Routes = [
  { path: 'translator/home', component: TranslationComponent},
  { path: 'translator', redirectTo: 'translator/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
