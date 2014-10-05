//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
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
window["app"].controller("OneCoreCtrl", ["$scope", "resourceSvc", OneCoreCtrl]);
//# sourceMappingURL=OneCoreController.js.map
