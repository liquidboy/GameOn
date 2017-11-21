//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var DirectX12PostCtrl = (function () {
            function DirectX12PostCtrl($scope, resourceSvc) {
                this.$scope = $scope;
                this.resourceSvc = resourceSvc;
                this.init();
            }
            DirectX12PostCtrl.prototype.init = function () {
                this.loadResources();
            };
            DirectX12PostCtrl.prototype.loadResources = function () {
                //this.$scope["resources"] = this.resourceSvc.getTopFiveResources();
            };
            return DirectX12PostCtrl;
        }());
        Controllers.DirectX12PostCtrl = DirectX12PostCtrl;
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//window["app"].controller("DirectX12Ctrl", ["$scope", "resourceSvc", Application.Controllers.DirectX12Ctrl]);
//# sourceMappingURL=DirectX12PostController.js.map