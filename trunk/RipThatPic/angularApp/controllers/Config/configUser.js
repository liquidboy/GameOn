var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigUserCtrl = (function () {
            function ConfigUserCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.EntityType = "user";
                this.DeleteItem = function () {
                    var __this = _this;
                    _this.dataSvc
                        .delete(__this.EntityType, __this.SelectedItem.Name, __this.SelectedItem.Grouping, __this.authService.sessionId)
                        .success(function (result) { __this.RefreshData(); __this.InitSelectedItem(); })
                        .error(function (err) { alert('failure deleting..'); });
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedItem();
                };
                this.SaveItem = function () {
                    var __this = _this;
                    _this.dataSvc
                        .save(__this.EntityType, __this.SelectedItem, __this.authService.sessionId)
                        .success(function (val) { __this.RefreshData(); __this.InitSelectedItem(); })
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
                this.init();
            }
            ConfigUserCtrl.prototype.init = function () {
                this.InitSelectedItem();
                this.RefreshData();
            };
            ConfigUserCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc
                    .getAll(__this.EntityType, __this.authService.sessionId)
                    .success(function (result) { __this.ItemsList = result; })
                    .error(function (err) { });
            };
            ConfigUserCtrl.prototype.InitSelectedItem = function () {
                this.UnSelect();
                this.SelectedItem = this.instanceFactory.getInstance("_object");
            };
            ConfigUserCtrl.prototype.UnSelect = function () { if (this.SelectedItem != undefined)
                this.SelectedItem._Model.IsSelected = false; };
            return ConfigUserCtrl;
        }());
        Controllers.ConfigUserCtrl = ConfigUserCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigUserCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", ConfigUserCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configUser.js.map