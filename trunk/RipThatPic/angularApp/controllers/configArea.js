var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigAreaCtrl = (function () {
            function ConfigAreaCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.SelectedArea = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
                this.DeleteArea = function () {
                    var __this = _this;
                    //this.dataSvc
                    //    .deleteArea(__this.SelectedArea.Name, __this.SelectedArea.Grouping)
                    //    .success(function (result:any) { __this.RefreshData();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                    _this.dataSvc.deleteAreaByDisplayId(__this.SelectedArea.DisplayId).success(function (result) {
                        __this.RefreshData();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                };
                this.SaveArea = function () {
                    var __this = _this;
                    _this.dataSvc.saveArea(__this.SelectedArea.Name, __this.SelectedArea.Grouping, __this.SelectedArea.Color, __this.SelectedArea.LongName, __this.SelectedArea.DisplayId).success(function (val) {
                        __this.RefreshData();
                    }).error(function (val) {
                        alert('Failed saving area');
                    });
                };
                this.SelectAreaRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedArea.Name = model.Name;
                    _this.SelectedArea.LongName = model.LongName;
                    _this.SelectedArea.Color = model.Color;
                    _this.SelectedArea.Grouping = model.Grouping;
                    _this.SelectedArea.DisplayId = model.DisplayId;
                };
                this.init();
            }
            ConfigAreaCtrl.prototype.init = function () {
                this.RefreshData();
            };
            ConfigAreaCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAllAreas().success(function (result) {
                    //alert(result[0].PartitionKey);
                    __this.AreasList = result;
                    __this.$scope.$apply();
                }).error(function (err) {
                });
            };
            ConfigAreaCtrl.prototype.ClearEntryFields = function () {
                this.SelectedArea.Name = '';
                this.SelectedArea.LongName = '';
                this.SelectedArea.Color = '';
                this.SelectedArea.Grouping = '';
                this.SelectedArea.DisplayId = '';
            };
            return ConfigAreaCtrl;
        })();
        Controllers.ConfigAreaCtrl = ConfigAreaCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigAreaCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigAreaCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configArea.js.map