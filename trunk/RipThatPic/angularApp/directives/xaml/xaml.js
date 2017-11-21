var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var XamlDirective = (function () {
            function XamlDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/xaml.html';
                this.link = function ($scope, element, attributes) {
                    _this.sc = $scope;
                };
            }
            XamlDirective.prototype.injection = function () {
                return [
                    "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                    function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) { return new XamlDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
                ];
            };
            return XamlDirective;
        }());
        Directives.XamlDirective = XamlDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dXaml", XamlDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=xaml.js.map