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
    public class VersionsController : ApiController
    {
        public IEnumerable<object> Get()
        {
            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = processor.RetrieveAll("Version");
            return result.AsEnumerable();

        }


        // GET: api/Versions/gaming 
        // have not tested yet!
        public IEnumerable<object> Get(string grouping)
        {

            AzureProcessor processor = new AzureProcessor(AzureProcessor.Location.Sydney);
            var result = processor.RetrieveAll("Version", grouping);
            return result.AsEnumerable();

        }




       


    }


}
