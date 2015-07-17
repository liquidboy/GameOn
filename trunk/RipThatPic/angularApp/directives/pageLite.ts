module Application.Directives {
    //'use strict';
    export class PageLiteDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new PageLiteDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
            ];
        }


        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        //public scope: IPageLite;  //using scope breaks it as a new scope is created
        public sc: IPageLite;

        public link: ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => void;


        constructor(
            public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/page-lite.html';
            //this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl];
            this.link = ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
                //this.scope = $scope;
                this.sc = $scope;

                var __this = this;

                this.dataSvc
                    .get('page', $scope.Grouping, $scope.Name, __this.authService.sessionId)
                    .success((result: any) => {
                        __this.sc.Title = result.LongName;
                    })
                    .error(() => { });          


            }
        }
    }

    export interface IPageLite extends ng.IScope {

        Title: string;

    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dPageLite", PageLiteDirective.prototype.injection());

}