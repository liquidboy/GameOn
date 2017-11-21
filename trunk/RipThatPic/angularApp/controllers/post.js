var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var PostCtrl = (function () {
            function PostCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService, location) {
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
            PostCtrl.prototype.init = function () {
                this.authService.ping('post');
            };
            return PostCtrl;
        }());
        Controllers.PostCtrl = PostCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("PostCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", PostCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=post.js.map