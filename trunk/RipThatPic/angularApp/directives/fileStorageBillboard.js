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
                this.clearAnimation = function () {
                    clearInterval(_this.pointerAnimation);
                    $('#fsbttn').stop();
                    _this.scope.FSBCurrentIndex = -1;
                    _this.scope.FSBItems = null;
                    _this.scope.FSBItemNos = null;
                    $('#fsbttn').width('0');
                };
                this.pointerAnimation = 0;
                this.restartAnimation = function () {
                    var __this = _this;
                    __this.clearAnimation();
                    __this.pointerAnimation = setInterval(__this.changeImage, __this.scope.FSBTimeBetweenEachFrame);
                    setTimeout(__this.changeImage, 50); //force a first image
                };
                this.changeImage = function () {
                    var __this = _this;
                    if (__this.scope.FSBItems == null || __this.scope.FSBItems.length === 0)
                        __this.scope.FSBItems = __this.scope.FSBRootElement.find('.item');
                    if (__this.scope.FSBItemNos == null || __this.scope.FSBItemNos.length === 0)
                        __this.scope.FSBItemNos = __this.scope.FSBRootElement.find('.itemno');
                    __this.scope.FSBItemNos.each(function (id, el) {
                        $(el).removeClass('selected');
                    });
                    if (__this.scope.FSBItems.length > 0) {
                        var previousItem = __this.scope.FSBItems[__this.scope.FSBCurrentIndex];
                        __this.scope.FSBCurrentIndex++;
                        if (__this.scope.FSBCurrentIndex >= __this.scope.FSBItems.length)
                            __this.scope.FSBCurrentIndex = 0;
                        var currentItem = __this.scope.FSBItems[__this.scope.FSBCurrentIndex];
                        var id = $(currentItem).data('id');
                        jQuery.each(__this.scope.FSBItemNos, function (idx) {
                            var iit = __this.scope.FSBItemNos[idx];
                            if ($(iit).data('id') === id) {
                                $(iit).addClass('selected');
                            }
                        });
                        if (__this.scope.FSBCurrentIndex >= 0)
                            $(previousItem).fadeOut(500);
                        $('#fsbttn').animate({ width: __this.scope.FSBItemWidth }, __this.scope.FSBTimeBetweenEachFrame, function () {
                            $('#fsbttn').width('0');
                        });
                        $(currentItem).fadeIn(1000);
                    }
                };
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
                    _this.scope.FSBRootElement = element;
                    _this.scope.FSBTimeBetweenEachFrame = 10000; //10 seconds
                    if (attributes.$attr["daBottom"])
                        _this.scope.FSBBottom = element.attr(attributes.$attr["daBottom"]);
                    if (attributes.$attr["daTop"])
                        _this.scope.FSBTop = element.attr(attributes.$attr["daTop"]);
                    if (attributes.$attr["daLeft"])
                        _this.scope.FSBLeft = element.attr(attributes.$attr["daLeft"]);
                    if (attributes.$attr["daRight"])
                        _this.scope.FSBRight = element.attr(attributes.$attr["daRight"]);
                    if (attributes.$attr["daHeight"])
                        _this.scope.FSBHeight = element.attr(attributes.$attr["daHeight"]);
                    if (attributes.$attr["daWidth"])
                        _this.scope.FSBWidth = element.attr(attributes.$attr["daWidth"]);
                    if (attributes.$attr["daItemHeight"])
                        _this.scope.FSBItemHeight = element.attr(attributes.$attr["daItemHeight"]);
                    if (attributes.$attr["daItemWidth"])
                        _this.scope.FSBItemWidth = element.attr(attributes.$attr["daItemWidth"]);
                    if (attributes.$attr["daCn"])
                        _this.scope.FSBCN = element.attr(attributes.$attr["daCn"]);
                    if (_this.scope.FSBCN == 'undefined' || _this.scope.FSBCN == undefined)
                        _this.scope.FSBCN = '';
                    var rootElement = $(element[0]);
                    if ($scope.FSBBottom != undefined && element) {
                        rootElement.css('bottom', $scope.FSBBottom);
                    }
                    if ($scope.FSBTop != undefined && element) {
                        rootElement.css('top', $scope.FSBTop);
                    }
                    if ($scope.FSBLeft != undefined && element) {
                        rootElement.css('left', $scope.FSBLeft);
                    }
                    if ($scope.FSBRight != undefined && element) {
                        rootElement.css('right', $scope.FSBRight);
                    }
                    if ($scope.FSBWidth != undefined && element) {
                        rootElement.css('width', $scope.FSBWidth);
                    }
                    if ($scope.FSBHeight != undefined && element) {
                        rootElement.css('height', $scope.FSBHeight);
                    }
                    //if ($scope.FSBItemWidth != undefined && element) { rootElement.css('width', parseInt($scope.FSBItemWidth) + 20); }
                    //if ($scope.FSBItemHeight != undefined && element) { rootElement.css('height', parseInt($scope.FSBItemHeight) + 20); }
                    $('#fsbli').width(parseInt(_this.scope.FSBItemWidth) - 10 + 'px');
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
                __this.clearAnimation();
                __this.scope.FSBItemsList = [];
                if (__this.scope.FSBCN === '') {
                    this.dataSvc.getAll("FileStorage", __this.authService.sessionId).success(function (result) {
                        __this.scope.FSBItemsList = result;
                        $.each(__this.scope.FSBItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1000);
                        });
                        __this.restartAnimation();
                        __this._isRefreshing = false;
                    }).error(function (err) {
                    });
                }
                else {
                    this.dataSvc.getAllByGrouping("FileStorage", __this.scope.FSBCN, __this.authService.sessionId).success(function (result) {
                        __this.scope.FSBItemsList = [];
                        __this.scope.FSBItemsList = result;
                        $.each(__this.scope.FSBItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1024);
                        });
                        __this.restartAnimation();
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