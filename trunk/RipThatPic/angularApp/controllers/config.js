var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigCtrl = (function () {
            function ConfigCtrl($scope, $rootScope) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.init();
            }
            ConfigCtrl.prototype.init = function () {
                var __this = this;
            };
            return ConfigCtrl;
        })();
        Controllers.ConfigCtrl = ConfigCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigCtrl", ["$scope", "$rootScope", ConfigCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=config.js.map