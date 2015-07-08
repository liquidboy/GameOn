var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var FileStorageListDirective = (function () {
            function FileStorageListDirective(pubSubConstants, dataSvc, authService) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/file-storage-list.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', FileStorageListController];
                this.link = function ($scope, element, attributes, controller) {
                    _this.scope = $scope;
                    if (attributes.$attr["daBottom"])
                        _this.scope.Bottom = element.attr(attributes.$attr["daBottom"]);
                    if (attributes.$attr["daTop"])
                        _this.scope.Top = element.attr(attributes.$attr["daTop"]);
                    if (attributes.$attr["daItemHeight"])
                        _this.scope.ItemHeight = element.attr(attributes.$attr["daItemHeight"]);
                    if (attributes.$attr["daLeft"])
                        _this.scope.Left = element.attr(attributes.$attr["daLeft"]);
                    if (attributes.$attr["daRight"])
                        _this.scope.Right = element.attr(attributes.$attr["daRight"]);
                    _this.init();
                };
            }
            FileStorageListDirective.prototype.injection = function () {
                return [
                    "pubSubConstants",
                    "dataSvc",
                    "authSvc",
                    function (pubSubConstants, dataSvc, authService) {
                        return new FileStorageListDirective(pubSubConstants, dataSvc, authService);
                    }
                ];
            };
            FileStorageListDirective.prototype.init = function () {
                this.RefreshData();
            };
            FileStorageListDirective.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll("FileStorage", __this.authService.sessionId).success(function (result) {
                    __this.scope.ItemsList = result;
                    $.each(__this.scope.ItemsList, function () {
                        this.SizeKB = Math.round(this.Size / 1000);
                    });
                }).error(function (err) {
                });
            };
            return FileStorageListDirective;
        })();
        Directives.FileStorageListDirective = FileStorageListDirective;
        var FileStorageListController = (function () {
            function FileStorageListController($scope, $routeParams, $rootScope, $injector) {
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.$rootScope = $rootScope;
                this.$injector = $injector;
            }
            return FileStorageListController;
        })();
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dFileStorageList", FileStorageListDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=fileStorageList.js.map