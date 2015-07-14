using Incite.Cloud.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace RipThatPic.Controllers
{
    public class pingController : _BaseController
    {

       

        // POST: api/Login
        [HttpPost]
        public void Post([FromBody]PingEntity ping)
        {
            var dt = new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(Math.Round(ping.TS / 1000d)).ToLocalTime();
            ping.ClientIP = GetClientIp();

        }




        


    }


    

    public class PingEntity 
    {
        public bool IA { get; set; }
        public long TS { get; set; }
        
        public string TID { get; set; }

        public string ClientIP { get; set; }
        

        public PingEntity() { }
    
    }
}
