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
    public class AudioController : _BaseController
    {

        // GET: api/Audio?name=documentname&grouping=groupname
        public async Task<AudioEntity> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Audio");
            return await processor.RetrieveFromTable<AudioEntity>("Audio", grouping, name);
        }

        // GET: api/Audio?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Audio");
            return processor.RetrieveAllByName("Audio", name);
        }




        // POST: api/Audio
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]AudioEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Audio");
            return await processor.AddToTable("Audio", data);
        }






        // DELETE: api/Audio/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Audio", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Audios/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            AudioEntity entity = new AudioEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Audio", entity);

            return result;
        }


    }

    public class AudioEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public AudioEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public AudioEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }
    }
}
