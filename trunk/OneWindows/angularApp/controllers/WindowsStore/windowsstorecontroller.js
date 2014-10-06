﻿var Application;
(function (Application) {
    //http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
    (function (Controllers) {
        var WindowsStoreCtrl = (function () {
            function WindowsStoreCtrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            WindowsStoreCtrl.prototype.init = function () {
                this.loadResources();
            };

            WindowsStoreCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return WindowsStoreCtrl;
        })();
        Controllers.WindowsStoreCtrl = WindowsStoreCtrl;
    })(Application.Controllers || (Application.Controllers = {}));
    var Controllers = Application.Controllers;
})(Application || (Application = {}));
//window["app"].controller("WindowsStoreCtrl", ["$scope", "resourceSvc", Application.Controllers.WindowsStoreCtrl]);
//# sourceMappingURL=WindowsStoreController.js.map
