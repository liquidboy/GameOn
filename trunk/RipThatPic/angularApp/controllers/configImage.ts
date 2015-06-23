module Application.Controllers {
    export class ConfigImageCtrl {

        ImagesList: Array<any>;
        SelectedImage: any;



        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData) {
            this.init();
        }

        DeleteImage = () => {

            var __this = this;

            this.dataSvc
                .deleteImage(__this.SelectedImage.Name, __this.SelectedImage.Grouping)
                .success(function (result: any) { __this.RefreshData(); __this.InitSelectedImage(); })
                .error(function (err: any) { alert('failure deleting..') });
            

            //this.dataSvc
            //    .deleteImageByDisplayId(__this.SelectedImage.DisplayId)
            //    .success(function (result: any) { __this.RefreshData(); __this.InitSelectedImage();})
            //    .error(function (err:any) { alert('failure deleting..')});
        }

        ClearEntryFields = () => {
            this.InitSelectedImage();
        }

        private init() {
            this.InitSelectedImage();
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAllImages()
                .success(function (result: any) { __this.ImagesList = result; })
                .error(function (err) { });
        }

        private InitSelectedImage() {
            this.SelectedImage = {
                Name: "",
                LongName: "",
                Grouping: "",
                Color: "",
                DisplayId: ""
            };
        }

        SaveImage = () => {

            var __this: any = this;

            __this.dataSvc
                .saveImage(__this.SelectedImage)
                .success(function (val) { __this.RefreshData(); __this.InitSelectedImage(); })
                .error(function (val) { alert('Failed saving Image'); });

        }

        SelectImageRow = (model, event) => {
            var trElement = event.currentTarget;
            this.SelectedImage = jQuery.extend(true, {}, model);;
        }



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigImageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigImageCtrl]);
}