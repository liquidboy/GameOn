module Application.Directives {
    //'use strict';
    export class ShaderToyDirective implements ng.IDirective {

        public injection(): Array<any> {
            return [
                "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) => { return new ShaderToyDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
            ];
        }


        public templateUrl: string;
        public restrict: string;
        public replace: boolean;
        public sc: IShaderToyScope;

        public link: ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => void;




        constructor(
            public pubSubConstants: Application.Constants.PubSubConstants,
            public dataSvc: Application.Services.IData,
            public authService: Application.Services.IAuthService,
            public radioPubSubSvc: Application.Services.IRadioPubSubSvc) {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/partials/shader-toy.html';
            this.link = ($scope: any, element: ng.IAugmentedJQuery, attributes: ng.IAttributes) => {
                this.sc = $scope;

                var editor = element.find('#editor');
                var player = element.find('#player');
                var passManager = element.find('#passManager');


                this.sc.shaderToy = new ShaderToy(player, editor, passManager);

            }


        }



    }

    export interface IShaderToyScope extends ng.IScope {

        shaderToy: ShaderToy;

    }


    class ShaderToy {

        mCanvas: webgl.HTMLCanvasElement;
        mGLContext: any;
        mIsPaused: boolean;
        mForceFrame: boolean;

        constructor(
            public playerElement: ng.IAugmentedJQuery,
            public editorElement: ng.IAugmentedJQuery,
            public passElement: ng.IAugmentedJQuery) {

            var canvas : any = playerElement.find('#demogl')[0];
            this.mCanvas = canvas;

            this.mGLContext = this.createGlContext(this.mCanvas, false, true);
            if (this.mGLContext == null) {
                this.createNoWebGLMessage(this.playerElement, this.mCanvas);
                this.mIsPaused = true;
                this.mForceFrame = false;
            }

        }


        createGlContext = function (cv, useAlpha, usePreserveBuffer) {
            var gGLContext = null;
            var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            for (var i = 0; i < names.length; i++) {
                try {
                    gGLContext = cv.getContext(names[i], { alpha: useAlpha, depth: false, antialias: false, stencil: true, premultipliedAlpha: false, preserveDrawingBuffer: usePreserveBuffer });
                }
                catch (e) {
                    gGLContext = null;
                }
                if (gGLContext)
                    break;
            }

            return gGLContext;
        }
        createNoWebGLMessage = function(base : any, old) {
            var div = document.createElement("div");
            div.style.left = "0px";
            div.style.top = "0px";
            div.style.width = "100%";
            div.style.height = "100%";
            div.style.padding = "0px";
            div.style.margin = "0px";
            div.style.position = "absolute";
            div.style.backgroundColor = "#202020";
            div.style.borderRadius = "8px";
            div.style.cursor = "pointer";
            //div.style.visibilty = "hidden";
            base.replaceChild(div, old);

            var divText = document.createElement("div");
            divText.style.width = "86%";
            divText.style.height = "90%";
            divText.style.paddingLeft = "7%";
            divText.style.paddingRight = "7%";
            divText.style.paddingTop = "10%";
            divText.style.paddingBottom = "0px";
            divText.style.color = "#ffffff";
            var fontSize = (base.offsetWidth / 32) | 0;
            if (fontSize < 6) fontSize = 6;
            if (fontSize > 16) fontSize = 16;
            divText.style.font = "italic bold " + fontSize + "px arial,serif";
            divText.innerHTML = 'Shadertoy needs a WebGL-enabled browser. Minimum Requirements: <ul><li>Firefox 17</li><li>Chrome 23</li><li>Internet Explorer 11</li><li>Safari 8</li></ul>';
            div.appendChild(divText);
        }
    }



    var myapp: ng.IModule = angular.module('bootstrapApp');
    myapp.directive("dShaderToy", ShaderToyDirective.prototype.injection());

}