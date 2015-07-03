var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigCtrl = (function () {
            function ConfigCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService, radioPubSubSvc) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.test1 = function (topic, message) {
                    alert('test1' + topic);
                };
                this.test2 = function (topic, message) {
                    alert('test2' + topic);
                };
                this.testclick = function () {
                    //this.serviceHelperSvc.testCall();
                    //this.dataSvc.getAllAreasByGrouping("gaming")
                    //    .success(function (result: any) {
                    //        alert(result.length);
                    //    })
                    //    .error(function (err) { });
                };
                var __this = this;
                var ctl = $('.list-of-pages');
                radioPubSubSvc.subscribe("jose-test1", __this.test1, undefined);
                radioPubSubSvc.subscribe("jose-test2", __this.test2, undefined);
                dataSvc.getAllConfig(this.authService.sessionId).success(function (result) {
                    __this.PageList = result.Pages;
                    __this.BannerList = result.Banners;
                    __this.AreaList = result.Areas;
                    __this.DatacenterList = result.Datacenters;
                    __this.ServiceList = result.Services;
                }).error(function (err) {
                });
                $scope.$on('$destroy', function () {
                    radioPubSubSvc.unsubscribe("jose-test1", __this.test1);
                    radioPubSubSvc.unsubscribe("jose-test2", __this.test2);
                });
            }
            return ConfigCtrl;
        })();
        Controllers.ConfigCtrl = ConfigCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "radioPubSubSvc", ConfigCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=config.js.map