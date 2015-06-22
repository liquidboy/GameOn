var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigVideoCtrl = (function () {
            function ConfigVideoCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
            }
            return ConfigVideoCtrl;
        })();
        Controllers.ConfigVideoCtrl = ConfigVideoCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigVideoCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigVideoCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configVideo.js.map