//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var Windows10Ctrl = (function () {
            function Windows10Ctrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            Windows10Ctrl.prototype.init = function () {
                this.loadResources();
            };
            Windows10Ctrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return Windows10Ctrl;
        })();
        Controllers.Windows10Ctrl = Windows10Ctrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=windows10controller.js.map