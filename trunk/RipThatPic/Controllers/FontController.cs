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
    public class FontController : _BaseController
    {

        // GET: api/Font?name=documentname&grouping=groupname
        public async Task<FontEntity> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Font");
            return await processor.RetrieveFromTable<FontEntity>("Font", grouping, name);
        }

        // GET: api/Font?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Font");
            return processor.RetrieveAllByName("Font", name);
        }




        // POST: api/Font
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]FontEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Font");
            return await processor.AddToTable("Font", data);
        }






        // DELETE: api/Font/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Font", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Fonts/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            FontEntity entity = new FontEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Font", entity);

            return result;
        }


    }

    public class FontEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public FontEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public FontEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }
    }
}
