var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigUserCtrl = (function () {
            function ConfigUserCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
            }
            return ConfigUserCtrl;
        })();
        Controllers.ConfigUserCtrl = ConfigUserCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigUserCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigUserCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configUser.js.map