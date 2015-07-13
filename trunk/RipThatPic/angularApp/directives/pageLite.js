var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var PageLiteDirective = (function () {
            function PageLiteDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/page-lite.html';
                this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl];
                this.link = function ($scope, element, attributes, controller) {
                    _this.scope = $scope;
                };
            }
            return PageLiteDirective;
        })();
        Directives.PageLiteDirective = PageLiteDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dPageLite", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) {
            return new PageLiteDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc);
        }]);
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=pageLite.js.map