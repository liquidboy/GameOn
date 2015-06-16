using System;

namespace Incite.Cloud
{

    public class LogData
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public string Type { get; set; }
        public string SubType { get; set; }
        public double Amount { get; set; }
        public double AmountDuration { get; set; }
        public string UserHostName { get; set; }
        public string UserIPAddresses { get; set; }
        public DateTime DateCreated { get; set; }
    }

    public class LogDataDisplay
    {
        public string Text { get; set; }
        public string Type { get; set; }
        public string SubType { get; set; }
        public double Amount { get; set; }
        public double AmountDuration { get; set; }
        public string UserHostName { get; set; }
        public string UserIPAddresses { get; set; }
    }
}
