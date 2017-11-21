//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var OneCorePostCtrl = (function () {
            function OneCorePostCtrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            OneCorePostCtrl.prototype.init = function () {
                this.loadResources();
            };
            OneCorePostCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return OneCorePostCtrl;
        }());
        Controllers.OneCorePostCtrl = OneCorePostCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//window["app"].controller("OneCoreCtrl", ["$scope", "resourceSvc", Application.Controllers.OneCoreCtrl]);
//# sourceMappingURL=OneCorePostController.js.map