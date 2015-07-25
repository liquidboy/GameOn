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
    public class ImageController : _BaseController
    {

        // GET: api/Image?name=imagename&grouping=groupname
        public async Task<ImageEntity> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Image");
            return await processor.RetrieveFromTable<ImageEntity>("Image", grouping, name);
        }

        // GET: api/Image?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Image");
            return processor.RetrieveAllByName("Image", name);
        }




        // POST: api/Image
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]ImageEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Image");
            return await processor.AddToTable("Image", data);
        }






        // DELETE: api/Image/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Image", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Image/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            ImageEntity entity = new ImageEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Image", entity);

            return result;
        }


    }


    public class ImageEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public ImageEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public ImageEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }

        public Guid FileStorageDisplayId { get; set; }
        
    }
}
