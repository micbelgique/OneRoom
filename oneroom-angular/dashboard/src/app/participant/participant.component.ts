import { Component, OnInit } from '@angular/core';
import { Participant } from '../models/participant';
import { ParticipantService } from '../services/participant.service';
import { GameService } from '../services/game.service';
import { UserService } from '../services/user.service';
import { FormControl,FormGroup,FormBuilder,FormArray,FormsModule  } from '@angular/forms';
import { User } from '../models/user';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  participantlist!: Participant[];
  gamelist!: any[];
  participantFinal!: User;
  selectedGame: string = '';

  constructor(private _participantservice: ParticipantService, private _gameservice: GameService, private _userservice: UserService) {

   }

  ngOnInit() {

    this._participantservice.GetAllUserFromAuth().subscribe(data => {
      this.participantlist = data;
      console.log(this.participantlist)
    })

    this._gameservice.GetAllGames().subscribe(data => {
      this.gamelist = data;
      console.log(this.gamelist)
    })
  }

  selectChangeHandler (event: any) {
    this.selectedGame = event.target.value;
  }

  submit(selectedUser) {
    console.log("------ Submit ------");
    // console.log(this.selectedGame);
    // console.log(selectedUser);

    const participantFinal = <User>{
      UserId : selectedUser.id,
      CreationDate : selectedUser.created,
      Name : selectedUser.name,
      UrlAvatar : selectedUser.avatarUrl,
      GameId : this.selectedGame,
      Recognized: 20
    }

    console.log(participantFinal);


    console.log(this._userservice.AddUser(participantFinal.GameId, participantFinal));

    this._userservice.AddUser(participantFinal.GameId, participantFinal).subscribe(
      newParticipant => {
        console.log(newParticipant);

      }
    )
  }
}
