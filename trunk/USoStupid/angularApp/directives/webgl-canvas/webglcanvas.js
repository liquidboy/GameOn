var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        'use strict';
        var WebGLCanvasDirective = (function () {
            function WebGLCanvasDirective() {
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/directives/webgl-canvas/WebGLCanvas.html';
            }
            WebGLCanvasDirective.prototype.injection = function () {
                return [
                    function () {
                        return new WebGLCanvasDirective();
                    }
                ];
            };
            WebGLCanvasDirective.prototype.link = function ($scope, element, attributes) {
                //var menuItems = element.find("div");
            };
            return WebGLCanvasDirective;
        })();
        Directives.WebGLCanvasDirective = WebGLCanvasDirective;
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=webglcanvas.js.map