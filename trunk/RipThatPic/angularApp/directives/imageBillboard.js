var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var ImageBillboardDirective = (function () {
            function ImageBillboardDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.clearAnimation = function () {
                    clearInterval(_this.pointerAnimation);
                    $('#imgbttn').width('0');
                    $('#imgbttn').stop();
                    _this.scope.IMGBCurrentIndex = -1;
                    _this.scope.IMGBItems = null;
                    _this.scope.IMGBItemNos = null;
                };
                this.pointerAnimation = 0;
                this.restartAnimation = function () {
                    var __this = _this;
                    __this.clearAnimation();
                    __this.pointerAnimation = setInterval(__this.changeImage, __this.scope.IMGBTimeBetweenEachFrame);
                    setTimeout(__this.changeImage, 50); //force a first image
                };
                this.changeImage = function () {
                    _this.changeImageToID('');
                };
                this.changeImageToID = function (guidToLoad) {
                    var __this = _this;
                    if (__this.scope.IMGBItems == null || __this.scope.IMGBItems.length === 0)
                        __this.scope.IMGBItems = __this.scope.IMGBRootElement.find('.item');
                    if (__this.scope.IMGBItemNos == null || __this.scope.IMGBItemNos.length === 0)
                        __this.scope.IMGBItemNos = __this.scope.IMGBRootElement.find('.itemno');
                    __this.scope.IMGBItemNos.each(function (id, el) { $(el).removeClass('selected'); });
                    if (__this.scope.IMGBItems.length > 0) {
                        var previousItem = __this.scope.IMGBItems[__this.scope.IMGBCurrentIndex];
                        //determine next index to change to
                        if (guidToLoad === '') {
                            __this.scope.IMGBCurrentIndex++;
                        }
                        else {
                            var indexToChangeTo = -1;
                            jQuery.each(__this.scope.IMGBItems, function (idx, el) {
                                if ($(el).data('id') === guidToLoad)
                                    indexToChangeTo = idx;
                            });
                            __this.scope.IMGBCurrentIndex = indexToChangeTo;
                        }
                        //if index is greater than number of images reset to start
                        if (__this.scope.IMGBCurrentIndex >= __this.scope.IMGBItems.length)
                            __this.scope.IMGBCurrentIndex = 0;
                        var currentItem = __this.scope.IMGBItems[__this.scope.IMGBCurrentIndex];
                        var id = $(currentItem).data('id');
                        jQuery.each(__this.scope.IMGBItemNos, function (idx) {
                            var iit = __this.scope.IMGBItemNos[idx];
                            if ($(iit).data('id') === id) {
                                $(iit).addClass('selected');
                            }
                        });
                        if (__this.scope.IMGBCurrentIndex >= 0)
                            $(previousItem).fadeOut(500);
                        $('#imgbttn').animate({ width: __this.scope.IMGBItemWidth }, __this.scope.IMGBTimeBetweenEachFrame, function () { $('#imgbttn').width('0'); });
                        $(currentItem).fadeIn(1000);
                    }
                };
                this.initPubSub = function () {
                    _this.radioPubSubSvc.subscribe(_this.pubSubConstants.FileUploaded, _this.RefreshData.bind(_this), undefined);
                    _this.radioPubSubSvc.subscribe(_this.pubSubConstants.ImageContainerChanged, _this.ContainerChanged.bind(_this), undefined);
                    _this.scope.$on('$destroy', _this.destructor);
                };
                this.destructor = function () {
                    var __this = _this;
                    _this.radioPubSubSvc.unsubscribe(_this.pubSubConstants.FileUploaded, __this.RefreshData);
                    _this.radioPubSubSvc.unsubscribe(_this.pubSubConstants.ImageContainerChanged, __this.ContainerChanged);
                };
                this._isRefreshing = false;
                this.ItemSelected = function (scope, evt) {
                    //now do stuff with the selected item
                    var el = evt.currentTarget;
                    clearInterval(_this.pointerAnimation);
                    $('#imgbttn').width('0');
                    $('#imgbttn').stop();
                    _this.changeImageToID($(el).data('id'));
                    _this.pointerAnimation = setInterval(_this.changeImage, _this.scope.IMGBTimeBetweenEachFrame);
                };
                this.safeApply = function (scope, fn) {
                    (scope.$$phase || scope.$root.$$phase) ? fn() : scope.$apply(fn);
                };
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/image-billboard.html';
                // this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl ];
                this.link = function ($scope, element, attributes, controller) {
                    _this.scope = $scope;
                    _this.scope.IMGBRootElement = element;
                    _this.scope.IMGBTimeBetweenEachFrame = 10000; //10 seconds
                    if (attributes.$attr["daBottom"])
                        _this.scope.IMGBBottom = element.attr(attributes.$attr["daBottom"]);
                    if (attributes.$attr["daTop"])
                        _this.scope.IMGBTop = element.attr(attributes.$attr["daTop"]);
                    if (attributes.$attr["daLeft"])
                        _this.scope.IMGBLeft = element.attr(attributes.$attr["daLeft"]);
                    if (attributes.$attr["daRight"])
                        _this.scope.IMGBRight = element.attr(attributes.$attr["daRight"]);
                    if (attributes.$attr["daHeight"])
                        _this.scope.IMGBHeight = element.attr(attributes.$attr["daHeight"]);
                    if (attributes.$attr["daWidth"])
                        _this.scope.IMGBWidth = element.attr(attributes.$attr["daWidth"]);
                    if (attributes.$attr["daItemHeight"])
                        _this.scope.IMGBItemHeight = element.attr(attributes.$attr["daItemHeight"]);
                    if (attributes.$attr["daItemWidth"])
                        _this.scope.IMGBItemWidth = element.attr(attributes.$attr["daItemWidth"]);
                    if (attributes.$attr["daHideNumbers"])
                        _this.scope.IMGBHideNumbers = element.attr(attributes.$attr["daHideNumbers"]) == "true" ? true : false;
                    if (attributes.$attr["daCn"])
                        _this.scope.IMGBCN = element.attr(attributes.$attr["daCn"]);
                    if (_this.scope.IMGBCN == 'undefined' || _this.scope.IMGBCN == undefined)
                        _this.scope.IMGBCN = '';
                    var rootElement = $(element[0]);
                    var setAbsolute = false;
                    if ($scope.IMGBBottom != undefined && element) {
                        rootElement.css('bottom', $scope.IMGBBottom);
                        setAbsolute = true;
                    }
                    if ($scope.IMGBTop != undefined && element) {
                        rootElement.css('top', $scope.IMGBTop);
                        setAbsolute = true;
                    }
                    if ($scope.IMGBLeft != undefined && element) {
                        rootElement.css('left', $scope.IMGBLeft);
                        setAbsolute = true;
                    }
                    if ($scope.IMGBRight != undefined && element) {
                        rootElement.css('right', $scope.IMGBRight);
                        setAbsolute = true;
                    }
                    if ($scope.IMGBWidth != undefined && element) {
                        rootElement.css('width', $scope.IMGBWidth);
                    }
                    if ($scope.IMGBHeight != undefined && element) {
                        rootElement.css('height', $scope.IMGBHeight);
                    }
                    //if ($scope.IMGBItemWidth != undefined && element) { rootElement.css('width', parseInt($scope.IMGBItemWidth) + 20); }
                    //if ($scope.IMGBItemHeight != undefined && element) { rootElement.css('height', parseInt($scope.IMGBItemHeight) + 20); }
                    if (setAbsolute)
                        rootElement.css('position', 'Absolute').css('padding', '0 5px 7px 5px');
                    $('#imgbli').width(parseInt(_this.scope.IMGBItemWidth) - 10 + 'px');
                    if ($scope.IMGBHideNumbers)
                        $('#imgbli').hide();
                    else
                        $('#imgbli').show();
                    _this.scope.IMGBSelectedItems = [];
                    _this.scope.IMGBItemSelected = function (evt) { _this.ItemSelected(_this.scope, evt); };
                    _this.init();
                };
            }
            ImageBillboardDirective.prototype.init = function () {
                this.initPubSub();
                if (this.scope.IMGBCN) {
                    this.RefreshData();
                }
            };
            ImageBillboardDirective.prototype.ContainerChanged = function (cn) {
                this.scope.IMGBCN = cn === '-all-' ? '' : cn;
                this.RefreshData();
            };
            ImageBillboardDirective.prototype.RefreshData = function () {
                var __this = this;
                //stop refreshing being called again if its currently running
                if (__this._isRefreshing)
                    return;
                //tag this method as already running
                __this._isRefreshing = true;
                __this.clearAnimation();
                __this.scope.IMGBItemsList = [];
                if (__this.scope.IMGBCN === '') {
                    this.dataSvc
                        .getAll("Image", __this.authService.sessionId)
                        .success(function (result) {
                        __this.scope.IMGBItemsList = result;
                        $.each(__this.scope.IMGBItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1000);
                            var firstPart = this.ContentType.substring(0, 5);
                            if (firstPart == 'image') {
                                this._ImgUrl = 'http://austoragetest.blob.core.windows.net/' + this.Grouping + '-thumb/' + this.Name;
                            }
                            else if (firstPart == 'audio') {
                                this._ImgUrl = '/Content/placeholders/audio-wide.png';
                            }
                            else if (firstPart == 'video') {
                                this._ImgUrl = '/Content/placeholders/video-wide.png';
                            }
                            else if (firstPart == 'appli') {
                                this._ImgUrl = '/Content/placeholders/file-wide.png';
                            }
                            else {
                                this._ImgUrl = '/Content/placeholders/unknown-wide.png';
                            }
                        });
                        __this.restartAnimation();
                        __this._isRefreshing = false;
                    })
                        .error(function (err) { });
                }
                else {
                    this.dataSvc
                        .getAllByGrouping("Image", __this.scope.IMGBCN, __this.authService.sessionId)
                        .success(function (result) {
                        __this.scope.IMGBItemsList = [];
                        __this.scope.IMGBItemsList = result;
                        $.each(__this.scope.IMGBItemsList, function () {
                            this.SizeKB = Math.round(this.Size / 1024);
                            var firstPart = this.ContentType.substring(0, 5);
                            if (firstPart == 'image') {
                                this._ImgUrl = 'http://austoragetest.blob.core.windows.net/' + this.Grouping + '-thumb/' + this.Name;
                            }
                            else if (firstPart == 'audio') {
                                this._ImgUrl = '/Content/placeholders/audio-wide.png';
                            }
                            else if (firstPart == 'video') {
                                this._ImgUrl = '/Content/placeholders/video-wide.png';
                            }
                            else if (firstPart == 'appli') {
                                this._ImgUrl = '/Content/placeholders/file-wide.png';
                            }
                            else {
                                this._ImgUrl = '/Content/placeholders/unknown-wide.png';
                            }
                        });
                        __this.restartAnimation();
                        __this._isRefreshing = false;
                    })
                        .error(function (err) { });
                }
            };
            return ImageBillboardDirective;
        }());
        Directives.ImageBillboardDirective = ImageBillboardDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dImageBillboard", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) { return new ImageBillboardDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }]);
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=imageBillboard.js.map