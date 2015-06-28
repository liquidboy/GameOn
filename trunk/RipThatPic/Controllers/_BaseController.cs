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
    public class _BaseController : ApiController
    {

        internal AzureProcessor GetAzureProcessor()
        {
            return new AzureProcessor(AzureProcessor.Location.Sydney); 
        }

    }




    
}
