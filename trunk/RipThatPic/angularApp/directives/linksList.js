var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var LinksListDirective = (function () {
            function LinksListDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/links-list.html';
                this.link = function ($scope, element, attributes) {
                    _this.sc = $scope;
                    var __this = _this;
                    //__this.sc.TotalLinksStyle = '';
                    var grouping = $scope.Grouping + '|' + $scope.Name;
                    _this.getLinks(grouping);
                };
            }
            LinksListDirective.prototype.injection = function () {
                return [
                    "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                    function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) { return new LinksListDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
                ];
            };
            LinksListDirective.prototype.getLinks = function (grouping) {
                var __this = this;
                this.dataSvc
                    .getAllByGrouping('link', grouping, this.authService.sessionId)
                    .success(function (result) {
                    __this.sc.LinksList = result;
                    //var runningStyle = '';
                    //$(__this.sc.LinksList).each(function (idx: number, obj: any) {
                    //    if (obj && obj.LinkStyle) {
                    //        runningStyle += obj.LinkStyle + ' ';
                    //    }
                    //});
                    //if (runningStyle && runningStyle.length > 0) {
                    //    __this.sc.TotalLinksStyle = runningStyle;
                    //}
                })
                    .error(function () { });
            };
            return LinksListDirective;
        })();
        Directives.LinksListDirective = LinksListDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dLinksList", LinksListDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
