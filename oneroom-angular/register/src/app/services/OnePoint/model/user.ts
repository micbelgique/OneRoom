import { Face } from './face';
import { GlassesType } from './glasses-type.enum';
import { Gender } from './gender.enum';


export class User {
  userId: string;
  urlAvatar: string;
  name: string;
  faces: Face[];
  // stats recalculated
  age: number;
  gender: number;
  moustacheLevel: number;
  beardLevel: number;
  baldLevel: number;
  smileLevel: number;
  hairColor: string;
  hairLength: string;
  skinColor: string;
  glassesType: GlassesType;
  emotionDominant: string;

  constructor() {
    this.faces = [];
  }

  static generateAvatar(u: User): void {
    if (u.faces.length === 1) {
      u.age = u.faces[u.faces.length - 1].age;
      u.gender =  u.faces[u.faces.length - 1].isMale ? Gender.MALE : Gender.FEMALE;
      u.moustacheLevel = u.faces[u.faces.length - 1].moustacheLevel;
      u.beardLevel = u.faces[u.faces.length - 1].beardLevel;
      u.baldLevel = u.faces[u.faces.length - 1].baldLevel;
      u.smileLevel = u.faces[u.faces.length - 1].smileLevel;
      u.hairColor = u.faces[u.faces.length - 1].hairColor;
      u.skinColor = u.faces[u.faces.length - 1].skinColor;
      u.glassesType = u.faces[u.faces.length - 1].glassesType;
      u.emotionDominant = u.faces[u.faces.length - 1].emotionDominant;
      console.log('data set');
    }
    User.generateAvatarUrl(u);
  }


  static generateAvatarUrl(u: User) {

  /* SEEDS FEMALE
    hair : long hair

  */

    u.urlAvatar = ( u.gender === Gender.MALE ?
    // tslint:disable-next-line:max-line-length
    'https://avatars.dicebear.com/v2/avataaars/OneRoomMale.svg?options[clothes][]=blazer&options[eyes][]=defaultValue&options[eyebrow][]=defaultValue&options[mouth][]=serious' :
    // tslint:disable-next-line:max-line-length
    'https://avatars.dicebear.com/v2/avataaars/HairLongFemale.svg?options[clothes][]=blazer&options[eyes][]=defaultValue&options[eyebrow][]=defaultValue&options[mouth][]=serious' );

    if (u.skinColor) {
      u.urlAvatar += u.skinColor.toLowerCase() === 'caucasian' ?
      '&options[skin][]=pale' : u.skinColor.toLowerCase() === 'black' ?
      '&options[skin][]=darkBrown' : u.skinColor.toLowerCase() === 'azian' ?
      '&options[skin][]=yellow' : '&options[skin][]=light';
    } else {
      u.urlAvatar += '&options[skin][]=light';
    }

    u.urlAvatar += u.faces[u.faces.length - 1].hairLength.toLowerCase() === 'long' ?
     '&options[top][]=longHair' : '&options[top][]=shortHair';

    u.urlAvatar += u.baldLevel > 0.65 ? '&options[topChance]=0' : '&options[topChance]=100';

    u.urlAvatar += u.glassesType === GlassesType.ReadingGlasses ?
    '&options[accessories][]=round&options[accessoriesChance]=100' :
    u.glassesType === GlassesType.Sunglasses ?
    '&options[accessories][]=sunglasses&options[accessoriesChance]=100' : '&options[accessoriesChance]=0';

    if (u.gender === Gender.MALE) {
      u.urlAvatar += u.beardLevel > 0.5 ?
        '&options[facialHair][]=medium' : u.beardLevel > 0.25 ?
        '&options[facialHair][]=light' : u.moustacheLevel > 0.5 ?
        '&options[facialHair][]=magnum' : u.moustacheLevel > 0.25 ?
        '&options[facialHair][]=fancy' : '&options[facialHair][]=magestic';
    } else {
      u.urlAvatar += '&options[facialHairChance]=0';
    }

    if (u.hairColor) {
  // hair color
    u.urlAvatar += '&options[hairColor][]=';
    u.urlAvatar += u.hairColor.toLowerCase() === 'other' ?
     'black' : u.hairColor.toLowerCase() === 'unknown' ?
     'black' : u.hairColor.toLowerCase() === 'blond' ?
     'blonde' : u.hairColor.toLowerCase() === 'red' ?
     'auburn' : u.hairColor.toLowerCase() === 'white' ?
     'gray' : u.hairColor.toLowerCase() ;
     // beard color
    if (u.gender === Gender.MALE) {
    u.urlAvatar += '&options[facialHairColor][]=';
    u.urlAvatar += u.hairColor.toLowerCase() === 'other' ?
      'black' : u.hairColor.toLowerCase() === 'unknown' ?
      'black' : u.hairColor.toLowerCase() === 'blond' ?
      'blonde' : u.hairColor.toLowerCase() === 'red' ?
      'auburn' : u.hairColor.toLowerCase() === 'white' ?
      'gray' : u.hairColor.toLowerCase() ;
    }
  }


  }
}
