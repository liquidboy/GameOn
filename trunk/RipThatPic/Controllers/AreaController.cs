using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace RipThatPic.Controllers
{
    public class AreaController : ApiController
    {
        // GET: api/Area
        public IEnumerable<string> Get()
        {
            return new string[] { "area", "value2" };
        }

        // GET: api/Area/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Area
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Area/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Area/5
        public void Delete(int id)
        {
        }
    }
}
