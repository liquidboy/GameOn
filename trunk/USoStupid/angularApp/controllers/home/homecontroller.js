//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var HomeCtrl = (function () {
            function HomeCtrl($scope, resourceSvc, dataSvc) {
                //this.init();
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.dataSvc = dataSvc;
                this.resourceSvc.something(function (data) {
                    //alert(data.result);
                });
            }
            HomeCtrl.prototype.init = function () {
                this.loadResources();
            };
            HomeCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return HomeCtrl;
        })();
        Controllers.HomeCtrl = HomeCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//window["app"].controller("HomeCtrl", ["$scope", "resourceSvc", Application.Controllers.HomeCtrl]); 
//# sourceMappingURL=HomeController.js.map