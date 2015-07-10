using Incite.Cloud.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.IO;
using System.Net.Http.Headers;
using System.Collections.ObjectModel;
using System.Collections.Specialized;
using System.Threading;

namespace RipThatPic.Controllers
{
    public class UploadController : _BaseController
    {
        //using a file
        //http://stackoverflow.com/questions/13732766/using-multipartformdatastreamprovider-and-readasmultipartasync

        //using memorystream
        //http://forums.asp.net/t/1842441.aspx?File+upload+using+MultipartMemoryStreamProvider

        
        private const int _thumbSize = 240;


        // POST: api/Upload
        [HttpPost]
        public async Task<HttpResponseMessage> Post([FromUri]string cn)
        {
            //container/bucket 
            string _groupingUpload = "temp-upload";
            if (!string.IsNullOrEmpty(cn)) _groupingUpload = cn;
            string _groupingUploadThumb = _groupingUpload + "-thumb";


            //var uploadPath = "";// TempStorage.GetTempDir(id);

            if (Request.Content.IsMimeMultipartContent())
            {
                var processor = GetAzureProcessor();

                ////pluploader chunks
                //var fileWriterProvider = new PlUploadMultipartFileStreamProvider(uploadPath, Guid.NewGuid(), processor);
                //await Request.Content.ReadAsMultipartAsync(fileWriterProvider);

                ////delete all container data first
                //var items = processor.GetListOfContainers();
                //foreach (var item in items) processor.DeleteContainer(item.Name);
                //return Request.CreateResponse(HttpStatusCode.OK);



                var streamProvider = new MultipartMemoryStreamProvider();
                await Request.Content.ReadAsMultipartAsync(streamProvider);
                foreach (HttpContent fileData in streamProvider.Contents)
                {
                    var OriginalFileName = fileData.Headers.ContentDisposition.FileName;
                    var ContentType = fileData.Headers.ContentType;
                    var ContentLength = fileData.Headers.ContentLength;

                    if(!string.IsNullOrEmpty(OriginalFileName))
                    {
                        //clean originalfilename
                        OriginalFileName = OriginalFileName.Replace("\"", "");
                        var ofnParts = OriginalFileName.Split("\\".ToCharArray());
                        OriginalFileName = ofnParts.Last();


                        var uniqueId = Guid.NewGuid().ToString();

                        using (var stream = await fileData.ReadAsStreamAsync())
                        {
                            //create containers incase they don't exist
                            processor.CreateContainer(_groupingUpload);
                            processor.CreateContainer(_groupingUploadThumb);


                            //setup entity for uplading into storage table
                            var uf = new FileStorageEntity(uniqueId, _groupingUpload.ToLower());
                            uf.ContentType = ContentType.MediaType;
                            uf.Size = ContentLength.HasValue ? ContentLength.Value : 0;
                            uf.OriginalFileName = OriginalFileName;
                            uf.DisplayId = Guid.Parse(uniqueId);


                            //metadata (table storage)
                            await processor.AddToTable("FileStorage", uf);

                            //content (blob storage)
                            await processor.UploadBlobIntoContainerAsync(stream, _groupingUpload, uniqueId, OriginalFileName, ContentType.MediaType, false);


                            //thumbnail if applicable
                            var ctmt = ContentType.MediaType.ToLower();
                            if (ctmt.Contains("jpeg") || ctmt.Contains("gif") ||
                                ctmt.Contains("jpg") || ctmt.Contains("png") ||
                                ctmt.Contains("bmp") || ctmt.Contains("tiff"))
                            {
                                stream.Seek(0, SeekOrigin.Begin);
                                using (var img = System.Drawing.Image.FromStream(stream))
                                {
                                    var thumbDimension = ResizeImageForThumb(img.Width, img.Height, _thumbSize, _thumbSize);
                                    using (var thumbnailImage = img.GetThumbnailImage(thumbDimension.Width, thumbDimension.Height, new System.Drawing.Image.GetThumbnailImageAbort(ThumbnailCallback), IntPtr.Zero))
                                    using (var imageThumbStream = new MemoryStream())
                                    {
                                        thumbnailImage.Save(imageThumbStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                                        imageThumbStream.Seek(0, SeekOrigin.Begin);
                                        await processor.UploadBlobIntoContainerAsync(imageThumbStream, _groupingUploadThumb, uniqueId, OriginalFileName, "image/jpeg", true);
                                    }
                                }
                            }
                            
                           
                        }



                    }
                    
                }
                return Request.CreateResponse(HttpStatusCode.OK);
                
            }
            return Request.CreateResponse(HttpStatusCode.NotAcceptable, "this request is not properly formated");
        }


        private System.Drawing.Rectangle ResizeImageForThumb(double originalWidth, double originalHeight, double requiredWidth, double requiredHeight) {


            double imageHeight = 0;
            double imageWidth = 0;

            double scale = 1;

            if (originalHeight > requiredHeight)
            {
                scale = (double)(requiredHeight / originalHeight);
                imageHeight = requiredHeight;
                imageWidth = (int)(originalHeight * scale);
            }

            if (imageWidth > requiredWidth)
            {
                scale = requiredWidth / imageWidth;
                imageWidth = requiredWidth;
                imageHeight = (int)(imageHeight * scale);
            }

            return new System.Drawing.Rectangle(0, 0, (int)(originalWidth * scale), (int)(originalHeight * scale));


        }

        private bool ThumbnailCallback()
        {
            return true;
        }




    }



