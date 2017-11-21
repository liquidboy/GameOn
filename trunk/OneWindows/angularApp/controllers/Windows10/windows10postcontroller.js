//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var Windows10PostCtrl = (function () {
            function Windows10PostCtrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            Windows10PostCtrl.prototype.init = function () {
                this.loadResources();
            };
            Windows10PostCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return Windows10PostCtrl;
        }());
        Controllers.Windows10PostCtrl = Windows10PostCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//window["app"].controller("Windows10Ctrl", ["$scope", "resourceSvc", Application.Controllers.Windows10Ctrl]);
//# sourceMappingURL=Windows10PostController.js.map