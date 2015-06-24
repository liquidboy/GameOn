

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.WindowsAzure.Storage.Table;
using Incite.Cloud;
using System.IO;
using System;
using RipThatPic.Controllers;

namespace Incite.Cloud.Storage
{
    public class AzureProcessor : IStorageProcessor
    {
        private const string ConnectionStrLayout = "BlobEndpoint={0};QueueEndpoint={1};TableEndpoint={2};{3}";
        private const string CredentialLayout = "AccountName={0};AccountKey={1}";


        private const string BlobEndpoint = "https://{0}.blob.core.windows.net/";
        private const string TableEndpoint = "https://{0}.table.core.windows.net/";
        private const string QueueEndpoint = "https://{0}.queue.core.windows.net/";

        private CloudStorageAccount _storageAccount;
        private CloudBlobClient _blobClient;
        private string _blobEndpoint;
        private CloudTableClient _tableClient;
        private string _tableEndpoint;


        private CloudStorageAccount _storageAccountPublic;
        private CloudBlobClient _blobClientPublic;
        private string _blobEndpointPublic;

        public enum Location
        {
            California,  //West US 
            Illinois, //North Central US 
            Virginia, //East US 
            Victoria, //Australia Southeast 
            Sydney, //AustraliaEast
            SydneyPublic, //AustraliaEast
            SaitamaPrefecture, //Japan East
            OsakaPrefecture, //OsakaPrefecture Japan West
            Singapore, //Singapore Singapore
            HongKong, //HongKong HongKong
            Ireland, //Ireland Ireland
            Netherlands, //Netherlands Netherlands
        }  //http://azure.microsoft.com/en-us/regions/


        public AzureProcessor(Location location)
        {

            string accountname;
            string accountkey;
            string accountnamepublic = "" ;
            string accountkeypublic = "";

            switch (location)
            {
                case Location.Singapore:
                    accountname = "asestoragetest";
                    accountkey = "vet6Q5BYB/nJ8ES5kw3qfQNpm32rUx3wE8vQ/vvKlL7c631I1YdFPw6gMxHxPva7+tAhrS+iBohHKYcaX8hIoQ==";
                    break;
                case Location.HongKong:
                    accountname = "asiaestoragetest";
                    accountkey = "dCsj9lN7LdeFDIfytGL1FGnGMVoemIVK1dFLVUhIBJi+a418LMPRDlxi+MXSczgpTsXtZsc9KgV9h3G/RShO7w==";
                    break;
                case Location.SaitamaPrefecture:
                    accountname = "japstoragetest";
                    accountkey = "cmrZ6OcOASCRMQyYzEx9R6rr1xdvqHpG9bJ2jeXFtGRnrhM0pQ2/4GvL3FKoP2RIIW3kmSWh+nYeFi1SZ6MOHQ==";
                    break;
                case Location.OsakaPrefecture:
                    accountname = "japwstoragetest";
                    accountkey = "AV/NVtrOIleIRdloo4ttWmqUwJs7kToCJRpRT5rNbKALfCagKFZxs7WJTaDO5k4wyUkHfj386XqgNGmvsGCyGQ==";
                    break;
                case Location.Ireland:
                    accountname = "neustoragetest";
                    accountkey = "ZAjJ5LWhwl8MIupAmsPQQqm6VXzPE/q2mMLOMf4yD3/nQubLpj5hpRjqMs24KUywtRIXSeSRY1mZREg+Lc87Wg==";
                    break;
                case Location.Netherlands:
                    accountname = "weustoragetest";
                    accountkey = "UBUcJ40JBWZoI/Z2FNk/9l81IwKXQBUKAeHhkgNUESccMkW4WXoqi4Yv0+4sDS/iNtA6I7MkRWci5FFGnJpLqA==";
                    break;
                case Location.California:
                    accountname = "usstoragetest";
                    accountkey = "ycn0kN42kmHvBPdlN5UN9UZIOQu+jlywKrZQhxWYCZHyseU5Kpnn9oL0N2e3Jswowm69fvoaufBkmiP6fjfJKg==";
                    break;
                case Location.Illinois:
                    accountname = "usncstoragetest";
                    accountkey = "M8lce1XuHtF0BVNMdrw8L7ZB9aJlJvW9NitMaH+H4+7WT3EAbdrdWbuL+5+9zUr4qmkrkIZbGSrQyJ+3JxbhhA==";
                    break;
                case Location.Virginia:
                    accountname = "usestoragetest";
                    accountkey = "pGSe/qGuRenpfMq/4COH8h++/DrRXs3kabCPGWRZPf/ZJCurYsFmIn+d6nDHXWXOc8GLYbFUCAxPR4aoZw2xVA==";
                    break;
                case Location.Victoria:
                    accountname = "ausestoragetest";
                    accountkey = "LJZftWko66Da4JSDDv6FSAKeVamJOlwqLYDaWAt9AS3xnnIVQoaSBR7cpOfx1eO+ztGpxppIeVMuxTBvHCLyMw==";
                    break;
                case Location.SydneyPublic:
                    accountname = "austoragetestpublic";
                    accountkey = "RLxuq7fosdtd5useZCgHlRzbUm52cnjMYnLj2loiDhmLYF1X6d/9JhGfaWUPzr/+OiTUyHRo2nRn9lfUtVYtSA==";
                    break;
                case Location.Sydney:
                default:
                    accountname = "austoragetest";
                    accountkey = "QCm7OG5eNbYu2z/exkw3gvGIiY+UcXpf6vpbnZKuGn/aqGVoLBHYgFEZRhYRh5X0x0dImC3MrEAbHTscJEclww==";
                    accountnamepublic = accountname + "public";
                    accountkeypublic = "RLxuq7fosdtd5useZCgHlRzbUm52cnjMYnLj2loiDhmLYF1X6d/9JhGfaWUPzr/+OiTUyHRo2nRn9lfUtVYtSA==";
                    break;
            }

            InitBlobClient(accountname, accountkey, accountnamepublic, accountkeypublic);
        }