    //public class UploadFileEntity : TableEntity, ITableEntity
    //{
    //    private string _name;
    //    public string Name { get { return _name; } set { _name = value; this.RowKey = value; } }


    //    private string _grouping;
    //    public string Grouping { get { return _grouping; } set { _grouping = value; this.PartitionKey = value; } }

    //    public UploadFileEntity(string name, string grouping)
    //    {
    //        this.Name = name;
    //        this.Grouping = grouping;
    //    }

    //    public UploadFileEntity() { }

    //    public string OriginalFileName { get; set; }
    //    public string ContentType { get; set; }
    //    public long Size { get; set; }

    //}








    public class PlUploadMultipartFileStreamProvider : MultipartStreamProvider
    {
        private readonly Guid _fileGuid;
        private readonly string _rootPath;
        private bool _formDataRead;
        private const int DefaultBufferSize = 0x1000;
        private AzureProcessor _ap;


        protected int BufferSize
        {
            get { return DefaultBufferSize; }
        }

        public PlUploadMultipartFileStreamProvider(string rootPath, Guid fileGuid, AzureProcessor ap)
        {
            if (fileGuid == Guid.Empty)
            {
                throw new ArgumentException("File guid is empty");
            }
            //if (rootPath == null)
            //{
            //    throw new ArgumentNullException("rootPath");
            //}
            if (ap == null)
            {
                throw new ArgumentNullException("Azure Processor is null");
            }

            _ap = ap;
            _fileGuid = fileGuid;
            //_rootPath = Path.GetFullPath(rootPath);
            FormData = new NameValueCollection(StringComparer.OrdinalIgnoreCase);
        }

        public override Stream GetStream(HttpContent parent, HttpContentHeaders headers)
        {
            if (parent == null)
            {
                throw new ArgumentNullException("parent");
            }

            if (headers == null)
            {
                throw new ArgumentNullException("headers");
            }

            //if (MultipartFormDataStreamProviderHelper.IsFileContent(parent, headers))
            //{
            //    return GetUploadFileStream(headers);
            //}

            return new MemoryStream();
        }


        private Stream GetUploadFileStream(HttpContentHeaders headers)
        {
            var isChunkedUpload = MultipartFormDataStreamProviderHelper.IsChunkedUpload(headers);

            if (isChunkedUpload)
            {
                _formDataRead = true;
                MultipartFormDataStreamProviderHelper.ReadFormDataAsync(Contents, FormData, CancellationToken.None).Wait(); // read all form data
            }

            var commandTypeName = isChunkedUpload
                ? FileUploadChaosMonkey.UploadChunkCommand
                : FileUploadChaosMonkey.UploadCommand;
            FileUploadChaosMonkey.TriggerError(commandTypeName, GetFileName(headers, isChunkedUpload));

            var fullFilePath = GetLocalFilePath(headers, isChunkedUpload);

            if (!isChunkedUpload)
            {
                //Trace.WriteLine("Process not chunked upload");
                if (File.Exists(fullFilePath)) File.Delete(fullFilePath);
                return File.Create(fullFilePath, BufferSize, FileOptions.Asynchronous);
            }


            //we have chunking            
            //var chunkNumber = int.Parse(FormData["chunk"]);
            //var noOfChunks = int.Parse(FormData["chunks"]);            
            var offset = int.Parse(FormData["offset"]);
            var total = int.Parse(FormData["total"]);

            if (offset == 0) // first chunk
            //if (chunkNumber == 0) // first chunk
            {
                //Trace.WriteLine("Process chunked upload - first chunk");
                if (File.Exists(fullFilePath)) File.Delete(fullFilePath);
                return File.Create(fullFilePath, BufferSize, FileOptions.Asynchronous);
            }

            var appendableStream = new FileStream(fullFilePath, FileMode.Append, FileAccess.Write, FileShare.None, BufferSize, FileOptions.Asynchronous);
            appendableStream.Seek(offset, SeekOrigin.Begin);
            //Trace.WriteLine(string.Format("Process chunked upload - chunk {0} of {1} - current file size {2}", chunkNumber, noOfChunks, appendableStream.Length));
            //Trace.WriteLine(string.Format("Process chunked upload - offset {0} of {1} - current file size {2}", offset, total, appendableStream.Length));
            return appendableStream;
        }


