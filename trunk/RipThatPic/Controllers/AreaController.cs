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
    public class AreaController : ApiController
    {
        // GET: api/Area
        public IEnumerable<string> Get()
        {
            return new string[] { "area", "value2" };
        }

        // GET: api/Area?name=areaname&grouping=groupname
        public async Task<object> Get(string name, string grouping)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Area");
            return await processor.RetrieveFromTable("Area", grouping, name);
        }

        // GET: api/Area?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Area");
            return await processor.RetrieveAllAreasByName(name);
        }

        // POST: api/Area
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Area/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Area/5
        public void Delete(int id)
        {
        }

        // DELETE: api/Area/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = await processor.DeleteAreaByDisplayId( Guid.Parse(displayid));
            return result;
        }
    }





    public class AreaEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public AreaEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public AreaEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }

        public Guid DisplayId { get; set; }
    }
}
