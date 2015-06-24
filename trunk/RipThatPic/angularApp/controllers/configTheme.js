var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigThemeCtrl = (function () {
            function ConfigThemeCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteTheme = function () {
                    var __this = _this;
                    _this.dataSvc.delete("theme", __this.SelectedTheme.Name, __this.SelectedTheme.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedTheme();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteThemeByDisplayId(__this.SelectedTheme.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedTheme();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedTheme();
                };
                this.SaveTheme = function () {
                    var __this = _this;
                    __this.dataSvc.save('theme', __this.SelectedTheme).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedTheme();
                    }).error(function (val) {
                        alert('Failed saving theme');
                    });
                };
                this.SelectThemeRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedTheme = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigThemeCtrl.prototype.init = function () {
                this.InitSelectedTheme();
                this.RefreshData();
            };
            ConfigThemeCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('theme').success(function (result) {
                    __this.ThemesList = result;
                }).error(function (err) {
                });
            };
            ConfigThemeCtrl.prototype.InitSelectedTheme = function () {
                this.SelectedTheme = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigThemeCtrl;
        })();
        Controllers.ConfigThemeCtrl = ConfigThemeCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigThemeCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigThemeCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configTheme.js.map