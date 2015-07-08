module Application.Directives {
    //'use strict';
    export class FileStoragePickerDirective implements ng.IDirective {

       
        public injection(): Array<any> {
            return [
                "pubSubConstants",
                (pubSubConstants) => { return new FileStoragePickerDirective(pubSubConstants); }
            ];
        }
       
        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: IFileStoragePickerController ;

        public link: ($scope: IFileStoragePickerController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: IFileStoragePickerController) => void;


        constructor(public pubSubConstants: Application.Constants.PubSubConstants) {

            
            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/file-storage-picker.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', FileStoragePickerController];
            this.link = ($scope: IFileStoragePickerController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: IFileStoragePickerController) =>
            {                
                this.scope = $scope;
           
  
               
            };


        }
        
    }




    interface IFileStoragePickerController extends ng.IScope {

    }
    class FileStoragePickerController {
      


        constructor(public $scope: IFileStoragePickerController,
            private $routeParams: any,
            private $rootScope: any,
            private $injector: any) {
            

        }


  
        
    }


    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dFileStoragePicker", FileStoragePickerDirective.prototype.injection());
}



















