module Application.Controllers {
    export class PageCtrl {




        constructor(
            public $scope: ng.IScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData,
            public instanceFactory: Application.Services.IInstanceFactory,
            public authService: Application.Services.IAuthService,
            public location: ng.ILocationService) {
            
            var name = location.search().name;  //?name=xxxxx <-- url encoded
            if (name) {
                
            }


        }
        

        
    }
    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("PageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", PageCtrl]);
}