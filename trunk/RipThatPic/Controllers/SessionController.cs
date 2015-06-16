using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace RipThatPic.Controllers
{
    public class SessionController : ApiController
    {
        // GET: api/Session
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Session/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Session
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Session/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Session/5
        public void Delete(int id)
        {
        }
    }
}
