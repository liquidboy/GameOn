module Application.Controllers {
    export class ConfigLogCtrl {

        LogsList: Array<any>;
        SelectedLog: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteLog = () => {

            var __this = this;

            this.dataSvc
                .delete("log", __this.SelectedLog.Name, __this.SelectedLog.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedLog(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteLogByDisplayId(__this.SelectedLog.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedLog();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedLog();
        }

        private init() {
            this.InitSelectedLog();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('log')
                .success(function (result: any) { __this.LogsList = result; })
                .error(function (err) { });
        }

        private InitSelectedLog() {
            this.SelectedLog = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveLog = () => {

            var __this: any = this;

            __this.dataSvc
                .save('log', __this.SelectedLog)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedLog(); })
                .error(function (val) { alert('Failed saving log'); });

        }

        SelectLogRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedLog = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigLogCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigLogCtrl]);
}