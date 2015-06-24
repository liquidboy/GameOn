var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigExtensionCtrl = (function () {
            function ConfigExtensionCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteExtension = function () {
                    var __this = _this;
                    _this.dataSvc.delete("extension", __this.SelectedExtension.Name, __this.SelectedExtension.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedExtension();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteExtensionByDisplayId(__this.SelectedExtension.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedExtension();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedExtension();
                };
                this.SaveExtension = function () {
                    var __this = _this;
                    __this.dataSvc.save('extension', __this.SelectedExtension).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedExtension();
                    }).error(function (val) {
                        alert('Failed saving extension');
                    });
                };
                this.SelectExtensionRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedExtension = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigExtensionCtrl.prototype.init = function () {
                this.InitSelectedExtension();
                this.RefreshData();
            };
            ConfigExtensionCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('extension').success(function (result) {
                    __this.ExtensionsList = result;
                }).error(function (err) {
                });
            };
            ConfigExtensionCtrl.prototype.InitSelectedExtension = function () {
                this.SelectedExtension = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigExtensionCtrl;
        })();
        Controllers.ConfigExtensionCtrl = ConfigExtensionCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigExtensionCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigExtensionCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configExtension.js.map