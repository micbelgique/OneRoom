namespace oneroom_api.Utilities
{
    public static class AvataaarsUtilities
    {
        public static string ToColorAvataaars(string color)
        {
            switch (color)
            {
                case "Other":
                case "Unknown":
                    return "black";
                case "Blond":
                    return "blonde";
                case "Red":
                    return "auburn";
                case "White":
                    return "gray";
                default:
                    return color.ToLower();
            }
        }
    }
}