
module Application.Directives {
    'use strict';
    export class WebGLCanvasDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                () => { return new WebGLCanvasDirective(); }
            ];
        }

        public templateUrl: string;
        public restrict: string;
        public replace: boolean;

        constructor() {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/directives/webgl-canvas/WebGLCanvas.html';


        }

        public link($scope: ng.IScope, element: JQuery, attributes: ng.IAttributes): void {

            var renderCanvas = element.find("canvas[id='render']");


            if (this.hasWebGLSupportWithExtensions(['OES_texture_float'])) {
                var flow = new Flow(renderCanvas);
            }

        }



        private hasWebGLSupportWithExtensions(extensions) {
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










    }

    export class Flow {

        private options: any = {
            premultipliedAlpha: false,
            alpha: true
        };


        constructor(canvas: any) {

            var gl = canvas.getContext('webgl', this.options) || canvas.getContext('experimental-webgl', this.options);
            gl.getExtension('OES_texture_float');
            gl.clearColor(0.0, 0.0, 0.0, 0.0);


        }
        

        
    }
}
