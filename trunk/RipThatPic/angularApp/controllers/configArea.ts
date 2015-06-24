module Application.Controllers {
    export class ConfigAreaCtrl {

        AreasList: Array<any>;
        SelectedArea: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteArea = () => {

            var __this = this;

            this.dataSvc
                .delete("area", __this.SelectedArea.Name, __this.SelectedArea.Grouping)
                .success(function (result:any) { __this.RefreshData(); __this.InitSelectedArea();})
                .error(function (err:any) { alert('failure deleting..')});
            

            //this.dataSvc
            //    .deleteAreaByDisplayId(__this.SelectedArea.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedArea();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedArea();
        }

        private init() {
            this.InitSelectedArea();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('area')
                .success(function (result: any) { __this.AreasList = result; })
                .error(function (err) { });
        }

        private InitSelectedArea() {
            this.SelectedArea = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveArea = () => {

            var __this:any = this;

            __this.dataSvc
                .save('area', __this.SelectedArea)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedArea();})
                .error(function (val) { alert('Failed saving area');});

        }

        SelectAreaRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedArea = jQuery.extend(true, {}, model);;
        }


        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigAreaCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigAreaCtrl]);
}