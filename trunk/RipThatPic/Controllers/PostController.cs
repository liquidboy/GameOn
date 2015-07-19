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

    

    public class PostController : _BaseController
    {
        
        // GET: api/Post?name=postname&grouping=groupname
        public async Task<PostRequest> Get(string name, string grouping)
        {
            var returnResult = new PostRequest();

            var processor = GetAzureProcessor();

            var postData = await processor.CreateTable("Post");

            returnResult.Post =  await processor.RetrieveFromTable<PostEntity>("Post", grouping, name);

            returnResult.FontsMetadata = GetFonts(returnResult.Post.Fonts);

            if (!string.IsNullOrEmpty(returnResult.Post.BannerPicture))
            {
                using (var ctrlFileStorage = new FileStorageController())
                {
                    returnResult.BannerPhoto = await ctrlFileStorage.Get(returnResult.Post.BannerPicture);
                }

            }

            return returnResult;
        }

        // GET: api/Post?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Post");
            return processor.RetrieveAllByName("Post", name);
        }




        // POST: api/Post
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]PostEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Post");
            return await processor.AddToTable("Post", data);
        }






        // DELETE: api/Post/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Post", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Posts/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            PostEntity entity = new PostEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Post", entity);

            return result;
        }


    }

    public class PostRequest
    {
        public PostEntity Post { get; set; }

        public List<FontEntity> FontsMetadata { get; set; }

        public Object BannerPhoto { get; set; }
    }

    public class PostEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public PostEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public PostEntity() { }

        public string LongName { get; set; }
        public string PostStyle { get; set; }
        public string Color { get; set; }
        public string Abstract { get; set; }
        public string Details { get; set; }

        public string Fonts { get; set; }

        public string PhotoGroup { get; set; }

        public string BannerPicture { get; set; }

        public Guid DisplayId { get; set; }
    }
}
