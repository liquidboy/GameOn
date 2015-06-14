//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ModernDesktopCtrl = (function () {
            function ModernDesktopCtrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            ModernDesktopCtrl.prototype.init = function () {
                this.loadResources();
            };
            ModernDesktopCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return ModernDesktopCtrl;
        })();
        Controllers.ModernDesktopCtrl = ModernDesktopCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//window["app"].controller("ModernDesktopCtrl", ["$scope", "resourceSvc", Application.Controllers.ModernDesktopCtrl]);
//# sourceMappingURL=ModernDesktopController.js.map