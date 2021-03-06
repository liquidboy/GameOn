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
    public class VersionController : _BaseController
    {

        // GET: api/Version?name=versionname&grouping=groupname
        public async Task<VersionEntity> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Version");
            return await processor.RetrieveFromTable<VersionEntity>("Version", grouping, name);
        }

        // GET: api/Version?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Version");
            return processor.RetrieveAllByName("Version", name);
        }




        // POST: api/Version
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]VersionEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Version");
            return await processor.AddToTable("Version", data);
        }






        // DELETE: api/Version/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Version", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Versions/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            VersionEntity entity = new VersionEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Version", entity);

            return result;
        }


    }

    public class VersionEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public VersionEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public VersionEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }
    }
}
