import { Face } from './face';
import { GlassesType } from './glasses-type.enum';

export class User {
  username: string;
  urlAvatar: string;
  personId: string;
  name: string;
  faces: Face[];
  constructor() {}
  generateAvatar(): void {
    if (this.faces && this.faces.length) {
      this.urlAvatar = this.faces[0].isMale ?
      // tslint:disable-next-line:max-line-length
      'https://avatars.dicebear.com/v2/avataaars/OneRoomMale.svg?options[facialHairChance]=100&options[clothes][]=blazer&options[eyes][]=defaultValue&options[eyebrow][]=defaultValue&options[mouth][]=serious&options[skin][]=light' :
      // tslint:disable-next-line:max-line-length
      'https://avatars.dicebear.com/v2/avataaars/OneRoomFemale.svg?options[facialHairChance]=100&options[clothes][]=blazer&options[eyes][]=defaultValue&options[eyebrow][]=defaultValue&options[mouth][]=serious&options[skin][]=light';

      this.urlAvatar += this.faces[0].baldLevel > 0.5 ? '&options[topChance]=0' :
        '&options[topChance]=100';

      this.urlAvatar += this.faces[0].glassesType === GlassesType.ReadingGlasses ?
      '&options[accessories][]=round&options[accessoriesChance]=100' :
      this.faces[0].glassesType === GlassesType.Sunglasses ?
      '&options[accessories][]=sunglasses&options[accessoriesChance]=100' : '&options[accessoriesChance]=0';

      this.urlAvatar += this.faces[0].beardLevel > 0.5 ?
        '&options[facialHair][]=medium' : this.faces[0].baldLevel > 0.2 ?
        '&options[facialHair][]=light' : this.faces[0].moustacheLevel > 0.5 ?
        '&options[facialHair][]=magnum' : this.faces[0].moustacheLevel > 0.2 ?
        '&options[facialHair][]=fancy' : '&options[facialHair][]=magestic';

      this.urlAvatar += '&options[hairColor][]=' + this.faces[0].hairColor === 'Other' ?
       'black' : this.faces[0].hairColor === 'Unknown' ?
       'black' : this.faces[0].hairColor === 'Blond' ?
       'blonde' : this.faces[0].hairColor === 'Red' ?
       'auburn' : this.faces[0].hairColor === 'White' ?
       'gray' : this.faces[0].hairColor.toLocaleLowerCase;
    }
  }
}
