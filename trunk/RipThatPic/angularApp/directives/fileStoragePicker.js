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
                };
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/file-storage-picker.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', FileStoragePickerController];
                this.link = function ($scope, element, attributes, controller) {
                    _this.scope = $scope;
                    if (attributes.$attr["daBottom"])
                        _this.scope.Bottom = element.attr(attributes.$attr["daBottom"]);
                    if (attributes.$attr["daTop"])
                        _this.scope.Top = element.attr(attributes.$attr["daTop"]);
                    if (attributes.$attr["daLeft"])
                        _this.scope.Left = element.attr(attributes.$attr["daLeft"]);
                    if (attributes.$attr["daRight"])
                        _this.scope.Right = element.attr(attributes.$attr["daRight"]);
                    if (attributes.$attr["daWidth"])
                        _this.scope.Width = element.attr(attributes.$attr["daWidth"]);
                    _this.scope.LocationStyle = '';
                    if ($scope.Bottom != undefined)
                        _this.scope.LocationStyle += "Bottom: " + $scope.Bottom + ";";
                    if ($scope.Top != undefined)
                        _this.scope.LocationStyle += "Top: " + $scope.Top + ";";
                    if ($scope.Left != undefined)
                        _this.scope.LocationStyle += "Left: " + $scope.Left + ";";
                    if ($scope.Right != undefined)
                        _this.scope.LocationStyle += "Right: " + $scope.Right + ";";
                    if ($scope.Width != undefined)
                        _this.scope.LocationStyle += "Width: " + $scope.Width + ";";
                    _this.scope.ItemSelected = function (evt) {
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
        var FileStoragePickerController = (function () {
            function FileStoragePickerController($scope, $routeParams, $rootScope, $injector) {
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$rootScope = $rootScope;
                this.$injector = $injector;
            }
            return FileStoragePickerController;
        })();
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dFileStoragePicker", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) {
            return new FileStoragePickerDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc);
        }]);
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=fileStoragePicker.js.map