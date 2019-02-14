import { Component, OnInit } from '@angular/core';
import { User } from '../services/OnePoint/model/user';
import { UserService } from '../services/OnePoint/user.service';
import { GlassesType } from '../services/OnePoint/model/glasses-type.enum';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  users: User[];
  filteredUsers: User[];
  errorMessage: string;
  // tslint:disable-next-line:variable-name
  _beardSelect = false;
  // tslint:disable-next-line:variable-name
  _moustacheSelect = false;
  // tslint:disable-next-line:variable-name
  _glassesSelect = false;

  public get beardSelect(): boolean {
    return this._beardSelect;
  }
  public set beardSelect(v: boolean) {
    this._beardSelect = v;
    this.filteredUsers = this.filter();
  }
  public get moustacheSelect(): boolean {
    return this._moustacheSelect;
  }
  public set moustacheSelect(v: boolean) {
    this._moustacheSelect = v;
    this.filteredUsers = this.filter();
  }
  public get glassesSelect(): boolean {
    return this._glassesSelect;
  }
  public set glassesSelect(v: boolean) {
    this._glassesSelect = v;
    this.filteredUsers = this.filter();
  }


  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(
      userslist => {
        this.users = userslist;
        this.filteredUsers = this.users;
      }
    );
  }
  filter(): User[] {
    return this.users.filter((user: User) => user.faces[0].beardLevel > 0.2 === this._beardSelect &&
      user.faces[0].moustacheLevel > 0.2 === this._moustacheSelect &&
      (user.faces[0].glassesType !== GlassesType.NoGlasses) === this._glassesSelect);
  }
}
