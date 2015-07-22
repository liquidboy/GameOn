module Application.Directives {
    //'use strict';
    export class ExtensionFullDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", "$sce",
                (pubSubConstants, dataSvc, authSvc, radioPubSubSvc, $sce) => { return new ExtensionFullDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc, $sce); }
            ];
        }


        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        
        public sc: IExtensionFull;

        public link: ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => void;


        constructor(
            public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc,
            public $sce: ng.ISCEService) {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/extension-full.html';

            this.link = ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {

                this.sc = $scope;

                var __this = this;
                
                __this.sc.EFGroup = $scope.Grouping + '|' + $scope.Name;
                __this.sc.EFExtensions = [];
                //__this.sc.EFRunningScript = '';
                __this.sc.EFElement = element;

                this.getBanner(__this.sc.EFGroup);

                $(element).hide();
                $(element).fadeIn(1500);

            }

            
        }

        getBanner(group: string) {
            var __this = this;
            this.dataSvc
                .getAllByGrouping('extension', group, this.authService.sessionId)
                .success((result: any) => {

                    var runningHtml = '';
                    $(result).each(function (idx: number, obj: any) {
                        if (obj.IsExtensionEnabled) {
                            if (obj.ExtensionHtml) obj.ExtensionHtmlSafe = __this.$sce.trustAsHtml(obj.ExtensionHtml);
                            if (obj.ExtensionScript) runningHtml += obj.ExtensionScript + '  ';
                            __this.sc.EFExtensions.push(obj);
                        }
                    });

                    
                    //__this.sc.EFRunningScript = __this.$sce.trustAsJs(runningHtml);

                    if (runningHtml && runningHtml.length > 0) $(__this.sc.EFElement).find(".dynamicjs").html("<script type='text/javascript'>" + runningHtml + "</script>");

                    __this.sc.EFShowExtensions = __this.sc.EFExtensions.length > 0 ? true : false;
                })
                .error(() => { });        
        }

     
    }

    export interface IExtensionFull extends ng.IScope {
        EFExtensions: Array<any>;
        EFGroup: string;
        EFShowExtensions: boolean;
        //EFRunningScript: string;
        EFElement: ng.IAugmentedJQuery;
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dExtensionFull",  ExtensionFullDirective.prototype.injection());

}