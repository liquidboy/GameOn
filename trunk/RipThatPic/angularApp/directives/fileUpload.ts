module Application.Directives {
    //'use strict';
    export class FileUploadDirective implements ng.IDirective {

        private localWindow: any = window;
        private plupload = this.localWindow.plupload;
        
        public httpConfiguration = {
            timeout: 120000 // 2 minutes
        };
        
        public uploader: any;
        public buildDefaultConfig = function () {
            return {
                //button : '',
                //url : '',
                //beforeFileUpload: function (uploader, file){},
                //postInitialisation: function (uploader)
                headers: {},
                bodyParams: {},
                runtimes: 1, //defaults.runtimes,
                preventDuplicates: true,
                maxFileSize: 0, //defaults.maxFileSize,
                maxFileAutoRetryAttempts: 4, //defaults.maxFileAutoRetryAttempts,
                timeout: 0,
                flash_swf_url: '/scripts/plupload/moxie.swf',
                silverlight_xap_url: '/scripts/plupload/moxie.xap'
            };
        };

        public injection(): Array<any> {
            return [
                "pubSubConstants",
                "radioPubSubSvc",
                (pubSubConstants, radioPubSubSvc) => { return new FileUploadDirective(pubSubConstants, radioPubSubSvc); }
            ];
        }
        //public static $inject: any[] = [() => { return new FileUploadDirective(); }];

        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: IFileUploadScope ;

        public link: ($scope: IFileUploadScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: ng.INgModelController) => void;


        constructor(public pubSubConstants: Application.Constants.PubSubConstants, public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {

            
            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/file-upload.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', FileUploadController];
            this.link = ($scope: IFileUploadScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: ng.INgModelController) =>
            {                
                this.scope = $scope;
                this.scope.FUBrowseButtonId = 'browse_button';
                this.scope.FUDropAreaId = 'drop_area';
                //this.scope.StartButtonId = 'start_button';
                this.scope.FUFileUploadRefCounter = 0;
                this.scope.FUDock = 'top';
                
                if (attributes.$attr["daDock"]) this.scope.FUDock = element.attr(<string>attributes.$attr["daDock"]);
                element.addClass('fu-dock-' + this.scope.FUDock);
                if (attributes.$attr["daCn"]) this.scope.FUCN = element.attr(<string>attributes.$attr["daCn"]);
                
                this.initPubSub();
                this.initUploader();

                //changing to auto uploading
                //element.find('#start_button').on('click', this.startUpload);
             
            };


        }

        initPubSub = () => {

            this.radioPubSubSvc.subscribe(
                this.pubSubConstants.FileStorageContainerChanged,
                this.ContainerChanged.bind(this),
                undefined);

            this.scope.$on('$destroy', this.destructor);
        }

        private ContainerChanged(cn: string) {
            this.scope.FUCN = cn === '-all-' ? '' : cn;
        }

        destructor = () => {
            var __this = this;
            this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FileStorageContainerChanged, __this.ContainerChanged);
        }

        _isUploading: boolean = false;
        startUpload = () => {
            var __this = this;
            if (__this._isUploading) return;
            __this.uploader.settings.url = __this.scope.FUUrl + '?cn=' + __this.scope.FUCN;
            __this.uploader.start();
            __this._isUploading = true;
        }

        initUploader = () => {
            var __this = this;
            __this.scope.FUUrl = '/api/Upload';
            var uploadConfig = {
                button: this.scope.FUBrowseButtonId,
                dropArea: this.scope.FUDropAreaId,
                url: __this.scope.FUUrl,
                headers: {},
                bodyParams: {},
                beforeFileUpload: () => { },
                postInitialisation: () => { },
                filesAdded: () => { },
                filesRemoved: () => { },
                fileUploaded: () => { },
                fileFiltered: () => { },
                attachCustomPropertiesToFile: () => { },
                uploadComplete: () => { },
                uploadProgress: () => { },
                stateChanged: () => { },
                canRetryFiles: () => { },
                error: () => { },
                browse: () => { },
                timeout: this.getSetting(this.pubSubConstants.CookieSettings_FileUploadTimeout, this.httpConfiguration.timeout),
                runtimes: this.getSetting(this.pubSubConstants.CookieSettings_FileUploadRuntimes, 'html5,flash,html4'), //uploadFileService.defaults.runtimes),
                chunk_size: this.getSetting(this.pubSubConstants.CookieSettings_FileUploadChunkSize, 0), //uploadFileService.defaults.chunkSize),
                maxFileAutoRetryAttempts: this.getSetting(this.pubSubConstants.CookieSettings_FileUploadRetries, 4),  //uploadFileService.defaults.maxFileAutoRetryAttempts)
                maxFileSize: this.getSetting(this.pubSubConstants.CookieSettings_FileUploadMaxFileSize, 2147483647)
            };

            if (!this.scope.FUBrowseButtonId) {
                alert('Browse button not specified');
                return;
            }

            $('#' + this.scope.FUBrowseButtonId).removeAttr('disabled');


            //uploadConfig.bodyParams[$scope.formsCookieName] = $scope.formsCookieValue;
            //uploadConfig.bodyParams[$scope.sessionCookieName] = $scope.sessionCookieValue;

            this.newUploadInstance(uploadConfig);

            //uploadFileDataService.setHttpConfiguration(httpConfiguration);
            //uploadFileDataService.setMessageId($scope.messageId);
        }

        getSetting = (key: string, defaultValue: any) => {
            return defaultValue;
        }

        
        
        newUploadInstance = (config: any) => {
            config = $.extend(this.buildDefaultConfig(), config);
            var __this = this;
            try {
                __this.uploader = new __this.plupload.Uploader({
                    browse_button: config.button,
                    drop_element: config.dropArea,
                    url: config.url,
                    runtimes: config.runtimes,
                    //headers: undefined, - according with documentation 'headers' works in flash only using some special options - e.g. urlstream_upload
                    send_chunk_number: false,
                    multipart_params: config.bodyParams,
                    chunk_size: config.chunk_size,
                    max_retries: config.max_retries,
                    flash_swf_url: config.flash_swf_url,
                    silverlight_xap_url: config.silverlight_xap_url,
                    filters: {
                        max_file_size: config.maxFileSize,
                        prevent_duplicates: config.preventDuplicates
                    },
                    // PreInit events, bound before any internal events
                    preinit: {
                        Init: (up, info) => { },
                        UploadFile: (up, file) => { }
                    },
                    // Post init events, bound after the internal events
                    init: {
                        postInit: (up) => { }, // Called after initialization is finished and internal event handlers bound
                        Browse: function (up) {
                            //up.log.log('[Browse]');

                            //if (config.browse) {
                            //    config.browse(up.wrapper);
                            //}
                        },
                        //Refresh: refresh,
                        StateChanged: (up) => { },
                        //QueueChanged: queueChanged,
                        //OptionChange: optionChanged,
                        //BeforeUpload: beforeUpload,
                        UploadProgress: (up, file) => { },
                        FileFiltered: (up, file) => { },
                        FilesAdded: (up, files) => {
                            this.plupload.each(files, function (file) {
                                __this.scope.FUFileUploadRefCounter++;
                                __this.EnableDisableStartButton();
                                //if (isHtml4) {
                                //    file.npsProperties.timeout = undefined;
                                //}
                            });

                            __this.startUpload();
                        },
                        FilesRemoved: (up, files) => { },
                        FileUploaded: (up, file, info) => {
                            __this.scope.FUFileUploadRefCounter--;
                            __this.EnableDisableStartButton();
                            if (!__this._isUploading) __this.radioPubSubSvc.publish(__this.pubSubConstants.FileUploaded, null);
                        },
                        ChunkUploaded: (up, file, info) => { },
                        UploadComplete: (up, files) => { },
                        //Destry: destroy,
                        Error: (up, args) => { }
                    }
                });
                
                __this.uploader.init();
            }
            catch (ex) { alert(ex.message);}

            

            //this.uploader.timeout = config.timeout;
            //this.uploader.maxFileAutoRetryAttempts = config.maxFileAutoRetryAttempts;
            //this.uploader.defaultLog = this.uploader.log = log;


        }

        
        EnableDisableStartButton = () => {
            var __this = this;

            if (__this.scope.FUFileUploadRefCounter > 0) {
                //$('#' + __this.scope.StartButtonId).removeAttr('disabled');
            }
            else {
                //$('#' + __this.scope.StartButtonId).attr('disabled', '');
                __this._isUploading = false;
            }

            __this.scope.$apply();
        }
    }




    interface IFileUploadScope extends ng.IScope {
        FUFileUploadRefCounter: number;
        FUBrowseButtonId: string;
        FUDropAreaId: string ;
        //StartButtonId: string;
        FUDock: string;
        FUUrl: string;
        FUCN: string;
    }
    class FileUploadController {
      


        constructor(public $scope: IFileUploadScope,
            private $routeParams: any,
            private $rootScope: any,
            private $injector: any) {
            

        }


  
        
    }


    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dFileUpload", FileUploadDirective.prototype.injection());
}



















