
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

                    controller.setHue(0);
                    controller.setTimeScale(controller.INITIAL_SPEED);
                    controller.setPersistence(controller.INITIAL_TURBULENCE);

                }

            }

        }

        
    }

    interface IFlowScope extends ng.IScope {
        hasWebGLSupportWithExtensions: (extensions: any) => boolean;
        initCanvas: (canvas: any) => void;
    }


    class MathUtils {


        public makeIdentityMatrix(matrix): any {
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

        public makeXRotationMatrix(matrix, angle): any {
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

        public makeYRotationMatrix(matrix, angle): any {
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

        public makePerspectiveMatrix(matrix, fov, aspect, near, far): any {
            var f = Math.tan(0.5 * (Math.PI - fov)),
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

        public premultiplyMatrix(out, matrixA, matrixB): any { //out = matrixB * matrixA
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



    }
    
    class Camera {
        private INITIAL_AZIMUTH = 0.6;
        private INITIAL_ELEVATION = 0.4;
        private CAMERA_ORBIT_POINT = [1.2, -0.3, 0.0];
        private CAMERA_DISTANCE = 2.2;
        private CAMERA_SENSITIVITY = 0.005;


        private viewMatrix = new Float32Array(16);
        private azimuth = this.INITIAL_AZIMUTH;
        private elevation = this.INITIAL_ELEVATION;
        private MIN_ELEVATION = -0.1;
        private MAX_ELEVATION = Math.PI / 2.0;


        constructor(element: any, mathUtils: MathUtils) {
           

            var lastMouseX = 0,
                lastMouseY = 0;

            var mouseDown = false;
            var __this = this;

            
            var recomputeViewMatrix = function () {
                var xRotationMatrix = new Float32Array(16),
                    yRotationMatrix = new Float32Array(16),
                    distanceTranslationMatrix = mathUtils.makeIdentityMatrix(new Float32Array(16)),
                    orbitTranslationMatrix = mathUtils.makeIdentityMatrix(new Float32Array(16));

                mathUtils.makeIdentityMatrix(__this.viewMatrix);

                mathUtils.makeXRotationMatrix(xRotationMatrix, __this.elevation);
                mathUtils.makeYRotationMatrix(yRotationMatrix, __this.azimuth);
                distanceTranslationMatrix[14] = -__this.CAMERA_DISTANCE;
                orbitTranslationMatrix[12] = -__this.CAMERA_ORBIT_POINT[0];
                orbitTranslationMatrix[13] = -__this.CAMERA_ORBIT_POINT[1];
                orbitTranslationMatrix[14] = -__this.CAMERA_ORBIT_POINT[2];

                mathUtils.premultiplyMatrix(__this.viewMatrix, __this.viewMatrix, orbitTranslationMatrix);
                mathUtils.premultiplyMatrix(__this.viewMatrix, __this.viewMatrix, yRotationMatrix);
                mathUtils.premultiplyMatrix(__this.viewMatrix, __this.viewMatrix, xRotationMatrix);
                mathUtils.premultiplyMatrix(__this.viewMatrix, __this.viewMatrix, distanceTranslationMatrix);
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

                    recomputeViewMatrix();

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

            recomputeViewMatrix();
        }



        public getViewMatrix() : any {
            return this.viewMatrix;
        }

        public getPosition() : any {
            var cameraPosition = new Float32Array(3);
            cameraPosition[0] = this.CAMERA_DISTANCE * Math.sin(Math.PI / 2 - this.elevation) * Math.sin(-this.azimuth) + this.CAMERA_ORBIT_POINT[0];
            cameraPosition[1] = this.CAMERA_DISTANCE * Math.cos(Math.PI / 2 - this.elevation) + this.CAMERA_ORBIT_POINT[1];
            cameraPosition[2] = this.CAMERA_DISTANCE * Math.sin(Math.PI / 2 - this.elevation) * Math.cos(-this.azimuth) + this.CAMERA_ORBIT_POINT[2];

            return cameraPosition;
        }

        public getViewDirection() : any {
            var viewDirection = new Float32Array(3);
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

        private NOISE_OCTAVES = 3;
        private NOISE_POSITION_SCALE = 1.5;
        private NOISE_SCALE = 0.075;
        private NOISE_TIME_SCALE = 1 / 4000;
        
        private BASE_SPEED = 0.2;
        

        private PARTICLE_OPACITY_SCALE = 0.75;
        
        private BACKGROUND_DISTANCE_SCALE = 0.1;


        public constructor(public FLOOR_ORIGIN: any, public PARTICLE_SATURATION: number, public PARTICLE_VALUE: number) {

        }


        public SIMULATION_VERTEX_SHADER_SOURCE: string = [
            'precision highp float;',

            'attribute vec2 a_position;',

            'void main () {',
            'gl_Position = vec4(a_position, 0.0, 1.0);',
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
            'return x - floor(x * (1.0 / 289.0)) * 289.0;',
            '}',

            'float mod289(float x) {',
            'return x - floor(x * (1.0 / 289.0)) * 289.0;',
            '}',

            'vec4 permute(vec4 x) {',
            'return mod289(((x*34.0)+1.0)*x);',
            '}',

            'float permute(float x) {',
            'return mod289(((x*34.0)+1.0)*x);',
            '}',

            'vec4 taylorInvSqrt(vec4 r) {',
            'return 1.79284291400159 - 0.85373472095314 * r;',
            '}',

            'float taylorInvSqrt(float r) {',
            'return 1.79284291400159 - 0.85373472095314 * r;',
            '}',

            'vec4 grad4(float j, vec4 ip) {',
            'const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);',
            'vec4 p,s;',

            'p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;',
            'p.w = 1.5 - dot(abs(p.xyz), ones.xyz);',
            's = vec4(lessThan(p, vec4(0.0)));',
            'p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; ',

            'return p;',
            '}',

            '#define F4 0.309016994374947451',

            'vec4 simplexNoiseDerivatives (vec4 v) {',
            'const vec4  C = vec4( 0.138196601125011,0.276393202250021,0.414589803375032,-0.447213595499958);',

            'vec4 i  = floor(v + dot(v, vec4(F4)) );',
            'vec4 x0 = v -   i + dot(i, C.xxxx);',

            'vec4 i0;',
            'vec3 isX = step( x0.yzw, x0.xxx );',
            'vec3 isYZ = step( x0.zww, x0.yyz );',
            'i0.x = isX.x + isX.y + isX.z;',
            'i0.yzw = 1.0 - isX;',
            'i0.y += isYZ.x + isYZ.y;',
            'i0.zw += 1.0 - isYZ.xy;',
            'i0.z += isYZ.z;',
            'i0.w += 1.0 - isYZ.z;',

            'vec4 i3 = clamp( i0, 0.0, 1.0 );',
            'vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );',
            'vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );',

            'vec4 x1 = x0 - i1 + C.xxxx;',
            'vec4 x2 = x0 - i2 + C.yyyy;',
            'vec4 x3 = x0 - i3 + C.zzzz;',
            'vec4 x4 = x0 + C.wwww;',

            'i = mod289(i); ',
            'float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);',
            'vec4 j1 = permute( permute( permute( permute (',
            'i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))',
            '+ i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))',
            '+ i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))',
            '+ i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));',


            'vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;',

            'vec4 p0 = grad4(j0,   ip);',
            'vec4 p1 = grad4(j1.x, ip);',
            'vec4 p2 = grad4(j1.y, ip);',
            'vec4 p3 = grad4(j1.z, ip);',
            'vec4 p4 = grad4(j1.w, ip);',

            'vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));',
            'p0 *= norm.x;',
            'p1 *= norm.y;',
            'p2 *= norm.z;',
            'p3 *= norm.w;',
            'p4 *= taylorInvSqrt(dot(p4,p4));',

            'vec3 values0 = vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2));', //value of contributions from each corner at point
            'vec2 values1 = vec2(dot(p3, x3), dot(p4, x4));',

            'vec3 m0 = max(0.5 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);', //(0.5 - x^2) where x is the distance
            'vec2 m1 = max(0.5 - vec2(dot(x3,x3), dot(x4,x4)), 0.0);',

            'vec3 temp0 = -6.0 * m0 * m0 * values0;',
            'vec2 temp1 = -6.0 * m1 * m1 * values1;',

            'vec3 mmm0 = m0 * m0 * m0;',
            'vec2 mmm1 = m1 * m1 * m1;',

            'float dx = temp0[0] * x0.x + temp0[1] * x1.x + temp0[2] * x2.x + temp1[0] * x3.x + temp1[1] * x4.x + mmm0[0] * p0.x + mmm0[1] * p1.x + mmm0[2] * p2.x + mmm1[0] * p3.x + mmm1[1] * p4.x;',
            'float dy = temp0[0] * x0.y + temp0[1] * x1.y + temp0[2] * x2.y + temp1[0] * x3.y + temp1[1] * x4.y + mmm0[0] * p0.y + mmm0[1] * p1.y + mmm0[2] * p2.y + mmm1[0] * p3.y + mmm1[1] * p4.y;',
            'float dz = temp0[0] * x0.z + temp0[1] * x1.z + temp0[2] * x2.z + temp1[0] * x3.z + temp1[1] * x4.z + mmm0[0] * p0.z + mmm0[1] * p1.z + mmm0[2] * p2.z + mmm1[0] * p3.z + mmm1[1] * p4.z;',
            'float dw = temp0[0] * x0.w + temp0[1] * x1.w + temp0[2] * x2.w + temp1[0] * x3.w + temp1[1] * x4.w + mmm0[0] * p0.w + mmm0[1] * p1.w + mmm0[2] * p2.w + mmm1[0] * p3.w + mmm1[1] * p4.w;',

            'return vec4(dx, dy, dz, dw) * 49.0;',
            '}',

            'void main () {',
            'vec2 textureCoordinates = gl_FragCoord.xy / u_resolution;',
            'vec4 data = texture2D(u_particleTexture, textureCoordinates);',

            'vec3 oldPosition = data.rgb;',

            'vec3 noisePosition = oldPosition * ' + this.NOISE_POSITION_SCALE.toFixed(8) + ';',

            'float noiseTime = u_time * ' + this.NOISE_TIME_SCALE.toFixed(8) + ';',

            'vec4 xNoisePotentialDerivatives = vec4(0.0);',
            'vec4 yNoisePotentialDerivatives = vec4(0.0);',
            'vec4 zNoisePotentialDerivatives = vec4(0.0);',

            'float persistence = u_persistence;',

            'for (int i = 0; i < OCTAVES; ++i) {',
            'float scale = (1.0 / 2.0) * pow(2.0, float(i));',

            'float noiseScale = pow(persistence, float(i));',
            'if (persistence == 0.0 && i == 0) {', //fix undefined behaviour
            'noiseScale = 1.0;',
            '}',

            'xNoisePotentialDerivatives += simplexNoiseDerivatives(vec4(noisePosition * pow(2.0, float(i)), noiseTime)) * noiseScale * scale;',
            'yNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((noisePosition + vec3(123.4, 129845.6, -1239.1)) * pow(2.0, float(i)), noiseTime)) * noiseScale * scale;',
            'zNoisePotentialDerivatives += simplexNoiseDerivatives(vec4((noisePosition + vec3(-9519.0, 9051.0, -123.0)) * pow(2.0, float(i)), noiseTime)) * noiseScale * scale;',
            '}',

        //compute curl
            'vec3 noiseVelocity = vec3(',
            'zNoisePotentialDerivatives[1] - yNoisePotentialDerivatives[2],',
            'xNoisePotentialDerivatives[2] - zNoisePotentialDerivatives[0],',
            'yNoisePotentialDerivatives[0] - xNoisePotentialDerivatives[1]',
            ') * ' + this.NOISE_SCALE.toFixed(8) + ';',

            'vec3 velocity = vec3(' + this.BASE_SPEED.toFixed(8) + ', 0.0, 0.0);',
            'vec3 totalVelocity = velocity + noiseVelocity;',

            'vec3 newPosition = oldPosition + totalVelocity * u_deltaTime;',

            'float oldLifetime = data.a;',
            'float newLifetime = oldLifetime - u_deltaTime;',

            'vec4 spawnData = texture2D(u_spawnTexture, textureCoordinates);',

            'if (newLifetime < 0.0) {',
            'newPosition = spawnData.rgb;',
            'newLifetime = spawnData.a + newLifetime;',
            '}',

            'gl_FragColor = vec4(newPosition, newLifetime);',
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
            'vec3 position = texture2D(u_particleTexture, a_textureCoordinates).rgb;',
            'v_position = position;',

            'vec2 lightTextureCoordinates = vec2(u_lightViewProjectionMatrix * vec4(position, 1.0)) * 0.5 + 0.5;',
            'v_opacity = texture2D(u_opacityTexture, lightTextureCoordinates).a;',

            'vec3 viewSpacePosition = vec3(u_viewMatrix * vec4(position, 1.0));',
            'vec4 corner = vec4(u_particleDiameter * 0.5, u_particleDiameter * 0.5, viewSpacePosition.z, 1.0);',
            'float projectedCornerX = dot(vec4(u_projectionMatrix[0][0], u_projectionMatrix[1][0], u_projectionMatrix[2][0], u_projectionMatrix[3][0]), corner);',
            'float projectedCornerW = dot(vec4(u_projectionMatrix[0][3], u_projectionMatrix[1][3], u_projectionMatrix[2][3], u_projectionMatrix[3][3]), corner);',
            'gl_PointSize = u_screenWidth * 0.5 * projectedCornerX * 2.0 / projectedCornerW;',

            'gl_Position = u_projectionMatrix * vec4(viewSpacePosition, 1.0);',

            'if (position.y < ' + this.FLOOR_ORIGIN[1].toFixed(8) + ') gl_Position = vec4(9999999.0, 9999999.0, 9999999.0, 1.0);',
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
            'float distanceFromCenter = distance(gl_PointCoord.xy, vec2(0.5, 0.5));',
            'if (distanceFromCenter > 0.5) discard;',
            'float alpha = clamp(1.0 - distanceFromCenter * 2.0, 0.0, 1.0) * u_particleAlpha;',

            'vec3 color = (1.0 - v_opacity * ' + this.PARTICLE_OPACITY_SCALE.toFixed(8) + ') * u_particleColor;',

            'gl_FragColor = vec4(color * alpha, alpha);',
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
            'vec4 data = texture2D(u_particleTexture, v_coordinates);',
            'vec4 offset = texture2D(u_offsetTexture, v_coordinates);',
            'vec3 position = data.rgb + offset.rgb * u_offsetScale;',
            'gl_FragColor = vec4(position, data.a);',
            '}'
        ].join('\n');

        public FLOOR_VERTEX_SHADER_SOURCE: string = [
            'precision highp float;',

            'attribute vec3 a_vertexPosition;',

            'varying vec3 v_position;',

            'uniform mat4 u_viewMatrix;',
            'uniform mat4 u_projectionMatrix;',

            'void main () {',
            'v_position = a_vertexPosition;',
            'gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_vertexPosition, 1.0);',
            '}'
        ].join('\n');

        public FLOOR_FRAGMENT_SHADER_SOURCE: string = [
            'precision highp float;',

            'varying vec3 v_position;',

            'uniform sampler2D u_opacityTexture;',

            'uniform mat4 u_lightViewProjectionMatrix;',

            'void main () {',
            'vec2 lightTextureCoordinates = vec2(u_lightViewProjectionMatrix * vec4(v_position, 1.0)) * 0.5 + 0.5;',
            'float opacity = texture2D(u_opacityTexture, lightTextureCoordinates).a;',

            'if (lightTextureCoordinates.x < 0.0 || lightTextureCoordinates.x > 1.0 || lightTextureCoordinates.y < 0.0 || lightTextureCoordinates.y > 1.0) {',
            'opacity = 0.0;',
            '}',

            'gl_FragColor = vec4(0.0, 0.0, 0.0, opacity * 0.5);',
            '}'
        ].join('\n');

        public BACKGROUND_VERTEX_SHADER_SOURCE: string = [
            'precision highp float;',

            'attribute vec2 a_position;',

            'varying vec2 v_position;',

            'void main () {',
            'v_position = a_position;',
            'gl_Position = vec4(a_position, 0.0, 1.0);',
            '}'
        ].join('\n');

        public BACKGROUND_FRAGMENT_SHADER_SOURCE: string = [
            'precision highp float;',

            'varying vec2 v_position;',

            'void main () {',
            'float dist = length(v_position);',
            'gl_FragColor = vec4(vec3(1.0) - dist * ' + this.BACKGROUND_DISTANCE_SCALE.toFixed(8) + ', 1.0);',
            '}'
        ].join('\n');


    }

    class FlowController {

        private MAX_DELTA_TIME = 0.2;

        private PRESIMULATION_DELTA_TIME = 0.1;

        private QUALITY_LEVELS = [
            {
                resolution: [256, 256],
                diameter: 0.03,
                alpha: 0.5
            }, {
                resolution: [512, 256],
                diameter: 0.025,
                alpha: 0.4
            }, {
                resolution: [512, 512],
                diameter: 0.02,
                alpha: 0.3
            }, {
                resolution: [1024, 512],
                diameter: 0.015,
                alpha: 0.25
            }, {
                resolution: [1024, 1024],
                diameter: 0.0125,
                alpha: 0.2
            }, {
                resolution: [2048, 1024],
                diameter: 0.01,
                alpha: 0.2
            },
        ];

        private OPACITY_TEXTURE_RESOLUTION = 1024;

        private LIGHT_DIRECTION = [0.0, -1.0, 0.0]; //points away from the light source
        private LIGHT_UP_VECTOR = [0.0, 0.0, 1.0];

        private SLICES = 128;

        private SORT_PASSES_PER_FRAME = 50;
        
        private ASPECT_RATIO = 16 / 9;

        private PROJECTION_NEAR = 0.01;
        private PROJECTION_FAR = 10.0;
        private PROJECTION_FOV = (60 / 180) * Math.PI;

        public PARTICLE_SATURATION: number = 0.75;
        public PARTICLE_VALUE: number = 1.0;

        private FLOOR_ORIGIN: any = [-2.0, -0.75, -5.0];
        private FLOOR_WIDTH: number = 100.0;
        private FLOOR_HEIGHT: number = 100.0;

        private LIGHT_PROJECTION_LEFT = -5.0;
        private LIGHT_PROJECTION_RIGHT = 5.0;
        private LIGHT_PROJECTION_BOTTOM = -5.0;
        private LIGHT_PROJECTION_TOP = 5.0;
        private LIGHT_PROJECTION_NEAR = -50.0;
        private LIGHT_PROJECTION_FAR = 50.0;

        private SPAWN_RADIUS = 0.1;
        private BASE_LIFETIME = 10;
        private MAX_ADDITIONAL_LIFETIME = 5;
        private OFFSET_RADIUS = 0.5;


        public INITIAL_SPEED : number = 2;
        public INITIAL_TURBULENCE: number = 0.2;

        private MAX_SPEED = 5;
        private MAX_TURBULENCE = 0.5;

        private HUE_INNER_RADIUS = 40;
        private HUE_OUTER_RADIUS = 70;

        private UI_SATURATION = 0.75;
        private UI_VALUE = 0.75;

        private BUTTON_ACTIVE_COLOR = 'white';
        private BUTTON_COLOR = '#333333';
        private BUTTON_BACKGROUND = '#bbbbbb';

        private HUE_HIGHLIGHTER_ANGLE_OFFSET = 0.2;
        private HUE_HIGHLIGHTER_RADIUS_OFFSET = 2;

        private HUE_PICKER_SATURATION = 0.75;
        private HUE_PICKER_VALUE = 1.0;

        private HUE_HIGHLIGHTER_SATURATION = 1;
        private HUE_HIGHLIGHTER_VALUE = 0.75;

        private HUE_HIGHLIGHTER_LINE_WIDTH = 5;


        private options: any = {
            premultipliedAlpha: false,
            alpha: true
        };

       
        


        private hue : number = 0;
        private timeScale: number = this.INITIAL_SPEED;
        private persistence: number = this.INITIAL_TURBULENCE;
        private qualityLevel: any = -1;
        
        private particleCountWidth: number = 0;
        private particleCountHeight: number= 0;
        private particleCount: number = this.particleCountWidth * this.particleCountHeight;

        private particleDiameter: number = 0.0;
        private particleAlpha : number = 0.0;

        private changingParticleCount: boolean = false;
        private oldParticleDiameter: number;
        private oldParticleCountWidth : number;
        private oldParticleCountHeight : number;
        private mathUtils: MathUtils;
        private shaderLib: ShaderLib;


       



        constructor(private $scope: IFlowScope,
            private $routeParams: any) {

            this.mathUtils = new MathUtils();
            this.shaderLib = new ShaderLib(this.FLOOR_ORIGIN, this.PARTICLE_SATURATION, this.PARTICLE_VALUE);

            $scope.hasWebGLSupportWithExtensions = (extensions: any) => this.hasWebGLSupportWithExtensions(extensions);
            $scope.initCanvas = (canvas: any) => this.initCanvas(canvas);
        

        }

        private changeQualityLevel(newLevel: any) {
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

        private initCanvas(canvas: any): void {
            var gl = canvas.getContext('webgl', this.options) || canvas.getContext('experimental-webgl', this.options);
            gl.getExtension('OES_texture_float');
            gl.clearColor(0.0, 0.0, 0.0, 0.0);


            var __this = this;
            
            var maxParticleCount = this.QUALITY_LEVELS[this.QUALITY_LEVELS.length - 1].resolution[0] * this.QUALITY_LEVELS[this.QUALITY_LEVELS.length - 1].resolution[1];

            var randomNumbers = [];
            for (var i = 0; i < maxParticleCount; ++i) {
                randomNumbers[i] = Math.random();
            }

            var randomSpherePoints = [];
            for (var i = 0; i < maxParticleCount; ++i) {
                var point = this.randomPointInSphere();
                randomSpherePoints.push(point);
            }

            var particleVertexBuffer;
            var spawnTexture;

            var particleVertexBuffers = []; //one for each quality level
            var spawnTextures = []; //one for each quality level

            for (var i = 0; i < this.QUALITY_LEVELS.length; ++i) {
                var width = this.QUALITY_LEVELS[i].resolution[0];
                var height = this.QUALITY_LEVELS[i].resolution[1];

                var count = width * height;

                particleVertexBuffers[i] = gl.createBuffer();

                var particleTextureCoordinates = new Float32Array(width * height * 2);
                for (var y = 0; y < height; ++y) {
                    for (var x = 0; x < width; ++x) {
                        particleTextureCoordinates[(y * width + x) * 2] = (x + 0.5) / width;
                        particleTextureCoordinates[(y * width + x) * 2 + 1] = (y + 0.5) / height;
                    }
                }

                gl.bindBuffer(gl.ARRAY_BUFFER, particleVertexBuffers[i]);
                gl.bufferData(gl.ARRAY_BUFFER, particleTextureCoordinates, gl.STATIC_DRAW);

                delete particleTextureCoordinates;

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

                spawnTextures[i] = this.buildTexture(gl, 0, gl.RGBA, gl.FLOAT, width, height, spawnData, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);

                delete spawnData;
            }

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

            var offsetTexture = this.buildTexture(gl, 0, gl.RGBA, gl.FLOAT, this.QUALITY_LEVELS[this.QUALITY_LEVELS.length - 1].resolution[0], this.QUALITY_LEVELS[this.QUALITY_LEVELS.length - 1].resolution[1], offsetData, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);

            delete randomNumbers;
            delete randomSpherePoints;
            delete offsetData;



            var particleTextureA = this.buildTexture(gl, 0, gl.RGBA, gl.FLOAT, 1, 1, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
            var particleTextureB = this.buildTexture(gl, 0, gl.RGBA, gl.FLOAT, 1, 1, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);

            var camera = new Camera(canvas, this.mathUtils);

            var projectionMatrix = this.mathUtils.makePerspectiveMatrix(new Float32Array(16), this.PROJECTION_FOV, this.ASPECT_RATIO, this.PROJECTION_NEAR, this.PROJECTION_FAR);

            var lightViewMatrix = new Float32Array(16);
            this.makeLookAtMatrix(lightViewMatrix, [0.0, 0.0, 0.0], this.LIGHT_DIRECTION, this.LIGHT_UP_VECTOR);
            var lightProjectionMatrix = this.makeOrthographicMatrix(new Float32Array(16), this.LIGHT_PROJECTION_LEFT, this.LIGHT_PROJECTION_RIGHT, this.LIGHT_PROJECTION_BOTTOM, this.LIGHT_PROJECTION_TOP, this.LIGHT_PROJECTION_NEAR, this.LIGHT_PROJECTION_FAR);

            var lightViewProjectionMatrix = new Float32Array(16);
            this.mathUtils.premultiplyMatrix(lightViewProjectionMatrix, lightViewMatrix, lightProjectionMatrix);
            
            var resampleFramebuffer = gl.createFramebuffer();
            

            this.changeQualityLevel(0);
            
            //variables used for sorting
            var totalSortSteps = (this.log2(this.particleCount) * (this.log2(this.particleCount) + 1)) / 2;
            var sortStepsLeft = totalSortSteps;
            var sortPass = -1;
            var sortStage = -1;

            var opacityTexture = this.buildTexture(gl, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.OPACITY_TEXTURE_RESOLUTION, this.OPACITY_TEXTURE_RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR); //opacity from the light's point of view

            var simulationFramebuffer = gl.createFramebuffer();
            var sortFramebuffer = gl.createFramebuffer();

            var opacityFramebuffer = this.buildFramebuffer(gl, opacityTexture);

            var simulationProgramWrapper: any = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, this.shaderLib.SIMULATION_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, this.shaderLib.SIMULATION_FRAGMENT_SHADER_SOURCE),
                { 'a_position': 0 }
                );

            var renderingProgramWrapper: any = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, this.shaderLib.RENDERING_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, this.shaderLib.RENDERING_FRAGMENT_SHADER_SOURCE),
                { 'a_textureCoordinates': 0 }
                );

            var opacityProgramWrapper: any = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, this.shaderLib.OPACITY_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, this.shaderLib.OPACITY_FRAGMENT_SHADER_SOURCE),
                { 'a_textureCoordinates': 0 }
                );

            var sortProgramWrapper : any = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, this.shaderLib.SORT_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, this.shaderLib.SORT_FRAGMENT_SHADER_SOURCE),
                { 'a_position': 0 }
                );

            var resampleProgramWrapper : any = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, this.shaderLib.RESAMPLE_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, this.shaderLib.RESAMPLE_FRAGMENT_SHADER_SOURCE),
                { 'a_position': 0 }
                );

            var floorProgramWrapper: any = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, this.shaderLib.FLOOR_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, this.shaderLib.FLOOR_FRAGMENT_SHADER_SOURCE),
                { 'a_vertexPosition': 0 }
                );

            var backgroundProgramWrapper: any = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, this.shaderLib.BACKGROUND_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, this.shaderLib.BACKGROUND_FRAGMENT_SHADER_SOURCE),
                { 'a_position': 0 }
                );

            var fullscreenVertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenVertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);

            var floorVertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                this.shaderLib.FLOOR_ORIGIN[0], this.shaderLib.FLOOR_ORIGIN[1], this.shaderLib.FLOOR_ORIGIN[2],
                this.shaderLib.FLOOR_ORIGIN[0], this.shaderLib.FLOOR_ORIGIN[1], this.shaderLib.FLOOR_ORIGIN[2] + this.FLOOR_HEIGHT,
                this.shaderLib.FLOOR_ORIGIN[0] + this.FLOOR_WIDTH, this.shaderLib.FLOOR_ORIGIN[1], this.shaderLib.FLOOR_ORIGIN[2],
                this.shaderLib.FLOOR_ORIGIN[0] + this.FLOOR_WIDTH, this.shaderLib.FLOOR_ORIGIN[1], this.shaderLib.FLOOR_ORIGIN[2] + this.FLOOR_HEIGHT
            ]), gl.STATIC_DRAW);


            var onresize = function () {
                var aspectRatio = window.innerWidth / window.innerHeight;
                __this.mathUtils.makePerspectiveMatrix(projectionMatrix, __this.PROJECTION_FOV, aspectRatio, __this.PROJECTION_NEAR, __this.PROJECTION_FAR);
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };

            window.addEventListener('resize', onresize);
            onresize();


            var firstFrame = true;
            
            var flipped = false;

            var lastTime = 0.0;
            var render = function render(currentTime) {
                var deltaTime = (currentTime - lastTime) / 1000 || 0.0;
                lastTime = currentTime;

                if (deltaTime > __this.MAX_DELTA_TIME) {
                    deltaTime = 0;
                }

                if (__this.changingParticleCount) {
                    deltaTime = 0;
                    __this.changingParticleCount = false;

                    particleVertexBuffer = particleVertexBuffers[__this.qualityLevel];
                    spawnTexture = spawnTextures[__this.qualityLevel];

                    //reset sort
                    totalSortSteps = (__this.log2(__this.particleCount) * (__this.log2(__this.particleCount) + 1)) / 2;
                    sortStepsLeft = totalSortSteps;
                    sortPass = -1;
                    sortStage = -1;

                    if (__this.oldParticleCountHeight === 0 && __this.oldParticleCountWidth === 0) { //initial generation
                        var particleData = new Float32Array(__this.particleCount * 4);

                        for (var i = 0; i < __this.particleCount; ++i) {
                            var position = __this.randomPointInSphere();

                            var positionX = position[0] * __this.SPAWN_RADIUS;
                            var positionY = position[1] * __this.SPAWN_RADIUS;
                            var positionZ = position[2] * __this.SPAWN_RADIUS;

                            particleData[i * 4] = positionX;
                            particleData[i * 4 + 1] = positionY;
                            particleData[i * 4 + 2] = positionZ;
                            particleData[i * 4 + 3] = Math.random() * __this.BASE_LIFETIME;
                        }

                        gl.bindTexture(gl.TEXTURE_2D, particleTextureA);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, __this.particleCountWidth, __this.particleCountHeight, 0, gl.RGBA, gl.FLOAT, particleData);

                        delete particleData;

                        gl.bindTexture(gl.TEXTURE_2D, particleTextureB);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, __this.particleCountWidth, __this.particleCountHeight, 0, gl.RGBA, gl.FLOAT, null);
                    } else {
                        //resample from A into B
                        gl.bindTexture(gl.TEXTURE_2D, particleTextureB);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, __this.particleCountWidth, __this.particleCountHeight, 0, gl.RGBA, gl.FLOAT, null);

                        gl.enableVertexAttribArray(0);
                        gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenVertexBuffer);
                        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

                        gl.enableVertexAttribArray(0);

                        gl.useProgram(resampleProgramWrapper.program);
                        gl.uniform1i(resampleProgramWrapper.uniformLocations['u_particleTexture'], 0);
                        gl.uniform1i(resampleProgramWrapper.uniformLocations['u_offsetTexture'], 1);

                        if (__this.particleCount > __this.oldParticleCountWidth * __this.oldParticleCountHeight) { //if we are upsampling we need to add random sphere offsets
                            gl.uniform1f(resampleProgramWrapper.uniformLocations['u_offsetScale'], __this.oldParticleDiameter);
                        } else { //if downsampling we can just leave positions as they are
                            gl.uniform1f(resampleProgramWrapper.uniformLocations['u_offsetScale'], 0);
                        }

                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, particleTextureA);

                        gl.activeTexture(gl.TEXTURE1);
                        gl.bindTexture(gl.TEXTURE_2D, offsetTexture);

                        gl.bindFramebuffer(gl.FRAMEBUFFER, resampleFramebuffer);
                        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, particleTextureB, 0);

                        gl.viewport(0, 0, __this.particleCountWidth, __this.particleCountHeight);

                        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

                        gl.bindTexture(gl.TEXTURE_2D, particleTextureA);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, __this.particleCountWidth, __this.particleCountHeight, 0, gl.RGBA, gl.FLOAT, null);

                        var temp = particleTextureA;
                        particleTextureA = particleTextureB;
                        particleTextureB = temp;
                    }
                }


                var flippedThisFrame = false; //if the order reversed this frame

                var viewDirection = camera.getViewDirection();

                var halfVector;

                if (__this.dotVectors(viewDirection, __this.LIGHT_DIRECTION) > 0.0) {
                    halfVector = new Float32Array([
                        __this.LIGHT_DIRECTION[0] + viewDirection[0],
                        __this.LIGHT_DIRECTION[1] + viewDirection[1],
                        __this.LIGHT_DIRECTION[2] + viewDirection[2],
                    ]);
                    __this.normalizeVector(halfVector, halfVector);

                    if (flipped) {
                        flippedThisFrame = true;
                    }

                    flipped = false;
                } else {
                    halfVector = new Float32Array([
                        __this.LIGHT_DIRECTION[0] - viewDirection[0],
                        __this.LIGHT_DIRECTION[1] - viewDirection[1],
                        __this.LIGHT_DIRECTION[2] - viewDirection[2],
                    ]);
                    __this.normalizeVector(halfVector, halfVector);

                    if (!flipped) {
                        flippedThisFrame = true;
                    }

                    flipped = true;
                }

                gl.disable(gl.DEPTH_TEST);

                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.viewport(0, 0, canvas.width, canvas.height);
                gl.clearColor(0.0, 0.0, 0.0, 0.0);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


                for (var i = 0; i < (firstFrame ? __this.BASE_LIFETIME / __this.PRESIMULATION_DELTA_TIME : 1); ++i) {
                    gl.enableVertexAttribArray(0);
                    gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenVertexBuffer);
                    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

                    gl.useProgram(simulationProgramWrapper.program);
                    gl.uniform2f(simulationProgramWrapper.uniformLocations['u_resolution'], __this.particleCountWidth, __this.particleCountHeight);
                    gl.uniform1f(simulationProgramWrapper.uniformLocations['u_deltaTime'], firstFrame ? __this.PRESIMULATION_DELTA_TIME : deltaTime * __this.timeScale);
                    gl.uniform1f(simulationProgramWrapper.uniformLocations['u_time'], firstFrame ? __this.PRESIMULATION_DELTA_TIME : currentTime);
                    gl.uniform1i(simulationProgramWrapper.uniformLocations['u_particleTexture'], 0);

                    gl.uniform1f(simulationProgramWrapper.uniformLocations['u_persistence'], __this.persistence);

                    gl.uniform1i(simulationProgramWrapper.uniformLocations['u_spawnTexture'], 1);

                    gl.disable(gl.BLEND);

                    gl.activeTexture(gl.TEXTURE1);
                    gl.bindTexture(gl.TEXTURE_2D, spawnTexture);

                    //render from A -> B
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, particleTextureA);

                    gl.bindFramebuffer(gl.FRAMEBUFFER, simulationFramebuffer);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, particleTextureB, 0);

                    //swap A and B
                    var temp = particleTextureA;
                    particleTextureA = particleTextureB;
                    particleTextureB = temp;

                    gl.viewport(0, 0, __this.particleCountWidth, __this.particleCountHeight);

                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

                    if (firstFrame) gl.flush();
                }

                firstFrame = false;

                gl.disable(gl.BLEND);

                gl.enableVertexAttribArray(0);
                gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenVertexBuffer);
                gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

                if (flippedThisFrame) { //if the order reversed this frame sort everything
                    sortPass = -1;
                    sortStage = -1;
                    sortStepsLeft = totalSortSteps;
                }

                for (var i = 0; i < (flippedThisFrame ? totalSortSteps : __this.SORT_PASSES_PER_FRAME); ++i) {
                    sortPass--;
                    if (sortPass < 0) {
                        sortStage++;
                        sortPass = sortStage;
                    }

                    gl.useProgram(sortProgramWrapper.program);

                    gl.uniform1i(sortProgramWrapper.uniformLocations['u_dataTexture'], 0);
                    gl.uniform2f(sortProgramWrapper.uniformLocations['u_resolution'], __this.particleCountWidth, __this.particleCountHeight);

                    gl.uniform1f(sortProgramWrapper.uniformLocations['pass'], 1 << sortPass);
                    gl.uniform1f(sortProgramWrapper.uniformLocations['stage'], 1 << sortStage);

                    gl.uniform3fv(sortProgramWrapper.uniformLocations['u_halfVector'], halfVector);

                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, particleTextureA);

                    gl.bindFramebuffer(gl.FRAMEBUFFER, sortFramebuffer);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, particleTextureB, 0);

                    gl.viewport(0, 0, __this.particleCountWidth, __this.particleCountHeight);

                    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

                    var temp = particleTextureA;
                    particleTextureA = particleTextureB;
                    particleTextureB = temp;

                    sortStepsLeft--;

                    if (sortStepsLeft === 0) {
                        sortStepsLeft = totalSortSteps;
                        sortPass = -1;
                        sortStage = -1;
                    }
                }

                gl.bindFramebuffer(gl.FRAMEBUFFER, opacityFramebuffer);
                gl.clearColor(0.0, 0.0, 0.0, 0.0);
                gl.clear(gl.COLOR_BUFFER_BIT);

                for (var i = 0; i < __this.SLICES; ++i) {
                    //render particles
                    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                    gl.viewport(0, 0, canvas.width, canvas.height);

                    gl.useProgram(renderingProgramWrapper.program);

                    gl.uniform1i(renderingProgramWrapper.uniformLocations['u_particleTexture'], 0);
                    gl.uniform1i(renderingProgramWrapper.uniformLocations['u_opacityTexture'], 1);

                    gl.uniformMatrix4fv(renderingProgramWrapper.uniformLocations['u_viewMatrix'], false, camera.getViewMatrix());
                    gl.uniformMatrix4fv(renderingProgramWrapper.uniformLocations['u_projectionMatrix'], false, projectionMatrix);

                    gl.uniformMatrix4fv(renderingProgramWrapper.uniformLocations['u_lightViewProjectionMatrix'], false, lightViewProjectionMatrix);

                    gl.uniform1f(renderingProgramWrapper.uniformLocations['u_particleDiameter'], __this.particleDiameter);
                    gl.uniform1f(renderingProgramWrapper.uniformLocations['u_screenWidth'], canvas.width);

                    gl.uniform1f(renderingProgramWrapper.uniformLocations['u_particleAlpha'], __this.particleAlpha);

                    var colorRGB = __this.hsvToRGB(__this.hue, __this.shaderLib.PARTICLE_SATURATION, __this.shaderLib.PARTICLE_VALUE);
                    gl.uniform3f(renderingProgramWrapper.uniformLocations['u_particleColor'], colorRGB[0], colorRGB[1], colorRGB[2]);

                    gl.uniform1i(renderingProgramWrapper.uniformLocations['u_flipped'], flipped ? 1 : 0);

                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, particleTextureA);

                    gl.activeTexture(gl.TEXTURE1);
                    gl.bindTexture(gl.TEXTURE_2D, opacityTexture);

                    gl.enableVertexAttribArray(0);
                    gl.bindBuffer(gl.ARRAY_BUFFER, particleVertexBuffer);
                    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);


                    if (!flipped) {
                        gl.enable(gl.BLEND);
                        gl.blendEquation(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ONE);
                    } else {
                        gl.enable(gl.BLEND);
                        gl.blendEquation(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    }

                    gl.drawArrays(gl.POINTS, i * (__this.particleCount / __this.SLICES), __this.particleCount / __this.SLICES);

                    //render to opacity texture
                    gl.bindFramebuffer(gl.FRAMEBUFFER, opacityFramebuffer);

                    gl.viewport(0, 0, __this.OPACITY_TEXTURE_RESOLUTION, __this.OPACITY_TEXTURE_RESOLUTION);

                    gl.useProgram(opacityProgramWrapper.program);

                    gl.uniform1i(opacityProgramWrapper.uniformLocations['u_particleTexture'], 0);

                    gl.uniformMatrix4fv(opacityProgramWrapper.uniformLocations['u_lightViewMatrix'], false, lightViewMatrix);
                    gl.uniformMatrix4fv(opacityProgramWrapper.uniformLocations['u_lightProjectionMatrix'], false, lightProjectionMatrix);

                    gl.uniform1f(opacityProgramWrapper.uniformLocations['u_particleDiameter'], __this.particleDiameter);
                    gl.uniform1f(opacityProgramWrapper.uniformLocations['u_screenWidth'], __this.OPACITY_TEXTURE_RESOLUTION);

                    gl.uniform1f(opacityProgramWrapper.uniformLocations['u_particleAlpha'], __this.particleAlpha);

                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, particleTextureA);

                    gl.enableVertexAttribArray(0);
                    gl.bindBuffer(gl.ARRAY_BUFFER, particleVertexBuffer);
                    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD, gl.FUNC_ADD);
                    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

                    gl.drawArrays(gl.POINTS, i * (__this.particleCount / __this.SLICES), __this.particleCount / __this.SLICES);
                }

                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.viewport(0, 0, canvas.width, canvas.height);

                gl.useProgram(floorProgramWrapper.program);

                gl.enableVertexAttribArray(0);
                gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexBuffer);
                gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

                gl.uniformMatrix4fv(floorProgramWrapper.uniformLocations['u_viewMatrix'], false, camera.getViewMatrix());
                gl.uniformMatrix4fv(floorProgramWrapper.uniformLocations['u_projectionMatrix'], false, projectionMatrix);

                gl.uniformMatrix4fv(floorProgramWrapper.uniformLocations['u_lightViewProjectionMatrix'], false, lightViewProjectionMatrix);

                gl.uniform1i(floorProgramWrapper.uniformLocations['u_opacityTexture'], 0);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, opacityTexture);

                gl.enable(gl.BLEND);
                gl.blendEquation(gl.FUNC_ADD, gl.FUNC_ADD);
                gl.blendFunc(gl.ONE_MINUS_DST_ALPHA, gl.ONE);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

                gl.viewport(0, 0, canvas.width, canvas.height);

                gl.enableVertexAttribArray(0);
                gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenVertexBuffer);
                gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

                gl.useProgram(backgroundProgramWrapper.program);

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

                requestAnimationFrame(render);
            };
            render(lastTime);


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
        
        private buildProgramWrapper (gl, vertexShader, fragmentShader, attributeLocations) : any {
            var programWrapper = { program: null, uniformLocations: null};

            var program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            for (var attributeName in attributeLocations) {
                gl.bindAttribLocation(program, attributeLocations[attributeName], attributeName);
            }
            gl.linkProgram(program);
            var uniformLocations = {};
            var numberOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < numberOfUniforms; i += 1) {
                var activeUniform = gl.getActiveUniform(program, i),
                    uniformLocation = gl.getUniformLocation(program, activeUniform.name);
                uniformLocations[activeUniform.name] = uniformLocation;
            }

            programWrapper.program = program;
            programWrapper.uniformLocations = uniformLocations;

            return programWrapper;
        }
        
        private buildShader (gl, type, source) : any {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            //console.log(gl.getShaderInfoLog(shader));
            return shader;
        }

        private buildTexture(gl, unit, format, type, width, height, data, wrapS, wrapT, minFilter, magFilter) : any {
            var texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, type, data);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
            return texture;
        }
        
        private buildFramebuffer(gl, attachment) : any {
            var framebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, attachment, 0);
            return framebuffer;
        }
        
        private normalizeVector(out, v) {
            var inverseMagnitude = 1.0 / Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
            out[0] = v[0] * inverseMagnitude;
            out[1] = v[1] * inverseMagnitude;
            out[2] = v[2] * inverseMagnitude;
        }

        private dotVectors(a, b) : any {
            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        }
        
        
        
       

        

        private makeOrthographicMatrix(matrix, left, right, bottom, top, near, far): any {
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

            return matrix;
        }

        private makeLookAtMatrix(matrix, eye, target, up) { //up is assumed to be normalized
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

        private randomPointInSphere() {
            var lambda = Math.random();
            var u = Math.random() * 2.0 - 1.0;
            var phi = Math.random() * 2.0 * Math.PI;

            return [
                Math.pow(lambda, 1 / 3) * Math.sqrt(1.0 - u * u) * Math.cos(phi),
                Math.pow(lambda, 1 / 3) * Math.sqrt(1.0 - u * u) * Math.sin(phi),
                Math.pow(lambda, 1 / 3) * u
            ];
        }
        
        private log2(x) : any{
            return Math.log(x) / Math.log(2);
        }

        
        private hsvToRGB(h, s, v) : any {
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

        private rgbToString(color) : any{
            return 'rgb(' + (color[0] * 255).toFixed(0) + ',' + (color[1] * 255).toFixed(0) + ',' + (color[2] * 255).toFixed(0) + ')';
        }
        
        public setHue(newHue: number) {
            this.hue = newHue;
        }

        public setTimeScale(newTimeScale: number) {
            this.timeScale = newTimeScale;
        }

        public setPersistence(newPersistence: number) {
            this.persistence = newPersistence;
        }

        




    }



    //angular.module('USoStupidApp').directive("dirWebglCanvas", Application.Directives.WebGLCanvasDirective.$inject);
   

}
