var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var PageCtrl = (function () {
            function PageCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService, location) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.location = location;
                this.fillFields = function (data) {
                    _this.$scope.Title = data.LongName;
                    _this.$scope.Tags = [];
                    _this.$scope.Abstract = '';
                    _this.$scope.Footer = '';
                };
                var name = location.search().n; //?n=xxxxx <-- url encoded
                var group = location.search().g;
                var __this = this;
                if (name && group) {
                    this.dataSvc.get('page', group, name, this.authService.sessionId).success(function (result) {
                        __this.$scope._pageData = result;
                        __this.fillFields(result);
                    }).error(function () {
                    });
                }
            }
            return PageCtrl;
        })();
        Controllers.PageCtrl = PageCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("PageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", PageCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=page.js.map