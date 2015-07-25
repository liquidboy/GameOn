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
    public class VideoController : _BaseController
    {

        // GET: api/Video?name=videoname&grouping=groupname
        public async Task<VideoEntity> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Video");
            return await processor.RetrieveFromTable<VideoEntity>("Video", grouping, name);
        }

        // GET: api/Video?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Video");
            return processor.RetrieveAllByName("Video", name);
        }




        // POST: api/Video
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]VideoEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Video");
            return await processor.AddToTable("Video", data);
        }






        // DELETE: api/Video/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Video", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Videos/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            VideoEntity entity = new VideoEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Video", entity);

            return result;
        }


    }

    public class VideoEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public VideoEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public VideoEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }

        public Guid FileStorageDisplayId { get; set; }
    }
}
