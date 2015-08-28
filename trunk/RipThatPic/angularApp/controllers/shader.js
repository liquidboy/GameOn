var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ShaderCtrl = (function () {
            function ShaderCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService, location) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.location = location;
                this.init();
            }
            ShaderCtrl.prototype.init = function () {
                this.authService.ping('shader');
            };
            return ShaderCtrl;
        })();
        Controllers.ShaderCtrl = ShaderCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ShaderCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", ShaderCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=shader.js.map