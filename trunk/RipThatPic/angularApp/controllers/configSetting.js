var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigSettingCtrl = (function () {
            function ConfigSettingCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteSetting = function () {
                    var __this = _this;
                    _this.dataSvc.delete("setting", __this.SelectedSetting.Name, __this.SelectedSetting.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedSetting();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteSettingByDisplayId(__this.SelectedSetting.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedSetting();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedSetting();
                };
                this.SaveSetting = function () {
                    var __this = _this;
                    __this.dataSvc.save('setting', __this.SelectedSetting).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedSetting();
                    }).error(function (val) {
                        alert('Failed saving setting');
                    });
                };
                this.SelectSettingRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedSetting = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigSettingCtrl.prototype.init = function () {
                this.InitSelectedSetting();
                this.RefreshData();
            };
            ConfigSettingCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('setting').success(function (result) {
                    __this.SettingsList = result;
                }).error(function (err) {
                });
            };
            ConfigSettingCtrl.prototype.InitSelectedSetting = function () {
                this.SelectedSetting = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigSettingCtrl;
        })();
        Controllers.ConfigSettingCtrl = ConfigSettingCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigSettingCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigSettingCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configSetting.js.map