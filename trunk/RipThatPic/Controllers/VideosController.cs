﻿using Incite.Cloud.Storage;
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
    public class VideosController : _BaseController
    {
        public IEnumerable<object> Get()
        {
            var processor = GetAzureProcessor();
            var result = processor.RetrieveAll("Video");
            return result.AsEnumerable();

        }


        // GET: api/Videos/gaming 
        // have not tested yet!
        public IEnumerable<object> Get(string grouping)
        {

            var processor = GetAzureProcessor();
            var result = processor.RetrieveAll("Video" , grouping);
            return result.AsEnumerable();

        }




       


    }


}
