//http://aboutcode.net/2013/10/20/typescript-angularjs-controller-classes.html
//http://www.slideshare.net/3x14159265/typescript-angularjs-32029652
var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        'use strict';
        var TopMenuDirective = (function () {
            function TopMenuDirective() {
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/TopMenu.html';
            }
            TopMenuDirective.prototype.injection = function () {
                return [
                    function () { return new TopMenuDirective(); }
                ];
            };
            TopMenuDirective.prototype.link = function ($scope, element, attributes) {
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
            };
            return TopMenuDirective;
        }());
        Directives.TopMenuDirective = TopMenuDirective;
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
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
//# sourceMappingURL=topmenu.js.map