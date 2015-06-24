var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigUserCtrl = (function () {
            function ConfigUserCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteUser = function () {
                    var __this = _this;
                    _this.dataSvc.delete("user", __this.SelectedUser.Name, __this.SelectedUser.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedUser();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteUserByDisplayId(__this.SelectedUser.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedUser();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedUser();
                };
                this.SaveUser = function () {
                    var __this = _this;
                    __this.dataSvc.save('user', __this.SelectedUser).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedUser();
                    }).error(function (val) {
                        alert('Failed saving user');
                    });
                };
                this.SelectUserRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedUser = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigUserCtrl.prototype.init = function () {
                this.InitSelectedUser();
                this.RefreshData();
            };
            ConfigUserCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('user').success(function (result) {
                    __this.UsersList = result;
                }).error(function (err) {
                });
            };
            ConfigUserCtrl.prototype.InitSelectedUser = function () {
                this.SelectedUser = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigUserCtrl;
        })();
        Controllers.ConfigUserCtrl = ConfigUserCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigUserCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigUserCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configUser.js.map