module Application.Directives {
    //'use strict';
    export class ExtensionLiteDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", "$sce",
                (pubSubConstants, dataSvc, authSvc, radioPubSubSvc, $sce) => { return new ExtensionLiteDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc, $sce); }
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
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc,
            public $sce: ng.ISCEService) {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/extension-lite.html';

            this.link = ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {

                this.sc = $scope;

                var __this = this;
                
                __this.sc.ELGroup = $scope.Grouping + '|' + $scope.Name;
                __this.sc.ELExtensions = [];
                //__this.sc.ELRunningScript = '';
                __this.sc.ELElement = element;

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

                    var runningHtml = '';
                    $(result).each(function (idx: number, obj: any) {
                        if (obj.IsExtensionStyleLiteEnabled) {
                            if (obj.ExtensionHtmlLite) obj.ExtensionHtmlLiteSafe = __this.$sce.trustAsHtml(obj.ExtensionHtmlLite);
                            if (obj.ExtensionScriptLite) runningHtml += obj.ExtensionScriptLite + '  ';
                            __this.sc.ELExtensions.push(obj);
                        }
                    });

                    
                    //__this.sc.ELRunningScript = __this.$sce.trustAsJs(runningHtml);

                    if (runningHtml && runningHtml.length > 0) $(__this.sc.ELElement).find(".dynamicjs").html("<script type='text/javascript'>" + runningHtml + "</script>");

                    __this.sc.ELShowExtensions = __this.sc.ELExtensions.length > 0 ? true : false;
                })
                .error(() => { });        
        }

     
    }

    export interface IExtensionLite extends ng.IScope {
        ELExtensions: Array<any>;
        ELGroup: string;
        ELShowExtensions: boolean;
        //ELRunningScript: string;
        ELElement: ng.IAugmentedJQuery;
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dExtensionLite",  ExtensionLiteDirective.prototype.injection());

}