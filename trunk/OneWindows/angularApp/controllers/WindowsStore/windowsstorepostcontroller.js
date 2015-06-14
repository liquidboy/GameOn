//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var WindowsStorePostCtrl = (function () {
            function WindowsStorePostCtrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            WindowsStorePostCtrl.prototype.init = function () {
                this.loadResources();
            };
            WindowsStorePostCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return WindowsStorePostCtrl;
        })();
        Controllers.WindowsStorePostCtrl = WindowsStorePostCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//window["app"].controller("WindowsStoreCtrl", ["$scope", "resourceSvc", Application.Controllers.WindowsStoreCtrl]);
//# sourceMappingURL=WindowsStorePostController.js.map