module Application.Directives {
    //'use strict';
    export class ConfigMenuDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                "pubSubConstants",
                "radioPubSubSvc",
                (pubSubConstants, radioPubSubSvc) => { return new ConfigMenuDirective(pubSubConstants, radioPubSubSvc); }
            ];
        }
        public static $inject: any[] = [(pubSubConstants, radioPubSubSvc) => { return new ConfigMenuDirective(pubSubConstants, radioPubSubSvc); }];

        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: any = {

        };
        public link: ($scope: IConfigMenuController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: ConfigMenuController) => void;
        

        constructor(public pubSubConstants: Application.Constants.PubSubConstants, public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/configmenu.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', ConfigMenuController];
            this.link = ($scope: IConfigMenuController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: ConfigMenuController) =>
            {
                //eg. http://dotnetspeak.com/2013/12/angular-and-dom-manipulations-in-directives
                var __this = this;
                var selectedTab: string = "";
                if (attributes.$attr["daSelectedTab"]) {
                    selectedTab = element.attr(<string>attributes.$attr["daSelectedTab"]); 
                }
                
                var foundTab = element.find('a[data-id="' + selectedTab + '"]');
                foundTab.addClass("active");

                if (selectedTab === 'home' || selectedTab === 'login' || selectedTab === 'explorer' ) {
                    var menuConfig = element.find('span[data-id="menu-config"]');
                    menuConfig.addClass('hidden');
                }
                
            };


        }


        

    }

    interface IConfigMenuController extends ng.IScope {
        CurrentImageIndex: number;
        ImagesResource: any;
   
        
    }
    class ConfigMenuController {
      


        constructor(public $scope: IConfigMenuController,
            private $routeParams: any,
            private $rootScope: any,
            private $injector: any) {

        }


  
        
    }


    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dConfigMenu", ConfigMenuDirective.prototype.injection());

}