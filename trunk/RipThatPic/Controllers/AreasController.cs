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
        // GET: api/Areas
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Areas/5
        public async Task<string> Get(int id)
        {

            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Area");

            var newArea = new AreaEntity("Xbox", "gaming") { Color="green", LongName= "Xbox One" };
            await processor.AddToTable("Area", newArea);

            return "value";
        }

        // POST: api/Areas
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Areas/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Areas/5
        public void Delete(int id)
        {
        }
    }

    //https://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-tables/

    public class AreaEntity : TableEntity
    {
        public AreaEntity(string name, string grouping)
        {
            this.PartitionKey = grouping;    //queried faster (by group)
            this.RowKey = name;  
        }

        public AreaEntity() { }

        public string LongName { get; set; }

        public string Color { get; set; }
    }
}
