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
    public class DocumentController : ApiController
    {

        // GET: api/Document?name=documentname&grouping=groupname
        public async Task<object> Get(string name, string grouping)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Document");
            return await processor.RetrieveFromTable("Document", grouping, name);
        }

        // GET: api/Document?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Document");
            return processor.RetrieveAllByName("Document", name);
        }




        // POST: api/Document
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]DocumentEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("Document");
            return await processor.AddToTable("Document", data);
        }






        // DELETE: api/Document/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = await processor.DeleteByDisplayId("Document", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Documents/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            DocumentEntity entity = new DocumentEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Document", entity);

            return result;
        }


    }

    public class DocumentEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public DocumentEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public DocumentEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }
    }
}
