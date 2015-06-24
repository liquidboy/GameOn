var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigListCtrl = (function () {
            function ConfigListCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteList = function () {
                    var __this = _this;
                    _this.dataSvc.delete("list", __this.SelectedList.Name, __this.SelectedList.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedList();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteListByDisplayId(__this.SelectedList.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedList();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedList();
                };
                this.SaveList = function () {
                    var __this = _this;
                    __this.dataSvc.save('list', __this.SelectedList).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedList();
                    }).error(function (val) {
                        alert('Failed saving list');
                    });
                };
                this.SelectListRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedList = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigListCtrl.prototype.init = function () {
                this.InitSelectedList();
                this.RefreshData();
            };
            ConfigListCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('list').success(function (result) {
                    __this.ListsList = result;
                }).error(function (err) {
                });
            };
            ConfigListCtrl.prototype.InitSelectedList = function () {
                this.SelectedList = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigListCtrl;
        })();
        Controllers.ConfigListCtrl = ConfigListCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigListCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigListCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configList.js.map