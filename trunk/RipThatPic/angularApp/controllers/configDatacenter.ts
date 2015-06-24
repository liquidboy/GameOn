module Application.Controllers {
    export class ConfigDataCenterCtrl {

        DataCentersList: Array<any>;
        SelectedDataCenter: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteDataCenter = () => {

            var __this = this;

            this.dataSvc
                .delete("datacenter", __this.SelectedDataCenter.Name, __this.SelectedDataCenter.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedDataCenter(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteDataCenterByDisplayId(__this.SelectedDataCenter.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedDataCenter();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedDataCenter();
        }

        private init() {
            this.InitSelectedDataCenter();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('datacenter')
                .success(function (result: any) { __this.DataCentersList = result; })
                .error(function (err) { });
        }

        private InitSelectedDataCenter() {
            this.SelectedDataCenter = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveDataCenter = () => {

            var __this: any = this;

            __this.dataSvc
                .save('datacenter', __this.SelectedDataCenter)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedDataCenter(); })
                .error(function (val) { alert('Failed saving datacenter'); });

        }

        SelectDataCenterRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedDataCenter = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigDataCenterCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigDataCenterCtrl]);
}