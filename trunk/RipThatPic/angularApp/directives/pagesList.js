var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var PagesListDirective = (function () {
            function PagesListDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.launchPage = function (model, event) {
                    var trElement = event.currentTarget;
                    var url = $(trElement).data("url");
                    //window.navigate(url);
                    document.location = url;
                };
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/pages-list.html';
                this.link = function ($scope, element, attributes) {
                    _this.sc = $scope;
                    _this.sc.LaunchPage = _this.launchPage;
                    var __this = _this;
                    _this.getPages('jose01');
                };
            }
            PagesListDirective.prototype.injection = function () {
                return [
                    "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                    function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) { return new PagesListDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
                ];
            };
            PagesListDirective.prototype.getPages = function (group) {
                var _this = this;
                this.dataSvc
                    .getAll('page', this.authService.sessionId)
                    .success(function (result) {
                    _this.sc.PgLiPages = result.Pages;
                })
                    .error(function () { });
            };
            return PagesListDirective;
        })();
        Directives.PagesListDirective = PagesListDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dPagesList", PagesListDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=pagesList.js.map