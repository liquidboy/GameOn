module Application.Controllers {
    export class ConfigPostCtrl {

        PostsList: Array<any>;
        SelectedPost: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeletePost = () => {

            var __this = this;

            this.dataSvc
                .delete("post", __this.SelectedPost.Name, __this.SelectedPost.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedPost(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deletePostByDisplayId(__this.SelectedPost.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedPost();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedPost();
        }

        private init() {
            this.InitSelectedPost();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('post')
                .success(function (result: any) { __this.PostsList = result; })
                .error(function (err) { });
        }

        private InitSelectedPost() {
            this.SelectedPost = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SavePost = () => {

            var __this: any = this;

            __this.dataSvc
                .save('post', __this.SelectedPost)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedPost(); })
                .error(function (val) { alert('Failed saving post'); });

        }

        SelectPostRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedPost = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigPostCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigPostCtrl]);
}