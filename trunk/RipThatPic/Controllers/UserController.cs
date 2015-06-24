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
    public class UserController : ApiController
    {

        // GET: api/User?name=username&grouping=groupname
        public async Task<object> Get(string name, string grouping)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("User");
            return await processor.RetrieveFromTable("User", grouping, name);
        }

        // GET: api/User?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("User");
            return processor.RetrieveAllUsersByName(name);
        }




        // POST: api/User
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]UserEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var ret = await processor.CreateTable("User");
            return await processor.AddToTable("User", data);
        }






        // DELETE: api/User/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = await processor.DeleteUserByDisplayId(Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Users/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            UserEntity entity = new UserEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("User", entity);

            return result;
        }


    }

    public class UserEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public UserEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public UserEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }
    }
}