        private string GetLocalFilePath(HttpContentHeaders headers, bool isChunkedUpload)
        {
            try
            {
                var originalFileName = GetFileName(headers, isChunkedUpload);
                var originalFileExtension = GetExtensionEx(originalFileName);
                var uniqueFileName = _fileGuid + originalFileExtension;
                return Path.Combine(_rootPath, uniqueFileName);
            }
            catch (Exception e)
            {
                throw new InvalidOperationException("Invalid local file name", e);
            }
        }

        public string GetExtensionEx(string path)
        {
            if (path == null)
                return null;

            var length = path.Length;
            for (var i = length; --i >= 0;)
            {
                var ch = path[i];
                if (ch == '.')
                {
                    if (i != length - 1)
                        return path.Substring(i, length - i);
                    else
                        return String.Empty;
                }
                if (ch == Path.DirectorySeparatorChar || ch == Path.AltDirectorySeparatorChar || ch == Path.VolumeSeparatorChar)
                    break;
            }
            return String.Empty;
        }

        private string GetFileName(HttpContentHeaders headers, bool isChunkedUpload)
        {
            return Path.GetFileName(isChunkedUpload ? FormData["name"] : GetLocalFileName(headers));
        }
        private string GetLocalFileName(HttpContentHeaders headers)
        {
            if (string.IsNullOrWhiteSpace(headers.ContentDisposition.FileName)) throw new ArgumentException("Invalid file name");
            return headers.ContentDisposition.FileName.Replace("\"", string.Empty);
        }

        public NameValueCollection FormData { get; private set; }
    }



    internal static class MultipartFormDataStreamProviderHelper
    {
        private const string FileNameWhenChunking = "blob";

        public static bool IsChunkedUpload(HttpContentHeaders headers)
        {
            var contentDispositionHeader = headers.ContentDisposition;
            return UnquoteToken(contentDispositionHeader.FileName.ToLower()) == FileNameWhenChunking.ToLower();
        }

        public static bool IsFileContent(HttpContent parent, HttpContentHeaders headers)
        {
            if (parent == null)
            {
                throw new ArgumentNullException("parent");
            }

            if (headers == null)
            {
                throw new ArgumentNullException("headers");
            }

            // For form data, Content-Disposition header is a requirement.
            var contentDisposition = headers.ContentDisposition;
            if (contentDisposition == null)
            {
                // If no Content-Disposition header was present.
                throw new InvalidOperationException("Content-Disposition not found");
            }

            // The file name's existence indicates it is a file data.
            if (!String.IsNullOrEmpty(contentDisposition.FileName))
            {
                return true;
            }

            return false;
        }

        public static async Task ReadFormDataAsync(Collection<HttpContent> contents, NameValueCollection formData, CancellationToken cancellationToken)
        {
            foreach (var content in contents)
            {
                var contentDisposition = content.Headers.ContentDisposition;
                if (String.IsNullOrEmpty(contentDisposition.FileName))
                {
                    var formFieldName = UnquoteToken(contentDisposition.Name) ?? String.Empty;
                    cancellationToken.ThrowIfCancellationRequested();
                    var formFieldValue = await content.ReadAsStringAsync();
                    formData.Add(formFieldName, formFieldValue);
                }
            }
        }

        public static string UnquoteToken(string token)
        {
            if (String.IsNullOrWhiteSpace(token))
            {
                return token;
            }

            if (token.StartsWith("\"", StringComparison.Ordinal) && token.EndsWith("\"", StringComparison.Ordinal) && token.Length > 1)
            {
                return token.Substring(1, token.Length - 2);
            }

            return token;
        }
    }



    public interface IChaosMonkeyTriggerKey
    {
        string GetChaosTriggerKey();
    }


    public static class FileUploadChaosMonkey
    {
        private static readonly Random Random = new Random();
        private const string Prefix = "incite.file.upload.";
        public const string UploadCommand = "Upload";
        public const string UploadChunkCommand = "UploadChunk";

        private static readonly Dictionary<string, string> TriggerMap = new Dictionary<string, string>()
        {
            //{typeof (AttachFilesToMessageCommand).Name, Prefix + "attach"},
            //{typeof (FinalizeFileUploadCommand).Name, Prefix + "finalize"},
            //{typeof (FncValidationRequest).Name, Prefix + "validate"},
            //{typeof (CancelFilesUploadCommand).Name, Prefix + "cancel"},
            {UploadCommand, Prefix + "upload"},
            {UploadChunkCommand, Prefix + "chunkupload"},
        };

        public static void TriggerError(string commandTypeName, string hint)
        {
            var hintMarker = TriggerMap[commandTypeName];
            if (hint.ToUpper().Contains(hintMarker.ToUpper()) && Random.Next() % 2 == 0)
                throw new Exception("FileUpload Chaos monkey detected " + hintMarker + " in command " + commandTypeName);
        }

        public static void TriggerError(Type commandType, string hint)
        {
            TriggerError(commandType.Name, hint);
        }
    }
}
