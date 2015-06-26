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
    [RoutePrefix("api/comments")]
    public class CommentsController : ApiController
    {
        public IEnumerable<object> Get()
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = processor.RetrieveAll("Comment");
            return result.AsEnumerable();

        }


        // GET: api/Comments/gaming 
        // have not tested yet!
        public IEnumerable<object> Get(string grouping)
        {

            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = processor.RetrieveAll("Comment", grouping);
            return result.AsEnumerable();

        }

        // GET: api/comments/groupings
        [HttpGet]
        [Route("groupings")]
        public async Task<IEnumerable<string>> GetAllGroupings()
        {

            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result =   await processor.RetrieveAllGroupingsFromTable("Comment");

            return result.AsEnumerable();

        }

    }


}
