//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    (function (Controllers) {
        var ModernDesktopPostCtrl = (function () {
            function ModernDesktopPostCtrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            ModernDesktopPostCtrl.prototype.init = function () {
                this.loadResources();
            };

            ModernDesktopPostCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return ModernDesktopPostCtrl;
        })();
        Controllers.ModernDesktopPostCtrl = ModernDesktopPostCtrl;
    })(Application.Controllers || (Application.Controllers = {}));
    var Controllers = Application.Controllers;
})(Application || (Application = {}));
//window["app"].controller("ModernDesktopCtrl", ["$scope", "resourceSvc", Application.Controllers.ModernDesktopCtrl]);
//# sourceMappingURL=ModernDesktopPostController.js.map
