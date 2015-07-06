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
    public class UploadController : _BaseController
    {

       


        // POST: api/Upload
        [HttpPost]
        public int Post([FromBody]object data)
        {

            return 0;
        }




        


    }
    
}
