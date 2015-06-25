var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigLogCtrl = (function () {
            function ConfigLogCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteLog = function () {
                    var __this = _this;
                    _this.dataSvc.delete("log", __this.SelectedLog.Name, __this.SelectedLog.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedLog();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteLogByDisplayId(__this.SelectedLog.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedLog();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedLog();
                };
                this.SaveLog = function () {
                    var __this = _this;
                    __this.dataSvc.save('log', __this.SelectedLog).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedLog();
                    }).error(function (val) {
                        alert('Failed saving log');
                    });
                };
                this.SelectLogRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedLog = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigLogCtrl.prototype.init = function () {
                this.InitSelectedLog();
                this.RefreshData();
            };
            ConfigLogCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('log').success(function (result) {
                    __this.LogsList = result;
                }).error(function (err) {
                });
            };
            ConfigLogCtrl.prototype.InitSelectedLog = function () {
                this.SelectedLog = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigLogCtrl;
        })();
        Controllers.ConfigLogCtrl = ConfigLogCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigLogCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigLogCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configLog.js.map