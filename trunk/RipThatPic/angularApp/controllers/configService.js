var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigServiceCtrl = (function () {
            function ConfigServiceCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteService = function () {
                    var __this = _this;
                    _this.dataSvc.delete("service", __this.SelectedService.Name, __this.SelectedService.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedService();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteServiceByDisplayId(__this.SelectedService.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedService();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedService();
                };
                this.SaveService = function () {
                    var __this = _this;
                    __this.dataSvc.save('service', __this.SelectedService).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedService();
                    }).error(function (val) {
                        alert('Failed saving service');
                    });
                };
                this.SelectServiceRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedService = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigServiceCtrl.prototype.init = function () {
                this.InitSelectedService();
                this.RefreshData();
            };
            ConfigServiceCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('service').success(function (result) {
                    __this.ServicesList = result;
                }).error(function (err) {
                });
            };
            ConfigServiceCtrl.prototype.InitSelectedService = function () {
                this.SelectedService = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigServiceCtrl;
        })();
        Controllers.ConfigServiceCtrl = ConfigServiceCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigServiceCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigServiceCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configService.js.map