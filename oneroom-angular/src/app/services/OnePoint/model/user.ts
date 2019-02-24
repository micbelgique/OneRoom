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
  gender: Gender;
  moustacheLevel: number;
  beardLevel: number;
  baldLevel: number;
  smileLevel: number;
  hairColor: string;
  skinColor: string;
  glassesType: GlassesType;
  emotionDominant: string;

  constructor() {
    this.generateAvatar();
  }

  generateAvatar(): void {
    if (this.faces && this.faces.length) {
      this.urlAvatar = this.faces[this.faces.length - 1].isMale ?
      // tslint:disable-next-line:max-line-length
      'https://avatars.dicebear.com/v2/avataaars/OneRoomMale.svg?options[facialHairChance]=100&options[clothes][]=blazer&options[eyes][]=defaultValue&options[eyebrow][]=defaultValue&options[mouth][]=serious' :
      // tslint:disable-next-line:max-line-length
      'https://avatars.dicebear.com/v2/avataaars/OneRoomFemale.svg?options[facialHairChance]=100&options[clothes][]=blazer&options[eyes][]=defaultValue&options[eyebrow][]=defaultValue&options[mouth][]=serious';

      this.urlAvatar += this.faces[this.faces.length - 1].skinColor.toLowerCase() === 'caucasian' ?
      '&options[skin][]=pale' : this.faces[this.faces.length - 1].skinColor.toLowerCase() === 'black' ?
      '&options[skin][]=darkBrown' : this.faces[this.faces.length - 1].skinColor.toLowerCase() === 'azian' ?
      '&options[skin][]=yellow' : '&options[skin][]=pale';
      this.urlAvatar += this.faces[this.faces.length - 1].baldLevel > 0.5 ? '&options[topChance]=0' : '&options[topChance]=100';

      this.urlAvatar += this.faces[this.faces.length - 1].glassesType === GlassesType.ReadingGlasses ?
      '&options[accessories][]=round&options[accessoriesChance]=100' :
      this.faces[this.faces.length - 1].glassesType === GlassesType.Sunglasses ?
      '&options[accessories][]=sunglasses&options[accessoriesChance]=100' : '&options[accessoriesChance]=0';

      this.urlAvatar += this.faces[this.faces.length - 1].beardLevel > 0.5 ?
        '&options[facialHair][]=medium' : this.faces[this.faces.length - 1].baldLevel > 0.2 ?
        '&options[facialHair][]=light' : this.faces[this.faces.length - 1].moustacheLevel > 0.5 ?
        '&options[facialHair][]=magnum' : this.faces[this.faces.length - 1].moustacheLevel > 0.2 ?
        '&options[facialHair][]=fancy' : '&options[facialHair][]=magestic';

      if (this.faces[this.faces.length - 1].hairColor) {
        // hair color
        this.urlAvatar += '&options[hairColor][]=';
        this.urlAvatar += this.faces[this.faces.length - 1].hairColor.toLowerCase() === 'other' ?
         'black' : this.faces[this.faces.length - 1].hairColor.toLowerCase() === 'unknown' ?
         'black' : this.faces[this.faces.length - 1].hairColor.toLowerCase() === 'blond' ?
         'blonde' : this.faces[this.faces.length - 1].hairColor.toLowerCase() === 'red' ?
         'auburn' : this.faces[this.faces.length - 1].hairColor.toLowerCase() === 'white' ?
         'gray' : this.faces[this.faces.length - 1].hairColor.toLowerCase();
         // beard color
        this.urlAvatar += '&options[facialHairColor][]=';
        this.urlAvatar += this.faces[this.faces.length - 1].hairColor.toLowerCase() === 'other' ?
         'black' : this.faces[this.faces.length - 1].hairColor.toLowerCase() === 'unknown' ?
         'black' : this.faces[this.faces.length - 1].hairColor.toLowerCase() === 'blonde' ?
         'blonde' : this.faces[this.faces.length - 1].hairColor.toLowerCase() === 'red' ?
         'auburn' : this.faces[this.faces.length - 1].hairColor.toLowerCase() === 'white' ?
         'gray' : this.faces[this.faces.length - 1].hairColor.toLowerCase();
      }
    }
  }
}
