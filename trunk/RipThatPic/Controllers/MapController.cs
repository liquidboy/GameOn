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
    public class MapController : _BaseController
    {

        // GET: api/Map?name=mapname&grouping=groupname
        public async Task<MapEntity> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Map");
            return await processor.RetrieveFromTable<MapEntity>("Map", grouping, name);
        }

        // GET: api/Map?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Map");
            return processor.RetrieveAllByName("Map", name);
        }




        // POST: api/Map
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]MapEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Map");
            return await processor.AddToTable("Map", data);
        }






        // DELETE: api/Map/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Map", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Maps/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            MapEntity entity = new MapEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Map", entity);

            return result;
        }


    }

    public class MapEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public MapEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public MapEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }
    }
}
