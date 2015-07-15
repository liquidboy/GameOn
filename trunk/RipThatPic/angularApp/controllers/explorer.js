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
                try {
                    __this.authSvc.ping('explorer');
                }
                catch (e) {
                    alert(e.message);
                }
            };
            return ExplorerCtrl;
        })();
        Controllers.ExplorerCtrl = ExplorerCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ExplorerCtrl", ["$scope", "$rootScope", "authSvc", ExplorerCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=explorer.js.map