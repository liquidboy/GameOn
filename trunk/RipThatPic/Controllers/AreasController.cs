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
        public IEnumerable<object> Get()
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = processor.RetrieveAllAreas();
            return result.Select(x => new { x.Name, x.Grouping, x.LongName,  x.Color, x.DisplayId }).AsEnumerable();

        }


        // GET: api/Areas/gaming 
        // have not tested yet!
        public IEnumerable<object> Get(string grouping)
        {

            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = processor.RetrieveAllAreas(grouping);
            return result.Select(x => new { x.Name, x.Grouping, x.LongName, x.Color, x.DisplayId }).AsEnumerable();

        }

        // GET: api/Areas?name=Xbox&grouping=gaming    <-- case sensitive
        public async Task<object> Get(string name, string grouping)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Area");
            return await processor.RetrieveFromTable("Area", grouping, name);
        }


        // POST: api/Areas
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]AreaEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Area");
            return await processor.AddToTable("Area", data);
        }

       


        // DELETE: api/Areas/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            AreaEntity entity = new AreaEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Area", entity);

            return result;
        }
    }

    //https://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-tables/

 
}
