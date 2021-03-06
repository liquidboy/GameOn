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
    public class ExtensionController : _BaseController
    {

        // GET: api/Extension?name=extensionname&grouping=groupname
        public async Task<ExtensionEntity> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Extension");
            return await processor.RetrieveFromTable<ExtensionEntity>("Extension", grouping, name);
        }

        // GET: api/Extension?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Extension");
            return processor.RetrieveAllByName("Extension", name);
        }




        // POST: api/Extension
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]ExtensionEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Extension");
            return await processor.AddToTable("Extension", data);
        }






        // DELETE: api/Extension/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Extension", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Extensions/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            ExtensionEntity entity = new ExtensionEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Extension", entity);

            return result;
        }


    }

    public class ExtensionEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public ExtensionEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public ExtensionEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public bool IsExtensionLiteEnabled { get; set; }
        public string ExtensionStyleLite { get; set; }
        public string ExtensionScriptLite { get; set; }
        public string ExtensionHtmlLite { get; set; }

        public bool IsExtensionEnabled { get; set; }
        public string ExtensionStyle { get; set; }
        public string ExtensionScript { get; set; }
        public string ExtensionHtml { get; set; }

        public Guid DisplayId { get; set; }
    }
}
