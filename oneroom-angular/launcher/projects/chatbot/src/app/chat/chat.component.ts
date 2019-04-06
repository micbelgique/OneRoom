import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/material';
import { Router } from '@angular/router';

export interface ChipColor {
  name: string;
  color: ThemePalette;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  // TODO : example, choose one color for the bot and one color for player
  messages: ChipColor[] = [
    {name: 'Hello', color: undefined},
    {name: 'Je suis Stéphane', color: 'primary'},
    {name: 'Le chatbot', color: 'accent'},
    {name: 'Chattez avec moi', color: 'warn'}
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    console.log(this.router.url);
    const message = {
      name: 'Vous êtes dans l app : ' + this.router.url,
      color: 'primary'
    } as ChipColor;
    this.messages.push(message);
  }

}
