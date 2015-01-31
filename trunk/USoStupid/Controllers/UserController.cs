using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace USoStupid.Controllers
{
    public class UserController : ApiController
    {

        public User Get(int id)
        {
            return new User { Id = id, Name = "Jose Fajardo" };
        }

    }



    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
