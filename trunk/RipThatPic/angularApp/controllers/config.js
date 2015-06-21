var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigCtrl = (function () {
            function ConfigCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.CreateArea = function () {
                    var __this = _this;
                    _this.dataSvc.addArea("name", "gaming", "green", "Xbox One").success(function (val) {
                        alert('Success creating area');
                    }).error(function (val) {
                        alert('Failed creating area');
                    });
                };
                this.testclick = function () {
                    //this.serviceHelperSvc.testCall();
                    //this.dataSvc.getAllAreas()
                    //    .success(function (result: any) {
                    //        //alert(result[0].PartitionKey);
                    //    })
                    //    .error(function (err) { });
                    //this.dataSvc.addArea("xbox", "gaming", "green", "Xbox One")
                    //    .success(function (val) { alert(val);})
                    //    .error(function (val) { alert(val);})
                    //;
                    //this.dataSvc.getAllAreasByGrouping("gaming")
                    //    .success(function (result: any) {
                    //        alert(result.length);
                    //    })
                    //    .error(function (err) { });
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