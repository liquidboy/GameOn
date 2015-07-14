var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ExplorerCtrl = (function () {
            function ExplorerCtrl($scope, $rootScope, authSvc) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.authSvc = authSvc;
                this.init();
            }
            ExplorerCtrl.prototype.init = function () {
                var __this = this;
                //this.$rootScope.$on("show-serviced",(evt, area) => {
                //    $("#dRequirements").show();
                //    $("#dWizard").show();
                //    this.$rootScope.$broadcast("wizard-step-selected", "step8");
                //});
                this.authSvc.ping('explorer');
            };
            return ExplorerCtrl;
        })();
        Controllers.ExplorerCtrl = ExplorerCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ExplorerCtrl", ["$scope", "$rootScope", "authSvc", ExplorerCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=explorer.js.map