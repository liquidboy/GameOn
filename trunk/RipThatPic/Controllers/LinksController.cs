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
    public class LinksController : ApiController
    {
        public IEnumerable<object> Get()
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = processor.RetrieveAll("Link");
            return result.AsEnumerable();

        }


        // GET: api/Links/gaming 
        // have not tested yet!
        public IEnumerable<object> Get(string grouping)
        {

            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = processor.RetrieveAll("Link", grouping);
            return result.AsEnumerable();

        }




       


    }


}