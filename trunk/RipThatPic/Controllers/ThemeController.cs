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
    public class ThemeController : _BaseController
    {

        // GET: api/Theme?name=themename&grouping=groupname
        public async Task<object> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Theme");
            return await processor.RetrieveFromTable("Theme", grouping, name);
        }

        // GET: api/Theme?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Theme");
            return processor.RetrieveAllByName("Theme", name);
        }




        // POST: api/Theme
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]ThemeEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Theme");
            return await processor.AddToTable("Theme", data);
        }






        // DELETE: api/Theme/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Theme", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Themes/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            ThemeEntity entity = new ThemeEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Theme", entity);

            return result;
        }


    }

    public class ThemeEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public ThemeEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public ThemeEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }
    }
}
