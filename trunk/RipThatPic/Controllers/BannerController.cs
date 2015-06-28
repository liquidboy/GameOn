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
    public class BannerController : _BaseController
    {

        // GET: api/Banner?name=bannername&grouping=groupname
        public async Task<object> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Banner");
            return await processor.RetrieveFromTable("Banner", grouping, name);
        }

        // GET: api/Banner?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Banner");
            return processor.RetrieveAllByName("Banner", name);
        }




        // POST: api/Banner
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]BannerEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Banner");
            return await processor.AddToTable("Banner", data);
        }






        // DELETE: api/Banner/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Banner", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Banners/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            BannerEntity entity = new BannerEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Banner", entity);

            return result;
        }


    }

    public class BannerEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public BannerEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public BannerEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }
    }
}
