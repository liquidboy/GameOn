module Application.Controllers {
    export class ConfigCommentCtrl {

        CommentsList: Array<any>;
        SelectedComment: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteComment = () => {

            var __this = this;

            this.dataSvc
                .delete("comment", __this.SelectedComment.Name, __this.SelectedComment.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedComment(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteCommentByDisplayId(__this.SelectedComment.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedComment();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedComment();
        }

        private init() {
            this.InitSelectedComment();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll('comment')
                .success(function (result: any) { __this.CommentsList = result; })
                .error(function (err) { });
        }

        private InitSelectedComment() {
            this.SelectedComment = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveComment = () => {

            var __this: any = this;

            __this.dataSvc
                .save('comment', __this.SelectedComment)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedComment(); })
                .error(function (val) { alert('Failed saving comment'); });

        }

        SelectCommentRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedComment = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigCommentCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigCommentCtrl]);
}