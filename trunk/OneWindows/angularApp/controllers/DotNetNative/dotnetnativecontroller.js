//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var DotNetNativeCtrl = (function () {
    function DotNetNativeCtrl($scope, resourceSvc) {
        this.$scope = $scope;
        this.resourceSvc = resourceSvc;
        this.init();
    }
    DotNetNativeCtrl.prototype.init = function () {
        this.loadResources();
    };

    DotNetNativeCtrl.prototype.loadResources = function () {
        //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
    };
    return DotNetNativeCtrl;
})();
window["app"].controller("DotNetNativeCtrl", ["$scope", "resourceSvc", DotNetNativeCtrl]);
//# sourceMappingURL=DotNetNativeController.js.map
