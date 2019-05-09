import { Injectable } from '@angular/core';
import { User, GlassesType, SkinColorType, HairColorType, Gender } from '@oneroomic/oneroomlibrary';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  constructor() { }
  generateUserForTeam(users: User[]): User {
    const userWanted = new User();
    const result = [
      users.filter(u => u.hairColor === 'blond').length,
      users.filter(u => u.hairColor === 'brown').length,
      users.filter(u => u.hairColor === 'red').length,
      users.filter(u => u.hairColor === 'white').length
    ];
    const best = this.findMinResult(result);
    switch (best) {
      case 0:
        userWanted.hairColor = HairColorType.BLOND;
        if (users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.BLACK).length >= 1) {
          userWanted.skinColor = SkinColorType.BLACK;
          // tslint:disable-next-line:max-line-length
          userWanted.beardLevel = users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.BLACK)[0].beardLevel;
          // tslint:disable-next-line:max-line-length
          userWanted.hairLength = users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.BLACK)[0].hairLength;
          userWanted.gender = users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.BLACK)[0].gender;
          // tslint:disable-next-line:max-line-length
          userWanted.baldLevel = users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.BLACK)[0].baldLevel;
          if (users.filter(
            u => u.hairColor === 'blond' && u.skinColor === SkinColorType.BLACK && u.glassesType === GlassesType.ReadingGlasses)) {
              userWanted.glassesType = GlassesType.ReadingGlasses;
          }
        } else if (users.filter(u => u.hairColor === 'blond' && u.skinColor ===  SkinColorType.AZIAN).length >= 1) {
          userWanted.skinColor =  SkinColorType.AZIAN;
          // tslint:disable-next-line:max-line-length
          userWanted.beardLevel = users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.AZIAN)[0].beardLevel;
          // tslint:disable-next-line:max-line-length
          userWanted.hairLength = users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.AZIAN)[0].hairLength;
          userWanted.gender = users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.AZIAN)[0].gender;
          // tslint:disable-next-line:max-line-length
          userWanted.baldLevel = users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.AZIAN)[0].baldLevel;
          if (users.filter(
            u => u.hairColor === 'blond' && u.skinColor === SkinColorType.AZIAN && u.glassesType === GlassesType.ReadingGlasses)) {
              userWanted.glassesType = GlassesType.ReadingGlasses;
          }
        } else {
          userWanted.skinColor = SkinColorType.CAUCASIAN;
          // tslint:disable-next-line:max-line-length
          userWanted.beardLevel = users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.CAUCASIAN)[0].beardLevel;
          // tslint:disable-next-line:max-line-length
          userWanted.hairLength = users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.CAUCASIAN)[0].hairLength;
          // tslint:disable-next-line:max-line-length
          userWanted.gender = users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.CAUCASIAN)[0].gender;
          // tslint:disable-next-line:max-line-length
          userWanted.baldLevel = users.filter(u => u.hairColor === 'blond' && u.skinColor === SkinColorType.CAUCASIAN)[0].baldLevel;
          if (users.filter(
            u => u.hairColor === 'blond' && u.skinColor === SkinColorType.CAUCASIAN && u.glassesType === GlassesType.ReadingGlasses)) {
              userWanted.glassesType = GlassesType.ReadingGlasses;
          }
        }
        break;
      case 1:
      userWanted.hairColor = HairColorType.BROWN;
      if (users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.BLACK).length >= 1) {
        userWanted.skinColor = SkinColorType.BLACK;
        // tslint:disable-next-line:max-line-length
        userWanted.beardLevel = users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.BLACK)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        userWanted.hairLength = users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.BLACK)[0].hairLength;
        userWanted.gender = users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.BLACK)[0].gender;
        // tslint:disable-next-line:max-line-length
        userWanted.baldLevel = users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.BLACK)[0].baldLevel;
        if (users.filter(
          u => u.hairColor === 'brown' && u.skinColor === SkinColorType.BLACK && u.glassesType === GlassesType.ReadingGlasses)) {
            userWanted.glassesType = GlassesType.ReadingGlasses;
        }
      } else if (users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.AZIAN).length >= 1) {
        userWanted.skinColor = SkinColorType.AZIAN;
        // tslint:disable-next-line:max-line-length
        userWanted.beardLevel = users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.AZIAN)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        userWanted.hairLength = users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.AZIAN)[0].hairLength;
        userWanted.gender = users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.AZIAN)[0].gender;
        // tslint:disable-next-line:max-line-length
        userWanted.baldLevel = users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.AZIAN)[0].baldLevel;
        if (users.filter(
          u => u.hairColor === 'brown' && u.skinColor === SkinColorType.AZIAN && u.glassesType === GlassesType.ReadingGlasses)) {
            userWanted.glassesType = GlassesType.ReadingGlasses;
        }
      } else {
        userWanted.skinColor = SkinColorType.CAUCASIAN;
        // tslint:disable-next-line:max-line-length
        userWanted.beardLevel = users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.CAUCASIAN)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        userWanted.hairLength = users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.CAUCASIAN)[0].hairLength;
        userWanted.gender = users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.CAUCASIAN)[0].gender;
        // tslint:disable-next-line:max-line-length
        userWanted.baldLevel = users.filter(u => u.hairColor === 'brown' && u.skinColor === SkinColorType.CAUCASIAN)[0].baldLevel;
        if (users.filter(
          u => u.hairColor === 'brown' && u.skinColor === SkinColorType.CAUCASIAN && u.glassesType === GlassesType.ReadingGlasses)) {
            userWanted.glassesType = GlassesType.ReadingGlasses;
        }
      }
      break;
      case 2:
      userWanted.hairColor = HairColorType.RED;
      if (users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.BLACK).length >= 1) {
        userWanted.skinColor = SkinColorType.BLACK;
        // tslint:disable-next-line:max-line-length
        userWanted.beardLevel = users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.BLACK)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        userWanted.hairLength = users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.BLACK)[0].hairLength;
        userWanted.gender = users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.BLACK)[0].gender;
        userWanted.baldLevel = users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.BLACK)[0].baldLevel;
        if (users.filter(
          u => u.hairColor === 'red' && u.skinColor === SkinColorType.BLACK && u.glassesType === GlassesType.ReadingGlasses)) {
            userWanted.glassesType = GlassesType.ReadingGlasses;
        }
      } else if (users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.AZIAN).length >= 1) {
        userWanted.skinColor = SkinColorType.AZIAN;
        // tslint:disable-next-line:max-line-length
        userWanted.beardLevel = users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.AZIAN)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        userWanted.hairLength = users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.AZIAN)[0].hairLength;
        userWanted.gender = users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.AZIAN)[0].gender;
        userWanted.baldLevel = users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.AZIAN)[0].baldLevel;
        if (users.filter(
          u => u.hairColor === 'red' && u.skinColor === SkinColorType.AZIAN && u.glassesType === GlassesType.ReadingGlasses)) {
            userWanted.glassesType = GlassesType.ReadingGlasses;
        }
      } else {
        userWanted.skinColor = SkinColorType.CAUCASIAN;
        // tslint:disable-next-line:max-line-length
        userWanted.beardLevel = users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.CAUCASIAN)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        userWanted.hairLength = users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.CAUCASIAN)[0].hairLength;
        userWanted.gender = users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.CAUCASIAN)[0].gender;
        // tslint:disable-next-line:max-line-length
        userWanted.baldLevel = users.filter(u => u.hairColor === 'red' && u.skinColor === SkinColorType.CAUCASIAN)[0].baldLevel;
        if (users.filter(
          u => u.hairColor === 'red' && u.skinColor === SkinColorType.CAUCASIAN && u.glassesType === GlassesType.ReadingGlasses)) {
            userWanted.glassesType = GlassesType.ReadingGlasses;
        }
      }
      break;
      case 3:
      userWanted.hairColor = HairColorType.WHITE;
      if (users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.BLACK).length >= 1) {
        userWanted.skinColor = SkinColorType.BLACK;
        // tslint:disable-next-line:max-line-length
        userWanted.beardLevel = users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.BLACK)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        userWanted.hairLength = users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.BLACK)[0].hairLength;
        userWanted.gender = users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.BLACK)[0].gender;
        // tslint:disable-next-line:max-line-length
        userWanted.baldLevel = users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.BLACK)[0].baldLevel;
        if (users.filter(
          u => u.hairColor === 'white' && u.skinColor === SkinColorType.BLACK && u.glassesType === GlassesType.ReadingGlasses)) {
            userWanted.glassesType = GlassesType.ReadingGlasses;
        }
      } else if (users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.AZIAN).length >= 1) {
        userWanted.skinColor = SkinColorType.AZIAN;
        // tslint:disable-next-line:max-line-length
        userWanted.beardLevel = users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.AZIAN)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        userWanted.hairLength = users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.AZIAN)[0].hairLength;
        userWanted.gender = users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.AZIAN)[0].gender;
        // tslint:disable-next-line:max-line-length
        userWanted.baldLevel = users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.AZIAN)[0].baldLevel;
        if (users.filter(
          u => u.hairColor === 'white' && u.skinColor === SkinColorType.AZIAN && u.glassesType === GlassesType.ReadingGlasses)) {
            userWanted.glassesType = GlassesType.ReadingGlasses;
        }
      } else {
        userWanted.skinColor = SkinColorType.CAUCASIAN;
        // tslint:disable-next-line:max-line-length
        userWanted.beardLevel = users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.CAUCASIAN)[0].beardLevel;
        // tslint:disable-next-line:max-line-length
        userWanted.hairLength = users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.CAUCASIAN)[0].hairLength;
        userWanted.gender = users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.CAUCASIAN)[0].gender;
        // tslint:disable-next-line:max-line-length
        userWanted.baldLevel = users.filter(u => u.hairColor === 'white' && u.skinColor === SkinColorType.CAUCASIAN)[0].baldLevel;
        if (users.filter(
          u => u.hairColor === 'white' && u.skinColor === SkinColorType.CAUCASIAN && GlassesType.ReadingGlasses)) {
            userWanted.glassesType = GlassesType.ReadingGlasses;
        }
      }
      break;
      default:
        break;
    }
    return userWanted;
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
    if (user.baldLevel <= 0.65) {
      if (user.gender === 'male') {
        console.log(user.gender);
        switch (user.hairLength) {
          case 'short':
            avataaarsEndPoint += '&topType=ShortHairShortFlat';
            break;
          case 'mid':
            avataaarsEndPoint += '&topType=LongHairBob';
            break;
          case 'long':
            avataaarsEndPoint += '&topType=LongHairStraightStrand';
            break;
        }
      } else {
        switch (user.hairLength) {
          case 'short':
            avataaarsEndPoint += '&topType=ShortHairShaggyMullet';
            break;
          case 'mid':
            avataaarsEndPoint += '&topType=LongHairNotTooLong';
            break;
          case 'long':
            avataaarsEndPoint += '&topType=LongHairStraight2';
            break;
        }
      }
      // hair color
      switch (user.hairColor) {
        case 'other':
        case 'unknown':
          avataaarsEndPoint += '&hairColor=Black';
          break;
        case 'blond':
          avataaarsEndPoint += '&hairColor=BlondeGolden';
          break;
        case 'red':
          avataaarsEndPoint += '&hairColor=Auburn';
          break;
        case 'white':
          avataaarsEndPoint += '&hairColor=SilverGray';
          break;
        default:
          avataaarsEndPoint += '&hairColor=' + user.hairColor.toLocaleUpperCase();
          break;
      }
    } else {
      avataaarsEndPoint += '&topType=NoHair';
    }
    return avataaarsEndPoint;
  }
}
