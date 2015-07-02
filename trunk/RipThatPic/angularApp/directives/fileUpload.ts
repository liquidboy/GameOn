module Application.Directives {
    //'use strict';
    export class FileUploadDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                () => { return new FileUploadDirective(); }
            ];
        }
        public static $inject: any[] = [() => { return new FileUploadDirective(); }];

        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: any = {

        };
        public link: ($scope: IFileUploadController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: FileUploadController) => void;


        constructor() {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/fileupload.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', FileUploadController];
            this.link = ($scope: IFileUploadController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: FileUploadController) =>
            {
                
                //var selectedTab: string = "";
                //if (attributes.$attr["daSelectedTab"]) {
                //    selectedTab = element.attr(<string>attributes.$attr["daSelectedTab"]); 
                //}
                
                //var foundTab = element.find('a[data-id="' + selectedTab + '"]');
                //foundTab.addClass("active");

                //if (selectedTab === 'home') {
                //    var menuConfig = element.find('span[data-id="menu-config"]');
                //    menuConfig.addClass('hidden');
                //}
            };


        }



    }

    interface IFileUploadController extends ng.IScope {
 
        
    }
    class FileUploadController {
      


        constructor(public $scope: IFileUploadController,
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
    myapp.directive("dFileUpload", FileUploadDirective.prototype.injection());
}