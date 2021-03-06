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
    public class FileStorageController : _BaseController
    {

        // GET: api/FileStorage?name=filestorage&grouping=groupname
        public async Task<FileStorageEntity> Get(string name, string grouping)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("FileStorage");
            return await processor.RetrieveFromTable<FileStorageEntity>("FileStorage", grouping, name);
        }

        // GET: api/FileStorage?grouping=groupname
        public async Task<object> Get(string displayId)
        {
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("FileStorage");
            return processor.RetrieveByDisplayId("FileStorage", new Guid(displayId));
        }




        // POST: api/FileStorage
        [HttpPost]
        //public async void Post([FromBody]string name, [FromBody]string grouping, [FromBody]string color, [FromBody]string longName)
        public async Task<int> Post([FromBody]FileStorageEntity data)
        {
            if (data.DisplayId == Guid.Empty) data.DisplayId = Guid.NewGuid();
            var processor = GetAzureProcessor();
            var ret = await processor.CreateTable("FileStorage");
            return await processor.AddToTable("FileStorage", data);
        }






        //// DELETE: api/FileStorage/guid
        //[HttpDelete]
        //public async Task<int> Delete([FromUri]string displayid)
        //{
        //    var processor = GetAzureProcessor();
        //    var result = await processor.DeleteByDisplayId("FileStorage", Guid.Parse(displayid));
        //    await processor.DeleteBlobAsync("temp-upload", displayid);
        //    await processor.DeleteBlobAsync("temp-upload-thumb", displayid);
        //    return result;
        //}


        //// DELETE: api/FileStorages/5
        //[HttpDelete]
        //public async Task<int> Delete([FromUri]string grouping, [FromUri]string name)
        //{
        //    var processor = GetAzureProcessor();
        //    FileStorageEntity entity = new FileStorageEntity(name, grouping);
        //    entity.ETag = "*";
        //    var result = await processor.DeleteFromTable("FileStorage", entity);
        //    await processor.DeleteBlobAsync("temp-upload", name);
        //    await processor.DeleteBlobAsync("temp-upload-thumb", name);
        //    return result;
        //}


    }

    public class FileStorageEntity : TableEntity
    {
        private string _name;
        public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


        private string _grouping;
        public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

        public FileStorageEntity(string name, string grouping)
        {
            this.Name = name;
            this.Grouping = grouping;
        }

        public FileStorageEntity() { }

        public string OriginalFileName { get; set; }
        public string ContentType { get; set; }
        public long Size { get; set; }

        public Guid DisplayId { get; set; }
    }
}
