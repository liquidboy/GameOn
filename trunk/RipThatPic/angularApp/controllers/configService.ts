module Application.Controllers {
    export class ConfigServiceCtrl {

        ServicesList: Array<any>;
        SelectedService: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteService = () => {

            var __this = this;

            this.dataSvc
                .delete("service", __this.SelectedService.Name, __this.SelectedService.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedService(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteServiceByDisplayId(__this.SelectedService.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedService();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedService();
        }

        private init() {
            this.InitSelectedService();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('service')
                .success(function (result: any) { __this.ServicesList = result; })
                .error(function (err) { });
        }

        private InitSelectedService() {
            this.SelectedService = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveService = () => {

            var __this: any = this;

            __this.dataSvc
                .save('service', __this.SelectedService)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedService(); })
                .error(function (val) { alert('Failed saving service'); });

        }

        SelectServiceRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedService = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigServiceCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigServiceCtrl]);
}