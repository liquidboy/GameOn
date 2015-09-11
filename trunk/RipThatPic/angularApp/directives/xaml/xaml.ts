module Application.Directives {
    //'use strict';
    export class XamlDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new XamlDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
            ];
        }
        

        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public sc: IXamlScope;

        public link: ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => void;




        constructor(
            public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/xaml.html';
            this.link = ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
                this.sc = $scope;
                
            }


        }

        
    }

    export interface IXamlScope extends ng.IScope {

        
    }



    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dXaml", XamlDirective.prototype.injection());
}