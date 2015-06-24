var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigVideoCtrl = (function () {
            function ConfigVideoCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteVideo = function () {
                    var __this = _this;
                    _this.dataSvc.delete("video", __this.SelectedVideo.Name, __this.SelectedVideo.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedVideo();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deleteVideoByDisplayId(__this.SelectedVideo.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedVideo();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedVideo();
                };
                this.SaveVideo = function () {
                    var __this = _this;
                    __this.dataSvc.save('video', __this.SelectedVideo).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedVideo();
                    }).error(function (val) {
                        alert('Failed saving video');
                    });
                };
                this.SelectVideoRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedVideo = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigVideoCtrl.prototype.init = function () {
                this.InitSelectedVideo();
                this.RefreshData();
            };
            ConfigVideoCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('video').success(function (result) {
                    __this.VideosList = result;
                }).error(function (err) {
                });
            };
            ConfigVideoCtrl.prototype.InitSelectedVideo = function () {
                this.SelectedVideo = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigVideoCtrl;
        })();
        Controllers.ConfigVideoCtrl = ConfigVideoCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigVideoCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigVideoCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configVideo.js.map