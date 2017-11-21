var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var FlowCtrl = (function () {
            function FlowCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService, location) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.location = location;
                this.init();
            }
            FlowCtrl.prototype.init = function () {
                this.authService.ping('flow');
            };
            return FlowCtrl;
        }());
        Controllers.FlowCtrl = FlowCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("FlowCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", FlowCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=flow.js.map