// config.button - browse button to trigger file selection(s)
// config.url - url to upload the file to 
// config.beforeFileUpload(uploader, file) - function called before each file is uploaded
// config.bodyParams{} - hash of the parameters and values to send to the server with each file being sent
// config.runtimes - list of runtimes to use as the uploading component, default: "html5,flash,html4"
// config.preventDuplicates - allow duplicates to be in the queue. default: true
// config.maxFileSize - maximum file size to allow to be uploaded in bytes, 0 for unlimited, default: 2147483647
// config.postInitialisation(uploader) - function called when uploader has initialised, Post init events, bound after the internal events
// config.maxFileAutoRetryAttempts - number of automatic retry attempts to upload a file, default: 3,
// config.stateChanged(uploader) - function called when state of the queue is changed
// config.uploadProgress(uploader, file) - function called while a file is being uploaded
// config.fileFiltered(uploader, file) - function called file has passed all the filters
// config.filesAdded(uploader, files) - function called when files are added to the queue
// config.filesRemoved(uploader, files) - function called when files are removed from the queue
// config.fileUploaded(uploader, file, info) - function called when file has been uploaded
// config.uploadComplete(upload, files) - function called when all files have been uploaded or failed
// config.error(uploader, args) - function called when error occurs
// config.attachCustomPropertiesToFile(file, customProperties) - function called when a file is added to the queue
// config.timeout - milliseconds without response from server before failing the upload. 0 = inifinate
// config.canRetryFiles(files) - return false to cancel automatic retry of files
