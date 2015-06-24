var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigImageCtrl = (function () {
            function ConfigImageCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteImage = function () {
                    var __this = _this;
                    _this.dataSvc.delete("image", __this.SelectedImage.Name, __this.SelectedImage.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedImage();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteImageByDisplayId(__this.SelectedImage.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedImage();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedImage();
                };
                this.SaveImage = function () {
                    var __this = _this;
                    __this.dataSvc.save('image', __this.SelectedImage).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedImage();
                    }).error(function (val) {
                        alert('Failed saving Image');
                    });
                };
                this.SelectImageRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedImage = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigImageCtrl.prototype.init = function () {
                this.InitSelectedImage();
                this.RefreshData();
            };
            ConfigImageCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('image').success(function (result) {
                    __this.ImagesList = result;
                }).error(function (err) {
                });
            };
            ConfigImageCtrl.prototype.InitSelectedImage = function () {
                this.SelectedImage = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigImageCtrl;
        })();
        Controllers.ConfigImageCtrl = ConfigImageCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigImageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigImageCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configImage.js.map