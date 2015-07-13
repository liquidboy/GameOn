module Application.Directives {
    //'use strict';
    export class PageLiteDirective implements ng.IDirective {
        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: Application.Controllers.IExplorerController;

        public link: ($scope: Application.Controllers.IExplorerController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: Application.Controllers.IExplorerController) => void;


        constructor(public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/page-lite.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl];
            this.link = ($scope: Application.Controllers.IExplorerController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: Application.Controllers.IExplorerController) => {
                this.scope = $scope;
            }
        }
    }




    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dPageLite", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new PageLiteDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }]);

}