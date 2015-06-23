module Application.Controllers {
    export class ConfigVideoCtrl {

        VideosList: Array<any>;
        SelectedVideo: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteVideo = () => {

            var __this = this;

            this.dataSvc
                .deleteVideo(__this.SelectedVideo.Name, __this.SelectedVideo.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedVideo(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteVideoByDisplayId(__this.SelectedVideo.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedVideo();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedVideo();
        }

        private init() {
            this.InitSelectedVideo();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAllVideos()
                .success(function (result: any) { __this.VideosList = result; })
                .error(function (err) { });
        }

        private InitSelectedVideo() {
            this.SelectedVideo = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveVideo = () => {

            var __this: any = this;

            __this.dataSvc
                .saveVideo(__this.SelectedVideo)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedVideo(); })
                .error(function (val) { alert('Failed saving video'); });

        }

        SelectVideoRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedVideo = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigVideoCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigVideoCtrl]);
}