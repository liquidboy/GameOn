module Application.Controllers {
    export class LoginCtrl {




        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData,
            public instanceFactory: Application.Services.IInstanceFactory,
            public authService: Application.Services.IAuthService,
            public location: ng.ILocationService) {
            
            var grouping: string = location.search()["grouping"];
            var name: string = location.search()["name"];
        }
        

        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("LoginCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", LoginCtrl]);
}