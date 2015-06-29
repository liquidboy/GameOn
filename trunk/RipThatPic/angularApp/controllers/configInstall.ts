module Application.Controllers {
    export class ConfigInstallCtrl {
        

        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData,
            public instanceFactory: Application.Services.IInstanceFactory,
            public authService: Application.Services.IAuthService) {
            this.init();
        }

      
        

        private init() {

        }
        



    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("ConfigInstallCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", ConfigInstallCtrl]);
}