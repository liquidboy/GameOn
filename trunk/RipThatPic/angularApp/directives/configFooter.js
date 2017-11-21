var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var ConfigFooterDirective = (function () {
            function ConfigFooterDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/config-footer.html';
                this.link = function ($scope, element, attributes) {
                    _this.sc = $scope;
                    var __this = _this;
                };
            }
            ConfigFooterDirective.prototype.injection = function () {
                return [
                    "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                    function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) { return new ConfigFooterDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
                ];
            };
            return ConfigFooterDirective;
        }());
        Directives.ConfigFooterDirective = ConfigFooterDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dConfigFooter", ConfigFooterDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configFooter.js.map