//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var OneCoreCtrl = (function () {
            function OneCoreCtrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            OneCoreCtrl.prototype.init = function () {
                this.loadResources();
            };
            OneCoreCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return OneCoreCtrl;
        })();
        Controllers.OneCoreCtrl = OneCoreCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=OneCoreController.js.map