using Incite.Cloud.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;

namespace RipThatPic.Controllers
{
    public class GroupingController : ApiController
    {

        // GET: api/Grouping?name=groupingname&grouping=groupname
        public async Task<object> Get(string name, string grouping)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Grouping");
            return await processor.RetrieveFromTable("Grouping", grouping, name);
        }

        // GET: api/Grouping?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Grouping");
            return processor.RetrieveAllByName("Grouping", name);
        }




        // POST: api/Grouping
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]GroupingEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Grouping");
            return await processor.AddToTable("Grouping", data);
        }






        // DELETE: api/Grouping/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = await processor.DeleteByDisplayId("Grouping", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Groupings/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            GroupingEntity entity = new GroupingEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Grouping", entity);

            return result;
        }


    }

    public class GroupingEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public GroupingEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public GroupingEntity() { }

        public string TableName { get; set; }
        public string GroupingName { get; set; }

        public Guid DisplayId { get; set; }
    }
}
