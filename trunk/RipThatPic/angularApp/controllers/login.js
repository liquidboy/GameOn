var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var LoginCtrl = (function () {
            function LoginCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService, location) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.location = location;
                var grouping = location.search()["grouping"];
                var name = location.search()["name"];
            }
            return LoginCtrl;
        })();
        Controllers.LoginCtrl = LoginCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("LoginCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", LoginCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=login.js.map