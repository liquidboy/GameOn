var Application;
(function (Application) {
    //http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
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
    })(Application.Controllers || (Application.Controllers = {}));
    var Controllers = Application.Controllers;
})(Application || (Application = {}));
//window["app"].controller("OneCoreCtrl", ["$scope", "resourceSvc", Application.Controllers.OneCoreCtrl]);
//# sourceMappingURL=OneCoreController.js.map
