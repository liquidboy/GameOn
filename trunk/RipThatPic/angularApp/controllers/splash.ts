module Application.Controllers {
    export class SplashCtrl {




        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData,
            public instanceFactory: Application.Services.IInstanceFactory,
            public authService: Application.Services.IAuthService,
            public location: ng.ILocationService) {
            

        }
        

        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("SplashCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", SplashCtrl]);
}