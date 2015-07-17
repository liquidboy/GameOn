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
                //this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl];
                this.link = function ($scope, element, attributes) {
                    //this.scope = $scope;
                    _this.sc = $scope;
                    var __this = _this;
                    _this.dataSvc.get('page', $scope.Grouping, $scope.Name, __this.authService.sessionId).success(function (result) {
                        __this.sc.Title = result.LongName;
                    }).error(function () {
                    });
                };
            }
            PageLiteDirective.prototype.injection = function () {
                return [
                    "pubSubConstants",
                    "dataSvc",
                    "authSvc",
                    "radioPubSubSvc",
                    function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) {
                        return new PageLiteDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc);
                    }
                ];
            };
            return PageLiteDirective;
        })();
        Directives.PageLiteDirective = PageLiteDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dPageLite", PageLiteDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=pageLite.js.map