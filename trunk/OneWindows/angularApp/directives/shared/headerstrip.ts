
module HeaderStripModule {
    'use strict';
    export class HeaderStripDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                () => { return new HeaderStripDirective(); }
            ];
        }

        public templateUrl: string;
        public restrict: string;
        public replace: boolean; 

        constructor() {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/HeaderStrip.html';


        }

        public link($scope: ng.IScope, element: JQuery, attributes: ng.IAttributes): void {

            var menuItems = element.find("div");
            
        }

    }
}

window["app"].directive("cstHeaderStrip", HeaderStripModule.HeaderStripDirective.prototype.injection());









//app.directive('cstHeaderStrip', function () {
//    return {
//        restrict: 'E', 
//        replace: true,
//        templateUrl: '/angularApp/partials/HeaderStrip.html',
//        link: function (scope, element, attrs) {
//            var menuItems = element.find("div");
//            //menuItems.on('click', function () {
//            //    menuItems.removeClass('active');
//            //    $(this).addClass('active');
//            //});


//        }
//    };
//}); 