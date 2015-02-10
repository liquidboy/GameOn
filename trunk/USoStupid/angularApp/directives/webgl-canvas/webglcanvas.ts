
module Application.Directives {
    'use strict';
    export class WebGLCanvasDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                () => { return new WebGLCanvasDirective(); }
            ];
        }

        public static $inject: any[] = [() => { return new WebGLCanvasDirective(); }];


        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public controller: any;
        public scope: any = {

        };
        public link: ($scope: IFlowScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: FlowController) => void;

        constructor() {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/directives/webgl-canvas/WebGLCanvas.html';
            this.controller = ['$scope', '$routeParams', FlowController];
            this.link = ($scope: IFlowScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: FlowController) => {

                var renderCanvas = element.find("canvas[id='render']");

                if ($scope.hasWebGLSupportWithExtensions(['OES_texture_float'])) {
                    $scope.initCanvas(renderCanvas);
                }

            }

        }

        










    }

    interface IFlowScope extends ng.IScope {

        hasWebGLSupportWithExtensions: (extensions: any) => boolean;
        initCanvas: (canvas: any) => void;
    }

    class FlowController {

        private options: any = {
            premultipliedAlpha: false,
            alpha: true
        };


        constructor(private $scope: IFlowScope,
            private $routeParams: any) {

            $scope.hasWebGLSupportWithExtensions = (extensions: any) => this.hasWebGLSupportWithExtensions(extensions);
            $scope.initCanvas = (canvas: any) => this.initCanvas(canvas);
        

        }
        

        private hasWebGLSupportWithExtensions(extensions) : boolean{
            var canvas = document.createElement('canvas');
            var gl = null;
            try {
                gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            } catch (e) {
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
        }

        private initCanvas(canvas: any) :void {
            var gl = canvas.getContext('webgl', this.options) || canvas.getContext('experimental-webgl', this.options);
            gl.getExtension('OES_texture_float');
            gl.clearColor(0.0, 0.0, 0.0, 0.0);

        }
    }



    //angular.module('USoStupidApp').directive("dirWebglCanvas", Application.Directives.WebGLCanvasDirective.$inject);

}
