module Application.Directives {
    //'use strict';
    export class ConfigMenuDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                () => { return new ConfigMenuDirective(); }
            ];
        }
        public static $inject: any[] = [() => { return new ConfigMenuDirective(); }];

        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: any = {

        };
        public link: ($scope: IConfigMenuController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: ConfigMenuController) => void;
        public nextImage: (controller: ConfigMenuController, element: ng.IAugmentedJQuery) => void;
        public setImage: (element: ng.IAugmentedJQuery, url: string) => void;



        constructor() {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/configmenu.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', ConfigMenuController];
            this.link = ($scope: IConfigMenuController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: ConfigMenuController) =>
            {
                var selectedTab: string = "";
                if (attributes.$attr["daSelectedTab"]) {
                    selectedTab = element.attr(<string>attributes.$attr["daSelectedTab"]);
                }
                
                var foundTab = element.find('a[data-id="' + selectedTab + '"]');
                foundTab.addClass("active");

                if (selectedTab === 'home') {
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

            //$scope.Title = "Search Serviced";

            //this.$rootScope.$on("load-step",(evt, step) => {

            //    //$scope.SubTitle = "";
   
            //    $scope.$apply();
            //});

        }


  
        
    }


    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dConfigMenu", ConfigMenuDirective.prototype.injection());
}