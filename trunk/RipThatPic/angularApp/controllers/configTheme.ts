module Application.Controllers {
    export class ConfigThemeCtrl {

        ThemesList: Array<any>;
        SelectedTheme: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteTheme = () => {

            var __this = this;

            this.dataSvc
                .delete("theme", __this.SelectedTheme.Name, __this.SelectedTheme.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedTheme(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteThemeByDisplayId(__this.SelectedTheme.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedTheme();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedTheme();
        }

        private init() {
            this.InitSelectedTheme();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('theme')
                .success(function (result: any) { __this.ThemesList = result; })
                .error(function (err) { });
        }

        private InitSelectedTheme() {
            this.SelectedTheme = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveTheme = () => {

            var __this: any = this;

            __this.dataSvc
                .save('theme', __this.SelectedTheme)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedTheme(); })
                .error(function (val) { alert('Failed saving theme'); });

        }

        SelectThemeRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedTheme = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigThemeCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigThemeCtrl]);
}