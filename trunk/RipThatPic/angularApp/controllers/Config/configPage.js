var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigPageCtrl = (function () {
            function ConfigPageCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService, radioPubSubSvc, pubSubConstants) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.pubSubConstants = pubSubConstants;
                this.EntityType = "page";
                this.DeleteItem = function () {
                    var __this = _this;
                    _this.dataSvc.delete(__this.EntityType, __this.SelectedItem.Name, __this.SelectedItem.Grouping, __this.authService.sessionId).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedItem();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedItem();
                };
                this.destructor = function () {
                    var __this = _this;
                    _this.radioPubSubSvc.unsubscribe(_this.pubSubConstants.FontChanged, __this.FontChanged);
                };
                this.SaveItem = function () {
                    var __this = _this;
                    _this.dataSvc.save(__this.EntityType, __this.SelectedItem, __this.authService.sessionId).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedItem();
                    }).error(function (val) {
                        alert('Failed saving item');
                    });
                };
                this.SelectItemRow = function (model, event) {
                    _this.UnSelect();
                    var trElement = event.currentTarget;
                    _this.SelectedItem = jQuery.extend(true, {}, model);
                    _this.SelectedItem.NameIsReadOnly = true;
                    _this.SelectedItem.GroupingIsReadOnly = true;
                    _this.SelectedItem._Model = model;
                    _this.SelectedItem._Model.IsSelected = true;
                    _this.radioPubSubSvc.publish(_this.pubSubConstants.InitFontsSelected, model.Fonts);
                };
                this.init();
            }
            ConfigPageCtrl.prototype.init = function () {
                this.InitSelectedItem();
                this.RefreshData();
                this.radioPubSubSvc.subscribe(this.pubSubConstants.FontChanged, this.FontChanged.bind(this), undefined);
                this.$scope.$on('$destroy', this.destructor);
            };
            ConfigPageCtrl.prototype.FontChanged = function (fonts) {
                this.SelectedItem.Fonts = fonts;
            };
            ConfigPageCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll(__this.EntityType, __this.authService.sessionId).success(function (result) {
                    __this.ItemsList = result;
                }).error(function (err) {
                });
            };
            ConfigPageCtrl.prototype.InitSelectedItem = function () {
                this.UnSelect();
                this.SelectedItem = this.instanceFactory.getInstance("_object");
            };
            ConfigPageCtrl.prototype.UnSelect = function () {
                if (this.SelectedItem != undefined) {
                    this.SelectedItem._Model.IsSelected = false;
                    this.radioPubSubSvc.publish(this.pubSubConstants.ClearFontsSelected, undefined);
                }
            };
            return ConfigPageCtrl;
        })();
        Controllers.ConfigPageCtrl = ConfigPageCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigPageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "radioPubSubSvc", "pubSubConstants", ConfigPageCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configPage.js.map