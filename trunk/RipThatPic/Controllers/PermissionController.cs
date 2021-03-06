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
    public class PermissionController : _BaseController
    {

        // GET: api/Permission?name=permissionname&grouping=groupname
        public async Task<PermissionEntity> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Permission");
            return await processor.RetrieveFromTable<PermissionEntity>("Permission", grouping, name);
        }

        // GET: api/Permission?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Permission");
            return processor.RetrieveAllByName("Permission", name);
        }




        // POST: api/Permission
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]PermissionEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Permission");
            return await processor.AddToTable("Permission", data);
        }






        // DELETE: api/Permission/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Permission", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Permissions/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            PermissionEntity entity = new PermissionEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Permission", entity);

            return result;
        }


    }

    public class PermissionEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public PermissionEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public PermissionEntity() { }

        public string LongName { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }

        public Guid DisplayId { get; set; }
    }
}
