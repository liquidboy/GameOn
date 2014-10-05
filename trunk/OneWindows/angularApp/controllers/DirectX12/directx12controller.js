//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var DirectX12Ctrl = (function () {
    function DirectX12Ctrl($scope, resourceSvc) {
        this.$scope = $scope;
        this.resourceSvc = resourceSvc;
        this.init();
    }
    DirectX12Ctrl.prototype.init = function () {
        this.loadResources();
    };

    DirectX12Ctrl.prototype.loadResources = function () {
        //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
    };
    return DirectX12Ctrl;
})();
window["app"].controller("DirectX12Ctrl", ["$scope", "resourceSvc", DirectX12Ctrl]);
//# sourceMappingURL=DirectX12controller.js.map
