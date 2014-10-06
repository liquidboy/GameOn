var Application;
(function (Application) {
    //http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
    (function (Controllers) {
        var MetroCtrl = (function () {
            function MetroCtrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            MetroCtrl.prototype.init = function () {
                this.loadResources();
            };

            MetroCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return MetroCtrl;
        })();
        Controllers.MetroCtrl = MetroCtrl;
    })(Application.Controllers || (Application.Controllers = {}));
    var Controllers = Application.Controllers;
})(Application || (Application = {}));
//window["app"].controller("MetroCtrl", ["$scope", "resourceSvc", Application.Controllers.MetroCtrl]);
//# sourceMappingURL=MetroController.js.map
