﻿module Application.Controllers {
    export class ConfigSessionCtrl {
        EntityType: string = "session";
        ItemsList: Array<any>;
        PingDetails: Array<any>;
        SelectedItem: any;

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
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedItem(); })
                .error(function (err: any) { alert('failure deleting..') });

        }

        ClearEntryFields = () => {
            this.InitSelectedItem();
        }

        private init() {
            this.InitSelectedItem();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll(__this.EntityType, __this.authService.sessionId)
                .success(function (result: any) {
                    var dateHelper: any = new Date();

                    $.each(result,(idx: number,el :any) => {        
                        dateHelper.setISO8601(el.ModifiedDateTime);
                        el.DisplayDateTime = dateHelper.toString();
                    });
                
                    __this.ItemsList = result;
                })
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
                .success(function (val) { __this.RefreshData(); __this.InitSelectedItem(); })
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

            this.PingDetails = model.LatestPing.split("|");
        }


        private UnSelect() { if (this.SelectedItem != undefined) this.SelectedItem._Model.IsSelected = false; }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigSessionCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", ConfigSessionCtrl]);
}