using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace USoStupid.Controllers
{
    public class FileController : ApiController
    {

        public File Get(int id)
        {
            

            return new File() { Id = 1, Name = "test.jpg" };
        }

        public int Post(string content, string fileName)
        {
            return 0;
        }

    }


    public class File
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
