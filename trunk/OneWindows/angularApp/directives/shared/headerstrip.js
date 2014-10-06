var Application;
(function (Application) {
    (function (Directives) {
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
        Directives.HeaderStripDirective = HeaderStripDirective;
    })(Application.Directives || (Application.Directives = {}));
    var Directives = Application.Directives;
})(Application || (Application = {}));
//window["app"].directive("cstHeaderStrip", Application.Directives.HeaderStripDirective.prototype.injection());
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
