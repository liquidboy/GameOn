module Application.Controllers {
    export class ShaderCtrl {

        
        

        constructor(
            public $scope: IFlowScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData,
            public instanceFactory: Application.Services.IInstanceFactory,
            public authService: Application.Services.IAuthService,
            public location: ng.ILocationService) {
            



            this.init();
        }
        

        private init() {
            this.authService.ping('shader');
        }

        
    }


    export interface IShaderScope extends ng.IScope {

        
        Grouping: string;
        Name: string;
        

    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ShaderCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", ShaderCtrl]);
}