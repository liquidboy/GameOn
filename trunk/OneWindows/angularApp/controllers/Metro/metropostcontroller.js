//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var MetroPostCtrl = (function () {
            function MetroPostCtrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            MetroPostCtrl.prototype.init = function () {
                this.loadResources();
            };
            MetroPostCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return MetroPostCtrl;
        })();
        Controllers.MetroPostCtrl = MetroPostCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//window["app"].controller("MetroCtrl", ["$scope", "resourceSvc", Application.Controllers.MetroCtrl]);
//# sourceMappingURL=MetroPostController.js.map