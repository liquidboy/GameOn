using System;

namespace AzureLib
{
    public class NotificationCenter
    {
        public NotificationCenter()
        {

        }

        public static string Refresh()
        {
            return DateTime.UtcNow.ToString();
        }

        public static string ClearAll()
        {
            return DateTime.UtcNow.ToString();
        }
    }
}
