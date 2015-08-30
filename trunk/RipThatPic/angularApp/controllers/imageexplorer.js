var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ImageExplorerCtrl = (function () {
            function ImageExplorerCtrl($scope, $rootScope, authSvc) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.authSvc = authSvc;
                this.init();
            }
            ImageExplorerCtrl.prototype.init = function () {
                var __this = this;
                //this.$rootScope.$on("show-serviced",(evt, area) => {
                //    $("#dRequirements").show();
                //    $("#dWizard").show();
                //    this.$rootScope.$broadcast("wizard-step-selected", "step8");
                //});
                __this.authSvc.ping('imageexplorer');
            };
            return ImageExplorerCtrl;
        })();
        Controllers.ImageExplorerCtrl = ImageExplorerCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ImageExplorerCtrl", ["$scope", "$rootScope", "authSvc", ImageExplorerCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=imageexplorer.js.map