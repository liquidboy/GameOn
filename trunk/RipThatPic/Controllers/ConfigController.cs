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
    public class ConfigController : _BaseController
    {

        public object Get()
        {
            
            ConfigEntity ret = new ConfigEntity();

            
            var processor = GetAzureProcessor();

            ret.Pages = processor.RetrieveAll("Page").AsEnumerable();
            ret.Banners = processor.RetrieveAll("Banner").AsEnumerable();
            ret.Areas = processor.RetrieveAll("Area").AsEnumerable();
            ret.Datacenters = processor.RetrieveAll("DataCenter").AsEnumerable();
            ret.Services = processor.RetrieveAll("Service").AsEnumerable();

            return ret;

        }

    }





    public class ConfigEntity
    {
        public IEnumerable<ITableEntity> Pages { get; set; }
        public IEnumerable<ITableEntity> Banners { get; set; }
        public IEnumerable<ITableEntity> Areas { get; set; }
        public IEnumerable<ITableEntity> Datacenters { get; set; }
        public IEnumerable<ITableEntity> Services { get; set; }


        public ConfigEntity() { }
        
    }
}
