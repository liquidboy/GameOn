var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var BannerSquareDirective = (function () {
            function BannerSquareDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/banner-square.html';
                this.link = function ($scope, element, attributes) {
                    _this.sc = $scope;
                    var __this = _this;
                };
            }
            BannerSquareDirective.prototype.injection = function () {
                return [
                    "pubSubConstants",
                    "dataSvc",
                    "authSvc",
                    "radioPubSubSvc",
                    function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) {
                        return new BannerSquareDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc);
                    }
                ];
            };
            BannerSquareDirective.prototype.getBanner = function (group) {
                var __this = this;
                this.dataSvc.getAllByGrouping('banner', group, this.authService.sessionId).success(function (result) {
                }).error(function () {
                });
            };
            return BannerSquareDirective;
        })();
        Directives.BannerSquareDirective = BannerSquareDirective;
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dBannerSquare", BannerSquareDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=bannerSquare.js.map