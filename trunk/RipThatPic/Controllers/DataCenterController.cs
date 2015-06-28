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
    public class DataCenterController : _BaseController
    {

        // GET: api/DataCenter?name=datacentername&grouping=groupname
        public async Task<object> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("DataCenter");
            return await processor.RetrieveFromTable("DataCenter", grouping, name);
        }

        // GET: api/DataCenter?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("DataCenter");
            return processor.RetrieveAllByName("DataCenter", name);
        }




        // POST: api/DataCenter
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]DataCenterEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("DataCenter");
            return await processor.AddToTable("DataCenter", data);
        }






        // DELETE: api/DataCenter/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("DataCenter", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/DataCenters/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            DataCenterEntity entity = new DataCenterEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("DataCenter", entity);

            return result;
        }


    }

    public class DataCenterEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public DataCenterEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public DataCenterEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }
    }
}
