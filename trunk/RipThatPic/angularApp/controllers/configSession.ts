module Application.Controllers {
    export class ConfigSessionCtrl {

        SessionsList: Array<any>;
        SelectedSession: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteSession = () => {

            var __this = this;

            this.dataSvc
                .delete("session", __this.SelectedSession.Name, __this.SelectedSession.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedSession(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteSessionByDisplayId(__this.SelectedSession.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedSession();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedSession();
        }

        private init() {
            this.InitSelectedSession();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('session')
                .success(function (result: any) { __this.SessionsList = result; })
                .error(function (err) { });
        }

        private InitSelectedSession() {
            this.SelectedSession = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveSession = () => {

            var __this: any = this;

            __this.dataSvc
                .save('session', __this.SelectedSession)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedSession(); })
                .error(function (val) { alert('Failed saving session'); });

        }

        SelectSessionRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedSession = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigSessionCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigSessionCtrl]);
}