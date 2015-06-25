var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigThemeCtrl = (function () {
            function ConfigThemeCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.EntityType = "theme";
                this.DeleteItem = function () {
                    var __this = _this;
                    _this.dataSvc.delete(__this.EntityType, __this.SelectedItem.Name, __this.SelectedItem.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedItem();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedItem();
                };
                this.SaveItem = function () {
                    var __this = _this;
                    __this.dataSvc.save(__this.EntityType, __this.SelectedItem).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedItem();
                    }).error(function (val) {
                        alert('Failed saving item');
                    });
                };
                this.SelectItemRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedItem = jQuery.extend(true, {}, model);
                    _this.SelectedItem.NameIsReadOnly = true;
                    _this.SelectedItem.GroupingIsReadOnly = true;
                };
                this.init();
            }
            ConfigThemeCtrl.prototype.init = function () {
                this.InitSelectedItem();
                this.RefreshData();
            };
            ConfigThemeCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll(__this.EntityType).success(function (result) {
                    __this.ItemsList = result;
                }).error(function (err) {
                });
            };
            ConfigThemeCtrl.prototype.InitSelectedItem = function () {
                this.SelectedItem = this.instanceFactory.getInstance("_object");
            };
            return ConfigThemeCtrl;
        })();
        Controllers.ConfigThemeCtrl = ConfigThemeCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigThemeCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", ConfigThemeCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configTheme.js.map