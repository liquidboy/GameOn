module Application.Controllers {
    export class ConfigLinkCtrl {

        LinksList: Array<any>;
        SelectedLink: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteLink = () => {

            var __this = this;

            this.dataSvc
                .delete("link", __this.SelectedLink.Name, __this.SelectedLink.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedLink(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteLinkByDisplayId(__this.SelectedLink.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedLink();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedLink();
        }

        private init() {
            this.InitSelectedLink();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('link')
                .success(function (result: any) { __this.LinksList = result; })
                .error(function (err) { });
        }

        private InitSelectedLink() {
            this.SelectedLink = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveLink = () => {

            var __this: any = this;

            __this.dataSvc
                .save('link', __this.SelectedLink)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedLink(); })
                .error(function (val) { alert('Failed saving link'); });

        }

        SelectLinkRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedLink = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigLinkCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigLinkCtrl]);
}