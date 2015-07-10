var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var FileUploadDirective = (function () {
            function FileUploadDirective(pubSubConstants, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.radioPubSubSvc = radioPubSubSvc;
                this.localWindow = window;
                this.plupload = this.localWindow.plupload;
                this.httpConfiguration = {
                    timeout: 120000 // 2 minutes
                };
                this.buildDefaultConfig = function () {
                    return {
                        //button : '',
                        //url : '',
                        //beforeFileUpload: function (uploader, file){},
                        //postInitialisation: function (uploader)
                        headers: {},
                        bodyParams: {},
                        runtimes: 1,
                        preventDuplicates: true,
                        maxFileSize: 0,
                        maxFileAutoRetryAttempts: 4,
                        timeout: 0,
                        flash_swf_url: '/scripts/plupload/moxie.swf',
                        silverlight_xap_url: '/scripts/plupload/moxie.xap'
                    };
                };
                this._isUploading = false;
                this.startUpload = function () {
                    var __this = _this;
                    if (__this._isUploading)
                        return;
                    __this.uploader.settings.url = __this.scope.Url + '?cn=' + __this.scope.CN;
                    __this.uploader.start();
                    __this._isUploading = true;
                };
                this.initUploader = function () {
                    var __this = _this;
                    __this.scope.Url = '/api/Upload';
                    var uploadConfig = {
                        button: _this.scope.BrowseButtonId,
                        dropArea: _this.scope.DropAreaId,
                        url: __this.scope.Url,
                        headers: {},
                        bodyParams: {},
                        beforeFileUpload: function () {
                        },
                        postInitialisation: function () {
                        },
                        filesAdded: function () {
                        },
                        filesRemoved: function () {
                        },
                        fileUploaded: function () {
                        },
                        fileFiltered: function () {
                        },
                        attachCustomPropertiesToFile: function () {
                        },
                        uploadComplete: function () {
                        },
                        uploadProgress: function () {
                        },
                        stateChanged: function () {
                        },
                        canRetryFiles: function () {
                        },
                        error: function () {
                        },
                        browse: function () {
                        },
                        timeout: _this.getSetting(_this.pubSubConstants.CookieSettings_FileUploadTimeout, _this.httpConfiguration.timeout),
                        runtimes: _this.getSetting(_this.pubSubConstants.CookieSettings_FileUploadRuntimes, 'html5,flash,html4'),
                        chunk_size: _this.getSetting(_this.pubSubConstants.CookieSettings_FileUploadChunkSize, 0),
                        maxFileAutoRetryAttempts: _this.getSetting(_this.pubSubConstants.CookieSettings_FileUploadRetries, 4),
                        maxFileSize: _this.getSetting(_this.pubSubConstants.CookieSettings_FileUploadMaxFileSize, 2147483647)
                    };
                    if (!_this.scope.BrowseButtonId) {
                        alert('Browse button not specified');
                        return;
                    }
                    $('#' + _this.scope.BrowseButtonId).removeAttr('disabled');
                    //uploadConfig.bodyParams[$scope.formsCookieName] = $scope.formsCookieValue;
                    //uploadConfig.bodyParams[$scope.sessionCookieName] = $scope.sessionCookieValue;
                    _this.newUploadInstance(uploadConfig);
                    //uploadFileDataService.setHttpConfiguration(httpConfiguration);
                    //uploadFileDataService.setMessageId($scope.messageId);
                };
                this.getSetting = function (key, defaultValue) {
                    return defaultValue;
                };
                this.newUploadInstance = function (config) {
                    config = $.extend(_this.buildDefaultConfig(), config);
                    var __this = _this;
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
                                Init: function (up, info) {
                                },
                                UploadFile: function (up, file) {
                                }
                            },
                            // Post init events, bound after the internal events
                            init: {
                                postInit: function (up) {
                                },
                                Browse: function (up) {
                                    //up.log.log('[Browse]');
                                    //if (config.browse) {
                                    //    config.browse(up.wrapper);
                                    //}
                                },
                                //Refresh: refresh,
                                StateChanged: function (up) {
                                },
                                //QueueChanged: queueChanged,
                                //OptionChange: optionChanged,
                                //BeforeUpload: beforeUpload,
                                UploadProgress: function (up, file) {
                                },
                                FileFiltered: function (up, file) {
                                },
                                FilesAdded: function (up, files) {
                                    _this.plupload.each(files, function (file) {
                                        __this.scope.FileUploadRefCounter++;
                                        __this.EnableDisableStartButton();
                                        //if (isHtml4) {
                                        //    file.npsProperties.timeout = undefined;
                                        //}
                                    });
                                    __this.startUpload();
                                },
                                FilesRemoved: function (up, files) {
                                },
                                FileUploaded: function (up, file, info) {
                                    __this.scope.FileUploadRefCounter--;
                                    __this.EnableDisableStartButton();
                                    if (!__this._isUploading)
                                        __this.radioPubSubSvc.publish(__this.pubSubConstants.FileUploaded, null);
                                },
                                ChunkUploaded: function (up, file, info) {
                                },
                                UploadComplete: function (up, files) {
                                },
                                //Destry: destroy,
                                Error: function (up, args) {
                                }
                            }
                        });
                        __this.uploader.init();
                    }
                    catch (ex) {
                        alert(ex.message);
                    }
                    //this.uploader.timeout = config.timeout;
                    //this.uploader.maxFileAutoRetryAttempts = config.maxFileAutoRetryAttempts;
                    //this.uploader.defaultLog = this.uploader.log = log;
                };
                this.EnableDisableStartButton = function () {
                    var __this = _this;
                    if (__this.scope.FileUploadRefCounter > 0) {
                    }
                    else {
                        //$('#' + __this.scope.StartButtonId).attr('disabled', '');
                        __this._isUploading = false;
                    }
                    __this.scope.$apply();
                };
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/file-upload.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', FileUploadController];
                this.link = function ($scope, element, attributes, controller) {
                    _this.scope = $scope;
                    _this.scope.BrowseButtonId = 'browse_button';
                    _this.scope.DropAreaId = 'drop_area';
                    //this.scope.StartButtonId = 'start_button';
                    _this.scope.FileUploadRefCounter = 0;
                    _this.scope.Dock = 'top';
                    if (attributes.$attr["daDock"])
                        _this.scope.Dock = element.attr(attributes.$attr["daDock"]);
                    element.addClass('fu-dock-' + _this.scope.Dock);
                    if (attributes.$attr["daCn"])
                        _this.scope.CN = element.attr(attributes.$attr["daCn"]);
                    _this.initUploader();
                    //changing to auto uploading
                    //element.find('#start_button').on('click', this.startUpload);
                };
            }
            FileUploadDirective.prototype.injection = function () {
                return [
                    "pubSubConstants",
                    "radioPubSubSvc",
                    function (pubSubConstants, radioPubSubSvc) {
                        return new FileUploadDirective(pubSubConstants, radioPubSubSvc);
                    }
                ];
            };
            return FileUploadDirective;
        })();
        Directives.FileUploadDirective = FileUploadDirective;
        var FileUploadController = (function () {
            function FileUploadController($scope, $routeParams, $rootScope, $injector) {
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$rootScope = $rootScope;
                this.$injector = $injector;
            }
            return FileUploadController;
        })();
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dFileUpload", FileUploadDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
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
//# sourceMappingURL=fileUpload.js.map