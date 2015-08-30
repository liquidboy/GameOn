var Application;
(function (Application) {
    var Controllers;
    (function (Controllers) {
        var ConfigFileStorageCtrl = (function () {
            function ConfigFileStorageCtrl($scope, $rootScope, serviceHelperSvc, dataSvc, instanceFactory, authService) {
                var _this = this;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.serviceHelperSvc = serviceHelperSvc;
                this.dataSvc = dataSvc;
                this.instanceFactory = instanceFactory;
                this.authService = authService;
                this.EntityType = "filestorage";
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
                this.init();
            }
            ConfigFileStorageCtrl.prototype.init = function () {
                this.InitSelectedItem();
                this.RefreshData();
            };
            ConfigFileStorageCtrl.prototype.RefreshData = function () {
                var __this = this;
                this.dataSvc
                    .getAll(__this.EntityType, __this.authService.sessionId)
                    .success(function (result) {
                    __this.ItemsList = result;
                    $.each(__this.ItemsList, function () {
                        var firstPart = this.ContentType.substring(0, 5);
                        if (firstPart == 'image') {
                            //http://austoragetest.blob.core.windows.net/{{configfilestorage.SelectedItem.Grouping}}-thumb/{{configfilestorage.SelectedItem.Name}}
                            this._ImgUrl = 'http://austoragetest.blob.core.windows.net/' + this.Grouping + '-thumb/' + this.Name;
                        }
                        else if (firstPart == 'audio') {
                            this._ImgUrl = '/Content/placeholders/audio.png';
                        }
                        else if (firstPart == 'video') {
                            this._ImgUrl = '/Content/placeholders/video.png';
                        }
                        else if (firstPart == 'appli') {
                            this._ImgUrl = '/Content/placeholders/file.png';
                        }
                        else {
                            this._ImgUrl = '/Content/placeholders/unknown.png';
                        }
                    });
                })
                    .error(function (err) { });
            };
            ConfigFileStorageCtrl.prototype.InitSelectedItem = function () {
                this.UnSelect();
                this.SelectedItem = this.instanceFactory.getInstance("_object");
            };
            ConfigFileStorageCtrl.prototype.UnSelect = function () { if (this.SelectedItem != undefined)
                this.SelectedItem._Model.IsSelected = false; };
            return ConfigFileStorageCtrl;
        })();
        Controllers.ConfigFileStorageCtrl = ConfigFileStorageCtrl;
        var myapp = angular.module('bootstrapApp');
        myapp.controller("ConfigFileStorageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", ConfigFileStorageCtrl]);
    })(Controllers = Application.Controllers || (Application.Controllers = {}));
})(Application || (Application = {}));
