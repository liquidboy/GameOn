var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigCtrl = (function () {
            function ConfigCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.testclick = function () {
                    //this.serviceHelperSvc.testCall();
                    //this.dataSvc.getAll("areas")
                    //    .success(function (result: any) {
                    //        //alert(result[0].PartitionKey);
                    //    })
                    //    .error(function (err) { });
                    //this.dataSvc.addArea("xbox", "gaming", "green", "Xbox One")
                    //    .success(function (val) { alert(val);})
                    //    .error(function (val) { alert(val);})
                    //;
                };
                this.init();
            }
            ConfigCtrl.prototype.init = function () {
                var __this = this;
            };
            return ConfigCtrl;
        })();
        Controllers.ConfigCtrl = ConfigCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=config.js.map