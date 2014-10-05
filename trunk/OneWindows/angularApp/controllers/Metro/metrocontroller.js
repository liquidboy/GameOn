//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
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
window["app"].controller("MetroCtrl", ["$scope", "resourceSvc", MetroCtrl]);
//# sourceMappingURL=MetroController.js.map
