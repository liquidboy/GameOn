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
    public class LinkController : _BaseController
    {

        // GET: api/Link?name=linkname&grouping=groupname
        public async Task<LinkEntity> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Link");
            return await processor.RetrieveFromTable<LinkEntity>("Link", grouping, name);
        }

        // GET: api/Link?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Link");
            return processor.RetrieveAllByName("Link", name);
        }




        // POST: api/Link
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]LinkEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Link");
            return await processor.AddToTable("Link", data);
        }






        // DELETE: api/Link/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Link", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Links/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            LinkEntity entity = new LinkEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Link", entity);

            return result;
        }


    }

    public class LinkEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public LinkEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public LinkEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }

        public string Target { get; set; }

        public Guid DisplayId { get; set; }
    }
}
