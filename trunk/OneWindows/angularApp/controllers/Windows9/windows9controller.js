//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Windows9Ctrl = (function () {
    function Windows9Ctrl($scope, resourceSvc) {
        this.$scope = $scope;
        this.resourceSvc = resourceSvc;
        this.init();
    }
    Windows9Ctrl.prototype.init = function () {
        this.loadResources();
    };

    Windows9Ctrl.prototype.loadResources = function () {
        //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
    };
    return Windows9Ctrl;
})();
window["app"].controller("Windows9Ctrl", ["$scope", "resourceSvc", Windows9Ctrl]);
//# sourceMappingURL=windows9controller.js.map
