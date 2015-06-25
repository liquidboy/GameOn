var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigInstallCtrl = (function () {
            function ConfigInstallCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.init();
            }
            ConfigInstallCtrl.prototype.init = function () {
            };
            return ConfigInstallCtrl;
        })();
        Controllers.ConfigInstallCtrl = ConfigInstallCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigInstallCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", ConfigInstallCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configInstall.js.map