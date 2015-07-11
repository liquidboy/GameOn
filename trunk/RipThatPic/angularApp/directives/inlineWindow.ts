module Application.Directives {
    //'use strict';
    export class InlineWindowDirective implements ng.IDirective {

       
        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: Application.Controllers.IExplorerController ;

        public link: ($scope: Application.Controllers.IExplorerController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: Application.Controllers.IExplorerController) => void;


        constructor(public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {

            
            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/inline-window.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', Application.Controllers.ExplorerCtrl];
            this.link = ($scope: Application.Controllers.IExplorerController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: Application.Controllers.IExplorerController) =>
            {                
                this.scope = $scope;
          

                this.init();
            };


        }

        private init() {
            this.initPubSub();
            this.RefreshData();

        }

        private RefreshData() {
            
        }

      

        initPubSub = () => {

            //this.radioPubSubSvc.subscribe(
            //    this.pubSubConstants.FileUploaded,
            //    this.RefreshData.bind(this),
            //    undefined);

            //this.scope.$on('$destroy', this.destructor);
        }

        destructor = () => {
            var __this = this;
            //this.radioPubSubSvc.unsubscribe(this.pubSubConstants.FileUploaded,() => { __this.RefreshData(); });
        }
        
    }


    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dInlineWindow", ["pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc", (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new InlineWindowDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }]);
}



















