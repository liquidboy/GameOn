//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    (function (Controllers) {
        var DotNetNativeCtrl = (function () {
            function DotNetNativeCtrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            DotNetNativeCtrl.prototype.init = function () {
                this.loadResources();
            };

            DotNetNativeCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return DotNetNativeCtrl;
        })();
        Controllers.DotNetNativeCtrl = DotNetNativeCtrl;
    })(Application.Controllers || (Application.Controllers = {}));
    var Controllers = Application.Controllers;
})(Application || (Application = {}));
//window["app"].controller("DotNetNativeCtrl", ["$scope", "resourceSvc", Application.Controllers.DotNetNativeCtrl]);
//# sourceMappingURL=DotNetNativeController.js.map
