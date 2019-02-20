import { Face } from './face';
import { GlassesType } from './glasses-type.enum';

export class User {
  userId: string;
  urlAvatar: string;
  name: string;
  faces: Face[];

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
      this.urlAvatar += this.faces[this.faces.length - 1].skinColor === 'caucasian' ?
      '&options[skin][]=pale' : this.faces[this.faces.length - 1].skinColor === 'black' ?
      '&options[skin][]=darkBrown' : '&options[skin][]=yellow';
      this.urlAvatar += this.faces[this.faces.length - 1].baldLevel > 0.5 ? '&options[topChance]=0' :
        '&options[topChance]=100';

      this.urlAvatar += this.faces[this.faces.length - 1].glassesType === GlassesType.ReadingGlasses ?
      '&options[accessories][]=round&options[accessoriesChance]=100' :
      this.faces[this.faces.length - 1].glassesType === GlassesType.Sunglasses ?
      '&options[accessories][]=sunglasses&options[accessoriesChance]=100' : '&options[accessoriesChance]=0';

      this.urlAvatar += this.faces[this.faces.length - 1].beardLevel > 0.5 ?
        '&options[facialHair][]=medium' : this.faces[this.faces.length - 1].baldLevel > 0.2 ?
        '&options[facialHair][]=light' : this.faces[this.faces.length - 1].moustacheLevel > 0.5 ?
        '&options[facialHair][]=magnum' : this.faces[this.faces.length - 1].moustacheLevel > 0.2 ?
        '&options[facialHair][]=fancy' : '&options[facialHair][]=magestic';

      this.urlAvatar += '&options[hairColor][]=';
      this.urlAvatar += this.faces[this.faces.length - 1].hairColor === 'Other' ?
       'black' : this.faces[this.faces.length - 1].hairColor === 'Unknown' ?
       'black' : this.faces[this.faces.length - 1].hairColor === 'Blonde' ?
       'blonde' : this.faces[this.faces.length - 1].hairColor === 'Red' ?
       'auburn' : this.faces[this.faces.length - 1].hairColor === 'White' ?
       'gray' : this.faces[this.faces.length - 1].hairColor.toLowerCase();
    }
  }
}
