module Application.Directives {
    //'use strict';
    export class FileStorageListDirective implements ng.IDirective {

        

        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc",
                (pubSubConstants, dataSvc, authService) => { return new FileStorageListDirective(pubSubConstants, dataSvc, authService); }
            ];
        }
       
        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: IFileStorageListController ;

        public link: ($scope: IFileStorageListController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: IFileStorageListController) => void;


        constructor(public pubSubConstants: Application.Constants.PubSubConstants, public dataSvc: Application.Services.IData, public authService: Application.Services.IAuthService) {

            
            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/file-storage-list.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', FileStorageListController];
            this.link = ($scope: IFileStorageListController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: IFileStorageListController) =>
            {                
                this.scope = $scope;
           
                this.init();
               
            };


        }

        private init() {
            this.RefreshData();
        }

        private RefreshData() {
            var __this = this;

            this.dataSvc
                .getAll("FileStorage", __this.authService.sessionId)
                .success(function (result: any) {
                    __this.scope.ItemsList = result;
                    $.each(__this.scope.ItemsList, function () {
                        this.SizeKB = Math.round(this.Size / 1000);
                    });

                })
                .error(function (err) { });
        }
    }




    interface IFileStorageListController extends ng.IScope {
        ItemsList: Array<any>;
    }
    class FileStorageListController {
      


        constructor(public $scope: IFileStorageListController,
            private $routeParams: any,
            private $rootScope: any,
            private $injector: any) {
            

        }


  
        
    }


    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dFileStorageList",  FileStorageListDirective.prototype.injection());
}

















