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
                var renderCanvas = element.find("canvas[id='render']");
                if (this.hasWebGLSupportWithExtensions(['OES_texture_float'])) {
                    var flow = new Flow(renderCanvas);
                }
            };
            WebGLCanvasDirective.prototype.hasWebGLSupportWithExtensions = function (extensions) {
                var canvas = document.createElement('canvas');
                var gl = null;
                try {
                    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                }
                catch (e) {
                    return false;
                }
                if (gl === null) {
                    return false;
                }
                for (var i = 0; i < extensions.length; ++i) {
                    if (gl.getExtension(extensions[i]) === null) {
                        return false;
                    }
                }
                return true;
            };
            return WebGLCanvasDirective;
        })();
        Directives.WebGLCanvasDirective = WebGLCanvasDirective;
        var Flow = (function () {
            function Flow(canvas) {
                this.options = {
                    premultipliedAlpha: false,
                    alpha: true
                };
                var gl = canvas.getContext('webgl', this.options) || canvas.getContext('experimental-webgl', this.options);
                gl.getExtension('OES_texture_float');
                gl.clearColor(0.0, 0.0, 0.0, 0.0);
            }
            return Flow;
        })();
        Directives.Flow = Flow;
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=webglcanvas.js.map