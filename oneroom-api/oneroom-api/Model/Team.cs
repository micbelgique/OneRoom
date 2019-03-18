using System;
using System.Collections.Generic;
using System.Drawing;

namespace oneroom_api.Model
{
    public class Team
    {
        // All possible names
        private static readonly List<string> TeamNames = new List<string>(new String[] {
            "alpha", "bravo", "charlie", "delta", "echo", "foxtrot",
            "golf", "hotel", "india", "juliet", "kilo", "lima",
            "mike", "november", "oscar", "papa", "quebec", "romeo",
            "sierra", "tango", "uniform", "victor", "whiskey", "xray",
            "yankee", "zulu" });

        public int TeamId { get; set; }
        // unique name to identify team
        public string TeamName { get; set; }
        // unique color to identify team
        public string TeamColor { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public List<User> Users { get; set; } = new List<User>();
        public int GameId { get; set; }

        public static string RandomName()
        {
            var random = new Random();
            var r = random.Next(TeamNames.Count);
            return TeamNames[r];
        }

        public static Color RandomColor()
        {
            var random = new Random();
            var randomColor = Color.FromArgb(random.Next(256), random.Next(256), random.Next(256));
            return randomColor;
        }
    }
}
