module Application.Controllers {
    export class ConfigMapCtrl {

        MapsList: Array<any>;
        SelectedMap: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteMap = () => {

            var __this = this;

            this.dataSvc
                .delete("map", __this.SelectedMap.Name, __this.SelectedMap.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedMap(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteMapByDisplayId(__this.SelectedMap.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedMap();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedMap();
        }

        private init() {
            this.InitSelectedMap();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('map')
                .success(function (result: any) { __this.MapsList = result; })
                .error(function (err) { });
        }

        private InitSelectedMap() {
            this.SelectedMap = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveMap = () => {

            var __this: any = this;

            __this.dataSvc
                .save('map', __this.SelectedMap)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedMap(); })
                .error(function (val) { alert('Failed saving map'); });

        }

        SelectMapRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedMap = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigMapCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigMapCtrl]);
}