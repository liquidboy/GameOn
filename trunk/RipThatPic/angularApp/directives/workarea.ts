module Application.Directives {
    //'use strict';
    export class WorkareaDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                () => { return new WorkareaDirective(); }
            ];
        }
        public static $inject: any[] = [() => { return new WorkareaDirective(); }];

        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: any = {

        };
        public link: ($scope: IWorkareaController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: WorkareaController) => void;
        public nextImage: (controller: WorkareaController, element: ng.IAugmentedJQuery) => void;
        public setImage: (element: ng.IAugmentedJQuery, url: string) => void;



        constructor() {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/workarea.html';
            this.controller = ['$scope', '$routeParams', '$rootScope', '$injector', WorkareaController];
            this.link = ($scope: IWorkareaController, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: WorkareaController) => {

             
                

            };


        }



    }

    interface IWorkareaController extends ng.IScope {
        CurrentImageIndex: number;
        ImagesResource: any;
   
        
    }
    class WorkareaController {
      


        constructor(public $scope: IWorkareaController,
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
}