var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigCommentCtrl = (function () {
            function ConfigCommentCtrl($scope, $rootScope, serviceHelperSvc, dataSvc) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.DeleteComment = function () {
                    var __this = _this;
                    _this.dataSvc.delete("comment", __this.SelectedComment.Name, __this.SelectedComment.Grouping).success(function (result) {
                        __this.RefreshData();
                        __this.InitSelectedComment();
                    }).error(function (err) {
                        alert('failure deleting..');
                    });
                };
                this.ClearEntryFields = function () {
                    _this.InitSelectedComment();
                };
                this.SaveComment = function () {
                    var __this = _this;
                    __this.dataSvc.save('comment', __this.SelectedComment).success(function (val) {
                        __this.RefreshData();
                        __this.InitSelectedComment();
                    }).error(function (val) {
                        alert('Failed saving comment');
                    });
                };
                this.SelectCommentRow = function (model, event) {
                    var trElement = event.currentTarget;
                    _this.SelectedComment = jQuery.extend(true, {}, model);
                    ;
                };
                this.init();
            }
            ConfigCommentCtrl.prototype.init = function () {
                this.InitSelectedComment();
                this.RefreshData();
            };
            ConfigCommentCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc.getAll('comment').success(function (result) {
                    __this.CommentsList = result;
                }).error(function (err) {
                });
            };
            ConfigCommentCtrl.prototype.InitSelectedComment = function () {
                this.SelectedComment = {
                    Name: "",
                    LongName: "",
                    Grouping: "",
                    Color: "",
                    DisplayId: ""
                };
            };
            return ConfigCommentCtrl;
        })();
        Controllers.ConfigCommentCtrl = ConfigCommentCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigCommentCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigCommentCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
//# sourceMappingURL=configComment.js.map