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
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {

            var __this = this;
            var ctl = $('.list-of-pages');
            

            radioPubSubSvc.subscribe("jose-test1", __this.test1, undefined);
            radioPubSubSvc.subscribe("jose-test2", __this.test2, undefined);


            dataSvc.getAllConfig(this.authService.sessionId)
                .success((result: any) => {
                    __this.PageList = result.Pages;
                    __this.BannerList = result.Banners;
                    __this.AreaList = result.Areas;
                    __this.DatacenterList = result.Datacenters;
                    __this.ServiceList = result.Services;
                })
                .error((err) => { });
            

            $scope.$on('$destroy', function () {
                radioPubSubSvc.unsubscribe("jose-test1", __this.test1);
                radioPubSubSvc.unsubscribe("jose-test2", __this.test2);
            });

        }

        
        test1 = (topic: string, message: any) => { alert('test1' + topic);}
        test2 = (topic: string, message: any) => { alert('test2' + topic);}
        

        testclick = () => {
            //this.serviceHelperSvc.testCall();
            
            //this.dataSvc.getAllAreasByGrouping("gaming")
            //    .success(function (result: any) {
            //        alert(result.length);
            //    })
            //    .error(function (err) { });
        }
        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "radioPubSubSvc", ConfigCtrl]);
}