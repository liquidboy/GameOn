//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var HomeCtrl = (function () {
    function HomeCtrl($scope, resourceSvc) {
        this.$scope = $scope;
        this.resourceSvc = resourceSvc;
        this.init();
    }
    HomeCtrl.prototype.init = function () {
        this.loadResources();
    };

    HomeCtrl.prototype.loadResources = function () {
        //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
    };
    return HomeCtrl;
})();
window["app"].controller("HomeCtrl", ["$scope", "resourceSvc", HomeCtrl]);
//# sourceMappingURL=HomeController.js.map
