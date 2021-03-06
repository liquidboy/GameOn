﻿using Incite.Cloud.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;

namespace RipThatPic.Controllers
{
    public class GroupingController : _BaseController
    {

        // GET: api/Grouping?name=groupingname&grouping=groupname
        public async Task<GroupingEntity> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Grouping");
            return await processor.RetrieveFromTable<GroupingEntity>("Grouping", grouping, name);
        }

        // GET: api/Grouping?grouping=groupname
        public async Task<IEnumerable<object>> Get(string name)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Grouping");
            return processor.RetrieveAllByName("Grouping", name);
        }




        // POST: api/Grouping
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]GroupingEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("Grouping");
            return await processor.AddToTable("Grouping", data);
        }






        // DELETE: api/Grouping/guid
        [HttpDelete]
        public async Task<int> Delete([FromUri]string displayid)
        {
            var processor = GetAzureProcessor();
            var result = await processor.DeleteByDisplayId("Grouping", Guid.Parse(displayid));
            return result;
        }


        // DELETE: api/Groupings/5
        [HttpDelete]
        public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        {
            var processor = GetAzureProcessor();
            GroupingEntity entity = new GroupingEntity(name, grouping);
            entity.ETag = "*";
            var result = await processor.DeleteFromTable("Grouping", entity);

            return result;
        }


    }

    public class GroupingEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public GroupingEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public GroupingEntity() { }

        public string TableName { get; set; }
        public string GroupingName { get; set; }

        public string DisplayName { get; set; }
        public string Icon { get; set; }

        public Guid DisplayId { get; set; }
    }
}