        public bool RestoreToVanilla()
        {
            var containers = GetListOfContainers();
            foreach (var container in containers)
            {
                DeleteContainer(container.Name);
            }
            return true;
        }

        public async Task<string> UploadBlobIntoContainerAsync(System.IO.Stream fileStream, string containerName, string fileName)
        {
            var success = false;
            var successPermission = false;
            var uri = string.Empty;
            var storageMetadataJson = string.Empty;

            try
            {
                success = await DoUpload(fileName, fileStream, containerName, false);
                successPermission = await DoChangeObjectsACL(containerName, BlobContainerPublicAccessType.Off);
                uri = _blobEndpoint + containerName + "/" + fileName;
            }
            catch(Exception ex)
            {

            }
            finally
            {
                storageMetadataJson = generateStorageMetadataJson(_blobEndpoint, containerName, fileName, uri);
            }

            
            if (success) return storageMetadataJson;

            return string.Empty;
        }

        public async Task<bool> DeleteOrphanedCOntainersAsync()
        {
            
            return true;
        }

        private string generateStorageMetadataJson(string blobEndpoint, string containerName, string fileName, string uri)
        {
            var storageMetadataJson = "{"
                + " \"blobEndpoint\":\"" + _blobEndpoint + "\""
                + " ,\"containerName\":\"" + containerName + "\""
                + " ,\"fileName\":\"" + fileName + "\""
                + " ,\"uri\":\"" + uri + "\""
                + "}";

            return storageMetadataJson;
        }


