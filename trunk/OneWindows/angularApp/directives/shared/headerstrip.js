﻿var HeaderStripModule;
(function (HeaderStripModule) {
    'use strict';
    var HeaderStripDirective = (function () {
        function HeaderStripDirective() {
            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/HeaderStrip.html';
        }
        HeaderStripDirective.prototype.injection = function () {
            return [
                function () {
                    return new HeaderStripDirective();
                }
            ];
        };

        HeaderStripDirective.prototype.link = function ($scope, element, attributes) {
            var menuItems = element.find("div");
        };
        return HeaderStripDirective;
    })();
    HeaderStripModule.HeaderStripDirective = HeaderStripDirective;
})(HeaderStripModule || (HeaderStripModule = {}));

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
//# sourceMappingURL=headerstrip.js.map