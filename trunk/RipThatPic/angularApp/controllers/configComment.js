var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigCommentCtrl = (function () {
            function ConfigCommentCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
            }
            return ConfigCommentCtrl;
        })();
        Controllers.ConfigCommentCtrl = ConfigCommentCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigCommentCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigCommentCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configComment.js.map