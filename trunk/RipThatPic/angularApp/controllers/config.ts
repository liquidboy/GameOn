﻿module Application.Controllers {
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
            public dataSvc: Application.Services.IData) {

            var __this = this;
            var ctl = $('.list-of-pages');
            

            dataSvc.getAll('page', '')
                .success((result: any) => { __this.PageList = result; })
                .error(() => { });

            dataSvc.getAll('banner', '')
                .success((result: any) => { __this.BannerList = result; })
                .error(() => { });

            dataSvc.getAll('area', '')
                .success((result: any) => { __this.AreaList = result; })
                .error(() => { });

            dataSvc.getAll('datacenter', '')
                .success((result: any) => { __this.DatacenterList = result; })
                .error(() => { });

            dataSvc.getAll('service', '')
                .success((result: any) => { __this.ServiceList = result; })
                .error(() => { });
        }
        

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
    myapp.controller("ConfigCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", ConfigCtrl]);
}