var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        'use strict';
        var WebGLCanvasDirective = (function () {
            function WebGLCanvasDirective() {
                this.scope = {};
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/directives/webgl-canvas/WebGLCanvas.html';
                this.controller = ['$scope', '$routeParams', FlowController];
                this.link = function ($scope, element, attributes, controller) {
                    var renderCanvas = element.find("canvas[id='render']")[0];
                    if ($scope.hasWebGLSupportWithExtensions(['OES_texture_float'])) {
                        $scope.initCanvas(renderCanvas);
                    }
                };
            }
            WebGLCanvasDirective.prototype.injection = function () {
                return [
                    function () {
                        return new WebGLCanvasDirective();
                    }
                ];
            };
            WebGLCanvasDirective.$inject = [function () {
                return new WebGLCanvasDirective();
            }];
            return WebGLCanvasDirective;
        })();
        Directives.WebGLCanvasDirective = WebGLCanvasDirective;
        var FlowController = (function () {
            function FlowController($scope, $routeParams) {
                var _this = this;
                this.$scope = $scope;
                this.$routeParams = $routeParams;
                this.options = {
                    premultipliedAlpha: false,
                    alpha: true
                };
                $scope.hasWebGLSupportWithExtensions = function (extensions) { return _this.hasWebGLSupportWithExtensions(extensions); };
                $scope.initCanvas = function (canvas) { return _this.initCanvas(canvas); };
            }
            FlowController.prototype.hasWebGLSupportWithExtensions = function (extensions) {
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
            FlowController.prototype.initCanvas = function (canvas) {
                var gl = canvas.getContext('webgl', this.options) || canvas.getContext('experimental-webgl', this.options);
                gl.getExtension('OES_texture_float');
                gl.clearColor(0.0, 0.0, 0.0, 0.0);
            };
            return FlowController;
        })();
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=webglcanvas.js.map