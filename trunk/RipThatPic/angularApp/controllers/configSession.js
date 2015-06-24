var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigSessionCtrl = (function () {
            function ConfigSessionCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteSession = function () {
                    var __this = _this;
                    _this.dataSvc.delete("session", __this.SelectedSession.Name, __this.SelectedSession.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedSession();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteSessionByDisplayId(__this.SelectedSession.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedSession();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedSession();
                };
                this.SaveSession = function () {
                    var __this = _this;
                    __this.dataSvc.save('session', __this.SelectedSession).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedSession();
                    }).error(function (val) {
                        alert('Failed saving session');
                    });
                };
                this.SelectSessionRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedSession = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigSessionCtrl.prototype.init = function () {
                this.InitSelectedSession();
                this.RefreshData();
            };
            ConfigSessionCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('session').success(function (result) {
                    __this.SessionsList = result;
                }).error(function (err) {
                });
            };
            ConfigSessionCtrl.prototype.InitSelectedSession = function () {
                this.SelectedSession = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigSessionCtrl;
        })();
        Controllers.ConfigSessionCtrl = ConfigSessionCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigSessionCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigSessionCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configSession.js.map