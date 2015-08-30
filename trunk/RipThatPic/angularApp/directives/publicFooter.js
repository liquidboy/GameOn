var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var PublicFooterDirective = (function () {
            function PublicFooterDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/public-footer.html';
                this.link = function ($scope, element, attributes) {
                    _this.sc = $scope;
                    var __this = _this;
                };
            }
            PublicFooterDirective.prototype.injection = function () {
                return [
                    "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                    function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) { return new PublicFooterDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
                ];
            };
            return PublicFooterDirective;
        })();
        Directives.PublicFooterDirective = PublicFooterDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dPublicFooter", PublicFooterDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
