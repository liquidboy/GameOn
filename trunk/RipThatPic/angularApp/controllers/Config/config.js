var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigCtrl = (function () {
            function ConfigCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authSvc, radioPubSubSvc, pubSubConstants) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authSvc = authSvc;
                this.radioPubSubSvc = radioPubSubSvc;
                this.pubSubConstants = pubSubConstants;
                this.destructor = function () {
                    var __this = _this;
                };
                var __this = this;
                var ctl = $('.list-of-pages');
                dataSvc.getAllConfig(this.authSvc.sessionId)
                    .success(function (result) {
                    __this.PageList = result.Pages;
                    __this.BannerList = result.Banners;
                    __this.AreaList = result.Areas;
                    __this.DatacenterList = result.Datacenters;
                    __this.ServiceList = result.Services;
                })
                    .error(function (err) { });
                $scope.$on('$destroy', __this.destructor);
                this.authSvc.ping('config');
            }
            return ConfigCtrl;
        }());
        Controllers.ConfigCtrl = ConfigCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "radioPubSubSvc", "pubSubConstants", ConfigCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=config.js.map