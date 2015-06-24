var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigDataCenterCtrl = (function () {
            function ConfigDataCenterCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteDataCenter = function () {
                    var __this = _this;
                    _this.dataSvc.delete("datacenter", __this.SelectedDataCenter.Name, __this.SelectedDataCenter.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedDataCenter();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteDataCenterByDisplayId(__this.SelectedDataCenter.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedDataCenter();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedDataCenter();
                };
                this.SaveDataCenter = function () {
                    var __this = _this;
                    __this.dataSvc.save('datacenter', __this.SelectedDataCenter).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedDataCenter();
                    }).error(function (val) {
                        alert('Failed saving datacenter');
                    });
                };
                this.SelectDataCenterRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedDataCenter = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigDataCenterCtrl.prototype.init = function () {
                this.InitSelectedDataCenter();
                this.RefreshData();
            };
            ConfigDataCenterCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('datacenter').success(function (result) {
                    __this.DataCentersList = result;
                }).error(function (err) {
                });
            };
            ConfigDataCenterCtrl.prototype.InitSelectedDataCenter = function () {
                this.SelectedDataCenter = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigDataCenterCtrl;
        })();
        Controllers.ConfigDataCenterCtrl = ConfigDataCenterCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigDataCenterCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigDataCenterCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configDatacenter.js.map