var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigDocumentCtrl = (function () {
            function ConfigDocumentCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteDocument = function () {
                    var __this = _this;
                    _this.dataSvc.deleteDocument(__this.SelectedDocument.Name, __this.SelectedDocument.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedDocument();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteDocumentByDisplayId(__this.SelectedDocument.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedDocument();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedDocument();
                };
                this.SaveDocument = function () {
                    var __this = _this;
                    __this.dataSvc.saveDocument(__this.SelectedDocument).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedDocument();
                    }).error(function (val) {
                        alert('Failed saving document');
                    });
                };
                this.SelectDocumentRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedDocument = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigDocumentCtrl.prototype.init = function () {
                this.InitSelectedDocument();
                this.RefreshData();
            };
            ConfigDocumentCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAllDocuments().success(function (result) {
                    __this.DocumentsList = result;
                }).error(function (err) {
                });
            };
            ConfigDocumentCtrl.prototype.InitSelectedDocument = function () {
                this.SelectedDocument = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigDocumentCtrl;
        })();
        Controllers.ConfigDocumentCtrl = ConfigDocumentCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigDocumentCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigDocumentCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configDocument.js.map