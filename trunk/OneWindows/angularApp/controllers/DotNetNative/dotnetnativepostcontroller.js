//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var DotNetNativePostCtrl = (function () {
            function DotNetNativePostCtrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            DotNetNativePostCtrl.prototype.init = function () {
                this.loadResources();
            };
            DotNetNativePostCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return DotNetNativePostCtrl;
        })();
        Controllers.DotNetNativePostCtrl = DotNetNativePostCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//window["app"].controller("DotNetNativeCtrl", ["$scope", "resourceSvc", Application.Controllers.DotNetNativeCtrl]);
//# sourceMappingURL=DotNetNativePostController.js.map