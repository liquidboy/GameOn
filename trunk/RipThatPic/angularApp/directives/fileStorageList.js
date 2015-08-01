var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var FileStorageListDirective = (function () {
            function FileStorageListDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.initPubSub = function () {
                    _this.radioPubSubSvc.subscribe(_this.pubSubConstants.FileUploaded, _this.RefreshData.bind(_this), undefined);
                    _this.radioPubSubSvc.subscribe(_this.pubSubConstants.FileStorageContainerChanged, _this.ContainerChanged.bind(_this), undefined);
                    _this.sc.$on('$destroy', _this.destructor);
                };
                this.destructor = function () {
                    var __this = _this;
                    _this.radioPubSubSvc.unsubscribe(_this.pubSubConstants.FileUploaded, __this.RefreshData);
                    _this.radioPubSubSvc.unsubscribe(_this.pubSubConstants.FileStorageContainerChanged, __this.ContainerChanged);
                };
                this._isRefreshing = false;
                this.ItemSelected = function (scope, evt) {
                    //now do stuff with the selected item
                    var el = evt.currentTarget;
                    var did = $(el).data('id');
                    //see if its already in the list
                    var foundItInList = null;
                    $.each(scope.FSSelectedItems, function (index) {
                        var elm = scope.FSSelectedItems[index];
                        if ($(elm).data('id') === $(el).data('id')) {
                            foundItInList = el;
                        }
                    });
                    if (scope.FSIsMultipleSelection) {
                        if (foundItInList != null) {
                            $(foundItInList).removeClass('selected');
                            $(foundItInList).find('.chk').hide();
                            var index = scope.FSSelectedItems.indexOf(foundItInList);
                            scope.FSSelectedItems.splice(index, 1);
                            var indexid = scope.FSSelectedIds.indexOf(did);
                            scope.FSSelectedIds.splice(indexid, 1);
                        }
                        else {
                            $(el).addClass('selected');
                            $(el).find('.chk').show();
                            scope.FSSelectedItems.push(el);
                            scope.FSSelectedIds.push(did);
                        }
                    }
                    else {
                        if (foundItInList != null) {
                            $(foundItInList).removeClass('selected');
                            $(foundItInList).find('.chk').hide();
                            var index = scope.FSSelectedItems.indexOf(foundItInList);
                            scope.FSSelectedItems.splice(index, 1);
                            var indexid = scope.FSSelectedIds.indexOf(foundItInList);
                            scope.FSSelectedIds.splice(indexid, 1);
                        }
                        else {
                            //clear list of anything 
                            if (scope.FSSelectedItems !== null && scope.FSSelectedItems.length >= 1) {
                                $(scope.FSSelectedItems).removeClass('selected');
                                $(scope.FSSelectedItems).find('.chk').hide();
                                scope.FSSelectedItems = [];
                            }
                            scope.FSSelectedIds = [];
                            //now add this single item into the list
                            $(el).addClass('selected');
                            $(el).find('.chk').show();
                            scope.FSSelectedItems.push(el);
                            scope.FSSelectedIds.push(did);
                        }
                    }
                    _this.radioPubSubSvc.publish(_this.pubSubConstants.FileStorageListSelectionsChanged, scope.FSSelectedIds.join());
                };
                this.safeApply = function (scope, fn) {
                    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
                };
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/file-storage-list.html';
                this.link = function ($scope, element, attributes) {
                    _this.sc = $scope;
                    if (attributes.$attr["daBottom"])
                        _this.sc.FSBottom = element.attr(attributes.$attr["daBottom"]);
                    if (attributes.$attr["daTop"])
                        _this.sc.FSTop = element.attr(attributes.$attr["daTop"]);
                    if (attributes.$attr["daItemHeight"])
                        _this.sc.FSItemHeight = element.attr(attributes.$attr["daItemHeight"]);
                    if (attributes.$attr["daLeft"])
                        _this.sc.FSLeft = element.attr(attributes.$attr["daLeft"]);
                    if (attributes.$attr["daRight"])
                        _this.sc.FSRight = element.attr(attributes.$attr["daRight"]);
                    if (attributes.$attr["daIsMultipleSelection"])
                        _this.sc.FSIsMultipleSelection = element.attr(attributes.$attr["daIsMultipleSelection"]) == "true" ? true : false;
                    if (attributes.$attr["daCn"])
                        _this.sc.FSCN = element.attr(attributes.$attr["daCn"]);
                    if (_this.sc.FSCN == 'undefined' || _this.sc.FSCN == undefined)
                        _this.sc.FSCN = '';
                    _this.sc.FSSelectedItems = [];
                    _this.sc.FSSelectedIds = [];
                    _this.sc.FSItemSelected = function (evt) { _this.ItemSelected(_this.sc, evt); };
                    _this.init();
                };
            }
            FileStorageListDirective.prototype.injection = function () {
                return [
                    "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                    function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) { return new FileStorageListDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
                ];
            };
            FileStorageListDirective.prototype.init = function () {
                this.initPubSub();
                //this.RefreshData();   
            };
            FileStorageListDirective.prototype.ContainerChanged = function (cn) {
                this.sc.FSCN = cn === '-all-' ? '' : cn;
                this.RefreshData();
            };
            FileStorageListDirective.prototype.RefreshData = function () {
                var __this = this;
                //stop refreshing being called again if its currently running
                if (__this._isRefreshing)
                    return;
                //tag this method as already running
                __this._isRefreshing = true;
                __this.sc.FSItemsList = [];
                if (__this.sc.FSCN === '') {
                    this.dataSvc
                        .getAll("FileStorage", __this.authService.sessionId)
                        .success(function (result) {
                        __this.sc.FSItemsList = result;
                        $.each(__this.sc.FSItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1000);
                        });
                        //justified gallery lib - http://miromannino.github.io/Justified-Gallery/
                        try {
                            //freaking using apply was causing digest errors .. going with timeout approach
                            eval('setTimeout(function(){$("#fsl").justifiedGallery();}, 10);');
                        }
                        catch (e) { }
                        __this._isRefreshing = false;
                    })
                        .error(function (err) { });
                }
                else {
                    this.dataSvc
                        .getAllByGrouping("FileStorage", __this.sc.FSCN, __this.authService.sessionId)
                        .success(function (result) {
                        //__this.sc.ItemsList = [];
                        //$.each(result, function () {
                        //    this.SizeKB = Math.round(this.Size / 1000);
                        //    __this.sc.ItemsList.push(this);
                        //});
                        __this.sc.FSItemsList = [];
                        __this.sc.FSItemsList = result;
                        $.each(__this.sc.FSItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1024);
                            var firstPart = this.ContentType.substring(0, 5);
                            if (firstPart == 'image') {
                                this._ImgUrl = 'http://austoragetest.blob.core.windows.net/' + this.Grouping + '-thumb/' + this.Name;
                            }
                            else if (firstPart == 'audio') {
                                this._ImgUrl = '/Content/placeholders/audio.png';
                            }
                            else if (firstPart == 'video') {
                                this._ImgUrl = '/Content/placeholders/video.png';
                            }
                            else if (firstPart == 'appli') {
                                this._ImgUrl = '/Content/placeholders/file.png';
                            }
                            else {
                                this._ImgUrl = '/Content/placeholders/unknown.png';
                            }
                        });
                        //justified gallery lib - http://miromannino.github.io/Justified-Gallery/
                        try {
                            //__this.sc.$apply(); //<-- its important to "apply" angular binding changes otherwise the justifiedlib does not correctly layout stuff
                            //eval('$("#fsl").justifiedGallery();');
                            //freaking using apply was causing digest errors .. going with timeout approach
                            eval('setTimeout(function(){$("#fsl").justifiedGallery();}, 10);');
                        }
                        catch (e) { }
                        __this._isRefreshing = false;
                    })
                        .error(function (err) { });
                }
            };
            return FileStorageListDirective;
        })();
        Directives.FileStorageListDirective = FileStorageListDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dFileStorageList", FileStorageListDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
