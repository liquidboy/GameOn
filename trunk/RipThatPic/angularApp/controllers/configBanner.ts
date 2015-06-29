module Application.Controllers {
    export class ConfigBannerCtrl {
        EntityType: string = "banner";
        ItemsList: Array<any>;
        GroupingsList: Array<string>;
        SelectedItem: any;
        SelectedGrouping: any;

        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData,
            public instanceFactory: Application.Services.IInstanceFactory,
            public authService: Application.Services.IAuthService) {
            this.init();
        }

        DeleteItem = () => {

            var __this = this;

            this.dataSvc
                .delete(__this.EntityType, __this.SelectedItem.Name, __this.SelectedItem.Grouping, __this.authService.sessionId)
                .success(function (result: any) { __this.RefreshGrid(__this.SelectedGrouping); __this.InitSelectedItem(); })
                .error(function (err: any) { alert('failure deleting..') });

        }

        ClearEntryFields = () => {
            this.InitSelectedItem();
        }

        private init() {
            this.InitSelectedItem();
            this.RefreshGrid(this.SelectedGrouping);
            this.RefreshGroupings();
        }

        private RefreshGrid(grouping: string) {
            var __this = this;

            if (grouping === undefined || grouping === "-all-")
                this.dataSvc
                    .getAll(__this.EntityType, __this.authService.sessionId)
                    .success(function (result: any) { __this.ItemsList = result; })
                    .error(function (err) { });
            else
                this.dataSvc
                    .getAllByGrouping(__this.EntityType, grouping, __this.authService.sessionId)
                    .success(function (result: any) { __this.ItemsList = result; })
                    .error(function (err) { });
                
        }

        private RefreshGroupings() {
            var __this = this;

            this.dataSvc
                .getGroupings(__this.EntityType, __this.authService.sessionId)
                .success(function (result: any) { __this.GroupingsList = result; })
                .error(function (err) { });
        }

        private InitSelectedItem() {
            this.UnSelect();
            this.SelectedItem = this.instanceFactory.getInstance("_object");
        }

        SaveItem = () => {

            var __this: any = this;

            this.dataSvc
                .save(__this.EntityType, __this.SelectedItem, __this.authService.sessionId)
                .success(function (val) { __this.RefreshGrid(__this.SelectedGrouping); __this.InitSelectedItem(); })
                .error(function (val) { alert('Failed saving item'); });

        }

        SelectItemRow = (model, event) => {
            this.UnSelect();

            var trElement = event.currentTarget;
            this.SelectedItem = jQuery.extend(true, {}, model);
            this.SelectedItem.NameIsReadOnly = true;
            this.SelectedItem.GroupingIsReadOnly = true;
            this.SelectedItem._Model = model;
            this.SelectedItem._Model.IsSelected = true;
        }

        GroupingChanged = (model, event) => {
            var __this: any = this;
            if(__this.SelectedGrouping != undefined) __this.RefreshGrid(__this.SelectedGrouping.name);
        }

        private UnSelect() { if (this.SelectedItem != undefined) this.SelectedItem._Model.IsSelected = false; }

    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigBannerCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", ConfigBannerCtrl]);
}