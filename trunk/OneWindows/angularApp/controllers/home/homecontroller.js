﻿var Application;
(function (Application) {
    //http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
    (function (Controllers) {
        var HomeCtrl = (function () {
            function HomeCtrl($scope, resourceSvc, dataSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.dataSvc = dataSvc;
                //this.init();
                this.resourceSvc.something(function (data) {
                    //alert(data.result);
                });
            }
            HomeCtrl.prototype.init = function () {
                this.loadResources();
            };

            HomeCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return HomeCtrl;
        })();
        Controllers.HomeCtrl = HomeCtrl;
    })(Application.Controllers || (Application.Controllers = {}));
    var Controllers = Application.Controllers;
})(Application || (Application = {}));
//window["app"].controller("HomeCtrl", ["$scope", "resourceSvc", Application.Controllers.HomeCtrl]);
//# sourceMappingURL=HomeController.js.map
