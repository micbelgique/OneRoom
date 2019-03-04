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
  recognized: number;

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
      u.hairLength = u.faces[u.faces.length - 1].hairLength;
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
    'https://avatars.dicebear.com/v2/avataaars/OneRoomMale.svg?options[eyes][]=defaultValue&options[eyebrow][]=defaultValue' :
    // tslint:disable-next-line:max-line-length
    'https://avatars.dicebear.com/v2/avataaars/HairLongFemale.svg?options[eyes][]=defaultValue&options[eyebrow][]=defaultValue' );

    u.urlAvatar += u.skinColor.toLowerCase() === 'caucasian' ?
    '&options[skin][]=pale' : u.skinColor.toLowerCase() === 'black' ?
    '&options[skin][]=darkBrown' : u.skinColor.toLowerCase() === 'azian' ?
    '&options[skin][]=yellow' : '&options[skin][]=light';
    u.urlAvatar += u.baldLevel > 0.65 ? '&options[topChance]=0' : '&options[topChance]=100';

    u.urlAvatar += u.glassesType === GlassesType.ReadingGlasses ?
    '&options[accessories][]=round&options[accessoriesChance]=100' :
    u.glassesType === GlassesType.Sunglasses ?
    '&options[accessories][]=sunglasses&options[accessoriesChance]=100' : '&options[accessoriesChance]=0';

    const randClothes = Math.random();
    if ( randClothes <= 1 / 6) {
      u.urlAvatar += '&options[clothes][]=blazer';
    } else if ( randClothes <= 1 / 3) {
      u.urlAvatar += '&options[clothes][]=sweater';
    } else if ( randClothes <= 1 / 2) {
      u.urlAvatar += '&options[clothes][]=shirt';
    } else if ( randClothes <= 2 / 3) {
      u.urlAvatar += '&options[clothes][]=hoodie';
    } else if ( randClothes <= 5 / 6) {
      u.urlAvatar += '&options[clothes][]=overall';
    } else if ( randClothes <= 1) {
      u.urlAvatar += '&options[clothes][]=sweater&options[clothes][]=shirt&options[clothes][]=hoodie';
    }

    const randClothesColor = Math.random();
    if ( randClothesColor <= 1 / 8) {
      u.urlAvatar += '&options[clothesColor][]=black';
    } else if ( randClothesColor <= 1 / 4) {
      u.urlAvatar += '&options[clothesColor][]=blue';
    } else if ( randClothesColor <= 3 / 8) {
      u.urlAvatar += '&options[clothesColor][]=gray';
    } else if ( randClothesColor <= 2 / 4) {
      u.urlAvatar += '&options[clothesColor][]=heather';
    } else if ( randClothesColor <= 5 / 8) {
      u.urlAvatar += '&options[clothesColor][]=pastel';
    } else if ( randClothesColor <= 3 / 4) {
      u.urlAvatar += '&options[clothesColor][]=pink';
    } else if ( randClothesColor <= 7 / 8) {
      u.urlAvatar += '&options[clothesColor][]=red';
    } else if ( randClothesColor <= 1) {
      u.urlAvatar += '&options[clothesColor][]=white';
    }

    if (u.gender === Gender.MALE) {
      u.urlAvatar += u.beardLevel > 0.5 ?
        '&options[facialHair][]=medium' : u.beardLevel > 0.25 ?
        '&options[facialHair][]=light' : u.moustacheLevel > 0.5 ?
        '&options[facialHair][]=magnum' : u.moustacheLevel > 0.25 ?
        '&options[facialHair][]=fancy' : '&options[facialHair][]=magestic';
    } else {
      u.urlAvatar += '&options[facialHairChance]=0';
    }

    const randHairLength = Math.random();
    switch (u.hairLength) {
      case 'short':
        if (u.gender === Gender.FEMALE) {
          if ( randHairLength <= 1 / 3 ) {
            u.urlAvatar += '&options[top][]=shortHair&options[top][]=hat';
          } else if ( randHairLength <= 2 / 3 ) {
            u.urlAvatar += '&options[top][]=shortHair&options[top][]=turban';
          } else if ( randHairLength <= 1 ) {
            u.urlAvatar += '&options[top][]=shortHair&options[top][]=turban&options[top][]=hijab';
          }
        } else {
          if ( randHairLength <= 1 / 4) {
            u.urlAvatar += '&options[top][]=shortHair';
          } else if ( randHairLength <= 1 / 2) {
            u.urlAvatar += '&options[top][]=shortHair&options[top][]=hat';
          } else if ( randHairLength <= 3 / 4) {
            u.urlAvatar += '&options[top][]=shortHair&options[top][]=longHair&options[top][]=hat&options[top][]=hijab';
          } else if ( randHairLength <= 1 ) {
            u.urlAvatar += '&options[top][]=shortHair&options[top][]=longHair&options[top][]=hat';
          }
        }
        break;
      case 'mid':
        if (u.gender === Gender.FEMALE) {
          if ( randHairLength <= 1 / 3) {
            u.urlAvatar += '&options[top][]=shortHair';
          } else if ( randHairLength <= 2 / 3) {
            u.urlAvatar += '&options[top][]=longHair&options[top][]=shortHair';
          } else if ( randHairLength <= 1 ) {
            u.urlAvatar += '&options[top][]=longHair&options[top][]=eyepatch';
          }
        } else {
          if ( randHairLength <= 1 / 2) {
            u.urlAvatar += '&options[top][]=longHair';
          } else if ( randHairLength <= 1 ) {
            u.urlAvatar += '&options[top][]=longHair&options[top][]=eyepatch';
          }
        }
        break;
      case 'long':
        if (u.gender === Gender.FEMALE) {
          if ( randHairLength <= 1 / 2) {
            u.urlAvatar += '&options[top][]=longHair&options[top][]=shortHair&options[top][]=hat';
          }
          // Else hair length already present in the seed
        } else {
          if ( randHairLength <= 1 / 2) {
            u.urlAvatar += '&options[top][]=longHair&options[top][]=hat&options[top][]=hijab&options[top][]=turban';
          } else if ( randHairLength <= 1 ) {
            u.urlAvatar += '&options[top][]=longHair&options[top][]=hat';
          }
        }
        break;
    }

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
    switch (u.emotionDominant) {
      case 'anger': {
        u.urlAvatar += '&options[eyebrow][]=angry&options[mouth][]=concerned';
        break;
      }
      case 'contempt': {
        u.urlAvatar += '&options[eyebrow][]=up&options[mouth][]=disbelief';
        break;
      }
      case 'disgust': {
        u.urlAvatar += '&options[eyes][]=dizzy&options[mouth][]=vomit';
        break;
      }
      case 'fear': {
        u.urlAvatar += '&options[eyes][]=squint&options[mouth][]=scream';
        break;
      }
      case 'happiness': {
        u.urlAvatar += '&options[eyes][]=squint&options[mouth][]=twinkle';
        break;
      }
      case 'neutral': {
        u.urlAvatar += '&options[mouth][]=serious';
        break;
      }
      case 'sadness': {
        u.urlAvatar += '&options[eyes][]=squint&options[eyebrow][]=sad&options[mouth][]=sad';
        break;
      }
      case 'surprise': {
        u.urlAvatar += '&options[eyes][]=surprised&options[eyebrow][]=up&options[mouth][]=disbelief';
        break;
      }
    }

    u.urlAvatar += u.smileLevel === 1 ? '&options[mouth][]=grimace' :
            u.smileLevel > 0.6 ? '&options[mouth][]=smile' : '';
  }
}
