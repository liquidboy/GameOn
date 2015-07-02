var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigCtrl = (function () {
            function ConfigCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
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
                dataSvc.getAll('page', '').success(function (result) {
                    __this.PageList = result;
                }).error(function () {
                });
                dataSvc.getAll('banner', '').success(function (result) {
                    __this.BannerList = result;
                }).error(function () {
                });
            }
            return ConfigCtrl;
        })();
        Controllers.ConfigCtrl = ConfigCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=config.js.map