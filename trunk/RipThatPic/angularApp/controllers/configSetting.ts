module Application.Controllers {
    export class ConfigSettingCtrl {

        SettingsList: Array<any>;
        SelectedSetting: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteSetting = () => {

            var __this = this;

            this.dataSvc
                .delete("setting", __this.SelectedSetting.Name, __this.SelectedSetting.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedSetting(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteSettingByDisplayId(__this.SelectedSetting.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedSetting();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedSetting();
        }

        private init() {
            this.InitSelectedSetting();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('setting')
                .success(function (result: any) { __this.SettingsList = result; })
                .error(function (err) { });
        }

        private InitSelectedSetting() {
            this.SelectedSetting = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveSetting = () => {

            var __this: any = this;

            __this.dataSvc
                .save('setting', __this.SelectedSetting)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedSetting(); })
                .error(function (val) { alert('Failed saving setting'); });

        }

        SelectSettingRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedSetting = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigSettingCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigSettingCtrl]);
}