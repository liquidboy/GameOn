using System.Collections.Generic;
using System.Threading.Tasks;

namespace Incite.Cloud
{
    public interface IStorageProcessor
    {
        Task<string> UploadBlobIntoContainerAsync(System.IO.Stream fileStream, string containerName, string fileName, string contentType, string originalFileName);
        string UploadBlobIntoContainer(System.IO.Stream fileStream, string containerName, string fileName, string contentType, string originalFileName);
        bool CreateContainer(string containerName);
        Task<bool> DownloadFile(string folderPathToSaveUrn, string containerName, string containerFileName, string folderPrefix, long singleFileSizeInMB);
        List<Container> GetListOfContainers();
        List<Blob> GetListOfBlobs(string containerName);
        bool DeleteContainer(string containerName);
        Task<bool> DeleteContainerAsync(string containerName);
        Task<string> GenerateSharedAccessBlobUrlAsync(string containerName, string fileName, int minsToExpire);
        string GenerateSharedAccessBlobUrl(string containerName, string fileName, int minsToExpire);
        bool RestoreToVanilla();
        Task<bool> DeleteOrphanedCOntainersAsync();
    }
}
