import { Component, OnInit } from '@angular/core';
import { User, Gender, GlassesType, UserService } from '@oneroomic/oneroomlibrary';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  user: User;
  genders: string[];
  glasses: string[];
  hairColors = [
    'brown',
    'blond',
    'black',
    'other',
    'white',
    'red'
  ];
  hairLengths = [
    'long',
    'mid',
    'short'
  ];
  skinColors = [
    'black',
    'azian',
    'caucasian'
  ];


  constructor(private userService: UserService, private toast: MatSnackBar) {
    this.genders = Object.keys(Gender).filter(key => !isNaN(Number(Gender[key])));
    this.glasses = Object.keys(GlassesType).map(key => key.charAt(0).toLowerCase() + key.slice(1));
  }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  saveProfile() {
    if (localStorage.getItem('user') && this.user.userId) {
      console.log('updating');
      console.log(this.user);
      const update$ = this.userService.updateUser(this.user);
      update$.subscribe(
        (user: User) => {
          this.toast.open('Profil mis à jour', 'Ok', {
            duration: 2000
          });
          console.log('updated');
          this.user = user;
          localStorage.setItem('user', JSON.stringify(user));
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }


}
