

//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
//http://www.slideshare.net/3x14159265/typescript-angularjs-32029652

module Application.Directives {
    'use strict';
    export class TopMenuDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                () => {return new TopMenuDirective()}
            ];
        }

        public templateUrl: string;
        public restrict: string;
        public replace: boolean;

        constructor() {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/TopMenu.html';
                

        }

        public link($scope: ng.IScope, element: JQuery, attributes: ng.IAttributes): void {

            var menuItems = element.find("a");
            menuItems.on('click', function () {
                menuItems.removeClass('active');
                $(this).addClass('active');
            });

            $scope.$on('logOff', function () {
                //$scope.isAuthenticated = false;
            });

            $scope.$on('logOn', function () {
                //$scope.isAuthenticated = true;
            });

        }

    }
}
 
//window["app"].directive("cstTopMenu", Application.Directives.TopMenuDirective.prototype.injection());


//used to be like this before TS came along :)
//app.directive('cstTopMenu', function () {
//    return {
//        restrict: 'E',
//        replace: true,
//        templateUrl: '/angularApp/partials/TopMenu.html',
//        link: function (scope, element, attrs) {
//            var menuItems = element.find("a");
//            menuItems.on('click', function () {
//                menuItems.removeClass('active');
//                $(this).addClass('active');
//            });
//            scope.$on('logOff', function () {
//                scope.isAuthenticated = false;
//            });
//            scope.$on('logOn', function () {
//                scope.isAuthenticated = true;
//            });
//        }
//    };
//});
