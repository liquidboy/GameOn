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
            ping.UA = GetUserAgent();


            var session = new SessionEntity(string.Format("{0}", ping.ClientIP), "ping");
            //session.DisplayId = Guid.NewGuid();
            session.LatestPing = ping.ToString();
            session.ModifiedDateTime = DateTime.UtcNow;
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Session");
            await processor.AddToTable("Session", session);

            return true;

        }



        // GET: api/Session?name=sessionname&grouping=groupname
        public async Task<PingEntity> Get([FromBody]PingEntity ping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Session");
            var session =  await processor.RetrieveFromTable<SessionEntity>("Session", "ping", ping.ClientIP);

            ping.FromString(session.LatestPing);

            return ping;
        }



    }


    

    public class PingEntity
    {
        

        public bool IA { get; set; }
        public long TS { get; set; }
        
        public string TID { get; set; }
        public string SID { get; set; }

        public string ClientIP { get; set; }
        public string UA { get; set; }



        public PingEntity() { }



        //using this format for serialization/deserialization over json/xml because i want this as fast and light weight as humanly possible
        public override string ToString() {
            return string.Format("{0}|{1}|{2}|{3}|{4}|{5}", this.IA, this.TS, this.TID, this.SID, this.ClientIP, this.UA);
        }

        public void FromString(string value) {
            var parts = value.Split("|".ToCharArray());

            IA = bool.Parse(parts[0]);
            TS = long.Parse(parts[1]);
            TID = parts[2];
            SID = parts[3];
            ClientIP = parts[4];
            UA = parts[5];
        }
    
    }
}
