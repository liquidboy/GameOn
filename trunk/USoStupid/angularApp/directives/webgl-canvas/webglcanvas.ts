
module Application.Directives {
    //'use strict';
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
        public flowController: FlowController;

        private currentHue: number = 0;
        private hueStep: number = 0.01;
        private hueIntervalAnimationPointer: number;

        public scope: any = {

        };
        public link: ($scope: IFlowScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: FlowController) => void;

        constructor() {


            this.restrict = 'E';
            this.replace = true;
            this.templateUrl = '/angularApp/directives/webgl-canvas/WebGLCanvas.html';
            this.controller = ['$scope', '$routeParams', FlowController];
            this.link = ($scope: IFlowScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes, controller: FlowController) => {

                var renderCanvas = element.find("canvas[id='render']")[0];

                if ($scope.hasWebGLSupportWithExtensions(['OES_texture_float'])) {
                    $scope.initCanvas(renderCanvas);

                    this.flowController = controller;

                    controller.hue = this.currentHue;
                    controller.timeScale = controller.INITIAL_SPEED;
                    controller.persistence = controller.INITIAL_TURBULENCE;
                    
                    this.hueIntervalAnimationPointer = setInterval(this.updateHueOverTime.bind(this), 100);

                }

            }

        }

        updateHueOverTime() {
            this.currentHue += this.hueStep;
            if (this.currentHue > 1) this.currentHue = 0;
            this.flowController.hue = this.currentHue;
        }

        
    }

    interface IFlowScope extends ng.IScope {
        hasWebGLSupportWithExtensions: (extensions: any) => boolean;
        initCanvas: (canvas: any) => void;
    }
    
    class PipelineState {
        simulationProgramWrapper: any;
        renderingProgramWrapper: any;
        opacityProgramWrapper: any;
        sortProgramWrapper: any;
        resampleProgramWrapper: any;
        floorProgramWrapper: any;
        backgroundProgramWrapper: any;

        
        //variables used for sorting
        totalSortSteps: number;
        sortStepsLeft: number ;
        sortPass: number ;
        sortStage: number ;


        opacityTexture: webgl.WebGLTexture;
        particleTextureA: webgl.WebGLTexture;
        particleTextureB: webgl.WebGLTexture;
        offsetTexture: webgl.WebGLTexture;


        fullscreenVertexBuffer: webgl.WebGLBuffer;
        particleVertexBuffer: webgl.WebGLBuffer;
        floorVertexBuffer: webgl.WebGLBuffer;


        simulationFramebuffer: webgl.WebGLFramebuffer;
        sortFramebuffer: webgl.WebGLFramebuffer;
        resampleFramebuffer: webgl.WebGLFramebuffer;
        opacityFramebuffer: webgl.WebGLFramebuffer;


        
        projectionMatrix: Float32Array;

        lightViewMatrix: Float32Array;
        lightProjectionMatrix: Float32Array;
        lightViewProjectionMatrix: Float32Array;

        lastTime: number;

    }

    class ParticleRenderer {

        firstFrame: boolean ;
        flipped: boolean ;

        public Render() {
            this.firstFrame = false;
            this.flipped = false;
        }
    }
    
    class Camera {
        private INITIAL_AZIMUTH: number = -1.6;  //-1.6 is directly out of screen .. 0.6 <-- left to right
        private INITIAL_ELEVATION: number = 0.4; //0.4 default
        private CAMERA_ORBIT_POINT = [1.2, -0.3, 0.0];
        private CAMERA_DISTANCE: number = 2.2;
        private CAMERA_SENSITIVITY: number = 0.005;


        private viewMatrix = new Float32Array(16);
        private azimuth: number = this.INITIAL_AZIMUTH;
        private elevation: number = this.INITIAL_ELEVATION;
        private MIN_ELEVATION: number = -0.1;
        private MAX_ELEVATION: number = Math.PI / 2.0;

        private currentX: number = 0;
        private recomputeViewMatrix: Function;


        constructor(element: any) {
           

            var lastMouseX: number = 0,
                lastMouseY: number = 0;

            var mouseDown:boolean = false;
            var __this = this;

            
            this.recomputeViewMatrix = function () {
                var xRotationMatrix: Float32Array = new Float32Array(16),
                    yRotationMatrix: Float32Array = new Float32Array(16),
                    distanceTranslationMatrix = GraphicsLib.makeIdentityMatrix(new Float32Array(16)),
                    orbitTranslationMatrix = GraphicsLib.makeIdentityMatrix(new Float32Array(16));

                GraphicsLib.makeIdentityMatrix(__this.viewMatrix);

                GraphicsLib.makeXRotationMatrix(xRotationMatrix, __this.elevation);
                GraphicsLib.makeYRotationMatrix(yRotationMatrix, __this.azimuth);
                distanceTranslationMatrix[14] = -__this.CAMERA_DISTANCE;
                orbitTranslationMatrix[12] = -__this.CAMERA_ORBIT_POINT[0];
                orbitTranslationMatrix[13] = -__this.CAMERA_ORBIT_POINT[1];
                orbitTranslationMatrix[14] = -__this.CAMERA_ORBIT_POINT[2];

                GraphicsLib.premultiplyMatrix(__this.viewMatrix, __this.viewMatrix, orbitTranslationMatrix);
                GraphicsLib.premultiplyMatrix(__this.viewMatrix, __this.viewMatrix, yRotationMatrix);
                GraphicsLib.premultiplyMatrix(__this.viewMatrix, __this.viewMatrix, xRotationMatrix);
                GraphicsLib.premultiplyMatrix(__this.viewMatrix, __this.viewMatrix, distanceTranslationMatrix);
            };


            element.addEventListener('mousedown', function (event) {
                mouseDown = true;
                lastMouseX = __this.getMousePosition(event, element).x;
                lastMouseY = __this.getMousePosition(event, element).y;
            });

            document.addEventListener('mouseup', function (event) {
                mouseDown = false;
            });

            element.addEventListener('mousemove', function (event) {
                if (mouseDown) {
                    var mouseX = __this.getMousePosition(event, element).x;
                    var mouseY = __this.getMousePosition(event, element).y;

                    var deltaAzimuth = (mouseX - lastMouseX) * __this.CAMERA_SENSITIVITY;
                    var deltaElevation = (mouseY - lastMouseY) * __this.CAMERA_SENSITIVITY;

                    __this.azimuth += deltaAzimuth;
                    __this.elevation += deltaElevation;

                    if (__this.elevation < __this.MIN_ELEVATION) {
                        __this.elevation = __this.MIN_ELEVATION;
                    } else if (__this.elevation > __this.MAX_ELEVATION) {
                        __this.elevation = __this.MAX_ELEVATION;
                    }

                    __this.recomputeViewMatrix();

                    lastMouseX = mouseX;
                    lastMouseY = mouseY;

                    element.style.cursor = '-webkit-grabbing';
                    element.style.cursor = '-moz-grabbing';
                    element.style.cursor = 'grabbing';
                } else {
                    element.style.cursor = '-webkit-grab';
                    element.style.cursor = '-moz-grab';
                    element.style.cursor = 'grab';
                }
            });

            //setInterval(this.AutoMoveCamera.bind(this), 10);
            //this.azimuth = -300 * this.CAMERA_SENSITIVITY; //coming out of the screen to user

            this.recomputeViewMatrix();
        }

        private AutoMoveCamera() {
            this.currentX += 0.1;
            if (this.currentX > 600) this.currentX = 0;

            this.azimuth = -this.currentX * this.CAMERA_SENSITIVITY;

            this.recomputeViewMatrix();
        }

        public getViewMatrix(): Float32Array {
            return this.viewMatrix;
        }

        public getPosition(): Float32Array {
            var cameraPosition: Float32Array = new Float32Array(3);
            cameraPosition[0] = this.CAMERA_DISTANCE * Math.sin(Math.PI / 2 - this.elevation) * Math.sin(-this.azimuth) + this.CAMERA_ORBIT_POINT[0];
            cameraPosition[1] = this.CAMERA_DISTANCE * Math.cos(Math.PI / 2 - this.elevation) + this.CAMERA_ORBIT_POINT[1];
            cameraPosition[2] = this.CAMERA_DISTANCE * Math.sin(Math.PI / 2 - this.elevation) * Math.cos(-this.azimuth) + this.CAMERA_ORBIT_POINT[2];

            return cameraPosition;
        }

        public getViewDirection(): Float32Array {
            var viewDirection: Float32Array = new Float32Array(3);
            viewDirection[0] = -Math.sin(Math.PI / 2 - this.elevation) * Math.sin(-this.azimuth);
            viewDirection[1] = -Math.cos(Math.PI / 2 - this.elevation);
            viewDirection[2] = -Math.sin(Math.PI / 2 - this.elevation) * Math.cos(-this.azimuth);

            return viewDirection;
        }
        
        public getMousePosition(event, element): any {
            var boundingRect = element.getBoundingClientRect();
            return {
                x: event.clientX - boundingRect.left,
                y: event.clientY - boundingRect.top
            };
        }

    }

    class ShaderLib {

        private NOISE_OCTAVES:number = 3;
        private NOISE_POSITION_SCALE: number = 1.5;
        private NOISE_SCALE: number = 0.075;
        private NOISE_TIME_SCALE: number = 1 / 4000;
        
        private BASE_SPEED: number = 0.2;
        
        private PARTICLE_OPACITY_SCALE: number = 0.75;
        
        private BACKGROUND_DISTANCE_SCALE: number = 0.1;


        public constructor(public FLOOR_ORIGIN: any, public PARTICLE_SATURATION: number, public PARTICLE_VALUE: number) {

        }


        public SIMULATION_VERTEX_SHADER_SOURCE: string = [
            'precision highp float;',
            'attribute vec2 a_position;',

            'void main () {',
            '   gl_Position = vec4(a_position, 0.0, 1.0);',
            '}'
        ].join('\n');

        public SIMULATION_FRAGMENT_SHADER_SOURCE: string = [
            'precision highp float;',
            'uniform sampler2D u_particleTexture;',
            'uniform sampler2D u_spawnTexture;',
            'uniform vec2 u_resolution;',
            'uniform float u_deltaTime;',
            'uniform float u_time;',
            'uniform float u_persistence;',
            'const int OCTAVES = ' + this.NOISE_OCTAVES.toFixed(0) + ';',
            'vec4 mod289(vec4 x) {',
            '   return x - floor(x * (1.0 / 289.0)) * 289.0;',
            '}',
            'float mod289(float x) {',
            '   return x - floor(x * (1.0 / 289.0)) * 289.0;',
            '}',
            'vec4 permute(vec4 x) {',
            '   return mod289(((x*34.0)+1.0)*x);',
            '}',
            'float permute(float x) {',
            '   return mod289(((x*34.0)+1.0)*x);',
            '}',
            'vec4 taylorInvSqrt(vec4 r) {',
            '   return 1.79284291400159 - 0.85373472095314 * r;',
            '}',
            'float taylorInvSqrt(float r) {',
            '   return 1.79284291400159 - 0.85373472095314 * r;',
            '}',
            'vec4 grad4(float j, vec4 ip) {',
            '   const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);',
            '   vec4 p,s;',
            '   p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;',
            '   p.w = 1.5 - dot(abs(p.xyz), ones.xyz);',
            '   s = vec4(lessThan(p, vec4(0.0)));',
            '   p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; ',
            '   return p;',
            '}',
            '#define F4 0.309016994374947451',
            'vec4 simplexNoiseDerivatives (vec4 v) {',
            '   const vec4  C = vec4( 0.138196601125011,0.276393202250021,0.414589803375032,-0.447213595499958);',
            '   vec4 i  = floor(v + dot(v, vec4(F4)) );',
            '   vec4 x0 = v -   i + dot(i, C.xxxx);',
            '   vec4 i0;',
            '   vec3 isX = step( x0.yzw, x0.xxx );',
            '   vec3 isYZ = step( x0.zww, x0.yyz );',
            '   i0.x = isX.x + isX.y + isX.z;',
            '   i0.yzw = 1.0 - isX;',
            '   i0.y += isYZ.x + isYZ.y;',
            '   i0.zw += 1.0 - isYZ.xy;',
            '   i0.z += isYZ.z;',
            '   i0.w += 1.0 - isYZ.z;',
            '   vec4 i3 = clamp( i0, 0.0, 1.0 );',
            '   vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );',
            '   vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );',
            '   vec4 x1 = x0 - i1 + C.xxxx;',
            '   vec4 x2 = x0 - i2 + C.yyyy;',
            '   vec4 x3 = x0 - i3 + C.zzzz;',
            '   vec4 x4 = x0 + C.wwww;',
            '   i = mod289(i); ',
            '   float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);',
            '   vec4 j1 = permute( permute( permute( permute (',
            '       i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))',
            '       + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))',
            '       + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))',
            '       + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));',
            '   vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;',
            '   vec4 p0 = grad4(j0,   ip);',
            '   vec4 p1 = grad4(j1.x, ip);',
            '   vec4 p2 = grad4(j1.y, ip);',
            '   vec4 p3 = grad4(j1.z, ip);',
            '   vec4 p4 = grad4(j1.w, ip);',
            '   vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));',
            '   p0 *= norm.x;',
            '   p1 *= norm.y;',
            '   p2 *= norm.z;',
            '   p3 *= norm.w;',
            '   p4 *= taylorInvSqrt(dot(p4,p4));',
            '   vec3 values0 = vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2));', //value of contributions from each corner at point
            '   vec2 values1 = vec2(dot(p3, x3), dot(p4, x4));',
            '   vec3 m0 = max(0.5 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);', //(0.5 - x^2) where x is the distance
            '   vec2 m1 = max(0.5 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);',
            '   vec3 temp0 = -6.0 * m0 * m0 * values0;',
            '   vec2 temp1 = -6.0 * m1 * m1 * values1;',
            '   vec3 mmm0 = m0 * m0 * m0;',
            '   vec2 mmm1 = m1 * m1 * m1;',
            '   float dx = temp0[0] * x0.x + temp0[1] * x1.x + temp0[2] * x2.x + temp1[0] * x3.x + temp1[1] * x4.x + mmm0[0] * p0.x + mmm0[1] * p1.x + mmm0[2] * p2.x + mmm1[0] * p3.x + mmm1[1] * p4.x;',
            '   float dy = temp0[0] * x0.y + temp0[1] * x1.y + temp0[2] * x2.y + temp1[0] * x3.y + temp1[1] * x4.y + mmm0[0] * p0.y + mmm0[1] * p1.y + mmm0[2] * p2.y + mmm1[0] * p3.y + mmm1[1] * p4.y;',
            '   float dz = temp0[0] * x0.z + temp0[1] * x1.z + temp0[2] * x2.z + temp1[0] * x3.z + temp1[1] * x4.z + mmm0[0] * p0.z + mmm0[1] * p1.z + mmm0[2] * p2.z + mmm1[0] * p3.z + mmm1[1] * p4.z;',
            '   float dw = temp0[0] * x0.w + temp0[1] * x1.w + temp0[2] * x2.w + temp1[0] * x3.w + temp1[1] * x4.w + mmm0[0] * p0.w + mmm0[1] * p1.w + mmm0[2] * p2.w + mmm1[0] * p3.w + mmm1[1] * p4.w;',
            '   return vec4(dx, dy, dz, dw) * 49.0;',
            '}',

            'void main () {',
            '   vec2 textureCoordinates = gl_FragCoord.xy / u_resolution;',
            '   vec4 data = texture2D(u_particleTexture, textureCoordinates);',
            '   vec3 oldPosition = data.rgb;',
            '   vec3 noisePosition = oldPosition * ' + this.NOISE_POSITION_SCALE.toFixed(8) + ';',
            '   float noiseTime = u_time * ' + this.NOISE_TIME_SCALE.toFixed(8) + ';',
            '   vec4 xNoisePotentialDerivatives = vec4(0.0);',
            '   vec4 yNoisePotentialDerivatives = vec4(0.0);',
            '   vec4 zNoisePotentialDerivatives = vec4(0.0);',
            '   float persistence = u_persistence;',
            '   for (int i = 0; i < OCTAVES; ++i) {',
            '       float scale = (1.0 / 2.0) * pow(2.0, float(i));',
            '       float noiseScale = pow(persistence, float(i));',
            '       if (persistence == 0.0 && i == 0) {', //fix undefined behaviour
            '           noiseScale = 1.0;',
            '       }',
            '       xNoisePotentialDerivatives += simplexNoiseDerivatives(vec4(noisePosition * pow(2.0, float(i)), noiseTime)) * noiseScale * scale;',
            '       yNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((noisePosition + vec3(123.4, 129845.6, -1239.1)) * pow(2.0, float(i)), noiseTime)) * noiseScale * scale;',
            '       zNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((noisePosition + vec3(-9519.0, 9051.0, -123.0)) * pow(2.0, float(i)), noiseTime)) * noiseScale * scale;',
            '   }',
                //compute curl
            '   vec3 noiseVelocity = vec3(',
            '      zNoisePotentialDerivatives[1] - yNoisePotentialDerivatives[2],',
            '      xNoisePotentialDerivatives[2] - zNoisePotentialDerivatives[0],',
            '      yNoisePotentialDerivatives[0] - xNoisePotentialDerivatives[1]',
            '   ) * ' + this.NOISE_SCALE.toFixed(8) + ';',
            '   vec3 velocity = vec3(' + this.BASE_SPEED.toFixed(8) + ', 0.0, 0.0);',
            '   vec3 totalVelocity = velocity + noiseVelocity;',
            '   vec3 newPosition = oldPosition + totalVelocity * u_deltaTime;',
            '   float oldLifetime = data.a;',
            '   float newLifetime = oldLifetime - u_deltaTime;',
            '   vec4 spawnData = texture2D(u_spawnTexture, textureCoordinates);',
            '   if (newLifetime < 0.0) {',
            '      newPosition = spawnData.rgb;',
            '      newLifetime = spawnData.a + newLifetime;',
            '   }',
            '   gl_FragColor = vec4(newPosition, newLifetime);',
            '}'
        ].join('\n');

        public RENDERING_VERTEX_SHADER_SOURCE: string = [
            'precision highp float;',
            'attribute vec2 a_textureCoordinates;',
            'varying vec3 v_position;',
            'varying float v_opacity;',
            'uniform sampler2D u_particleTexture;',
            'uniform sampler2D u_opacityTexture;',
            'uniform mat4 u_viewMatrix;',
            'uniform mat4 u_projectionMatrix;',
            'uniform mat4 u_lightViewProjectionMatrix;',
            'uniform float u_particleDiameter;',
            'uniform float u_screenWidth;',

            'void main () {',
            '   vec3 position = texture2D(u_particleTexture, a_textureCoordinates).rgb;',
            '   v_position = position;',

            '   vec2 lightTextureCoordinates = vec2(u_lightViewProjectionMatrix * vec4(position, 1.0)) * 0.5 + 0.5;',
            '   v_opacity = texture2D(u_opacityTexture, lightTextureCoordinates).a;',

            '   vec3 viewSpacePosition = vec3(u_viewMatrix * vec4(position, 1.0));',
            '   vec4 corner = vec4(u_particleDiameter * 0.5, u_particleDiameter * 0.5, viewSpacePosition.z, 1.0);',
            '   float projectedCornerX = dot(vec4(u_projectionMatrix[0][0], u_projectionMatrix[1][0], u_projectionMatrix[2][0], u_projectionMatrix[3][0]), corner);',
            '   float projectedCornerW = dot(vec4(u_projectionMatrix[0][3], u_projectionMatrix[1][3], u_projectionMatrix[2][3], u_projectionMatrix[3][3]), corner);',
            '   gl_PointSize = u_screenWidth * 0.5 * projectedCornerX * 2.0 / projectedCornerW;',

            '   gl_Position = u_projectionMatrix * vec4(viewSpacePosition, 1.0);',

            '   if (position.y < ' + this.FLOOR_ORIGIN[1].toFixed(8) + ') gl_Position = vec4(9999999.0, 9999999.0, 9999999.0, 1.0);',
            '}'
        ].join('\n');

        public RENDERING_FRAGMENT_SHADER_SOURCE: string = [
            'precision highp float;',
            'varying vec3 v_position;',
            'varying float v_opacity;',
            'uniform float u_particleAlpha;',
            'uniform vec3 u_particleColor;',
            'uniform bool u_flipped;', //non-flipped is front-to-back, flipped is back-to-front

            'void main () {',
            '   float distanceFromCenter = distance(gl_PointCoord.xy, vec2(0.5, 0.5));',
            '   if (distanceFromCenter > 0.5) discard;',
            '   float alpha = clamp(1.0 - distanceFromCenter * 2.0, 0.0, 1.0) * u_particleAlpha;',

            '   vec3 color = (1.0 - v_opacity * ' + this.PARTICLE_OPACITY_SCALE.toFixed(8) + ') * u_particleColor;',

            '   gl_FragColor = vec4(color * alpha, alpha);',
            '}'
        ].join('\n');

        public OPACITY_VERTEX_SHADER_SOURCE: string = [
            'precision highp float;',

            'attribute vec2 a_textureCoordinates;',

            'uniform sampler2D u_particleTexture;',

            'uniform mat4 u_lightViewMatrix;',
            'uniform mat4 u_lightProjectionMatrix;',

            'uniform float u_particleDiameter;',
            'uniform float u_screenWidth;',

            'void main () {',
            'vec3 position = texture2D(u_particleTexture, a_textureCoordinates).rgb;',

            'vec3 viewSpacePosition = vec3(u_lightViewMatrix * vec4(position, 1.0));',

            'vec4 corner = vec4(u_particleDiameter * 0.5, u_particleDiameter * 0.5, viewSpacePosition.z, 1.0);',

            'float projectedCornerX = dot(vec4(u_lightProjectionMatrix[0][0], u_lightProjectionMatrix[1][0], u_lightProjectionMatrix[2][0], u_lightProjectionMatrix[3][0]), corner);',
            'float projectedCornerW = dot(vec4(u_lightProjectionMatrix[0][3], u_lightProjectionMatrix[1][3], u_lightProjectionMatrix[2][3], u_lightProjectionMatrix[3][3]), corner);',

            'gl_PointSize = u_screenWidth * 0.5 * projectedCornerX * 2.0 / projectedCornerW;',

            'gl_Position = u_lightProjectionMatrix * vec4(viewSpacePosition, 1.0);',
            '}'
        ].join('\n');

        public OPACITY_FRAGMENT_SHADER_SOURCE: string = [
            'precision highp float;',

            'uniform float u_particleAlpha;',

            'void main () {',
            'float distanceFromCenter = distance(gl_PointCoord.xy, vec2(0.5, 0.5));',
            'if (distanceFromCenter > 0.5) discard;',
            'float alpha = clamp(1.0 - distanceFromCenter * 2.0, 0.0, 1.0) * u_particleAlpha;',

            'gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);', //under operator requires this premultiplication
            '}'
        ].join('\n');

        public SORT_VERTEX_SHADER_SOURCE: string = [
            'precision highp float;',

            'attribute vec2 a_position;',

            'void main () {',
            'gl_Position = vec4(a_position, 0.0, 1.0);',
            '}'
        ].join('\n');

        public SORT_FRAGMENT_SHADER_SOURCE: string = [
            'precision highp float;',

            'uniform sampler2D u_dataTexture;',

            'uniform vec2 u_resolution;',

            'uniform float pass;',
            'uniform float stage;',

            'uniform vec3 u_cameraPosition;',

            'uniform vec3 u_halfVector;',

            'void main () {',
            'vec2 normalizedCoordinates = gl_FragCoord.xy / u_resolution;',

            'vec4 self = texture2D(u_dataTexture, normalizedCoordinates);',

            'float i = floor(normalizedCoordinates.x * u_resolution.x) + floor(normalizedCoordinates.y * u_resolution.y) * u_resolution.x;',

            'float j = floor(mod(i, 2.0 * stage));',

            'float compare = 0.0;',

            'if ((j < mod(pass, stage)) || (j > (2.0 * stage - mod(pass, stage) - 1.0))) {',
            'compare = 0.0;',
            '} else {',
            'if (mod((j + mod(pass, stage)) / pass, 2.0) < 1.0) {',
            'compare = 1.0;',
            '} else {',
            'compare = -1.0;',
            '}',
            '}',

            'float adr = i + compare * pass;',

            'vec4 partner = texture2D(u_dataTexture, vec2(floor(mod(adr, u_resolution.x)) / u_resolution.x, floor(adr / u_resolution.x) / u_resolution.y));',

            'float selfProjectedLength = dot(u_halfVector, self.xyz);',
            'float partnerProjectedLength = dot(u_halfVector, partner.xyz);',

            'gl_FragColor = (selfProjectedLength * compare < partnerProjectedLength * compare) ? self : partner;',
            '}'
        ].join('\n');

        public RESAMPLE_VERTEX_SHADER_SOURCE: string = [
            'precision highp float;',

            'attribute vec2 a_position;',
            'varying vec2 v_coordinates;',

            'void main () {',
            'v_coordinates = a_position.xy * 0.5 + 0.5;',
            'gl_Position = vec4(a_position, 0.0, 1.0);',
            '}'
        ].join('\n');

        public RESAMPLE_FRAGMENT_SHADER_SOURCE: string = [
            'precision highp float;',
            'varying vec2 v_coordinates;',
            'uniform sampler2D u_particleTexture;',
            'uniform sampler2D u_offsetTexture;',
            'uniform float u_offsetScale;',

            'void main () {',
            '   vec4 data = texture2D(u_particleTexture, v_coordinates);',
            '   vec4 offset = texture2D(u_offsetTexture, v_coordinates);',
            '   vec3 position = data.rgb + offset.rgb * u_offsetScale;',
            '   gl_FragColor = vec4(position, data.a);',
            '}'
        ].join('\n');

        public FLOOR_VERTEX_SHADER_SOURCE: string = [
            'precision highp float;',
            'attribute vec3 a_vertexPosition;',
            'varying vec3 v_position;',
            'uniform mat4 u_viewMatrix;',
            'uniform mat4 u_projectionMatrix;',

            'void main () {',
            '   v_position = a_vertexPosition;',
            '   gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_vertexPosition, 1.0);',
            '}'
        ].join('\n');

        public FLOOR_FRAGMENT_SHADER_SOURCE: string = [
            'precision highp float;',
            'varying vec3 v_position;',
            'uniform sampler2D u_opacityTexture;',
            'uniform mat4 u_lightViewProjectionMatrix;',

            'void main () {',
            '   vec2 lightTextureCoordinates = vec2(u_lightViewProjectionMatrix * vec4(v_position, 1.0)) * 0.5 + 0.5;',
            '   float opacity = texture2D(u_opacityTexture, lightTextureCoordinates).a;',

            '   if (lightTextureCoordinates.x < 0.0 || lightTextureCoordinates.x > 1.0 || lightTextureCoordinates.y < 0.0 || lightTextureCoordinates.y > 1.0) {',
            '       opacity = 0.0;',
            '   }',

            '   gl_FragColor = vec4(0.0, 0.0, 0.0, opacity * 0.5);',
            '}'
        ].join('\n');

        public BACKGROUND_VERTEX_SHADER_SOURCE: string = [
            'precision highp float;',
            'attribute vec2 a_position;',
            'varying vec2 v_position;',

            'void main () {',
            '   v_position = a_position;',
            '   gl_Position = vec4(a_position, 0.0, 1.0);',
            '}'
        ].join('\n');

        public BACKGROUND_FRAGMENT_SHADER_SOURCE: string = [
            'precision highp float;',
            'varying vec2 v_position;',

            'void main () {',
            '   float dist = length(v_position);',
            '   gl_FragColor = vec4(vec3(1.0) - dist * ' + this.BACKGROUND_DISTANCE_SCALE.toFixed(8) + ', 1.0);',
            '}'
        ].join('\n');


    }

    class GraphicsLib {

        public static makeIdentityMatrix(matrix: Float32Array): Float32Array {
            matrix[0] = 1.0;
            matrix[1] = 0.0;
            matrix[2] = 0.0;
            matrix[3] = 0.0;
            matrix[4] = 0.0;
            matrix[5] = 1.0;
            matrix[6] = 0.0;
            matrix[7] = 0.0;
            matrix[8] = 0.0;
            matrix[9] = 0.0;
            matrix[10] = 1.0;
            matrix[11] = 0.0;
            matrix[12] = 0.0;
            matrix[13] = 0.0;
            matrix[14] = 0.0;
            matrix[15] = 1.0;
            return matrix;
        }

        public static makeXRotationMatrix(matrix: Float32Array, angle: number): Float32Array {
            matrix[0] = 1.0;
            matrix[1] = 0.0;
            matrix[2] = 0.0;
            matrix[3] = 0.0;
            matrix[4] = 0.0;
            matrix[5] = Math.cos(angle);
            matrix[6] = Math.sin(angle);
            matrix[7] = 0.0;
            matrix[8] = 0.0;
            matrix[9] = -Math.sin(angle);
            matrix[10] = Math.cos(angle);
            matrix[11] = 0.0;
            matrix[12] = 0.0;
            matrix[13] = 0.0;
            matrix[14] = 0.0;
            matrix[15] = 1.0;
            return matrix;
        }

        public static makeYRotationMatrix(matrix: Float32Array, angle: number): Float32Array {
            matrix[0] = Math.cos(angle);
            matrix[1] = 0.0;
            matrix[2] = -Math.sin(angle);
            matrix[3] = 0.0;
            matrix[4] = 0.0;
            matrix[5] = 1.0;
            matrix[6] = 0.0;
            matrix[7] = 0.0;
            matrix[8] = Math.sin(angle);
            matrix[9] = 0.0;
            matrix[10] = Math.cos(angle);
            matrix[11] = 0.0;
            matrix[12] = 0.0;
            matrix[13] = 0.0;
            matrix[14] = 0.0;
            matrix[15] = 1.0;
            return matrix;
        }

        public static makePerspectiveMatrix(matrix: Float32Array, fov: number, aspect: number, near: number, far: number): Float32Array {
            var f: number = Math.tan(0.5 * (Math.PI - fov)),
                range = near - far;

            matrix[0] = f / aspect;
            matrix[1] = 0;
            matrix[2] = 0;
            matrix[3] = 0;
            matrix[4] = 0;
            matrix[5] = f;
            matrix[6] = 0;
            matrix[7] = 0;
            matrix[8] = 0;
            matrix[9] = 0;
            matrix[10] = far / range;
            matrix[11] = -1;
            matrix[12] = 0;
            matrix[13] = 0;
            matrix[14] = (near * far) / range;
            matrix[15] = 0.0;

            return matrix;
        }

        public static premultiplyMatrix(out: Float32Array, matrixA: Float32Array, matrixB: Float32Array): Float32Array { //out = matrixB * matrixA
            var b0 = matrixB[0], b4 = matrixB[4], b8 = matrixB[8], b12 = matrixB[12],
                b1 = matrixB[1], b5 = matrixB[5], b9 = matrixB[9], b13 = matrixB[13],
                b2 = matrixB[2], b6 = matrixB[6], b10 = matrixB[10], b14 = matrixB[14],
                b3 = matrixB[3], b7 = matrixB[7], b11 = matrixB[11], b15 = matrixB[15],

                aX = matrixA[0], aY = matrixA[1], aZ = matrixA[2], aW = matrixA[3];
            out[0] = b0 * aX + b4 * aY + b8 * aZ + b12 * aW;
            out[1] = b1 * aX + b5 * aY + b9 * aZ + b13 * aW;
            out[2] = b2 * aX + b6 * aY + b10 * aZ + b14 * aW;
            out[3] = b3 * aX + b7 * aY + b11 * aZ + b15 * aW;

            aX = matrixA[4];
            aY = matrixA[5];
            aZ = matrixA[6];
            aW = matrixA[7];

            out[4] = b0 * aX + b4 * aY + b8 * aZ + b12 * aW;
            out[5] = b1 * aX + b5 * aY + b9 * aZ + b13 * aW;
            out[6] = b2 * aX + b6 * aY + b10 * aZ + b14 * aW;
            out[7] = b3 * aX + b7 * aY + b11 * aZ + b15 * aW;

            aX = matrixA[8];
            aY = matrixA[9];
            aZ = matrixA[10];
            aW = matrixA[11];

            out[8] = b0 * aX + b4 * aY + b8 * aZ + b12 * aW;
            out[9] = b1 * aX + b5 * aY + b9 * aZ + b13 * aW;
            out[10] = b2 * aX + b6 * aY + b10 * aZ + b14 * aW;
            out[11] = b3 * aX + b7 * aY + b11 * aZ + b15 * aW;

            aX = matrixA[12];
            aY = matrixA[13];
            aZ = matrixA[14];
            aW = matrixA[15];

            out[12] = b0 * aX + b4 * aY + b8 * aZ + b12 * aW;
            out[13] = b1 * aX + b5 * aY + b9 * aZ + b13 * aW;
            out[14] = b2 * aX + b6 * aY + b10 * aZ + b14 * aW;
            out[15] = b3 * aX + b7 * aY + b11 * aZ + b15 * aW;

            return out;
        }
        
        public static normalizeVector(out: Float32Array, v: Float32Array) {
            var inverseMagnitude = 1.0 / Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
            out[0] = v[0] * inverseMagnitude;
            out[1] = v[1] * inverseMagnitude;
            out[2] = v[2] * inverseMagnitude;
        }

        public static dotVectors(a, b): any {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        }
        
        public static makeOrthographicMatrix(matrix, left, right, bottom, top, near, far): void {
            matrix[0] = 2 / (right - left);
            matrix[1] = 0;
            matrix[2] = 0;
            matrix[3] = 0;
            matrix[4] = 0;
            matrix[5] = 2 / (top - bottom);
            matrix[6] = 0;
            matrix[7] = 0;
            matrix[8] = 0;
            matrix[9] = 0;
            matrix[10] = -2 / (far - near);
            matrix[11] = 0;
            matrix[12] = -(right + left) / (right - left);
            matrix[13] = -(top + bottom) / (top - bottom);
            matrix[14] = -(far + near) / (far - near);
            matrix[15] = 1;
        }

        public static makeLookAtMatrix(matrix, eye, target, up) { //up is assumed to be normalized
            var forwardX = eye[0] - target[0],
                forwardY = eye[1] - target[1],
                forwardZ = eye[2] - target[2];
            var forwardMagnitude = Math.sqrt(forwardX * forwardX + forwardY * forwardY + forwardZ * forwardZ);
            forwardX /= forwardMagnitude;
            forwardY /= forwardMagnitude;
            forwardZ /= forwardMagnitude;

            var rightX = up[2] * forwardY - up[1] * forwardZ;
            var rightY = up[0] * forwardZ - up[2] * forwardX;
            var rightZ = up[1] * forwardX - up[0] * forwardY;

            var rightMagnitude = Math.sqrt(rightX * rightX + rightY * rightY + rightZ * rightZ);
            rightX /= rightMagnitude;
            rightY /= rightMagnitude;
            rightZ /= rightMagnitude;

            var newUpX = forwardY * rightZ - forwardZ * rightY;
            var newUpY = forwardZ * rightX - forwardX * rightZ;
            var newUpZ = forwardX * rightY - forwardY * rightX;

            var newUpMagnitude = Math.sqrt(newUpX * newUpX + newUpY * newUpY + newUpZ * newUpZ);
            newUpX /= newUpMagnitude;
            newUpY /= newUpMagnitude;
            newUpZ /= newUpMagnitude;

            matrix[0] = rightX;
            matrix[1] = newUpX;
            matrix[2] = forwardX;
            matrix[3] = 0;
            matrix[4] = rightY;
            matrix[5] = newUpY;
            matrix[6] = forwardY;
            matrix[7] = 0;
            matrix[8] = rightZ;
            matrix[9] = newUpZ;
            matrix[10] = forwardZ;
            matrix[11] = 0;
            matrix[12] = -(rightX * eye[0] + rightY * eye[1] + rightZ * eye[2]);
            matrix[13] = -(newUpX * eye[0] + newUpY * eye[1] + newUpZ * eye[2]);
            matrix[14] = -(forwardX * eye[0] + forwardY * eye[1] + forwardZ * eye[2]);
            matrix[15] = 1;
        }

        public static randomPointInSphere() {
            var lambda = Math.random();
            var u = Math.random() * 2.0 - 1.0;
            var phi = Math.random() * 2.0 * Math.PI;

            return [
                Math.pow(lambda, 1 / 3) * Math.sqrt(1.0 - u * u) * Math.cos(phi),
                Math.pow(lambda, 1 / 3) * Math.sqrt(1.0 - u * u) * Math.sin(phi),
                Math.pow(lambda, 1 / 3) * u
            ];
        }

        public static log2(x): any {
            return Math.log(x) / Math.log(2);
        }
        
        public static hsvToRGB(h, s, v): any {
            h = h % 1;

            var c = v * s;

            var hDash = h * 6;

            var x = c * (1 - Math.abs(hDash % 2 - 1));

            var mod = Math.floor(hDash);

            var r = [c, x, 0, 0, x, c][mod];
            var g = [x, c, c, x, 0, 0][mod];
            var b = [0, 0, x, c, c, x][mod];

            var m = v - c;

            r += m;
            g += m;
            b += m;

            return [r, g, b];
        }

        public static rgbToString(color): any {
            return 'rgb(' + (color[0] * 255).toFixed(0) + ',' + (color[1] * 255).toFixed(0) + ',' + (color[2] * 255).toFixed(0) + ')';
        }
    }

    class FlowController {

        private MAX_DELTA_TIME: number = 0.2;

        private PRESIMULATION_DELTA_TIME: number = 0.1;

        private QUALITY_LEVELS = [
            {
                resolution: [256, 256],
                diameter: 0.03,
                alpha: 0.5
            },
            //{
            //    resolution: [512, 256],
            //    diameter: 0.025,
            //    alpha: 0.4
            //},
            //{
            //    resolution: [512, 512],
            //    diameter: 0.02,
            //    alpha: 0.3
            //},
            //{
            //    resolution: [1024, 512],
            //    diameter: 0.015,
            //    alpha: 0.25
            //},
            //{
            //    resolution: [1024, 1024],
            //    diameter: 0.0125,
            //    alpha: 0.2
            //},
            //{
            //    resolution: [2048, 1024],
            //    diameter: 0.01,
            //    alpha: 0.2
            //},
        ];

        private OPACITY_TEXTURE_RESOLUTION: number = 1024;

        private LIGHT_DIRECTION = [0.0, -1.0, 0.0]; //points away from the light source
        private LIGHT_UP_VECTOR = [0.0, 0.0, 1.0];

        private SLICES: number = 128; //128;

        private SORT_PASSES_PER_FRAME: number = 100; //50;
        
        private ASPECT_RATIO: number = 16 / 9;

        private PROJECTION_NEAR: number = 0.01;
        private PROJECTION_FAR: number = 10.0;
        private PROJECTION_FOV: number = (60 / 180) * Math.PI;

        public PARTICLE_SATURATION: number = 0.75;
        public PARTICLE_VALUE: number = 1.0;

        private FLOOR_ORIGIN: any = [-2.0, -0.75, -5.0];
        private FLOOR_WIDTH: number = 100.0;
        private FLOOR_HEIGHT: number = 100.0;

        private LIGHT_PROJECTION_LEFT: number = -5.0;
        private LIGHT_PROJECTION_RIGHT: number = 5.0;
        private LIGHT_PROJECTION_BOTTOM: number = -5.0;
        private LIGHT_PROJECTION_TOP: number = 5.0;
        private LIGHT_PROJECTION_NEAR: number = -50.0;
        private LIGHT_PROJECTION_FAR: number = 50.0;

        private SPAWN_RADIUS: number = 0.6;
        private BASE_LIFETIME: number = 10;
        private MAX_ADDITIONAL_LIFETIME: number = 5;
        private OFFSET_RADIUS: number = 0.5;
        
        public INITIAL_SPEED : number = 2;
        public INITIAL_TURBULENCE: number = 0.2;
        
        private options: any = {
            premultipliedAlpha: false,
            alpha: true
        };
        
        public hue : number = 0;
        public timeScale: number = this.INITIAL_SPEED;
        public persistence: number = this.INITIAL_TURBULENCE;
        private qualityLevel: any = -1;
        
        private particleCountWidth: number = 0;
        private particleCountHeight: number= 0;
        private particleCount: number = this.particleCountWidth * this.particleCountHeight;

        private particleDiameter: number = 0.0;
        private particleAlpha : number = 0.0;

        private changingParticleCount: boolean = false;
        private oldParticleDiameter: number;
        private oldParticleCountWidth : number;
        private oldParticleCountHeight: number;

        private spawnTexture: any;



        private shaderLib: ShaderLib;

        
        private canvas: webgl.HTMLCanvasElement;
        private camera: Camera;
        private gl: webgl.WebGLRenderingContext;
        private pso: PipelineState;
        private renderer: ParticleRenderer;

        private particleVertexBuffers: any; //one for each quality level
        private spawnTextures: any; //one for each quality level

        constructor(private $scope: IFlowScope,
            private $routeParams: any) {

            this.renderer = new ParticleRenderer();
            this.pso = new PipelineState();
            this.shaderLib = new ShaderLib(this.FLOOR_ORIGIN, this.PARTICLE_SATURATION, this.PARTICLE_VALUE);

            $scope.hasWebGLSupportWithExtensions = (extensions: any) => this.hasWebGLSupportWithExtensions(extensions);
            $scope.initCanvas = (canvas: any) => this.initCanvas(canvas);
        

        }

        private changeQualityLevel(newLevel: number): void {
            this.qualityLevel = newLevel;

            this.particleAlpha = this.QUALITY_LEVELS[this.qualityLevel].alpha;
            this.changingParticleCount = true;

            this.oldParticleDiameter = this.particleDiameter;
            this.particleDiameter = this.QUALITY_LEVELS[this.qualityLevel].diameter;

            this.oldParticleCountWidth = this.particleCountWidth;
            this.oldParticleCountHeight = this.particleCountHeight;
            this.particleCountWidth = this.QUALITY_LEVELS[this.qualityLevel].resolution[0];
            this.particleCountHeight = this.QUALITY_LEVELS[this.qualityLevel].resolution[1];

            this.particleCount = this.particleCountWidth * this.particleCountHeight;
        }



        private initCanvas(canvas: webgl.HTMLCanvasElement): void {
            this.canvas = canvas;
            this.gl = canvas.getContext('webgl', this.options) || canvas.getContext('experimental-webgl', this.options);

            this.gl.getExtension('OES_texture_float');
            this.gl.clearColor(0.0, 0.0, 0.0, 0.0);

            this.camera = new Camera(this.canvas);
            
            this.renderer.firstFrame = true;
            this.renderer.flipped = false;
            this.pso.lastTime = 0.0;

            this.loadParticleResources();

            this.loadResources();
            

            $(window).on("resize", this.onresize.bind(this));
            this.onresize();
            this.render(this.pso.lastTime);


        }

        private onresize(): void{
            var aspectRatio = window.innerWidth / window.innerHeight;
            GraphicsLib.makePerspectiveMatrix(this.pso.projectionMatrix, this.PROJECTION_FOV, aspectRatio, this.PROJECTION_NEAR, this.PROJECTION_FAR);
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };

        private loadParticleResources(): void{

            var maxParticleCount = this.QUALITY_LEVELS[this.QUALITY_LEVELS.length - 1].resolution[0] * this.QUALITY_LEVELS[this.QUALITY_LEVELS.length - 1].resolution[1];

            var randomNumbers = [];
            var randomSpherePoints = [];

            for (var i = 0; i < maxParticleCount; ++i) {
                randomNumbers[i] = Math.random();

                var point = GraphicsLib.randomPointInSphere();
                randomSpherePoints.push(point);
            }

            

            this.particleVertexBuffers = []; //one for each quality level
            this.spawnTextures = []; //one for each quality level

            //spawn texture
            for (var i = 0; i < this.QUALITY_LEVELS.length; ++i) {
                var width = this.QUALITY_LEVELS[i].resolution[0];
                var height = this.QUALITY_LEVELS[i].resolution[1];

                var count = width * height;

                this.particleVertexBuffers[i] = this.gl.createBuffer();

                var particleTextureCoordinates = new Float32Array(width * height * 2);
                for (var y = 0; y < height; ++y) {
                    for (var x = 0; x < width; ++x) {
                        particleTextureCoordinates[(y * width + x) * 2] = (x + 0.5) / width;
                        particleTextureCoordinates[(y * width + x) * 2 + 1] = (y + 0.5) / height;
                    }
                }

                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.particleVertexBuffers[i]);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, particleTextureCoordinates, this.gl.STATIC_DRAW);

                particleTextureCoordinates.length = 0; //delete particleTextureCoordinates;

                var spawnData = new Float32Array(count * 4);
                for (var j = 0; j < count; ++j) {
                    var position = randomSpherePoints[j];

                    var positionX = position[0] * this.SPAWN_RADIUS;
                    var positionY = position[1] * this.SPAWN_RADIUS;
                    var positionZ = position[2] * this.SPAWN_RADIUS;
                    var lifetime = this.BASE_LIFETIME + randomNumbers[j] * this.MAX_ADDITIONAL_LIFETIME;

                    spawnData[j * 4] = positionX;
                    spawnData[j * 4 + 1] = positionY;
                    spawnData[j * 4 + 2] = positionZ;
                    spawnData[j * 4 + 3] = lifetime;
                }

                this.spawnTextures[i] = this.buildTexture(this.gl, 0, this.gl.RGBA, this.gl.FLOAT, width, height, spawnData, this.gl.CLAMP_TO_EDGE, this.gl.CLAMP_TO_EDGE, this.gl.NEAREST, this.gl.NEAREST);

                spawnData.length = 0; //delete spawnData;
            }

            //offset texture
            var offsetData = new Float32Array(maxParticleCount * 4);
            for (var i = 0; i < maxParticleCount; ++i) {
                var position = randomSpherePoints[i];

                var positionX = position[0] * this.OFFSET_RADIUS;
                var positionY = position[1] * this.OFFSET_RADIUS;
                var positionZ = position[2] * this.OFFSET_RADIUS;

                offsetData[i * 4] = positionX;
                offsetData[i * 4 + 1] = positionY;
                offsetData[i * 4 + 2] = positionZ;
                offsetData[i * 4 + 3] = 0.0;
            }

            this.pso.offsetTexture = this.buildTexture(this.gl, 0, this.gl.RGBA, this.gl.FLOAT, this.QUALITY_LEVELS[this.QUALITY_LEVELS.length - 1].resolution[0], this.QUALITY_LEVELS[this.QUALITY_LEVELS.length - 1].resolution[1], offsetData, this.gl.CLAMP_TO_EDGE, this.gl.CLAMP_TO_EDGE, this.gl.NEAREST, this.gl.NEAREST);


            randomNumbers.length = 0; //delete randomNumbers;
            randomSpherePoints.length = 0; //delete randomSpherePoints;
            offsetData.length = 0; //delete offsetData;

        }
        
        private loadResources(): void {
            


            //TEXTURES
            this.pso.particleTextureA = this.buildTexture(this.gl, 0, this.gl.RGBA, this.gl.FLOAT, 1, 1, null, this.gl.CLAMP_TO_EDGE, this.gl.CLAMP_TO_EDGE, this.gl.NEAREST, this.gl.NEAREST);
            this.pso.particleTextureB = this.buildTexture(this.gl, 0, this.gl.RGBA, this.gl.FLOAT, 1, 1, null, this.gl.CLAMP_TO_EDGE, this.gl.CLAMP_TO_EDGE, this.gl.NEAREST, this.gl.NEAREST);
            this.pso.opacityTexture = this.buildTexture(this.gl, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.OPACITY_TEXTURE_RESOLUTION, this.OPACITY_TEXTURE_RESOLUTION, null, this.gl.CLAMP_TO_EDGE, this.gl.CLAMP_TO_EDGE, this.gl.LINEAR, this.gl.LINEAR); //opacity from the light's point of view



            //FRAMEBUFFERS
            this.pso.resampleFramebuffer = this.gl.createFramebuffer();
            this.pso.simulationFramebuffer = this.gl.createFramebuffer();
            this.pso.sortFramebuffer = this.gl.createFramebuffer();
            this.pso.opacityFramebuffer = this.buildFramebuffer(this.gl, this.pso.opacityTexture);



            //BUFFERS
            this.pso.fullscreenVertexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pso.fullscreenVertexBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), this.gl.STATIC_DRAW);

            this.pso.floorVertexBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pso.floorVertexBuffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
                this.shaderLib.FLOOR_ORIGIN[0], this.shaderLib.FLOOR_ORIGIN[1], this.shaderLib.FLOOR_ORIGIN[2],
                this.shaderLib.FLOOR_ORIGIN[0], this.shaderLib.FLOOR_ORIGIN[1], this.shaderLib.FLOOR_ORIGIN[2] + this.FLOOR_HEIGHT,
                this.shaderLib.FLOOR_ORIGIN[0] + this.FLOOR_WIDTH, this.shaderLib.FLOOR_ORIGIN[1], this.shaderLib.FLOOR_ORIGIN[2],
                this.shaderLib.FLOOR_ORIGIN[0] + this.FLOOR_WIDTH, this.shaderLib.FLOOR_ORIGIN[1], this.shaderLib.FLOOR_ORIGIN[2] + this.FLOOR_HEIGHT
            ]), this.gl.STATIC_DRAW);



        
            //MATRIX'S
            this.pso.projectionMatrix = GraphicsLib.makePerspectiveMatrix(new Float32Array(16), this.PROJECTION_FOV, this.ASPECT_RATIO, this.PROJECTION_NEAR, this.PROJECTION_FAR);

            this.pso.lightViewMatrix = new Float32Array(16);
            GraphicsLib.makeLookAtMatrix(this.pso.lightViewMatrix, [0.0, 0.0, 0.0], this.LIGHT_DIRECTION, this.LIGHT_UP_VECTOR);

            this.pso.lightProjectionMatrix = new Float32Array(16);
            GraphicsLib.makeOrthographicMatrix(this.pso.lightProjectionMatrix, this.LIGHT_PROJECTION_LEFT, this.LIGHT_PROJECTION_RIGHT, this.LIGHT_PROJECTION_BOTTOM, this.LIGHT_PROJECTION_TOP, this.LIGHT_PROJECTION_NEAR, this.LIGHT_PROJECTION_FAR);

            this.pso.lightViewProjectionMatrix = new Float32Array(16);
            GraphicsLib.premultiplyMatrix(this.pso.lightViewProjectionMatrix, this.pso.lightViewMatrix, this.pso.lightProjectionMatrix);

            


            //SORTING
            this.pso.totalSortSteps = (GraphicsLib.log2(this.particleCount) * (GraphicsLib.log2(this.particleCount) + 1)) / 2;
            this.pso.sortStepsLeft = this.pso.totalSortSteps;
            this.pso.sortPass = -1;
            this.pso.sortStage = -1;



            
            //PROGRAMS
            this.pso.simulationProgramWrapper = this.buildProgramWrapper(this.gl,
                this.buildShader(this.gl, this.gl.VERTEX_SHADER, this.shaderLib.SIMULATION_VERTEX_SHADER_SOURCE),
                this.buildShader(this.gl, this.gl.FRAGMENT_SHADER, this.shaderLib.SIMULATION_FRAGMENT_SHADER_SOURCE),
                { 'a_position': 0 }
                );

            this.pso.renderingProgramWrapper = this.buildProgramWrapper(this.gl,
                this.buildShader(this.gl, this.gl.VERTEX_SHADER, this.shaderLib.RENDERING_VERTEX_SHADER_SOURCE),
                this.buildShader(this.gl, this.gl.FRAGMENT_SHADER, this.shaderLib.RENDERING_FRAGMENT_SHADER_SOURCE),
                { 'a_textureCoordinates': 0 }
                );

            this.pso.opacityProgramWrapper = this.buildProgramWrapper(this.gl,
                this.buildShader(this.gl, this.gl.VERTEX_SHADER, this.shaderLib.OPACITY_VERTEX_SHADER_SOURCE),
                this.buildShader(this.gl, this.gl.FRAGMENT_SHADER, this.shaderLib.OPACITY_FRAGMENT_SHADER_SOURCE),
                { 'a_textureCoordinates': 0 }
                );

            this.pso.sortProgramWrapper = this.buildProgramWrapper(this.gl,
                this.buildShader(this.gl, this.gl.VERTEX_SHADER, this.shaderLib.SORT_VERTEX_SHADER_SOURCE),
                this.buildShader(this.gl, this.gl.FRAGMENT_SHADER, this.shaderLib.SORT_FRAGMENT_SHADER_SOURCE),
                { 'a_position': 0 }
                );

            this.pso.resampleProgramWrapper = this.buildProgramWrapper(this.gl,
                this.buildShader(this.gl, this.gl.VERTEX_SHADER, this.shaderLib.RESAMPLE_VERTEX_SHADER_SOURCE),
                this.buildShader(this.gl, this.gl.FRAGMENT_SHADER, this.shaderLib.RESAMPLE_FRAGMENT_SHADER_SOURCE),
                { 'a_position': 0 }
                );

            this.pso.floorProgramWrapper = this.buildProgramWrapper(this.gl,
                this.buildShader(this.gl, this.gl.VERTEX_SHADER, this.shaderLib.FLOOR_VERTEX_SHADER_SOURCE),
                this.buildShader(this.gl, this.gl.FRAGMENT_SHADER, this.shaderLib.FLOOR_FRAGMENT_SHADER_SOURCE),
                { 'a_vertexPosition': 0 }
                );

            this.pso.backgroundProgramWrapper = this.buildProgramWrapper(this.gl,
                this.buildShader(this.gl, this.gl.VERTEX_SHADER, this.shaderLib.BACKGROUND_VERTEX_SHADER_SOURCE),
                this.buildShader(this.gl, this.gl.FRAGMENT_SHADER, this.shaderLib.BACKGROUND_FRAGMENT_SHADER_SOURCE),
                { 'a_position': 0 }
                );



            this.changeQualityLevel(0);

        }
        
        private render(currentTime: number): void{
            var deltaTime = (currentTime - this.pso.lastTime) / 1000 || 0.0;
            this.pso.lastTime = currentTime;

            if (deltaTime > this.MAX_DELTA_TIME) {
                deltaTime = 0;
            }
            

            if (this.changingParticleCount) {
                deltaTime = 0;
                this.changingParticleCount = false;

                this.pso.particleVertexBuffer = this.particleVertexBuffers[this.qualityLevel];
                this.spawnTexture = this.spawnTextures[this.qualityLevel];

                //reset sort
                this.pso.totalSortSteps = (GraphicsLib.log2(this.particleCount) * (GraphicsLib.log2(this.particleCount) + 1)) / 2;
                this.pso.sortStepsLeft = this.pso.totalSortSteps;
                this.pso.sortPass = -1;
                this.pso.sortStage = -1;

                if (this.oldParticleCountHeight === 0 && this.oldParticleCountWidth === 0) { //initial generation
                    var particleData = new Float32Array(this.particleCount * 4);

                    for (var i = 0; i < this.particleCount; ++i) {
                        var position = GraphicsLib.randomPointInSphere();

                        var positionX = position[0] * this.SPAWN_RADIUS;
                        var positionY = position[1] * this.SPAWN_RADIUS;
                        var positionZ = position[2] * this.SPAWN_RADIUS;

                        particleData[i * 4] = positionX;
                        particleData[i * 4 + 1] = positionY;
                        particleData[i * 4 + 2] = positionZ;
                        particleData[i * 4 + 3] = Math.random() * this.BASE_LIFETIME;
                    }

                    this.gl.bindTexture(this.gl.TEXTURE_2D, this.pso.particleTextureA);
                    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.particleCountWidth, this.particleCountHeight, 0, this.gl.RGBA, this.gl.FLOAT, particleData);

                    particleData.length = 0; //delete particleData;

                    this.gl.bindTexture(this.gl.TEXTURE_2D, this.pso.particleTextureB);
                    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.particleCountWidth, this.particleCountHeight, 0, this.gl.RGBA, this.gl.FLOAT, null);
                } else {
                    //resample from A into B
                    this.gl.bindTexture(this.gl.TEXTURE_2D, this.pso.particleTextureB);
                    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.particleCountWidth, this.particleCountHeight, 0, this.gl.RGBA, this.gl.FLOAT, null);

                    this.gl.enableVertexAttribArray(0);
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pso.fullscreenVertexBuffer);
                    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);

                    this.gl.enableVertexAttribArray(0);

                    this.gl.useProgram(this.pso.resampleProgramWrapper.program);
                    this.gl.uniform1i(this.pso.resampleProgramWrapper.uniformLocations['u_particleTexture'], 0);
                    this.gl.uniform1i(this.pso.resampleProgramWrapper.uniformLocations['u_offsetTexture'], 1);

                    if (this.particleCount > this.oldParticleCountWidth * this.oldParticleCountHeight) { //if we are upsampling we need to add random sphere offsets
                        this.gl.uniform1f(this.pso.resampleProgramWrapper.uniformLocations['u_offsetScale'], this.oldParticleDiameter);
                    } else { //if downsampling we can just leave positions as they are
                        this.gl.uniform1f(this.pso.resampleProgramWrapper.uniformLocations['u_offsetScale'], 0);
                    }

                    this.gl.activeTexture(this.gl.TEXTURE0);
                    this.gl.bindTexture(this.gl.TEXTURE_2D, this.pso.particleTextureA);

                    this.gl.activeTexture(this.gl.TEXTURE1);
                    this.gl.bindTexture(this.gl.TEXTURE_2D, this.pso.offsetTexture);

                    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pso.resampleFramebuffer);
                    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.pso.particleTextureB, 0);

                    this.gl.viewport(0, 0, this.particleCountWidth, this.particleCountHeight);

                    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

                    this.gl.bindTexture(this.gl.TEXTURE_2D, this.pso.particleTextureA);
                    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.particleCountWidth, this.particleCountHeight, 0, this.gl.RGBA, this.gl.FLOAT, null);

                    var temp = this.pso.particleTextureA;
                    this.pso.particleTextureA = this.pso.particleTextureB;
                    this.pso.particleTextureB = temp;
                }
            }


            var flippedThisFrame = false; //if the order reversed this frame

            var viewDirection = this.camera.getViewDirection();

            var halfVector: Float32Array;

            if (GraphicsLib.dotVectors(viewDirection, this.LIGHT_DIRECTION) > 0.0) {
                halfVector = new Float32Array([
                    this.LIGHT_DIRECTION[0] + viewDirection[0],
                    this.LIGHT_DIRECTION[1] + viewDirection[1],
                    this.LIGHT_DIRECTION[2] + viewDirection[2],
                ]);
                GraphicsLib.normalizeVector(halfVector, halfVector);

                if (this.renderer.flipped) {
                    flippedThisFrame = true;
                }

                this.renderer.flipped = false;
            }
            else
            {
                halfVector = new Float32Array([
                    this.LIGHT_DIRECTION[0] - viewDirection[0],
                    this.LIGHT_DIRECTION[1] - viewDirection[1],
                    this.LIGHT_DIRECTION[2] - viewDirection[2],
                ]);
                GraphicsLib.normalizeVector(halfVector, halfVector);

                if (!this.renderer.flipped) {
                    flippedThisFrame = true;
                }

                this.renderer.flipped = true;
            }

            this.gl.disable(this.gl.DEPTH_TEST);

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            //SIMULATION
            for (var i = 0; i < (this.renderer.firstFrame ? this.BASE_LIFETIME / this.PRESIMULATION_DELTA_TIME : 1); ++i) {
                this.gl.enableVertexAttribArray(0);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pso.fullscreenVertexBuffer);
                this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);

                this.gl.useProgram(this.pso.simulationProgramWrapper.program);
                this.gl.uniform2f(this.pso.simulationProgramWrapper.uniformLocations['u_resolution'], this.particleCountWidth, this.particleCountHeight);
                this.gl.uniform1f(this.pso.simulationProgramWrapper.uniformLocations['u_deltaTime'], this.renderer.firstFrame ? this.PRESIMULATION_DELTA_TIME : deltaTime * this.timeScale);
                this.gl.uniform1f(this.pso.simulationProgramWrapper.uniformLocations['u_time'], this.renderer.firstFrame ? this.PRESIMULATION_DELTA_TIME : currentTime);
                this.gl.uniform1i(this.pso.simulationProgramWrapper.uniformLocations['u_particleTexture'], 0);
                this.gl.uniform1f(this.pso.simulationProgramWrapper.uniformLocations['u_persistence'], this.persistence);
                this.gl.uniform1i(this.pso.simulationProgramWrapper.uniformLocations['u_spawnTexture'], 1);

                this.gl.disable(this.gl.BLEND);

                this.gl.activeTexture(this.gl.TEXTURE1);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.spawnTexture);

                //render from A -> B
                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.pso.particleTextureA);

                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pso.simulationFramebuffer);
                this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.pso.particleTextureB, 0);

                //swap A and B
                var temp = this.pso.particleTextureA;
                this.pso.particleTextureA = this.pso.particleTextureB;
                this.pso.particleTextureB = temp;

                this.gl.viewport(0, 0, this.particleCountWidth, this.particleCountHeight);

                this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

                if (this.renderer.firstFrame) this.gl.flush();
            }

            this.renderer.firstFrame = false;

            this.gl.disable(this.gl.BLEND);

            this.gl.enableVertexAttribArray(0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pso.fullscreenVertexBuffer);
            this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);

            if (flippedThisFrame) { //if the order reversed this frame sort everything
                this.pso.sortPass = -1;
                this.pso.sortStage = -1;
                this.pso.sortStepsLeft = this.pso.totalSortSteps;
            }

            for (var i = 0; i < (flippedThisFrame ? this.pso.totalSortSteps : this.SORT_PASSES_PER_FRAME); ++i) {
                this.pso.sortPass--;
                if (this.pso.sortPass < 0) {
                    this.pso.sortStage++;
                    this.pso.sortPass = this.pso.sortStage;
                }

                this.gl.useProgram(this.pso.sortProgramWrapper.program);

                this.gl.uniform1i(this.pso.sortProgramWrapper.uniformLocations['u_dataTexture'], 0);
                this.gl.uniform2f(this.pso.sortProgramWrapper.uniformLocations['u_resolution'], this.particleCountWidth, this.particleCountHeight);
                this.gl.uniform1f(this.pso.sortProgramWrapper.uniformLocations['pass'], 1 << this.pso.sortPass);
                this.gl.uniform1f(this.pso.sortProgramWrapper.uniformLocations['stage'], 1 << this.pso.sortStage);
                this.gl.uniform3fv(this.pso.sortProgramWrapper.uniformLocations['u_halfVector'], halfVector);

                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.pso.particleTextureA);

                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pso.sortFramebuffer);
                this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.pso.particleTextureB, 0);

                this.gl.viewport(0, 0, this.particleCountWidth, this.particleCountHeight);

                this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

                var temp = this.pso.particleTextureA;
                this.pso.particleTextureA = this.pso.particleTextureB;
                this.pso.particleTextureB = temp;

                this.pso.sortStepsLeft--;

                if (this.pso.sortStepsLeft === 0) {
                    this.pso.sortStepsLeft = this.pso.totalSortSteps;
                    this.pso.sortPass = -1;
                    this.pso.sortStage = -1;
                }
            }

            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pso.opacityFramebuffer);
            this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);


            //RENDERING
            for (var i = 0; i < this.SLICES; ++i) {

                //particle
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
                this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

                this.gl.useProgram(this.pso.renderingProgramWrapper.program);

                this.gl.uniform1i(this.pso.renderingProgramWrapper.uniformLocations['u_particleTexture'], 0);
                this.gl.uniform1i(this.pso.renderingProgramWrapper.uniformLocations['u_opacityTexture'], 1);
                this.gl.uniformMatrix4fv(this.pso.renderingProgramWrapper.uniformLocations['u_viewMatrix'], false, this.camera.getViewMatrix());
                this.gl.uniformMatrix4fv(this.pso.renderingProgramWrapper.uniformLocations['u_projectionMatrix'], false, this.pso.projectionMatrix);
                this.gl.uniformMatrix4fv(this.pso.renderingProgramWrapper.uniformLocations['u_lightViewProjectionMatrix'], false, this.pso.lightViewProjectionMatrix);
                this.gl.uniform1f(this.pso.renderingProgramWrapper.uniformLocations['u_particleDiameter'], this.particleDiameter);
                this.gl.uniform1f(this.pso.renderingProgramWrapper.uniformLocations['u_screenWidth'], this.canvas.width);
                this.gl.uniform1f(this.pso.renderingProgramWrapper.uniformLocations['u_particleAlpha'], this.particleAlpha);
                this.gl.uniform1i(this.pso.renderingProgramWrapper.uniformLocations['u_flipped'], this.renderer.flipped ? 1 : 0);

                var colorRGB = GraphicsLib.hsvToRGB(this.hue, this.shaderLib.PARTICLE_SATURATION, this.shaderLib.PARTICLE_VALUE);
                this.gl.uniform3f(this.pso.renderingProgramWrapper.uniformLocations['u_particleColor'], colorRGB[0], colorRGB[1], colorRGB[2]);

                
                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.pso.particleTextureA);

                this.gl.activeTexture(this.gl.TEXTURE1);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.pso.opacityTexture);

                this.gl.enableVertexAttribArray(0);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pso.particleVertexBuffer);
                this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);


                if (!this.renderer.flipped) {
                    this.gl.enable(this.gl.BLEND);
                    //this.gl.blendEquation(this.gl.FUNC_ADD, this.gl.FUNC_ADD);
                    this.gl.blendEquation(this.gl.FUNC_ADD);
                    this.gl.blendFunc(this.gl.ONE_MINUS_DST_ALPHA, this.gl.ONE);
                } else {
                    this.gl.enable(this.gl.BLEND);
                    //this.gl.blendEquation(this.gl.FUNC_ADD, this.gl.FUNC_ADD);
                    this.gl.blendEquation(this.gl.FUNC_ADD);
                    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
                }

                this.gl.drawArrays(this.gl.POINTS, i * (this.particleCount / this.SLICES), this.particleCount / this.SLICES);





                //particle opacity
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.pso.opacityFramebuffer);

                this.gl.viewport(0, 0, this.OPACITY_TEXTURE_RESOLUTION, this.OPACITY_TEXTURE_RESOLUTION);

                this.gl.useProgram(this.pso.opacityProgramWrapper.program);

                this.gl.uniform1i(this.pso.opacityProgramWrapper.uniformLocations['u_particleTexture'], 0);
                this.gl.uniformMatrix4fv(this.pso.opacityProgramWrapper.uniformLocations['u_lightViewMatrix'], false, this.pso.lightViewMatrix);
                this.gl.uniformMatrix4fv(this.pso.opacityProgramWrapper.uniformLocations['u_lightProjectionMatrix'], false, this.pso.lightProjectionMatrix);
                this.gl.uniform1f(this.pso.opacityProgramWrapper.uniformLocations['u_particleDiameter'], this.particleDiameter);
                this.gl.uniform1f(this.pso.opacityProgramWrapper.uniformLocations['u_screenWidth'], this.OPACITY_TEXTURE_RESOLUTION);
                this.gl.uniform1f(this.pso.opacityProgramWrapper.uniformLocations['u_particleAlpha'], this.particleAlpha);

                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.pso.particleTextureA);

                this.gl.enableVertexAttribArray(0);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pso.particleVertexBuffer);
                this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);

                this.gl.enable(this.gl.BLEND);
                //this.gl.blendEquation(this.gl.FUNC_ADD, this.gl.FUNC_ADD);
                this.gl.blendEquation(this.gl.FUNC_ADD);
                this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);

                this.gl.drawArrays(this.gl.POINTS, i * (this.particleCount / this.SLICES), this.particleCount / this.SLICES);
            }


            
            //FLOOR (SHADOW) & BACKGROUND
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

            this.gl.useProgram(this.pso.floorProgramWrapper.program);

            this.gl.enableVertexAttribArray(0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pso.floorVertexBuffer);
            this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, false, 0, 0);

            this.gl.uniformMatrix4fv(this.pso.floorProgramWrapper.uniformLocations['u_viewMatrix'], false, this.camera.getViewMatrix());
            this.gl.uniformMatrix4fv(this.pso.floorProgramWrapper.uniformLocations['u_projectionMatrix'], false, this.pso.projectionMatrix);
            this.gl.uniformMatrix4fv(this.pso.floorProgramWrapper.uniformLocations['u_lightViewProjectionMatrix'], false, this.pso.lightViewProjectionMatrix);
            this.gl.uniform1i(this.pso.floorProgramWrapper.uniformLocations['u_opacityTexture'], 0);

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.pso.opacityTexture);

            this.gl.enable(this.gl.BLEND);
            //this.gl.blendEquation(this.gl.FUNC_ADD, this.gl.FUNC_ADD);
            this.gl.blendEquation(this.gl.FUNC_ADD);
            this.gl.blendFunc(this.gl.ONE_MINUS_DST_ALPHA, this.gl.ONE);

            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
           
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

            this.gl.enableVertexAttribArray(0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pso.fullscreenVertexBuffer);
            this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);


            
            this.gl.useProgram(this.pso.backgroundProgramWrapper.program);
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

            


            //NEXT FRAME
            requestAnimationFrame(this.render.bind(this));
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
        
        private buildProgramWrapper(gl: webgl.WebGLRenderingContext, vertexShader: webgl.WebGLShader, fragmentShader: webgl.WebGLShader, attributeLocations) : any {
            var programWrapper = { program: null, uniformLocations: null};

            var program : webgl.WebGLProgram = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            for (var attributeName in attributeLocations) {
                gl.bindAttribLocation(program, attributeLocations[attributeName], attributeName);
            }
            gl.linkProgram(program);
            var uniformLocations = {};
            var numberOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < numberOfUniforms; i += 1) {
                var activeUniform : webgl.WebGLActiveInfo = gl.getActiveUniform(program, i),
                    uniformLocation = gl.getUniformLocation(program, activeUniform.name);
                uniformLocations[activeUniform.name] = uniformLocation;
            }

            programWrapper.program = program;
            programWrapper.uniformLocations = uniformLocations;

            return programWrapper;
        }
        
        private buildShader(gl: webgl.WebGLRenderingContext, type: number, source: string) : any {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            //console.log(gl.getShaderInfoLog(shader));
            return shader;
        }

        private buildTexture(gl: webgl.WebGLRenderingContext, unit: number, format: number, type: number, width: number, height: number, data: ArrayBufferView, wrapS: number, wrapT: number, minFilter: number, magFilter: number): webgl.WebGLTexture {
            var texture: webgl.WebGLTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, type, data);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
            return texture;
        }
        
        private buildFramebuffer(gl: webgl.WebGLRenderingContext, attachment): webgl.WebGLFramebuffer {
            var framebuffer: webgl.WebGLFramebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, attachment, 0);
            return framebuffer;
        }
        
        

    }



   
    //var myapp: ng.IModule = angular.module('USoStupidApp', ['ngRoute', 'ngResource', 'ngAnimate']);
    //myapp.directive("dirWebglCanvas", Application.Directives.WebGLCanvasDirective.prototype.injection());

    ////angular.module('USoStupidApp').directive("dirWebglCanvas", Application.Directives.WebGLCanvasDirective.$inject);
   
}
