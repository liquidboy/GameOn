var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var HomeCtrl = (function () {
            function HomeCtrl($scope, $rootScope) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.init();
            }
            HomeCtrl.prototype.init = function () {
                var __this = this;
                //this.$rootScope.$on("show-serviced",(evt, area) => {
                //    $("#dRequirements").show();
                //    $("#dWizard").show();
                //    this.$rootScope.$broadcast("wizard-step-selected", "step8");
                //});
            };
            return HomeCtrl;
        })();
        Controllers.HomeCtrl = HomeCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("HomeCtrl", ["$scope", "$rootScope", HomeCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=home.js.map