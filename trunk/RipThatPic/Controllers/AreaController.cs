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
    public class AreaController : _BaseController
    {



        // GET: api/Area?name=areaname&grouping=groupname
        public async Task<object> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Area");
            return await processor.RetrieveFromTable("Area", grouping, name);
        }

        // GET: api/Area?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Area");
            return processor.RetrieveAllByName("Area", name);
        }




        // POST: api/Area
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]AreaEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Area");
            return await processor.AddToTable("Area", data);
        }






        // DELETE: api/Area/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Area", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Areas/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            AreaEntity entity = new AreaEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Area", entity);

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
