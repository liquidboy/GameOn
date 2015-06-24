module Application.Controllers {
    export class ConfigPermissionCtrl {

        PermissionsList: Array<any>;
        SelectedPermission: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeletePermission = () => {

            var __this = this;

            this.dataSvc
                .delete("permission", __this.SelectedPermission.Name, __this.SelectedPermission.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedPermission(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deletePermissionByDisplayId(__this.SelectedPermission.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedPermission();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedPermission();
        }

        private init() {
            this.InitSelectedPermission();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('permission')
                .success(function (result: any) { __this.PermissionsList = result; })
                .error(function (err) { });
        }

        private InitSelectedPermission() {
            this.SelectedPermission = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SavePermission = () => {

            var __this: any = this;

            __this.dataSvc
                .save('permission', __this.SelectedPermission)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedPermission(); })
                .error(function (val) { alert('Failed saving permission'); });

        }

        SelectPermissionRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedPermission = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigPermissionCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigPermissionCtrl]);
}