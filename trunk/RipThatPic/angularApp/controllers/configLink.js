var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigLinkCtrl = (function () {
            function ConfigLinkCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteLink = function () {
                    var __this = _this;
                    _this.dataSvc.delete("link", __this.SelectedLink.Name, __this.SelectedLink.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedLink();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteLinkByDisplayId(__this.SelectedLink.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedLink();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedLink();
                };
                this.SaveLink = function () {
                    var __this = _this;
                    __this.dataSvc.save('link', __this.SelectedLink).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedLink();
                    }).error(function (val) {
                        alert('Failed saving link');
                    });
                };
                this.SelectLinkRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedLink = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigLinkCtrl.prototype.init = function () {
                this.InitSelectedLink();
                this.RefreshData();
            };
            ConfigLinkCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('link').success(function (result) {
                    __this.LinksList = result;
                }).error(function (err) {
                });
            };
            ConfigLinkCtrl.prototype.InitSelectedLink = function () {
                this.SelectedLink = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigLinkCtrl;
        })();
        Controllers.ConfigLinkCtrl = ConfigLinkCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigLinkCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigLinkCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configLink.js.map