var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigCtrl = (function () {
            function ConfigCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService, radioPubSubSvc, pubSubConstants) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.pubSubConstants = pubSubConstants;
                this.test1 = function (topic, message) {
                    alert('test1' + topic);
                };
                this.test2 = function (topic, message) {
                    alert('test2' + topic);
                };
                this.destructor = function () {
                    var __this = _this;
                    _this.radioPubSubSvc.unsubscribe(__this.pubSubConstants.MessageSample001, __this.test1);
                    _this.radioPubSubSvc.unsubscribe(__this.pubSubConstants.MessageSample002, __this.test2);
                };
                var __this = this;
                var ctl = $('.list-of-pages');
                radioPubSubSvc.subscribe(pubSubConstants.MessageSample001, __this.test1, undefined);
                radioPubSubSvc.subscribe(pubSubConstants.MessageSample002, __this.test2, undefined);
                dataSvc.getAllConfig(this.authService.sessionId).success(function (result) {
                    __this.PageList = result.Pages;
                    __this.BannerList = result.Banners;
                    __this.AreaList = result.Areas;
                    __this.DatacenterList = result.Datacenters;
                    __this.ServiceList = result.Services;
                }).error(function (err) {
                });
                $scope.$on('$destroy', __this.destructor);
            }
            return ConfigCtrl;
        })();
        Controllers.ConfigCtrl = ConfigCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "radioPubSubSvc", "pubSubConstants", ConfigCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=config.js.map