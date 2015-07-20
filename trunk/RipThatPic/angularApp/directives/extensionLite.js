var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var ExtensionLiteDirective = (function () {
            function ExtensionLiteDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/extension-lite.html';
                this.link = function ($scope, element, attributes) {
                    _this.sc = $scope;
                    var __this = _this;
                    __this.sc.ELGroup = $scope.Grouping + '|' + $scope.Name;
                    _this.getBanner(__this.sc.ELGroup);
                    $(element).hide();
                    $(element).fadeIn(1500);
                };
            }
            ExtensionLiteDirective.prototype.injection = function () {
                return [
                    "pubSubConstants",
                    "dataSvc",
                    "authSvc",
                    "radioPubSubSvc",
                    function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) {
                        return new ExtensionLiteDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc);
                    }
                ];
            };
            ExtensionLiteDirective.prototype.getBanner = function (group) {
                var _this = this;
                var __this = this;
                this.dataSvc.getAllByGrouping('extension', group, this.authService.sessionId).success(function (result) {
                    _this.sc.ELExtensions = result;
                    _this.sc.ELShowExtensions = result.length > 0 ? true : false;
                }).error(function () {
                });
            };
            return ExtensionLiteDirective;
        })();
        Directives.ExtensionLiteDirective = ExtensionLiteDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dExtensionLite", ExtensionLiteDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=extensionLite.js.map