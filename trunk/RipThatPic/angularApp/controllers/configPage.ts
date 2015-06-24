module Application.Controllers {
    export class ConfigPageCtrl {

        PagesList: Array<any>;
        SelectedPage: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeletePage = () => {

            var __this = this;

            this.dataSvc
                .delete("page", __this.SelectedPage.Name, __this.SelectedPage.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedPage(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deletePageByDisplayId(__this.SelectedPage.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedPage();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedPage();
        }

        private init() {
            this.InitSelectedPage();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('page')
                .success(function (result: any) { __this.PagesList = result; })
                .error(function (err) { });
        }

        private InitSelectedPage() {
            this.SelectedPage = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SavePage = () => {

            var __this: any = this;

            __this.dataSvc
                .save('page', __this.SelectedPage)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedPage(); })
                .error(function (val) { alert('Failed saving page'); });

        }

        SelectPageRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedPage = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigPageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigPageCtrl]);
}