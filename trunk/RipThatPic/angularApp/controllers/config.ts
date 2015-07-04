module Application.Controllers {
    export class ConfigCtrl {


        PageList: Array<any>;
        BannerList: Array<any>;
        AreaList: Array<any>;
        DatacenterList: Array<any>;
        ServiceList: Array<any>;

        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData,
            public instanceFactory: Application.Services.IInstanceFactory,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc,
            public pubSubConstants: Application.Constants.PubSubConstants) {

            var __this = this;
            var ctl = $('.list-of-pages');
            


            dataSvc.getAllConfig(this.authService.sessionId)
                .success((result: any) => {
                    __this.PageList = result.Pages;
                    __this.BannerList = result.Banners;
                    __this.AreaList = result.Areas;
                    __this.DatacenterList = result.Datacenters;
                    __this.ServiceList = result.Services;
                })
                .error((err) => { });
            

            $scope.$on('$destroy', __this.destructor);
        }


        

        destructor = () => {
            var __this = this;

        }
        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "radioPubSubSvc", "pubSubConstants", ConfigCtrl]);
}