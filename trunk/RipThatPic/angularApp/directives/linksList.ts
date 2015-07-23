module Application.Directives {
    //'use strict';
    export class LinksListDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new LinksListDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
            ];
        }


        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public sc: ILinksList;

        public link: ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => void;


        constructor(
            public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/links-list.html';
            this.link = ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
                this.sc = $scope;
               
                var __this = this;
                
                //__this.sc.TotalLinksStyle = '';
                var grouping = $scope.Grouping + '|' + $scope.Name;
                this.getLinks(grouping);
                
            }

            
        }

        getLinks(grouping: string) {
            var __this = this;
            this.dataSvc
                .getAllByGrouping('link', grouping, this.authService.sessionId)
                .success((result: any) => {
                    __this.sc.LinksList = result;
                    //var runningStyle = '';
                    //$(__this.sc.LinksList).each(function (idx: number, obj: any) {
                    //    if (obj && obj.LinkStyle) {
                    //        runningStyle += obj.LinkStyle + ' ';
                    //    }
                    //});
                    //if (runningStyle && runningStyle.length > 0) {
                    //    __this.sc.TotalLinksStyle = runningStyle;
                    //}
                })
                .error(() => { });        
        }

     
    
    }

    export interface ILinksList extends ng.IScope {
        
        LinksList: Array<any>;
        //TotalLinksStyle: string;

    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dLinksList", LinksListDirective.prototype.injection());

}