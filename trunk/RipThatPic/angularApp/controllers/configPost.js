var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigPostCtrl = (function () {
            function ConfigPostCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeletePost = function () {
                    var __this = _this;
                    _this.dataSvc.delete("post", __this.SelectedPost.Name, __this.SelectedPost.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedPost();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                    //this.dataSvc
                    //    .deletePostByDisplayId(__this.SelectedPost.DisplayId)
                    //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedPost();})
                    //    .error(function (err:any) { alert('failure deleting..')});
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedPost();
                };
                this.SavePost = function () {
                    var __this = _this;
                    __this.dataSvc.save('post', __this.SelectedPost).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedPost();
                    }).error(function (val) {
                        alert('Failed saving post');
                    });
                };
                this.SelectPostRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedPost = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigPostCtrl.prototype.init = function () {
                this.InitSelectedPost();
                this.RefreshData();
            };
            ConfigPostCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('post').success(function (result) {
                    __this.PostsList = result;
                }).error(function (err) {
                });
            };
            ConfigPostCtrl.prototype.InitSelectedPost = function () {
                this.SelectedPost = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigPostCtrl;
        })();
        Controllers.ConfigPostCtrl = ConfigPostCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigPostCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigPostCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configPost.js.map