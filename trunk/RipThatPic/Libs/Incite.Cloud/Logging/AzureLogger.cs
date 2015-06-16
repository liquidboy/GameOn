//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using Microsoft.WindowsAzure.MobileServices;
//using System.Net;
//using System.Dynamic;

//namespace Incite.Cloud.Logging
//{
//    public class AzureLogger : ILogger
//    {

//        private static MobileServiceClient _mobileService;
//        private static string _usersHostName;
//        private static string _usersIPAddresses;

//        public AzureLogger(MobileServiceClient ms)
//        {
//            _mobileService = ms;

//            try
//            {
//                var usersIPHost = System.Net.Dns.GetHostEntry(System.Net.Dns.GetHostName());

//                _usersHostName = usersIPHost.HostName;

//                foreach (var ipAddress in usersIPHost.AddressList)
//                {
//                    _usersIPAddresses += ipAddress.ToString() + "|";
//                }

//            }
//            catch { }
            
//        }

//        public async Task<bool> LogInfo(string type, string content)
//        {
//            return await LogInfo(type, string.Empty, 0, 0, content);
//        }

//        public async Task<bool> LogInfo(string type, string subType, double amount, double amountDuration, string content)
//        {
//            try
//            {
//                LogData item = new LogData { Type = type, SubType = subType, Amount = amount, AmountDuration = amountDuration, Text = content, UserHostName = _usersHostName, UserIPAddresses = _usersIPAddresses, DateCreated = DateTime.UtcNow };
//                await _mobileService.GetTable<LogData>().InsertAsync(item);
//                return true;
//            }
//            catch (Exception ex)
//            {

//            }
//            return false;
//        }

//        public async Task<List<LogDataDisplay>> GetResults(string query)
//        {
//            var logDataTable = _mobileService.GetTable<LogData>();

//            var results = logDataTable
//                .OrderByDescending(x => x.DateCreated)
//                .Select(x => new LogDataDisplay { Text = x.Text, Type = x.Type, UserHostName = x.UserHostName , UserIPAddresses = x.UserIPAddresses })
//                .Take(500);

//            return await results.ToListAsync() ;

//        }


//    }



//}
