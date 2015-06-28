using Incite.Cloud.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace RipThatPic.Controllers
{
    [RoutePrefix("api/groupings")]
    public class GroupingsController : _BaseController
    {


        public IEnumerable<object> Get()
        {
            var processor = GetAzureProcessor();
            var result = processor.RetrieveAll("Grouping");
            return result.AsEnumerable();

        }


        //// GET: api/Documents/gaming 
        //// have not tested yet!
        //public IEnumerable<object> Get(string grouping)
        //{

        //    var processor = GetAzureProcessor();
        //    var result = processor.RetrieveAll("Grouping", grouping);
        //    return result.AsEnumerable();

        //}




        // GET: api/groupings?name=groupname
        [HttpGet]
        public async Task<IEnumerable<object>> Get(string tablename)
        {

            var processor = GetAzureProcessor();
            var result = await processor.RetrieveAllGroupingsFromTable(tablename);

            var ret = result.Select(x => new { name = x }).ToList();
            ret.Insert(0, new { name = "-all-" });
            return ret.AsEnumerable();

        }

       
    }
    
}
