var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigMapCtrl = (function () {
            function ConfigMapCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteMap = function () {
                    var __this = _this;
                    _this.dataSvc.delete("map", __this.SelectedMap.Name, __this.SelectedMap.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedMap();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteMapByDisplayId(__this.SelectedMap.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedMap();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedMap();
                };
                this.SaveMap = function () {
                    var __this = _this;
                    __this.dataSvc.save('map', __this.SelectedMap).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedMap();
                    }).error(function (val) {
                        alert('Failed saving map');
                    });
                };
                this.SelectMapRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedMap = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigMapCtrl.prototype.init = function () {
                this.InitSelectedMap();
                this.RefreshData();
            };
            ConfigMapCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('map').success(function (result) {
                    __this.MapsList = result;
                }).error(function (err) {
                });
            };
            ConfigMapCtrl.prototype.InitSelectedMap = function () {
                this.SelectedMap = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigMapCtrl;
        })();
        Controllers.ConfigMapCtrl = ConfigMapCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigMapCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigMapCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configMap.js.map