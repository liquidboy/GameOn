module Application.Directives {
    //'use strict';
    export class PostLiteDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new PostLiteDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
            ];
        }


        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        //public scope: IPostLite;  //using scope breaks it as a new scope is created
        public sc: IPostLite;

        public link: ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => void;


        constructor(
            public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/post-lite.html';
            //this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl];
            this.link = ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
                //this.scope = $scope;
                this.sc = $scope;

                var __this = this;

                __this.sc.PsLGroup = $scope.Grouping + '|' + $scope.Name;
                this.getPost($scope.Grouping, $scope.Name);
                

            }

            
        }

        getPost(group: string, name: string) {
            var __this = this;
            this.dataSvc
                .get('post', group, name, this.authService.sessionId)
                .success((result: any) => {
                    __this.sc.PsLData = result.Entity;
                    __this.sc.PsLStyle = result.Entity.PostStyle;
                    __this.sc.PsLFonts = result.FontsMetadata;
                })
                .error(() => { });        
        }

     
    }

    export interface IPostLite extends ng.IScope {

        PsLStyle: string;
        PsLGroup: string;

        PsLData: any;
        PsLFonts: Array<any>;
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dPostLite", PostLiteDirective.prototype.injection());

}