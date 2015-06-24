module Application.Controllers {
    export class ConfigExtensionCtrl {

        ExtensionsList: Array<any>;
        SelectedExtension: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteExtension = () => {

            var __this = this;

            this.dataSvc
                .delete("extension", __this.SelectedExtension.Name, __this.SelectedExtension.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedExtension(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteExtensionByDisplayId(__this.SelectedExtension.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedExtension();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedExtension();
        }

        private init() {
            this.InitSelectedExtension();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('extension')
                .success(function (result: any) { __this.ExtensionsList = result; })
                .error(function (err) { });
        }

        private InitSelectedExtension() {
            this.SelectedExtension = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveExtension = () => {

            var __this: any = this;

            __this.dataSvc
                .save('extension', __this.SelectedExtension)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedExtension(); })
                .error(function (val) { alert('Failed saving extension'); });

        }

        SelectExtensionRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedExtension = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigExtensionCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigExtensionCtrl]);
}