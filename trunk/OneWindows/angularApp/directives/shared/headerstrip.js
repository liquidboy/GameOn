var Application;
(function (Application) {
    var Directives;
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
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=headerstrip.js.map