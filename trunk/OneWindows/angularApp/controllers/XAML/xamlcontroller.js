//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var XAMLCtrl = (function () {
    function XAMLCtrl($scope, resourceSvc) {
        this.$scope = $scope;
        this.resourceSvc = resourceSvc;
        this.init();
    }
    XAMLCtrl.prototype.init = function () {
        this.loadResources();
    };

    XAMLCtrl.prototype.loadResources = function () {
        //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
    };
    return XAMLCtrl;
})();
window["app"].controller("XAMLCtrl", ["$scope", "resourceSvc", XAMLCtrl]);
//# sourceMappingURL=XAMLController.js.map
