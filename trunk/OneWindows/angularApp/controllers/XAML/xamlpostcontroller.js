//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var XAMLPostCtrl = (function () {
            function XAMLPostCtrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            XAMLPostCtrl.prototype.init = function () {
                this.loadResources();
            };
            XAMLPostCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return XAMLPostCtrl;
        })();
        Controllers.XAMLPostCtrl = XAMLPostCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=XAMLPostController.js.map