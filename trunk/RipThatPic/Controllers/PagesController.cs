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
    public class PagesController : _BaseController
    {
        public PagesRequest Get()
        {
            var retPages = new PagesRequest();
            retPages.Pages = new List<PageRequest>();

            var processor = GetAzureProcessor();

            //get pages
            var pages = processor.RetrieveAll("Page").ToList();
            
            //get photos relevant to pages retrieved above
            List<Guid> pageGuids = new List<Guid>();
            foreach (PageEntity page in pages) {
                if(!string.IsNullOrEmpty(page.BannerPicture))
                    pageGuids.Add(new Guid(page.BannerPicture));
            }

            var photos  = processor.RetrieveByDisplayIds("FileStorage", pageGuids);

            //create the return entity for a page and fill it with page/photo data
            foreach(var page in pages)
            {
                var newPageRequest = new PageRequest();
                newPageRequest.Page = (PageEntity)page;
                foreach (FileStorageEntity photo in photos) {
                    if (!string.IsNullOrEmpty(newPageRequest.Page.BannerPicture)) {
                        var bpguid = new Guid(newPageRequest.Page.BannerPicture);
                        if (photo.DisplayId == bpguid) {
                            newPageRequest.BannerPhoto = photo;
                            break;
                        }
                    }
                }
                retPages.Pages.Add(newPageRequest);
            }


            return retPages;
        }


        // GET: api/Pages/gaming 
        // have not tested yet!
        public IEnumerable<object> Get(string grouping)
        {

            var processor = GetAzureProcessor();
            var result = processor.RetrieveAll("Page", grouping);
            return result.AsEnumerable();

        }
    }

    public class PagesRequest
    {        
        public List<PageRequest> Pages { get; set; }
        
    }
}
