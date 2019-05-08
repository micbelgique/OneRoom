import { Component, OnInit } from '@angular/core';
import { Team, TeamService, User, GlassesType, Gender } from '@oneroomic/oneroomlibrary';
import { HairColorType, SkinColorType } from '@oneroomic/oneroomlibrary/one-room/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  teams: Team[];
  team = new Team();
  UserWanted = new User();
  constructor(
    private teamService: TeamService
  ) { }

  ngOnInit() {
    this.getTeams();
  }
  getTeams() {
    this.teamService.getTeams().subscribe(
      (result) => {
        this.teams = result;
        console.log(this.teams);
      }
    );
  }
  getTeam(teamName: string) {
    this.team = null;
    this.team = this.teams.filter(t => t.teamName === teamName)[0];
    this.generateUserForTeam();
  }
  generateUserForTeam() {
    const result = [
      this.team.users.filter(u => u.hairColor === 'blond').length,
      this.team.users.filter(u => u.hairColor === 'brown').length,
      this.team.users.filter(u => u.hairColor === 'red').length,
      this.team.users.filter(u => u.hairColor === 'white').length
    ];
    const best = this.findMinResult(result);
    switch (best) {
      case 0:
        this.UserWanted.hairColor = HairColorType.BLOND;
        if (this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.BLACK).length >= 1) {
          this.UserWanted.skinColor = SkinColorType.BLACK;
          // tslint:disable-next-line:max-line-length
          this.UserWanted.beardLevel = this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.BLACK)[0].beardLevel;
          // tslint:disable-next-line:max-line-length
          this.UserWanted.hairLength = this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.BLACK)[0].hairLength;
          this.UserWanted.gender = this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.BLACK)[0].gender;
          // tslint:disable-next-line:max-line-length
          this.UserWanted.baldLevel = this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.BLACK)[0].baldLevel;
          if (this.team.users.filter(
            u => u.hairColor === 'blond' && u.skinColor === SkinColorType.BLACK && u.glassesType === GlassesType.ReadingGlasses)) {
              this.UserWanted.glassesType = GlassesType.ReadingGlasses;
          }
        } else if (this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor ===  SkinColorType.AZIAN).length >= 1) {
          this.UserWanted.skinColor =  SkinColorType.AZIAN;
          // tslint:disable-next-line:max-line-length
          this.UserWanted.beardLevel = this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.AZIAN)[0].beardLevel;
          // tslint:disable-next-line:max-line-length
          this.UserWanted.hairLength = this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.AZIAN)[0].hairLength;
          this.UserWanted.gender = this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.AZIAN)[0].gender;
          // tslint:disable-next-line:max-line-length
          this.UserWanted.baldLevel = this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.AZIAN)[0].baldLevel;
          if (this.team.users.filter(
            u => u.hairColor === 'blond' && u.skinColor === SkinColorType.AZIAN && u.glassesType === GlassesType.ReadingGlasses)) {
              this.UserWanted.glassesType = GlassesType.ReadingGlasses;
          }
        } else {
          this.UserWanted.skinColor = SkinColorType.CAUCASIAN;
          // tslint:disable-next-line:max-line-length
          this.UserWanted.beardLevel = this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.CAUCASIAN)[0].beardLevel;
          // tslint:disable-next-line:max-line-length
          this.UserWanted.hairLength = this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.CAUCASIAN)[0].hairLength;
          // tslint:disable-next-line:max-line-length
          this.UserWanted.gender = this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.CAUCASIAN)[0].gender;
          // tslint:disable-next-line:max-line-length
          this.UserWanted.baldLevel = this.team.users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.CAUCASIAN)[0].baldLevel;
          if (this.team.users.filter(
            u => u.hairColor === 'blond' && u.skinColor === SkinColorType.CAUCASIAN && u.glassesType === GlassesType.ReadingGlasses)) {
              this.UserWanted.glassesType = GlassesType.ReadingGlasses;
          }
        }
        break;
      case 1:
      this.UserWanted.hairColor = HairColorType.OTHER;
      if (this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.BLACK).length >= 1) {
        this.UserWanted.skinColor = SkinColorType.BLACK;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.beardLevel = this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.BLACK)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.hairLength = this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.BLACK)[0].hairLength;
        this.UserWanted.gender = this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.BLACK)[0].gender;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.baldLevel = this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.BLACK)[0].baldLevel;
        if (this.team.users.filter(
          u => u.hairColor === 'brown' && u.skinColor === SkinColorType.BLACK && u.glassesType === GlassesType.ReadingGlasses)) {
            this.UserWanted.glassesType = GlassesType.ReadingGlasses;
        }
      } else if (this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.AZIAN).length >= 1) {
        this.UserWanted.skinColor = SkinColorType.AZIAN;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.beardLevel = this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.AZIAN)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.hairLength = this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.AZIAN)[0].hairLength;
        this.UserWanted.gender = this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.AZIAN)[0].gender;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.baldLevel = this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.AZIAN)[0].baldLevel;
        if (this.team.users.filter(
          u => u.hairColor === 'brown' && u.skinColor === SkinColorType.AZIAN && u.glassesType === GlassesType.ReadingGlasses)) {
            this.UserWanted.glassesType = GlassesType.ReadingGlasses;
        }
      } else {
        this.UserWanted.skinColor = SkinColorType.CAUCASIAN;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.beardLevel = this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.CAUCASIAN)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.hairLength = this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.CAUCASIAN)[0].hairLength;
        this.UserWanted.gender = this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.CAUCASIAN)[0].gender;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.baldLevel = this.team.users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.CAUCASIAN)[0].baldLevel;
        if (this.team.users.filter(
          u => u.hairColor === 'brown' && u.skinColor === SkinColorType.CAUCASIAN && u.glassesType === GlassesType.ReadingGlasses)) {
            this.UserWanted.glassesType = GlassesType.ReadingGlasses;
        }
      }
      break;
      case 2:
      this.UserWanted.hairColor = HairColorType.RED;
      if (this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.BLACK).length >= 1) {
        this.UserWanted.skinColor = SkinColorType.BLACK;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.beardLevel = this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.BLACK)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.hairLength = this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.BLACK)[0].hairLength;
        this.UserWanted.gender = this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.BLACK)[0].gender;
        this.UserWanted.baldLevel = this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.BLACK)[0].baldLevel;
        if (this.team.users.filter(
          u => u.hairColor === 'red' && u.skinColor === SkinColorType.BLACK && u.glassesType === GlassesType.ReadingGlasses)) {
            this.UserWanted.glassesType = GlassesType.ReadingGlasses;
        }
      } else if (this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.AZIAN).length >= 1) {
        this.UserWanted.skinColor = SkinColorType.AZIAN;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.beardLevel = this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.AZIAN)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.hairLength = this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.AZIAN)[0].hairLength;
        this.UserWanted.gender = this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.AZIAN)[0].gender;
        this.UserWanted.baldLevel = this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.AZIAN)[0].baldLevel;
        if (this.team.users.filter(
          u => u.hairColor === 'red' && u.skinColor === SkinColorType.AZIAN && u.glassesType === GlassesType.ReadingGlasses)) {
            this.UserWanted.glassesType = GlassesType.ReadingGlasses;
        }
      } else {
        this.UserWanted.skinColor = SkinColorType.CAUCASIAN;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.beardLevel = this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.CAUCASIAN)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.hairLength = this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.CAUCASIAN)[0].hairLength;
        this.UserWanted.gender = this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.CAUCASIAN)[0].gender;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.baldLevel = this.team.users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.CAUCASIAN)[0].baldLevel;
        if (this.team.users.filter(
          u => u.hairColor === 'red' && u.skinColor === SkinColorType.CAUCASIAN && u.glassesType === GlassesType.ReadingGlasses)) {
            this.UserWanted.glassesType = GlassesType.ReadingGlasses;
        }
      }
      break;
      case 3:
      this.UserWanted.hairColor = HairColorType.WHITE;
      if (this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.BLACK).length >= 1) {
        this.UserWanted.skinColor = SkinColorType.BLACK;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.beardLevel = this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.BLACK)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.hairLength = this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.BLACK)[0].hairLength;
        this.UserWanted.gender = this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.BLACK)[0].gender;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.baldLevel = this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.BLACK)[0].baldLevel;
        if (this.team.users.filter(
          u => u.hairColor === 'white' && u.skinColor === SkinColorType.BLACK && u.glassesType === GlassesType.ReadingGlasses)) {
            this.UserWanted.glassesType = GlassesType.ReadingGlasses;
        }
      } else if (this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.AZIAN).length >= 1) {
        this.UserWanted.skinColor = SkinColorType.AZIAN;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.beardLevel = this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.AZIAN)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.hairLength = this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.AZIAN)[0].hairLength;
        this.UserWanted.gender = this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.AZIAN)[0].gender;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.baldLevel = this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.AZIAN)[0].baldLevel;
        if (this.team.users.filter(
          u => u.hairColor === 'white' && u.skinColor === SkinColorType.AZIAN && u.glassesType === GlassesType.ReadingGlasses)) {
            this.UserWanted.glassesType = GlassesType.ReadingGlasses;
        }
      } else {
        this.UserWanted.skinColor = SkinColorType.CAUCASIAN;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.beardLevel = this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.CAUCASIAN)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.hairLength = this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.CAUCASIAN)[0].hairLength;
        this.UserWanted.gender = this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.CAUCASIAN)[0].gender;
        // tslint:disable-next-line:max-line-length
        this.UserWanted.baldLevel = this.team.users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.CAUCASIAN)[0].baldLevel;
        if (this.team.users.filter(
          u => u.hairColor === 'white' && u.skinColor === SkinColorType.CAUCASIAN && GlassesType.ReadingGlasses)) {
            this.UserWanted.glassesType = GlassesType.ReadingGlasses;
        }
      }
      break;
      default:
        break;
    }
    console.log(this.generateAvatar(this.UserWanted));
  }
  findMinResult(res: number[]): number {
    let result = Math.max(...res);
    let resultPos = -1;
    for (let index = 0; index < res.length; index++) {
      if (res[index] > 0 && result >= res[index]) {
        result = res[index];
        resultPos = index;
      }
    }
    return resultPos;
  }
  generateAvatar(user: User): string {
    let avataaarsEndPoint = 'https://avataaars.io/?';
    avataaarsEndPoint += '&accessoriesType=Sunglasses';
    switch (user.skinColor) {
    case SkinColorType.CAUCASIAN:
      avataaarsEndPoint += '&skinColor=Pale';
      break;
    case SkinColorType.BLACK:
      avataaarsEndPoint += '&skinColor=DarkBrown';
      break;
    case SkinColorType.AZIAN:
      avataaarsEndPoint += '&skinColor=Yellow';
      break;
    default:
      avataaarsEndPoint += '&skinColor=Light';
      break;
    }
    if (user.glassesType === GlassesType.ReadingGlasses) {
      avataaarsEndPoint += '&accessoriesType=Prescription02';
    }
    avataaarsEndPoint += '&clotheType=GraphicShirt&clotheColor=Black&graphicType=Pizza';
    if (user.gender === Gender.MALE) {
      if (user.beardLevel > 0.75) {
        avataaarsEndPoint += '&facialHairType=BeardMajestic';
      } else if (user.beardLevel > 0.5) {
        avataaarsEndPoint += '&facialHairType=BeardMedium';
      } else if (user.beardLevel > 0.25) {
        avataaarsEndPoint += '&facialHairType=BeardLight';
      } else {
        if (user.moustacheLevel > 0.5) {
          avataaarsEndPoint += '&facialHairType=MoustacheMagnum';
        } else if (user.moustacheLevel > 0.25) {
          avataaarsEndPoint += '&facialHairType=MoustacheFancy';
        } else {
          avataaarsEndPoint += '&facialHairType=Blank';
        }
      }
      switch (user.hairColor) {
        case 'other':
        case 'unknown':
          avataaarsEndPoint += '&facialHairColor=Black';
          break;
        case 'blond':
          avataaarsEndPoint += '&facialHairColor=BlondeGolden';
          break;
        case 'red':
          avataaarsEndPoint += '&facialHairColor=Auburn';
          break;
        case 'white':
          avataaarsEndPoint += '&facialHairColor=SilverGray';
          break;
      default:
        avataaarsEndPoint += ('&facialHairColor=' + user.hairColor);
        break;
      }
  } else {
    avataaarsEndPoint += '&facialHairType=Blank';
  }
    return avataaarsEndPoint;
  }
}
