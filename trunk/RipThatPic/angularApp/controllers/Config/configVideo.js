var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigVideoCtrl = (function () {
            function ConfigVideoCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService, radioPubSubSvc, pubSubConstants) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.pubSubConstants = pubSubConstants;
                this.EntityType = "video";
                this.destructor = function () {
                    var __this = _this;
                    _this.radioPubSubSvc.unsubscribe(_this.pubSubConstants.FileStorageListSelectionsChanged, __this.FileStorageListSelectionsChanged);
                };
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
                this.$scope.$on('$destroy', this.destructor);
                this.init();
            }
            ConfigVideoCtrl.prototype.FileStorageListSelectionsChanged = function (ids) {
                this.SelectedItem.FileStorageDisplayId = ids;
            };
            ConfigVideoCtrl.prototype.init = function () {
                this.radioPubSubSvc.subscribe(this.pubSubConstants.FileStorageListSelectionsChanged, this.FileStorageListSelectionsChanged.bind(this), undefined);
                this.InitSelectedItem();
                this.RefreshData();
            };
            ConfigVideoCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc
                    .getAll(__this.EntityType, __this.authService.sessionId)
                    .success(function (result) { __this.ItemsList = result; })
                    .error(function (err) { });
            };
            ConfigVideoCtrl.prototype.InitSelectedItem = function () {
                this.UnSelect();
                this.SelectedItem = this.instanceFactory.getInstance("_object");
            };
            ConfigVideoCtrl.prototype.UnSelect = function () { if (this.SelectedItem != undefined)
                this.SelectedItem._Model.IsSelected = false; };
            return ConfigVideoCtrl;
        })();
        Controllers.ConfigVideoCtrl = ConfigVideoCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigVideoCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "radioPubSubSvc", "pubSubConstants", ConfigVideoCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configVideo.js.map