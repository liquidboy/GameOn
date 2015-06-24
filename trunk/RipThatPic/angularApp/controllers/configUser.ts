module Application.Controllers {
    export class ConfigUserCtrl {

        UsersList: Array<any>;
        SelectedUser: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteUser = () => {

            var __this = this;

            this.dataSvc
                .delete("user", __this.SelectedUser.Name, __this.SelectedUser.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedUser(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteUserByDisplayId(__this.SelectedUser.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedUser();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedUser();
        }

        private init() {
            this.InitSelectedUser();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('user')
                .success(function (result: any) { __this.UsersList = result; })
                .error(function (err) { });
        }

        private InitSelectedUser() {
            this.SelectedUser = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveUser = () => {

            var __this: any = this;

            __this.dataSvc
                .save('user', __this.SelectedUser)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedUser(); })
                .error(function (val) { alert('Failed saving user'); });

        }

        SelectUserRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedUser = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigUserCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigUserCtrl]);
}