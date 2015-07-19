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
    public class PageController : _BaseController
    {

        // GET: api/Page?name=pagename&grouping=groupname
        public async Task<PageRequest> Get(string name, string grouping)
        {
            var returnResult = new PageRequest();

            var processor = GetAzureProcessor();

            var pageData = await processor.CreateTable("Page");

            returnResult.Page =  await processor.RetrieveFromTable<PageEntity>("Page", grouping, name);

            returnResult.FontsMetadata = GetFonts(returnResult.Page.Fonts);

            using (var PostsCtrl = new PostsController())
            {
                var postGroup = grouping + "|" + name;
                returnResult.Posts = PostsCtrl.Get(postGroup.ToLower());
            }

            if (!string.IsNullOrEmpty(returnResult.Page.BannerPicture)) {
                using(var ctrlFileStorage = new FileStorageController())
                {
                    returnResult.BannerPhoto = await ctrlFileStorage.Get(returnResult.Page.BannerPicture);
                }
                
            }
            


            return returnResult;

        }

        // GET: api/Page?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Page");
            return processor.RetrieveAllByName("Page", name);
        }




        // POST: api/Page
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]PageEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Page");
            return await processor.AddToTable("Page", data);
        }






        // DELETE: api/Page/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Page", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Pages/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            PageEntity entity = new PageEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Page", entity);

            return result;
        }


    }

    public class PageRequest 
    {
        public PageEntity Page { get; set; }

        public List<FontEntity> FontsMetadata { get; set; }

        public IEnumerable<Object> Posts { get; set; }

        public Object BannerPhoto { get; set; }
    }

    public class PageEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public PageEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public PageEntity() { }

        public string LongName { get; set; }
        public string PageStyle { get; set; }

        public string Description { get; set; }

        public string Fonts { get; set; }

        public string BannerPicture { get; set; }

        public Guid DisplayId { get; set; }
    }
}
