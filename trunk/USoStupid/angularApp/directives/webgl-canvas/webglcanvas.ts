
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

            //var menuItems = element.find("div");

        }

    }
}
