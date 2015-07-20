module Application.Directives {
    //'use strict';
    export class BannerSquareDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new BannerSquareDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
            ];
        }


        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        
        public sc: IBannerSquare;

        public link: ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => void;


        constructor(
            public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/banner-square.html';

            this.link = ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {

                this.sc = $scope;

                var __this = this;
                

            }

            
        }

        getBanner(group: string) {
            var __this = this;
            this.dataSvc
                .getAllByGrouping('banner', group, this.authService.sessionId)
                .success((result: any) => {

                })
                .error(() => { });        
        }

     
    }

    export interface IBannerSquare extends ng.IScope {

      
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dBannerSquare", BannerSquareDirective.prototype.injection());

}