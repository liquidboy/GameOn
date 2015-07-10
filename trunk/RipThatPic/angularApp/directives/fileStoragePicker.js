var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var FileStoragePickerDirective = (function () {
            function FileStoragePickerDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.initPubSub = function () {
                    //this.radioPubSubSvc.subscribe(
                    //    this.pubSubConstants.FileUploaded,
                    //    this.RefreshData.bind(this),
                    //    undefined);
                    //this.scope.$on('$destroy', this.destructor);
                };
                this.destructor = function () {
                    var __this = _this;
                    _this.radioPubSubSvc.unsubscribe(_this.pubSubConstants.FileUploaded, function () {
                        __this.RefreshData();
                    });
                };
                this.ItemSelected = function (scope, evt) {
                    if (scope.FSPSelectedItem) {
                        $(scope.FSPSelectedItem).removeClass('selected');
                        scope.FSPSelectedItem = null;
                    }
                    var el = evt.currentTarget;
                    $(el).addClass('selected');
                    scope.FSPSelectedItem = el;
                };
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/file-storage-picker.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl];
                this.link = function ($scope, element, attributes, controller) {
                    _this.scope = $scope;
                    if (attributes.$attr["daBottom"])
                        _this.scope.FSPBottom = element.attr(attributes.$attr["daBottom"]);
                    if (attributes.$attr["daTop"])
                        _this.scope.FSPTop = element.attr(attributes.$attr["daTop"]);
                    if (attributes.$attr["daLeft"])
                        _this.scope.FSPLeft = element.attr(attributes.$attr["daLeft"]);
                    if (attributes.$attr["daRight"])
                        _this.scope.FSPRight = element.attr(attributes.$attr["daRight"]);
                    if (attributes.$attr["daWidth"])
                        _this.scope.FSPWidth = element.attr(attributes.$attr["daWidth"]);
                    _this.scope.FSPLocationStyle = '';
                    if ($scope.FSPBottom != undefined)
                        _this.scope.FSPLocationStyle += "Bottom: " + $scope.FSPBottom + ";";
                    if ($scope.FSPTop != undefined)
                        _this.scope.FSPLocationStyle += "Top: " + $scope.FSPTop + ";";
                    if ($scope.FSPLeft != undefined)
                        _this.scope.FSPLocationStyle += "Left: " + $scope.FSPLeft + ";";
                    if ($scope.FSPRight != undefined)
                        _this.scope.FSPLocationStyle += "Right: " + $scope.FSPRight + ";";
                    if ($scope.FSPWidth != undefined)
                        _this.scope.FSPLocationStyle += "Width: " + $scope.FSPWidth + ";";
                    _this.scope.FSPItemSelected = function (evt) {
                        _this.ItemSelected(_this.scope, evt);
                    };
                    _this.init();
                };
            }
            FileStoragePickerDirective.prototype.init = function () {
                this.initPubSub();
                this.RefreshData();
            };
            FileStoragePickerDirective.prototype.RefreshData = function () {
                this.RefreshGroupings();
            };
            FileStoragePickerDirective.prototype.RefreshGroupings = function () {
                var __this = this;
                this.dataSvc.getGroupings('filestorage', __this.authService.sessionId).success(function (result) {
                    __this.scope.FSPList = result;
                }).error(function (err) {
                });
            };
            return FileStoragePickerDirective;
        })();
        Directives.FileStoragePickerDirective = FileStoragePickerDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dFileStoragePicker", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) {
            return new FileStoragePickerDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc);
        }]);
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=fileStoragePicker.js.map