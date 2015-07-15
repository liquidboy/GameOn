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
        public async Task<bool> Post([FromBody]PingEntity ping)
        {
            var dt = new DateTime(1970, 1, 1, 0, 0, 0, 0).AddSeconds(Math.Round(ping.TS / 1000d)).ToLocalTime();
            ping.ClientIP = GetClientIp();


            var session = new SessionEntity(string.Format("{0}-{1}", ping.SID , ping.ClientIP), "ping");
            session.DisplayId = Guid.NewGuid();

            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Session");
            await processor.AddToTable("Session", session);

            return true;

        }




        


    }


    

    public class PingEntity
    {
        

        public bool IA { get; set; }
        public long TS { get; set; }
        
        public string TID { get; set; }
        public string SID { get; set; }

        public string ClientIP { get; set; }
        

        public PingEntity() { }
    
    }
}
