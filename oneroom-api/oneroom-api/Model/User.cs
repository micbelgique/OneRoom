using oneroom_api.Utilities;
using System.Text;

namespace oneroom_api.Model
{
    public class User : Person
    {
        private static int nbUser = 0;
        public int UserId { get; set; }
        public string Username { get; set; }
        public string UrlAvatar { get; set; }

        public User() { }

        public User(Person p) : base(p)
        {
            Username = "Joueur " + ++nbUser;
            UrlAvatar = GenerateUrlAvatar();
        }

        public string GenerateUrlAvatar()
        {
            Face face = this.Faces?[0];
            if (face == null) return null;

            StringBuilder url = new StringBuilder(face.IsMale ? "https://avatars.dicebear.com/v2/avataaars/OneRoomMale.svg?options[facialHairChance]=100&options[clothes][]=blazer&options[eyes][]=defaultValue&options[eyebrow][]=defaultValue&options[mouth][]=serious&options[skin][]=light" : "https://avatars.dicebear.com/v2/avataaars/OneRoomFemale.svg?options[facialHairChance]=100&options[clothes][]=blazer&options[eyes][]=defaultValue&options[eyebrow][]=defaultValue&options[mouth][]=serious&options[skin][]=light");
            url.Append(face.BaldLevel > 0.5 ? "&options[topChance]=0" : "&options[topChance]=100");// Set if the avatar is bald
            url.Append(face.GlassesType == Microsoft.Azure.CognitiveServices.Vision.Face.Models.GlassesType.ReadingGlasses ? "&options[accessories][]=round&options[accessoriesChance]=100" : face.GlassesType == Microsoft.Azure.CognitiveServices.Vision.Face.Models.GlassesType.Sunglasses ? "&options[accessories][]=sunglasses&options[accessoriesChance]=100" : "&options[accessoriesChance]=0");// Set if the avatar has glasses
            url.Append(face.BeardLevel > 0.5 ? "&options[facialHair][]=medium" : face.BeardLevel > 0.2 ? "&options[facialHair][]=light" : face.MoustacheLevel > 0.5 ? "&options[facialHair][]=magnum" : face.MoustacheLevel > 0.2 ? "&options[facialHair][]=fancy" : "&options[facialHair][]=magestic");// Add a beard, a mustache or... nothing !
            url.Append("&options[hairColor][]=" + AvataaarsUtilities.ToColorAvataaars(face.HairColor) + "&options[facialHairColor][]=" + AvataaarsUtilities.ToColorAvataaars(face.HairColor));// Set the hair color of the avatar

            return url.ToString();
        }
    }
}
