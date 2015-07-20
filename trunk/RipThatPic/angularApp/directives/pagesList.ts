module Application.Directives {
    //'use strict';
    export class PagesListDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new PagesListDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
            ];
        }


        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public sc: IPagesList;

        public link: ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => void;


        constructor(
            public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/pages-list.html';
            this.link = ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
                this.sc = $scope;

                var __this = this;
                
                this.getPages('jose01');
                
            }

            
        }

        getPages(group: string) {

            this.dataSvc
                .getAll('page', this.authService.sessionId)
                .success((result: any) => {
                    this.sc.PgLiPages = result.Pages;
                    
                })
                .error(() => { });        
        }

    
    }

    export interface IPagesList extends ng.IScope {
        
        PgLiPages: Array<any>;


    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dPagesList", PagesListDirective.prototype.injection());

}