        public string UploadBlobIntoContainer(System.IO.Stream fileStream, string containerName, string fileName)
        {
            var success = false;
            var successPermission = false;
            var uri = string.Empty;
            var storageMetadataJson = string.Empty;

            try
            {
                success = DoUpload(fileName, fileStream, containerName, false).Result;
                successPermission = DoChangeObjectsACL(containerName, BlobContainerPublicAccessType.Off).Result;
                uri = _blobEndpoint + containerName + "/" + fileName;
            }
            catch (Exception ex)
            {

            }
            finally
            {
                storageMetadataJson = generateStorageMetadataJson(_blobEndpoint, containerName, fileName, uri);
            }

            if (success) return storageMetadataJson;

            return string.Empty;
        }


        public bool CreateContainer(string containerName)
        {
            var container = DoCreateContainer(containerName);
            return container != null;
        }

        public async Task<bool> CreateTable (string tableName)
        {
            var table = _tableClient.GetTableReference(tableName);
            return await table.CreateIfNotExistsAsync();
        }

        public async Task<int> AddToTable(string tableName, TableEntity entity)
        {
            var table = _tableClient.GetTableReference(tableName);
            await table.CreateIfNotExistsAsync();

            TableOperation insertOp = TableOperation.InsertOrReplace(entity);
            var result = await table.ExecuteAsync(insertOp);

            return result.HttpStatusCode;
        }

        public async Task<int> DeleteFromTable(string tableName, TableEntity entity)
        {
            var table = _tableClient.GetTableReference(tableName);
            await table.CreateIfNotExistsAsync();

            TableOperation insertOp = TableOperation.Delete(entity);
            var result = await table.ExecuteAsync(insertOp);

            return result.HttpStatusCode;
        }






        
        public async Task<int> DeleteByDisplayId(string type, Guid displayId)
        {
            var table = _tableClient.GetTableReference(type);
            await table.CreateIfNotExistsAsync();

            var ret = 0;
            IEnumerable<ITableEntity> found = null;

            if (type == "Session") found = table.ExecuteQuery(new TableQuery<SessionEntity>().Where(TableQuery.GenerateFilterConditionForGuid("DisplayId", QueryComparisons.Equal, displayId)));
            else if (type == "Link") found = table.ExecuteQuery(new TableQuery<LinkEntity>().Where(TableQuery.GenerateFilterConditionForGuid("DisplayId", QueryComparisons.Equal, displayId)));
            else if (type == "User") found = table.ExecuteQuery(new TableQuery<UserEntity>().Where(TableQuery.GenerateFilterConditionForGuid("DisplayId", QueryComparisons.Equal, displayId)));
            else if (type == "Comment") found = table.ExecuteQuery(new TableQuery<CommentEntity>().Where(TableQuery.GenerateFilterConditionForGuid("DisplayId", QueryComparisons.Equal, displayId)));
            else if (type == "Document") found = table.ExecuteQuery(new TableQuery<DocumentEntity>().Where(TableQuery.GenerateFilterConditionForGuid("DisplayId", QueryComparisons.Equal, displayId)));
            else if (type == "Image") found = table.ExecuteQuery(new TableQuery<ImageEntity>().Where(TableQuery.GenerateFilterConditionForGuid("DisplayId", QueryComparisons.Equal, displayId)));
            else if (type == "Video") found = table.ExecuteQuery(new TableQuery<VideoEntity>().Where(TableQuery.GenerateFilterConditionForGuid("DisplayId", QueryComparisons.Equal, displayId)));
            else if (type == "Area") found = table.ExecuteQuery(new TableQuery<AreaEntity>().Where(TableQuery.GenerateFilterConditionForGuid("DisplayId", QueryComparisons.Equal, displayId)));
            else if (type == "Setting") found = table.ExecuteQuery(new TableQuery<SettingEntity>().Where(TableQuery.GenerateFilterConditionForGuid("DisplayId", QueryComparisons.Equal, displayId)));
            else throw new NotImplementedException();
            
            
            if (found != null)
            {
                foreach (var item in found)
                {
                    TableOperation op = TableOperation.Delete(item);
                    var result = await table.ExecuteAsync(op);
                    ret = result.HttpStatusCode;
                }

            }
            return ret;
        }
















