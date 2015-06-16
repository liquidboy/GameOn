using Incite.Cloud.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace RipThatPic.Controllers
{
    public class AreasController : ApiController
    {
        // GET: api/Areas
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Areas/5
        public async Task<string> Get(int id)
        {

            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);

            var ret = await processor.CreateTable("test");
            ret = await processor.DeleteTable("test");

            return "value";
        }

        // POST: api/Areas
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Areas/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Areas/5
        public void Delete(int id)
        {
        }
    }
}
