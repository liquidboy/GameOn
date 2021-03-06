var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigBannerCtrl = (function () {
            function ConfigBannerCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.EntityType = "banner";
                this.DeleteItem = function () {
                    var __this = _this;
                    _this.dataSvc
                        .delete(__this.EntityType, __this.SelectedItem.Name, __this.SelectedItem.Grouping, __this.authService.sessionId)
                        .success(function (result) { __this.RefreshGrid(__this.SelectedGrouping); __this.InitSelectedItem(); })
                        .error(function (err) { alert('failure deleting..'); });
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedItem();
                };
                this.SaveItem = function () {
                    var __this = _this;
                    _this.dataSvc
                        .save(__this.EntityType, __this.SelectedItem, __this.authService.sessionId)
                        .success(function (val) { __this.RefreshGrid(__this.SelectedGrouping); __this.InitSelectedItem(); })
                        .error(function (val) { alert('Failed saving item'); });
                };
                this.SelectItemRow = function (model, event) {
                    _this.UnSelect();
                    var trElement = event.currentTarget;
                    _this.SelectedItem = jQuery.extend(true, {}, model);
                    _this.SelectedItem.NameIsReadOnly = true;
                    _this.SelectedItem.GroupingIsReadOnly = true;
                    _this.SelectedItem._Model = model;
                    _this.SelectedItem._Model.IsSelected = true;
                };
                this.GroupingChanged = function (model, event) {
                    var __this = _this;
                    if (__this.SelectedGrouping != undefined)
                        __this.RefreshGrid(__this.SelectedGrouping.name);
                };
                this.init();
            }
            ConfigBannerCtrl.prototype.init = function () {
                this.InitSelectedItem();
                this.RefreshGrid(this.SelectedGrouping);
                this.RefreshGroupings();
            };
            ConfigBannerCtrl.prototype.RefreshGrid = function (grouping) {
                var __this = this;
                if (grouping === undefined || grouping === "-all-")
                    this.dataSvc
                        .getAll(__this.EntityType, __this.authService.sessionId)
                        .success(function (result) { __this.ItemsList = result; })
                        .error(function (err) { });
                else
                    this.dataSvc
                        .getAllByGrouping(__this.EntityType, grouping, __this.authService.sessionId)
                        .success(function (result) { __this.ItemsList = result; })
                        .error(function (err) { });
            };
            ConfigBannerCtrl.prototype.RefreshGroupings = function () {
                var __this = this;
                this.dataSvc
                    .getGroupings(__this.EntityType, __this.authService.sessionId)
                    .success(function (result) { __this.GroupingsList = result; })
                    .error(function (err) { });
            };
            ConfigBannerCtrl.prototype.InitSelectedItem = function () {
                this.UnSelect();
                this.SelectedItem = this.instanceFactory.getInstance("_object");
            };
            ConfigBannerCtrl.prototype.UnSelect = function () { if (this.SelectedItem != undefined)
                this.SelectedItem._Model.IsSelected = false; };
            return ConfigBannerCtrl;
        }());
        Controllers.ConfigBannerCtrl = ConfigBannerCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigBannerCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", ConfigBannerCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configBanner.js.map