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
    public class SessionController : ApiController
    {

        // GET: api/Session?name=sessionname&grouping=groupname
        public async Task<object> Get(string name, string grouping)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Session");
            return await processor.RetrieveFromTable("Session", grouping, name);
        }

        // GET: api/Session?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Session");
            return processor.RetrieveAllSessionsByName(name);
        }




        // POST: api/Session
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]SessionEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Session");
            return await processor.AddToTable("Session", data);
        }






        // DELETE: api/Session/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = await processor.DeleteSessionByDisplayId(Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Sessions/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            SessionEntity entity = new SessionEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Session", entity);

            return result;
        }


    }

    public class SessionEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public SessionEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public SessionEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }
    }
}
