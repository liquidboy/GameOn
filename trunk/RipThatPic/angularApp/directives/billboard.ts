module Application.Directives {
    //'use strict';
    export class BillboardDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                () => { return new BillboardDirective(); }
            ];
        }
        public static $inject: any[] = [() => { return new BillboardDirective(); }];

        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: any = {

        };
        public link: ($scope: IBillboardController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: BillboardController) => void;
        public nextImage: (controller: BillboardController, element: ng.IAugmentedJQuery) => void;
        public setImage: (element: ng.IAugmentedJQuery, url: string) => void;



        constructor() {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/billboard.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', BillboardController];
            this.link = ($scope: IBillboardController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: BillboardController) => {

             
                

            };


        }



    }

    interface IBillboardController extends ng.IScope {
        CurrentImageIndex: number;
        ImagesResource: any;
   
        
    }
    class BillboardController {
        public CurrentImageIndex: number = 0;
        public ImagesResource: Array<string> = [
            '/content/videos/regusvid2.PNG'
            , '/content/videos/regusvid3.PNG'
            , '/content/billboards/2.jpg'
            , '/content/billboards/1.jpg'
            , '/content/billboards/8.jpg'
            , '/content/billboards/3.jpg'
            , '/content/billboards/4.jpg'
            , '/content/billboards/5.jpg'
            , '/content/billboards/6.jpg'
            , '/content/billboards/7.jpg'
        ];


        constructor(public $scope: IBillboardController,
            private $routeParams: any,
            private $rootScope: any,
            private $injector: any) {

            //$scope.Title = "Search Serviced";

            this.$rootScope.$on("load-step",(evt, step) => {

                //$scope.SubTitle = "";
   
                $scope.$apply();
            });

        }


  
        
    }

    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dBillboard", BillboardDirective.prototype.injection());
}