module Application.Controllers {
    export class ConfigServiceCtrl {
        EntityType: string = "service";
        ItemsList: Array<any>;
        SelectedItem: any;

        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteItem = () => {

            var __this = this;

            this.dataSvc
                .delete(__this.EntityType, __this.SelectedItem.Name, __this.SelectedItem.Grouping)
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
                .getAll(__this.EntityType)
                .success(function (result: any) { __this.ItemsList = result; })
                .error(function (err) { });
        }

        private InitSelectedItem() {
            this.SelectedItem = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveItem = () => {

            var __this: any = this;

            __this.dataSvc
                .save(__this.EntityType, __this.SelectedItem)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedItem(); })
                .error(function (val) { alert('Failed saving item'); });

        }

        SelectItemRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedItem = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigServiceCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigServiceCtrl]);
}