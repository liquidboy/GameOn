using System.Collections.Generic;
using System.Threading.Tasks;

namespace Incite.Cloud
{
    public interface IStorageProcessor
    {
        Task<string> UploadBlobIntoContainerAsync(System.IO.Stream fileStream, string containerName, string fileName, string originalFileName, string contentType, bool publicAccess = false);
        string UploadBlobIntoContainer(System.IO.Stream fileStream, string containerName, string fileName, string originalFileName, string contentType, bool publicAccess = false);
        bool CreateContainer(string containerName, bool isPublicContainer);
        Task<bool> DownloadFile(string folderPathToSaveUrn, string containerName, string containerFileName, string folderPrefix, long singleFileSizeInMB);
        List<Container> GetListOfContainers();
        List<Blob> GetListOfBlobs(string containerName);
        bool DeleteContainer(string containerName);
        Task<bool> DeleteContainerAsync(string containerName);
        bool DeleteBlob(string containerName, string blobName);
        Task<bool> DeleteBlobAsync(string containerName, string blobName);
        Task<string> GenerateSharedAccessBlobUrlAsync(string containerName, string fileName, int minsToExpire);
        string GenerateSharedAccessBlobUrl(string containerName, string fileName, int minsToExpire);
        bool RestoreToVanilla();
        Task<bool> DeleteOrphanedCOntainersAsync();
    }
}
