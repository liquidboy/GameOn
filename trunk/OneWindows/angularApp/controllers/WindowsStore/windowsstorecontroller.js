//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    var Controllers;
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
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=WindowsStoreController.js.map