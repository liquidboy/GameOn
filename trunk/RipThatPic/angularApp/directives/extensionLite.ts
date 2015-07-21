module Application.Directives {
    //'use strict';
    export class ExtensionLiteDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new ExtensionLiteDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
            ];
        }


        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        
        public sc: IExtensionLite;

        public link: ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => void;


        constructor(
            public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/extension-lite.html';

            this.link = ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {

                this.sc = $scope;

                var __this = this;
                
                __this.sc.ELGroup = $scope.Grouping + '|' + $scope.Name;
                __this.sc.ELExtensions = [];
                this.getBanner(__this.sc.ELGroup);

                $(element).hide();
                $(element).fadeIn(1500);

            }

            
        }

        getBanner(group: string) {
            var __this = this;
            this.dataSvc
                .getAllByGrouping('extension', group, this.authService.sessionId)
                .success((result: any) => {

                    $(result).each(function (idx: number, obj: any) {
                        if (obj.IsExtensionStyleLiteEnabled) {
                            __this.sc.ELExtensions.push(obj);
                        }
                    });

                    __this.sc.ELShowExtensions = __this.sc.ELExtensions.length > 0 ? true : false;
                })
                .error(() => { });        
        }

     
    }

    export interface IExtensionLite extends ng.IScope {
        ELExtensions: Array<any>;
        ELGroup: string;
        ELShowExtensions: boolean;
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dExtensionLite", ExtensionLiteDirective.prototype.injection());

}