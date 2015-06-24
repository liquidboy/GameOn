var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigPermissionCtrl = (function () {
            function ConfigPermissionCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeletePermission = function () {
                    var __this = _this;
                    _this.dataSvc.delete("permission", __this.SelectedPermission.Name, __this.SelectedPermission.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedPermission();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deletePermissionByDisplayId(__this.SelectedPermission.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedPermission();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedPermission();
                };
                this.SavePermission = function () {
                    var __this = _this;
                    __this.dataSvc.save('permission', __this.SelectedPermission).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedPermission();
                    }).error(function (val) {
                        alert('Failed saving permission');
                    });
                };
                this.SelectPermissionRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedPermission = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigPermissionCtrl.prototype.init = function () {
                this.InitSelectedPermission();
                this.RefreshData();
            };
            ConfigPermissionCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('permission').success(function (result) {
                    __this.PermissionsList = result;
                }).error(function (err) {
                });
            };
            ConfigPermissionCtrl.prototype.InitSelectedPermission = function () {
                this.SelectedPermission = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigPermissionCtrl;
        })();
        Controllers.ConfigPermissionCtrl = ConfigPermissionCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigPermissionCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigPermissionCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configPermission.js.map