        public async Task<object> RetrieveFromTable(string tableName, string partition, string key)
        {
            var table = _tableClient.GetTableReference(tableName);
            await table.CreateIfNotExistsAsync();

            TableOperation retrieveOp = TableOperation.Retrieve(partition, key);
            var result = await table.ExecuteAsync(retrieveOp);

            return result.Result;
        }

        

        

        
        
        public IEnumerable<ITableEntity> RetrieveAllByName(string type, string name)
        {

            var table = _tableClient.GetTableReference(type);

            if (type == "Session") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.SessionEntity>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, name)));
            else if (type == "User") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.UserEntity>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, name)));
            else if (type == "Comment") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.CommentEntity>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, name)));
            else if (type == "Link") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.LinkEntity>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, name)));
            else if (type == "Document") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.DocumentEntity>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, name)));
            else if (type == "Image") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.ImageEntity>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, name)));
            else if (type == "Video") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.VideoEntity>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, name)));
            else if (type == "Area") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.AreaEntity>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, name)));
            else if (type == "Setting") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.SettingEntity>().Where(TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, name)));
            else throw new NotImplementedException();
            
        }

        
        
        public IEnumerable<ITableEntity> RetrieveAll(string type, string grouping)
        {
            var table = _tableClient.GetTableReference(type);

            if (type == "Session") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.SessionEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, grouping)));
            else if (type == "User") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.UserEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, grouping)));
            else if (type == "Comment") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.CommentEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, grouping)));
            else if (type == "Link") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.LinkEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, grouping)));
            else if (type == "Document") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.DocumentEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, grouping)));
            else if (type == "Image") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.ImageEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, grouping)));
            else if (type == "Video") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.VideoEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, grouping)));
            else if (type == "Area") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.AreaEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, grouping)));
            else if (type == "Setting") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.SettingEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, grouping)));
            else throw new NotImplementedException();

        }

        
        
        public IEnumerable<ITableEntity> RetrieveAll(string type)
        {
            var table = _tableClient.GetTableReference(type);
            if (type == "Session") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.SessionEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.NotEqual, "xxx")));
            else if (type == "User") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.UserEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.NotEqual, "xxx")));
            else if (type == "Comment") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.CommentEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.NotEqual, "xxx")));
            else if (type == "Link") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.LinkEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.NotEqual, "xxx")));
            else if (type == "Document") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.DocumentEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.NotEqual, "xxx")));
            else if (type == "Image") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.ImageEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.NotEqual, "xxx")));
            else if (type == "Video") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.VideoEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.NotEqual, "xxx")));
            else if (type == "Area") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.AreaEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.NotEqual, "xxx")));
            else if (type == "Setting") return table.ExecuteQuery(new TableQuery<RipThatPic.Controllers.SettingEntity>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.NotEqual, "xxx")));
            else throw new NotImplementedException();

        }









        public async Task<bool> DownloadFile(string folderPathToSaveUrn, string containerName, string containerFileName, string folderPrefix = "", long singleFileSizeInMB = 0)
        {
            var path = string.Format(folderPathToSaveUrn + @"\" + folderPrefix + "-" + containerName);
            var blob = DoGetContainerBlob(containerName,  containerFileName);
            await DoDownload(path, blob);

            return true;
        }

        public List<Container> GetListOfContainers()
        {
            var containers = _blobClient.ListContainers(null, ContainerListingDetails.All);
            return containers.Select(c => new Incite.Cloud.Container {LastModified = c.Properties.LastModified, Name = c.Name}).ToList();
        }

        public List<Blob> GetListOfBlobs(string containerName)
        {
            var container = DoGetContainer(containerName);
            var listOfBlobs = container.ListBlobs(null, true, BlobListingDetails.All);
            return (from CloudBlockBlob castedobject in listOfBlobs select new Blob() { Length = castedobject.Properties.Length, Name = castedobject.Name }).ToList();
        }

        public bool DeleteContainer(string containerName)
        {
            var container = DoGetContainer(containerName);
            container.Delete();
            return true;
        }

        public async Task<bool> DeleteTable(string tableName)
        {
            var table = _tableClient.GetTableReference(tableName);
            await table.DeleteIfExistsAsync();

            return true;
        }


        public async Task<bool> DeleteContainerAsync(string containerName)
        {
            var container = DoGetContainer(containerName);
            await container.DeleteAsync();
            return true;
        }

        public async Task<string> GenerateSharedAccessBlobUrlAsync(string containerName, string fileName, int minsToExpire)
        {
            string publicUrl = string.Empty;
            var key = fileName ;


            if (_blobClientPublic != null)
            {
                //create new public container
                var containerPublic = _blobClientPublic.GetContainerReference(containerName);
                containerPublic.Create();
                containerPublic.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Off });


                //create blob in public container
                var refTargetBlob = containerPublic.GetBlockBlobReference(key);
                var refSourceBlob = await _blobClient.GetBlobReferenceFromServerAsync(new Uri(_blobEndpoint + containerName + "/" + key));

                //copy source into target stream
                using (var targetStream = await refTargetBlob.OpenWriteAsync())
                {
                    await refSourceBlob.DownloadToStreamAsync(targetStream);
                }


                //Set the expiry time and permissions for the container.
                //In this case no start time is specified, so the shared access signature becomes valid immediately.
                SharedAccessBlobPolicy sasConstraints = new SharedAccessBlobPolicy();
                //sasConstraints.SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(minsToExpire);
                sasConstraints.SharedAccessStartTime = DateTime.UtcNow.AddMinutes(-(minsToExpire + 1));
                sasConstraints.SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(minsToExpire);
                sasConstraints.Permissions = SharedAccessBlobPermissions.Read;

                //Generate the shared access signature on the container, setting the constraints directly on the signature.
                string sasContainerToken = containerPublic.GetSharedAccessSignature(sasConstraints);


                //final url
                publicUrl = _blobEndpointPublic + containerName + "/" + key + sasContainerToken;

            }


            return publicUrl;
        }
        public string GenerateSharedAccessBlobUrl(string containerName, string fileName, int minsToExpire)
        {
            var key =  fileName;

            string publicUrl = string.Empty;
            string sasContainerToken = string.Empty;

            try
            {
                if (_blobClientPublic != null)
                {
                    //create new public container
                    var containerPublic = _blobClientPublic.GetContainerReference(containerName);

                   
                    try
                    {
                        if(!containerPublic.Exists()) containerPublic.Create();
                    }
                    catch (Exception ex2) { }

                    
                    containerPublic.SetPermissions(new BlobContainerPermissions{ PublicAccess = BlobContainerPublicAccessType.Off});


                    //create blob in public container
                    var refTargetBlob = containerPublic.GetBlockBlobReference(key);
                    var refSourceBlob = _blobClient.GetBlobReferenceFromServer(new Uri(_blobEndpoint + containerName + "/" + key));

                    //copy source into target stream
                    using (var targetStream = refTargetBlob.OpenWrite())
                    {
                        refSourceBlob.DownloadToStream(targetStream);
                    }

                    //Set the expiry time and permissions for the container.
                    //In this case no start time is specified, so the shared access signature becomes valid immediately.
                    SharedAccessBlobPolicy sasConstraints = new SharedAccessBlobPolicy();
                    //sasConstraints.SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(minsToExpire);
                    sasConstraints.SharedAccessStartTime = DateTime.UtcNow.AddMinutes(-(minsToExpire + 1));
                    sasConstraints.SharedAccessExpiryTime = DateTime.UtcNow.AddMinutes(minsToExpire);
                    sasConstraints.Permissions = SharedAccessBlobPermissions.Read;

                    //Generate the shared access signature on the container, setting the constraints directly on the signature.
                    sasContainerToken = containerPublic.GetSharedAccessSignature(sasConstraints);



                }

            }
            catch (Exception ex)
            {
                //handle errors ... to work out what
            }
            finally
            {
                publicUrl = _blobEndpointPublic + containerName + "/" + key + sasContainerToken;
            }



            return publicUrl;
        }

















        private void InitBlobClient(string accountName, string accountKey, string accountNamePublic, string accountKeyPublic)
        {
            var credential = string.Format(CredentialLayout, accountName, accountKey);
            _blobEndpoint = string.Format(BlobEndpoint, accountName);
            _tableEndpoint = string.Format(TableEndpoint, accountName);
            var connectString = string.Format(ConnectionStrLayout,
                _blobEndpoint,
                string.Format(QueueEndpoint, accountName),
                _tableEndpoint, 
                credential);
            if (_storageAccount == null) _storageAccount = CloudStorageAccount.Parse(connectString);
            if (_blobClient == null) _blobClient = _storageAccount.CreateCloudBlobClient();
            if (_tableClient == null) _tableClient = _storageAccount.CreateCloudTableClient();



            //public
            if (!string.IsNullOrEmpty(accountNamePublic))
            {
                var credentialPublic = string.Format(CredentialLayout, accountNamePublic, accountKeyPublic);
                _blobEndpointPublic = string.Format(BlobEndpoint, accountNamePublic);
                var connectStringPublic = string.Format(ConnectionStrLayout,
                    _blobEndpointPublic,
                    string.Format(QueueEndpoint, accountNamePublic),
                    string.Format(TableEndpoint, accountNamePublic),
                    credentialPublic);
                if (_storageAccountPublic == null) _storageAccountPublic = CloudStorageAccount.Parse(connectStringPublic);
                if (_blobClientPublic == null) _blobClientPublic = _storageAccountPublic.CreateCloudBlobClient();
            }

        }

      



        private CloudBlobContainer DoGetContainer(string containerName)
        {
            var container = _blobClient.GetContainerReference(containerName);
            return container;
        }

        private CloudBlobContainer DoCreateContainer(string containerName)
        {
            var container = DoGetContainer(containerName);
            container.Create();
            container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Off });
            return container;
        }

        private CloudBlockBlob DoGetContainerBlob(string containerName, string fileName)
        {
            var container = DoGetContainer(containerName);
            var blockBlob = container.GetBlockBlobReference(fileName);
            return blockBlob;
        }

        private async Task<bool> DoUpload(string fileName, System.IO.Stream fileStream, string containerName,  bool containerIsNew = false)
        {
            var container = containerIsNew ? DoCreateContainer(containerName): DoGetContainer(containerName);
            var key = fileName;
            var blockBlob = container.GetBlockBlobReference(key);
            
            using (fileStream)
            {
                await blockBlob.UploadFromStreamAsync(fileStream);    
                
            }
            return true;
        }

        private async Task<bool> DoDownload(string savePathUrn, CloudBlockBlob blockBlob)
        {
            //using (var fileStream = System.IO.File.OpenWrite(savePathUrn + @"\" + blockBlob.Name))
            //{

            using (FileStream fileStream = new FileStream(savePathUrn + @"\" + blockBlob.Name,
                FileMode.CreateNew, FileAccess.ReadWrite, FileShare.ReadWrite,
                bufferSize: 4096, useAsync: true))
            {

                await blockBlob.DownloadToStreamAsync(fileStream);
            }

            return true;
        }

        private async Task<bool> DoChangeObjectsACL(string containerName, BlobContainerPublicAccessType permission)
        {
            var container = DoGetContainer(containerName);
            await container.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = permission });
            return true;
        }



    }
}
