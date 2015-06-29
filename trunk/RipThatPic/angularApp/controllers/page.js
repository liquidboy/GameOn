var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var PageCtrl = (function () {
            function PageCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
            }
            return PageCtrl;
        })();
        Controllers.PageCtrl = PageCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("PageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", PageCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=page.js.map