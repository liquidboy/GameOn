module Application.Controllers {
    export class ConfigListCtrl {

        ListsList: Array<any>;
        SelectedList: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteList = () => {

            var __this = this;

            this.dataSvc
                .delete("list", __this.SelectedList.Name, __this.SelectedList.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedList(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteListByDisplayId(__this.SelectedList.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedList();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedList();
        }

        private init() {
            this.InitSelectedList();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('list')
                .success(function (result: any) { __this.ListsList = result; })
                .error(function (err) { });
        }

        private InitSelectedList() {
            this.SelectedList = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveList = () => {

            var __this: any = this;

            __this.dataSvc
                .save('list', __this.SelectedList)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedList(); })
                .error(function (val) { alert('Failed saving list'); });

        }

        SelectListRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedList = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigListCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigListCtrl]);
}