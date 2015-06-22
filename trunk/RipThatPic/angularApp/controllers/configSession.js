var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigSessionCtrl = (function () {
            function ConfigSessionCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
            }
            return ConfigSessionCtrl;
        })();
        Controllers.ConfigSessionCtrl = ConfigSessionCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigSessionCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigSessionCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configSession.js.map