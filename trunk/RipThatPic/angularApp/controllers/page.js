var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var PageCtrl = (function () {
            function PageCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService, location) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.location = location;
                var name = location.search().n; //?n=xxxxx <-- url encoded
                var group = location.search().g;
                this.$scope.Grouping = group;
                this.$scope.Name = name;
                this.init();
            }
            PageCtrl.prototype.init = function () {
                this.authService.ping('page');
            };
            return PageCtrl;
        })();
        Controllers.PageCtrl = PageCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("PageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", PageCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=page.js.map