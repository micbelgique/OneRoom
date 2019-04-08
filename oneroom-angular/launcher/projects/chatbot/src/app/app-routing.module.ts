import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  { path: 'chatbot/chat', component: ChatComponent},
  { path: 'chatbot', redirectTo: 'chatbot/chat' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
