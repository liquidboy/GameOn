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

                __this.sc.PLGroup = $scope.Grouping + '|' + $scope.Name;
                this.getPage($scope.Grouping, $scope.Name);
                this.getPosts($scope.Grouping, $scope.Name);
                


            }

            
        }

        getPage(group: string, name: string) {

            this.dataSvc
                .get('page', group, name, this.authService.sessionId)
                .success((result: any) => {
                    this.sc.PLTitle = result.LongName;
                })
                .error(() => { });        
        }

        getPosts(group: string, name: string) {

            this.dataSvc
                .getAllByGrouping('post', group + '|' + name, this.authService.sessionId)
                .success((result: any) => {
                    this.sc.PLPosts = result;
                })
                .error(() => { });
        }
    }

    export interface IPageLite extends ng.IScope {

        PLTitle: string;
        PLPosts: Array<any>;

        PLGroup: string;

    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dPageLite", PageLiteDirective.prototype.injection());

}