using Incite.Cloud.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace RipThatPic.Controllers
{
    [RoutePrefix("api/groupings")]
    public class GroupingsController : ApiController
    {

        // GET: api/groupings?name=groupname
        [HttpGet]
        public async Task<IEnumerable<object>> Get(string tablename)
        {

            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = await processor.RetrieveAllGroupingsFromTable(tablename);

            return result.Select(x => new { name = x  }).AsEnumerable();

        }

       
    }
    
}
