var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigPageCtrl = (function () {
            function ConfigPageCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeletePage = function () {
                    var __this = _this;
                    _this.dataSvc.delete("page", __this.SelectedPage.Name, __this.SelectedPage.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedPage();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deletePageByDisplayId(__this.SelectedPage.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedPage();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedPage();
                };
                this.SavePage = function () {
                    var __this = _this;
                    __this.dataSvc.save('page', __this.SelectedPage).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedPage();
                    }).error(function (val) {
                        alert('Failed saving page');
                    });
                };
                this.SelectPageRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedPage = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigPageCtrl.prototype.init = function () {
                this.InitSelectedPage();
                this.RefreshData();
            };
            ConfigPageCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('page').success(function (result) {
                    __this.PagesList = result;
                }).error(function (err) {
                });
            };
            ConfigPageCtrl.prototype.InitSelectedPage = function () {
                this.SelectedPage = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigPageCtrl;
        })();
        Controllers.ConfigPageCtrl = ConfigPageCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigPageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigPageCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configPage.js.map