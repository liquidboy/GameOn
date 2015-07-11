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
                        }
                        else {
                            $(el).addClass('selected');
                            $(el).find('.chk').show();
                            scope.FSSelectedItems.push(el);
                        }
                    }
                    else {
                        if (foundItInList != null) {
                            $(foundItInList).removeClass('selected');
                            $(foundItInList).find('.chk').hide();
                            var index = scope.FSSelectedItems.indexOf(foundItInList);
                            scope.FSSelectedItems.splice(index, 1);
                        }
                        else {
                            //clear list of anything 
                            if (scope.FSSelectedItems !== null && scope.FSSelectedItems.length >= 1) {
                                $(scope.FSSelectedItems).removeClass('selected');
                                $(scope.FSSelectedItems).find('.chk').hide();
                                scope.FSSelectedItems = [];
                            }
                            //now add this single item into the list
                            $(el).addClass('selected');
                            $(el).find('.chk').show();
                            scope.FSSelectedItems.push(el);
                        }
                    }
                };
                this.safeApply = function (scope, fn) {
                    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
                };
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/file-storage-list.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl];
                this.link = function ($scope, element, attributes, controller) {
                    _this.scope = $scope;
                    if (attributes.$attr["daBottom"])
                        _this.scope.FSBottom = element.attr(attributes.$attr["daBottom"]);
                    if (attributes.$attr["daTop"])
                        _this.scope.FSTop = element.attr(attributes.$attr["daTop"]);
                    if (attributes.$attr["daItemHeight"])
                        _this.scope.FSItemHeight = element.attr(attributes.$attr["daItemHeight"]);
                    if (attributes.$attr["daLeft"])
                        _this.scope.FSLeft = element.attr(attributes.$attr["daLeft"]);
                    if (attributes.$attr["daRight"])
                        _this.scope.FSRight = element.attr(attributes.$attr["daRight"]);
                    if (attributes.$attr["daIsMultipleSelection"])
                        _this.scope.FSIsMultipleSelection = element.attr(attributes.$attr["daIsMultipleSelection"]) == "true" ? true : false;
                    if (attributes.$attr["daCn"])
                        _this.scope.FSCN = element.attr(attributes.$attr["daCn"]);
                    if (_this.scope.FSCN == 'undefined' || _this.scope.FSCN == undefined)
                        _this.scope.FSCN = '';
                    _this.scope.FSSelectedItems = [];
                    _this.scope.FSItemSelected = function (evt) {
                        _this.ItemSelected(_this.scope, evt);
                    };
                    _this.init();
                };
            }
            FileStorageListDirective.prototype.init = function () {
                this.initPubSub();
                //this.RefreshData();   
            };
            FileStorageListDirective.prototype.ContainerChanged = function (cn) {
                this.scope.FSCN = cn === '-all-' ? '' : cn;
                this.RefreshData();
            };
            FileStorageListDirective.prototype.RefreshData = function () {
                var __this = this;
                //stop refreshing being called again if its currently running
                if (__this._isRefreshing)
                    return;
                //tag this method as already running
                __this._isRefreshing = true;
                if (__this.scope.FSCN === '') {
                    this.dataSvc.getAll("FileStorage", __this.authService.sessionId).success(function (result) {
                        __this.scope.FSItemsList = result;
                        $.each(__this.scope.FSItemsList, function () {
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
                    this.dataSvc.getAllByGrouping("FileStorage", __this.scope.FSCN, __this.authService.sessionId).success(function (result) {
                        //__this.scope.ItemsList = [];
                        //$.each(result, function () {
                        //    this.SizeKB = Math.round(this.Size / 1000);
                        //    __this.scope.ItemsList.push(this);
                        //});
                        __this.scope.FSItemsList = result;
                        $.each(__this.scope.FSItemsList, function () {
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
            return FileStorageListDirective;
        })();
        Directives.FileStorageListDirective = FileStorageListDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dFileStorageList", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) {
            return new FileStorageListDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc);
        }]);
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=fileStorageList.js.map