module Application.Controllers {
    export class PageCtrl {

        
        

        constructor(
            public $scope: IPageScope,
            public $rootScope: any,
            public serviceHelperSvc: Application.Services.IServiceHelper,
            public dataSvc: Application.Services.IData,
            public instanceFactory: Application.Services.IInstanceFactory,
            public authService: Application.Services.IAuthService,
            public location: ng.ILocationService) {
            
            var name = location.search().n;  //?n=xxxxx <-- url encoded
            var group = location.search().g;  

            this.$scope.Grouping = group;
            this.$scope.Name = name;

            
            this.init();
        }


        private init() {
            
            this.authService.ping('page');
        } 

    

        
    }


    export interface IPageScope extends ng.IScope {

        
        Grouping: string;
        Name: string;
        

    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("PageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", PageCtrl]);
}