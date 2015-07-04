var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var SplashCtrl = (function () {
            function SplashCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService, location) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.location = location;
            }
            return SplashCtrl;
        })();
        Controllers.SplashCtrl = SplashCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("SplashCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", SplashCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=splash.js.map