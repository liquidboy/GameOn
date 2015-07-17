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

            var __this = this;

            if (name && group) {
                this.dataSvc
                    .get('page', group, name, this.authService.sessionId)
                    .success((result) => {
                        __this.$scope._pageData = result;
                        __this.fillFields(result);
                    })
                    .error(() => { });                
            }

            
        }
        

        fillFields = (data: any) => {
            this.$scope.Title = data.LongName;
            this.$scope.Tags = [];
            this.$scope.Abstract = '';
            this.$scope.Footer = '';
        }

        
    }


    export interface IPageScope extends ng.IScope {

        _pageData: any;

        Title: string;
        Tags: Array<string>;
        Abstract: string;
        Footer: string;

        Posts: Array<string>;

    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.controller("PageCtrl", ["$scope", "$rootScope", "serviceHelperSvc", "dataSvc", "instanceFactory", "authSvc", "$location", PageCtrl]);
}