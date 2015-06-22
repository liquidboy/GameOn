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
    public class AreasController : ApiController
    {
        public async Task<IEnumerable<object>> Get()
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = await processor.RetrieveAllAreas("Area");
            return result.Select(x => new { x.Name, x.Grouping, x.LongName,  x.Color }).AsEnumerable();

        }


        // GET: api/Areas/gaming 
        // have not tested yet!
        public async Task<IEnumerable<object>> Get(string grouping)
        {

            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = await  processor.RetrieveAllAreas("Area", grouping);
            return result.Select(x => new { x.Name, x.Grouping, x.LongName, x.Color }).AsEnumerable();

        }

        // GET: api/Areas?name=Xbox&grouping=gaming    <-- case sensitive
        public async Task<object> Get(string name, string grouping)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Area");

            var result = await processor.RetrieveFromTable("Area", grouping, name);

            return result;
        }


        // POST: api/Areas
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]AreaEntity data)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Area");
            var id = await processor.AddToTable("Area", data);
            return id;
        }

       


        // DELETE: api/Areas/5
        [HttpDelete]
        public async void Delete([FromUri]string grouping, [FromUri]string name)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            AreaEntity entity = new AreaEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Area", entity);

        }
    }

    //https://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-tables/

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
        
    }
}
