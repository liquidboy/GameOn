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
                this.pointerAnimation = 0;
                this.restartAnimation = function () {
                    var __this = _this;
                    //setup rotating animation
                    clearInterval(__this.pointerAnimation);
                    __this.scope.FSBCurrentIndex = 0;
                    __this.pointerAnimation = setInterval(function () {
                        var items = __this.scope.FSBRootElement.find('.item');
                        var itemnos = __this.scope.FSBRootElement.find('.itemno');
                        itemnos.each(function (id, el) {
                            $(el).removeClass('selected');
                        });
                        if (items.length > 0) {
                            var item = items[__this.scope.FSBCurrentIndex];
                            var id = $(item).data('id');
                            jQuery.each(itemnos, function (idx) {
                                var iit = itemnos[idx];
                                if ($(iit).data('id') === id) {
                                    $(iit).addClass('selected');
                                }
                            });
                            if (__this.scope.FSBCurrentIndex >= 0)
                                $(item).fadeOut(500);
                            __this.scope.FSBCurrentIndex++;
                            if (__this.scope.FSBCurrentIndex >= items.length)
                                __this.scope.FSBCurrentIndex = 0;
                            $(item).fadeIn(1000);
                        }
                    }, 5000);
                };
                this.initPubSub = function () {
                    _this.radioPubSubSvc.subscribe(_this.pubSubConstants.FileStorageContainerChanged, _this.ContainerChanged.bind(_this), undefined);
                    _this.scope.$on('$destroy', _this.destructor);
                };
                this.destructor = function () {
                    var __this = _this;
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
                    if (attributes.$attr["daBottom"])
                        _this.scope.FSBBottom = element.attr(attributes.$attr["daBottom"]);
                    if (attributes.$attr["daTop"])
                        _this.scope.FSBTop = element.attr(attributes.$attr["daTop"]);
                    if (attributes.$attr["daLeft"])
                        _this.scope.FSBLeft = element.attr(attributes.$attr["daLeft"]);
                    if (attributes.$attr["daRight"])
                        _this.scope.FSBRight = element.attr(attributes.$attr["daRight"]);
                    if (attributes.$attr["daItemHeight"])
                        _this.scope.FSBItemHeight = element.attr(attributes.$attr["daItemHeight"]);
                    if (attributes.$attr["daItemWidth"])
                        _this.scope.FSBItemWidth = element.attr(attributes.$attr["daItemWidth"]);
                    if (attributes.$attr["daCn"])
                        _this.scope.FSBCN = element.attr(attributes.$attr["daCn"]);
                    if (_this.scope.FSBCN == 'undefined' || _this.scope.FSBCN == undefined)
                        _this.scope.FSBCN = '';
                    var finalStyle = '';
                    if ($scope.FSBBottom != undefined)
                        finalStyle += "Bottom: " + $scope.FSBBottom + ";";
                    if ($scope.FSBTop != undefined)
                        finalStyle += "Top: " + $scope.FSBTop + ";";
                    if ($scope.FSBLeft != undefined)
                        finalStyle += "Left: " + $scope.FSBLeft + ";";
                    if ($scope.FSBRight != undefined)
                        finalStyle += "Right: " + $scope.FSBRight + ";";
                    //if ($scope.FSBItemWidth != undefined) finalStyle += "Width: " + $scope.FSBItemWidth + ";";
                    //if ($scope.FSBItemHeight != undefined) finalStyle += "Height: " + $scope.FSBItemHeight + ";";
                    _this.scope.FSBLocationStyle = finalStyle;
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