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
    public class CommentController : _BaseController
    {

        // GET: api/Comment?name=commentname&grouping=groupname
        public async Task<object> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Comment");
            return await processor.RetrieveFromTable("Comment", grouping, name);
        }

        // GET: api/Comment?name=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Comment");
            return processor.RetrieveAllByName("Comments", name);
        }




        // POST: api/Comment
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]CommentEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Comment");
            return await processor.AddToTable("Comment", data);
        }






        // DELETE: api/Comment/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Comment", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Comments/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            CommentEntity entity = new CommentEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Comment", entity);

            return result;
        }


    }

    public class CommentEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public CommentEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public CommentEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }
    }
}
