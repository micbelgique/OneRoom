import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lockscreen',
  templateUrl: './lockscreen.component.html',
  styleUrls: ['./lockscreen.component.css']
})
export class LockscreenComponent implements OnInit {

  password: string;
  private code: string;

  constructor() {
    // this.code = ;
   }

  ngOnInit() {
  }

  unlock() {
    console.log(this.password);
    // check password with challenge generated password
  }

}
