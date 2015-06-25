var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigVideoCtrl = (function () {
            function ConfigVideoCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.EntityType = "video";
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
            ConfigVideoCtrl.prototype.init = function () {
                this.InitSelectedItem();
                this.RefreshData();
            };
            ConfigVideoCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll(__this.EntityType).success(function (result) {
                    __this.ItemsList = result;
                }).error(function (err) {
                });
            };
            ConfigVideoCtrl.prototype.InitSelectedItem = function () {
                this.SelectedItem = this.instanceFactory.getInstance("_object");
            };
            return ConfigVideoCtrl;
        })();
        Controllers.ConfigVideoCtrl = ConfigVideoCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigVideoCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", ConfigVideoCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configVideo.js.map