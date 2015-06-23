module Application.Controllers {
    export class ConfigDocumentCtrl {

        DocumentsList: Array<any>;
        SelectedDocument: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteDocument = () => {

            var __this = this;

            this.dataSvc
                .deleteDocument(__this.SelectedDocument.Name, __this.SelectedDocument.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedDocument(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteDocumentByDisplayId(__this.SelectedDocument.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedDocument();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedDocument();
        }

        private init() {
            this.InitSelectedDocument();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAllDocuments()
                .success(function (result: any) { __this.DocumentsList = result; })
                .error(function (err) { });
        }

        private InitSelectedDocument() {
            this.SelectedDocument = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveDocument = () => {

            var __this: any = this;

            __this.dataSvc
                .saveDocument(__this.SelectedDocument)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedDocument(); })
                .error(function (val) { alert('Failed saving document'); });

        }

        SelectDocumentRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedDocument = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigDocumentCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigDocumentCtrl]);
}