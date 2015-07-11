var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var FileStorageBillboardDirective = (function () {
            function FileStorageBillboardDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.initPubSub = function () {
                    _this.radioPubSubSvc.subscribe(_this.pubSubConstants.FileUploaded, _this.RefreshData.bind(_this), undefined);
                    _this.radioPubSubSvc.subscribe(_this.pubSubConstants.FileStorageContainerChanged, _this.ContainerChanged.bind(_this), undefined);
                    _this.scope.$on('$destroy', _this.destructor);
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
                    //see if its already in the list
                    var foundItInList = null;
                    $.each(scope.FSBSelectedItems, function (index) {
                        var elm = scope.FSBSelectedItems[index];
                        if ($(elm).data('id') === $(el).data('id')) {
                            foundItInList = el;
                        }
                    });
                    if (scope.FSBIsMultipleSelection) {
                        if (foundItInList != null) {
                            $(foundItInList).removeClass('selected');
                            $(foundItInList).find('.chk').hide();
                            var index = scope.FSBSelectedItems.indexOf(foundItInList);
                            scope.FSBSelectedItems.splice(index, 1);
                        }
                        else {
                            $(el).addClass('selected');
                            $(el).find('.chk').show();
                            scope.FSBSelectedItems.push(el);
                        }
                    }
                    else {
                        if (foundItInList != null) {
                            $(foundItInList).removeClass('selected');
                            $(foundItInList).find('.chk').hide();
                            var index = scope.FSBSelectedItems.indexOf(foundItInList);
                            scope.FSBSelectedItems.splice(index, 1);
                        }
                        else {
                            //clear list of anything 
                            if (scope.FSBSelectedItems !== null && scope.FSBSelectedItems.length >= 1) {
                                $(scope.FSBSelectedItems).removeClass('selected');
                                $(scope.FSBSelectedItems).find('.chk').hide();
                                scope.FSBSelectedItems = [];
                            }
                            //now add this single item into the list
                            $(el).addClass('selected');
                            $(el).find('.chk').show();
                            scope.FSBSelectedItems.push(el);
                        }
                    }
                };
                this.safeApply = function (scope, fn) {
                    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
                };
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/file-storage-billboard.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl];
                this.link = function ($scope, element, attributes, controller) {
                    _this.scope = $scope;
                    if (attributes.$attr["daBottom"])
                        _this.scope.FSBBottom = element.attr(attributes.$attr["daBottom"]);
                    if (attributes.$attr["daTop"])
                        _this.scope.FSBTop = element.attr(attributes.$attr["daTop"]);
                    if (attributes.$attr["daItemHeight"])
                        _this.scope.FSBItemHeight = element.attr(attributes.$attr["daItemHeight"]);
                    if (attributes.$attr["daLeft"])
                        _this.scope.FSBLeft = element.attr(attributes.$attr["daLeft"]);
                    if (attributes.$attr["daRight"])
                        _this.scope.FSBRight = element.attr(attributes.$attr["daRight"]);
                    if (attributes.$attr["daIsMultipleSelection"])
                        _this.scope.FSBIsMultipleSelection = element.attr(attributes.$attr["daIsMultipleSelection"]) == "true" ? true : false;
                    if (attributes.$attr["daCn"])
                        _this.scope.FSBCN = element.attr(attributes.$attr["daCn"]);
                    if (_this.scope.FSBCN == 'undefined' || _this.scope.FSBCN == undefined)
                        _this.scope.FSBCN = '';
                    _this.scope.FSBSelectedItems = [];
                    _this.scope.FSBItemSelected = function (evt) {
                        _this.ItemSelected(_this.scope, evt);
                    };
                    _this.init();
                };
            }
            FileStorageBillboardDirective.prototype.init = function () {
                this.initPubSub();
                //this.RefreshData();   
            };
            FileStorageBillboardDirective.prototype.ContainerChanged = function (cn) {
                this.scope.FSBCN = cn === '-all-' ? '' : cn;
                this.RefreshData();
            };
            FileStorageBillboardDirective.prototype.RefreshData = function () {
                var __this = this;
                //stop refreshing being called again if its currently running
                if (__this._isRefreshing)
                    return;
                //tag this method as already running
                __this._isRefreshing = true;
                __this.scope.FSBItemsList = [];
                if (__this.scope.FSBCN === '') {
                    this.dataSvc.getAll("FileStorage", __this.authService.sessionId).success(function (result) {
                        __this.scope.FSBItemsList = result;
                        $.each(__this.scope.FSBItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1000);
                        });
                        try {
                            //freaking using apply was causing digest errors .. going with timeout approach
                            eval('setTimeout(function(){$("#fsl").justifiedGallery();}, 10);');
                        }
                        catch (e) {
                        }
                        __this._isRefreshing = false;
                    }).error(function (err) {
                    });
                }
                else {
                    this.dataSvc.getAllByGrouping("FileStorage", __this.scope.FSBCN, __this.authService.sessionId).success(function (result) {
                        //__this.scope.ItemsList = [];
                        //$.each(result, function () {
                        //    this.SizeKB = Math.round(this.Size / 1000);
                        //    __this.scope.ItemsList.push(this);
                        //});
                        __this.scope.FSBItemsList = [];
                        __this.scope.FSBItemsList = result;
                        $.each(__this.scope.FSBItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1024);
                        });
                        try {
                            //__this.scope.$apply(); //<-- its important to "apply" angular binding changes otherwise the justifiedlib does not correctly layout stuff
                            //eval('$("#fsl").justifiedGallery();');
                            //freaking using apply was causing digest errors .. going with timeout approach
                            eval('setTimeout(function(){$("#fsl").justifiedGallery();}, 10);');
                        }
                        catch (e) {
                        }
                        __this._isRefreshing = false;
                    }).error(function (err) {
                    });
                }
            };
            return FileStorageBillboardDirective;
        })();
        Directives.FileStorageBillboardDirective = FileStorageBillboardDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dFileStorageBillboard", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) {
            return new FileStorageBillboardDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc);
        }]);
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=fileStorageBillboard.js.map