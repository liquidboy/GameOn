
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

                var renderCanvas = element.find("canvas[id='render']")[0];

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

        private NOISE_OCTAVES = 3;
        private NOISE_POSITION_SCALE = 1.5;
        private NOISE_SCALE = 0.075;
        private NOISE_TIME_SCALE = 1 / 4000;
        private BASE_SPEED = 0.2;

        private PARTICLE_SATURATION = 0.75;
        private PARTICLE_VALUE = 1.0;
        private PARTICLE_OPACITY_SCALE = 0.75;

        private BACKGROUND_DISTANCE_SCALE = 0.1;

        private FLOOR_WIDTH = 100.0;
        private FLOOR_HEIGHT = 100.0;
        private FLOOR_ORIGIN = [-2.0, -0.75, -5.0];

        private ASPECT_RATIO = 16 / 9;

        private PROJECTION_NEAR = 0.01;
        private PROJECTION_FAR = 10.0;

        private PROJECTION_FOV = (60 / 180) * Math.PI;

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

        private CAMERA_DISTANCE = 2.2;
        private INITIAL_AZIMUTH = 0.6;
        private INITIAL_ELEVATION = 0.4;

        private MIN_ELEVATION = -0.1;
        private MAX_ELEVATION = Math.PI / 2.0;

        private CAMERA_ORBIT_POINT = [1.2, -0.3, 0.0];

        private CAMERA_SENSITIVITY = 0.005;

        private INITIAL_SPEED = 2;
        private INITIAL_TURBULENCE = 0.2;

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




       








        constructor(private $scope: IFlowScope,
            private $routeParams: any) {

            $scope.hasWebGLSupportWithExtensions = (extensions: any) => this.hasWebGLSupportWithExtensions(extensions);
            $scope.initCanvas = (canvas: any) => this.initCanvas(canvas);
        

        }

        private initCanvas(canvas: any): void {
            var gl = canvas.getContext('webgl', this.options) || canvas.getContext('experimental-webgl', this.options);
            gl.getExtension('OES_texture_float');
            gl.clearColor(0.0, 0.0, 0.0, 0.0);



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

            var particleCountWidth = 0;
            var particleCountHeight = 0;
            var particleCount = particleCountWidth * particleCountHeight;

            var particleDiameter = 0.0;
            var particleAlpha = 0.0;

            var changingParticleCount = false;
            var oldParticleDiameter;
            var oldParticleCountWidth;
            var oldParticleCountHeight;


            var particleTextureA = this.buildTexture(gl, 0, gl.RGBA, gl.FLOAT, 1, 1, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
            var particleTextureB = this.buildTexture(gl, 0, gl.RGBA, gl.FLOAT, 1, 1, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);

            //var camera = new Camera(canvas);

            var projectionMatrix = this.makePerspectiveMatrix(new Float32Array(16), this.PROJECTION_FOV, this.ASPECT_RATIO, this.PROJECTION_NEAR, this.PROJECTION_FAR);

            var lightViewMatrix = new Float32Array(16);
            this.makeLookAtMatrix(lightViewMatrix, [0.0, 0.0, 0.0], this.LIGHT_DIRECTION, this.LIGHT_UP_VECTOR);
            var lightProjectionMatrix = this.makeOrthographicMatrix(new Float32Array(16), this.LIGHT_PROJECTION_LEFT, this.LIGHT_PROJECTION_RIGHT, this.LIGHT_PROJECTION_BOTTOM, this.LIGHT_PROJECTION_TOP, this.LIGHT_PROJECTION_NEAR, this.LIGHT_PROJECTION_FAR);

            var lightViewProjectionMatrix = new Float32Array(16);
            this.premultiplyMatrix(lightViewProjectionMatrix, lightViewMatrix, lightProjectionMatrix);

            var hue = 0;
            var timeScale = this.INITIAL_SPEED;
            var persistence = this.INITIAL_TURBULENCE;


            //this.setHue = function (newHue) {
            //    hue = newHue;
            //};

            //this.setTimeScale = function (newTimeScale) {
            //    timeScale = newTimeScale;
            //};

            //this.setPersistence = function (newPersistence) {
            //    persistence = newPersistence;
            //};

            //var resampleFramebuffer = gl.createFramebuffer();

            //var qualityLevel = -1;

            //this.changeQualityLevel = function (newLevel) {
            //    qualityLevel = newLevel;

            //    particleAlpha = QUALITY_LEVELS[qualityLevel].alpha;
            //    changingParticleCount = true;

            //    oldParticleDiameter = particleDiameter;
            //    particleDiameter = QUALITY_LEVELS[qualityLevel].diameter;

            //    oldParticleCountWidth = particleCountWidth;
            //    oldParticleCountHeight = particleCountHeight;
            //    particleCountWidth = QUALITY_LEVELS[qualityLevel].resolution[0];
            //    particleCountHeight = QUALITY_LEVELS[qualityLevel].resolution[1];

            //    particleCount = particleCountWidth * particleCountHeight;
            //}

            //this.changeQualityLevel(0);

            //variables used for sorting
            var totalSortSteps = (this.log2(particleCount) * (this.log2(particleCount) + 1)) / 2;
            var sortStepsLeft = totalSortSteps;
            var sortPass = -1;
            var sortStage = -1;

            var opacityTexture = this.buildTexture(gl, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.OPACITY_TEXTURE_RESOLUTION, this.OPACITY_TEXTURE_RESOLUTION, null, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR); //opacity from the light's point of view

            var simulationFramebuffer = gl.createFramebuffer();
            var sortFramebuffer = gl.createFramebuffer();

            var opacityFramebuffer = this.buildFramebuffer(gl, opacityTexture);

            var simulationProgramWrapper = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, SIMULATION_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, SIMULATION_FRAGMENT_SHADER_SOURCE),
                { 'a_position': 0 }
                );

            var renderingProgramWrapper = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, RENDERING_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, RENDERING_FRAGMENT_SHADER_SOURCE),
                { 'a_textureCoordinates': 0 }
                );

            var opacityProgramWrapper = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, OPACITY_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, OPACITY_FRAGMENT_SHADER_SOURCE),
                { 'a_textureCoordinates': 0 }
                );

            var sortProgramWrapper = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, SORT_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, SORT_FRAGMENT_SHADER_SOURCE),
                { 'a_position': 0 }
                );

            var resampleProgramWrapper = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, RESAMPLE_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, RESAMPLE_FRAGMENT_SHADER_SOURCE),
                { 'a_position': 0 }
                );

            var floorProgramWrapper = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, FLOOR_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, FLOOR_FRAGMENT_SHADER_SOURCE),
                { 'a_vertexPosition': 0 }
                );

            var backgroundProgramWrapper = this.buildProgramWrapper(gl,
                this.buildShader(gl, gl.VERTEX_SHADER, BACKGROUND_VERTEX_SHADER_SOURCE),
                this.buildShader(gl, gl.FRAGMENT_SHADER, BACKGROUND_FRAGMENT_SHADER_SOURCE),
                { 'a_position': 0 }
                );

            var fullscreenVertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenVertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);

            var floorVertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, floorVertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                this.FLOOR_ORIGIN[0], this.FLOOR_ORIGIN[1], this.FLOOR_ORIGIN[2],
                this.FLOOR_ORIGIN[0], this.FLOOR_ORIGIN[1], this.FLOOR_ORIGIN[2] + this.FLOOR_HEIGHT,
                this.FLOOR_ORIGIN[0] + this.FLOOR_WIDTH, this.FLOOR_ORIGIN[1], this.FLOOR_ORIGIN[2],
                this.FLOOR_ORIGIN[0] + this.FLOOR_WIDTH, this.FLOOR_ORIGIN[1], this.FLOOR_ORIGIN[2] + this.FLOOR_HEIGHT
            ]), gl.STATIC_DRAW);


            var onresize = function () {
                var aspectRatio = window.innerWidth / window.innerHeight;
                this.makePerspectiveMatrix(projectionMatrix, this.PROJECTION_FOV, aspectRatio, this.PROJECTION_NEAR, this.PROJECTION_FAR);
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

                if (deltaTime > this.MAX_DELTA_TIME) {
                    deltaTime = 0;
                }

                if (changingParticleCount) {
                    deltaTime = 0;
                    changingParticleCount = false;

                    particleVertexBuffer = particleVertexBuffers[this.qualityLevel];
                    spawnTexture = spawnTextures[this.qualityLevel];

                    //reset sort
                    totalSortSteps = (this.log2(particleCount) * (this.log2(particleCount) + 1)) / 2;
                    sortStepsLeft = totalSortSteps;
                    sortPass = -1;
                    sortStage = -1;

                    if (oldParticleCountHeight === 0 && oldParticleCountWidth === 0) { //initial generation
                        var particleData = new Float32Array(particleCount * 4);

                        for (var i = 0; i < particleCount; ++i) {
                            var position = this.randomPointInSphere();

                            var positionX = position[0] * this.SPAWN_RADIUS;
                            var positionY = position[1] * this.SPAWN_RADIUS;
                            var positionZ = position[2] * this.SPAWN_RADIUS;

                            particleData[i * 4] = positionX;
                            particleData[i * 4 + 1] = positionY;
                            particleData[i * 4 + 2] = positionZ;
                            particleData[i * 4 + 3] = Math.random() * this.BASE_LIFETIME;
                        }

                        gl.bindTexture(gl.TEXTURE_2D, particleTextureA);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, particleCountWidth, particleCountHeight, 0, gl.RGBA, gl.FLOAT, particleData);

                        delete particleData;

                        gl.bindTexture(gl.TEXTURE_2D, particleTextureB);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, particleCountWidth, particleCountHeight, 0, gl.RGBA, gl.FLOAT, null);
                    } else {
                        //resample from A into B
                        gl.bindTexture(gl.TEXTURE_2D, particleTextureB);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, particleCountWidth, particleCountHeight, 0, gl.RGBA, gl.FLOAT, null);

                        gl.enableVertexAttribArray(0);
                        gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenVertexBuffer);
                        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

                        gl.enableVertexAttribArray(0);

                        gl.useProgram(resampleProgramWrapper.program);
                        gl.uniform1i(resampleProgramWrapper.uniformLocations['u_particleTexture'], 0);
                        gl.uniform1i(resampleProgramWrapper.uniformLocations['u_offsetTexture'], 1);

                        if (particleCount > oldParticleCountWidth * oldParticleCountHeight) { //if we are upsampling we need to add random sphere offsets
                            gl.uniform1f(resampleProgramWrapper.uniformLocations['u_offsetScale'], oldParticleDiameter);
                        } else { //if downsampling we can just leave positions as they are
                            gl.uniform1f(resampleProgramWrapper.uniformLocations['u_offsetScale'], 0);
                        }

                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, particleTextureA);

                        gl.activeTexture(gl.TEXTURE1);
                        gl.bindTexture(gl.TEXTURE_2D, offsetTexture);

                        gl.bindFramebuffer(gl.FRAMEBUFFER, this.resampleFramebuffer);
                        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, particleTextureB, 0);

                        gl.viewport(0, 0, particleCountWidth, particleCountHeight);

                        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

                        gl.bindTexture(gl.TEXTURE_2D, particleTextureA);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, particleCountWidth, particleCountHeight, 0, gl.RGBA, gl.FLOAT, null);

                        var temp = particleTextureA;
                        particleTextureA = particleTextureB;
                        particleTextureB = temp;
                    }
                }


                var flippedThisFrame = false; //if the order reversed this frame

                var viewDirection = camera.getViewDirection();

                var halfVector;

                if (this.dotVectors(viewDirection, this.LIGHT_DIRECTION) > 0.0) {
                    halfVector = new Float32Array([
                        this.LIGHT_DIRECTION[0] + viewDirection[0],
                        this.LIGHT_DIRECTION[1] + viewDirection[1],
                        this.LIGHT_DIRECTION[2] + viewDirection[2],
                    ]);
                    this.normalizeVector(halfVector, halfVector);

                    if (flipped) {
                        flippedThisFrame = true;
                    }

                    flipped = false;
                } else {
                    halfVector = new Float32Array([
                        this.LIGHT_DIRECTION[0] - viewDirection[0],
                        this.LIGHT_DIRECTION[1] - viewDirection[1],
                        this.LIGHT_DIRECTION[2] - viewDirection[2],
                    ]);
                    this.normalizeVector(halfVector, halfVector);

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


                for (var i = 0; i < (firstFrame ? this.BASE_LIFETIME / this.PRESIMULATION_DELTA_TIME : 1); ++i) {
                    gl.enableVertexAttribArray(0);
                    gl.bindBuffer(gl.ARRAY_BUFFER, fullscreenVertexBuffer);
                    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

                    gl.useProgram(simulationProgramWrapper.program);
                    gl.uniform2f(simulationProgramWrapper.uniformLocations['u_resolution'], particleCountWidth, particleCountHeight);
                    gl.uniform1f(simulationProgramWrapper.uniformLocations['u_deltaTime'], firstFrame ? this.PRESIMULATION_DELTA_TIME : deltaTime * timeScale);
                    gl.uniform1f(simulationProgramWrapper.uniformLocations['u_time'], firstFrame ? this.PRESIMULATION_DELTA_TIME : currentTime);
                    gl.uniform1i(simulationProgramWrapper.uniformLocations['u_particleTexture'], 0);

                    gl.uniform1f(simulationProgramWrapper.uniformLocations['u_persistence'], persistence);

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

                    gl.viewport(0, 0, particleCountWidth, particleCountHeight);

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

                for (var i = 0; i < (flippedThisFrame ? totalSortSteps : this.SORT_PASSES_PER_FRAME); ++i) {
                    sortPass--;
                    if (sortPass < 0) {
                        sortStage++;
                        sortPass = sortStage;
                    }

                    gl.useProgram(sortProgramWrapper.program);

                    gl.uniform1i(sortProgramWrapper.uniformLocations['u_dataTexture'], 0);
                    gl.uniform2f(sortProgramWrapper.uniformLocations['u_resolution'], particleCountWidth, particleCountHeight);

                    gl.uniform1f(sortProgramWrapper.uniformLocations['pass'], 1 << sortPass);
                    gl.uniform1f(sortProgramWrapper.uniformLocations['stage'], 1 << sortStage);

                    gl.uniform3fv(sortProgramWrapper.uniformLocations['u_halfVector'], halfVector);

                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, particleTextureA);

                    gl.bindFramebuffer(gl.FRAMEBUFFER, sortFramebuffer);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, particleTextureB, 0);

                    gl.viewport(0, 0, particleCountWidth, particleCountHeight);

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

                for (var i = 0; i < this.SLICES; ++i) {
                    //render particles
                    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                    gl.viewport(0, 0, canvas.width, canvas.height);

                    gl.useProgram(renderingProgramWrapper.program);

                    gl.uniform1i(renderingProgramWrapper.uniformLocations['u_particleTexture'], 0);
                    gl.uniform1i(renderingProgramWrapper.uniformLocations['u_opacityTexture'], 1);

                    gl.uniformMatrix4fv(renderingProgramWrapper.uniformLocations['u_viewMatrix'], false, camera.getViewMatrix());
                    gl.uniformMatrix4fv(renderingProgramWrapper.uniformLocations['u_projectionMatrix'], false, projectionMatrix);

                    gl.uniformMatrix4fv(renderingProgramWrapper.uniformLocations['u_lightViewProjectionMatrix'], false, lightViewProjectionMatrix);

                    gl.uniform1f(renderingProgramWrapper.uniformLocations['u_particleDiameter'], particleDiameter);
                    gl.uniform1f(renderingProgramWrapper.uniformLocations['u_screenWidth'], canvas.width);

                    gl.uniform1f(renderingProgramWrapper.uniformLocations['u_particleAlpha'], particleAlpha);

                    var colorRGB = this.hsvToRGB(hue, this.PARTICLE_SATURATION, this.PARTICLE_VALUE);
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

                    gl.drawArrays(gl.POINTS, i * (particleCount / this.SLICES), particleCount / this.SLICES);

                    //render to opacity texture
                    gl.bindFramebuffer(gl.FRAMEBUFFER, opacityFramebuffer);

                    gl.viewport(0, 0, this.OPACITY_TEXTURE_RESOLUTION, this.OPACITY_TEXTURE_RESOLUTION);

                    gl.useProgram(opacityProgramWrapper.program);

                    gl.uniform1i(opacityProgramWrapper.uniformLocations['u_particleTexture'], 0);

                    gl.uniformMatrix4fv(opacityProgramWrapper.uniformLocations['u_lightViewMatrix'], false, lightViewMatrix);
                    gl.uniformMatrix4fv(opacityProgramWrapper.uniformLocations['u_lightProjectionMatrix'], false, lightProjectionMatrix);

                    gl.uniform1f(opacityProgramWrapper.uniformLocations['u_particleDiameter'], particleDiameter);
                    gl.uniform1f(opacityProgramWrapper.uniformLocations['u_screenWidth'], this.OPACITY_TEXTURE_RESOLUTION);

                    gl.uniform1f(opacityProgramWrapper.uniformLocations['u_particleAlpha'], particleAlpha);

                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, particleTextureA);

                    gl.enableVertexAttribArray(0);
                    gl.bindBuffer(gl.ARRAY_BUFFER, particleVertexBuffer);
                    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD, gl.FUNC_ADD);
                    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

                    gl.drawArrays(gl.POINTS, i * (particleCount / this.SLICES), particleCount / this.SLICES);
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
            //render();


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
        
        private makeIdentityMatrix(matrix) : any {
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
        
        private premultiplyMatrix(out, matrixA, matrixB) :any { //out = matrixB * matrixA
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

        private makeXRotationMatrix(matrix, angle) : any {
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

        private makeYRotationMatrix(matrix, angle) : any {
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

        private makePerspectiveMatrix(matrix, fov, aspect, near, far) : any {
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

        private getMousePosition(event, element) : any {
            var boundingRect = element.getBoundingClientRect();
            return {
                x: event.clientX - boundingRect.left,
                y: event.clientY - boundingRect.top
            };
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
    }



    //angular.module('USoStupidApp').directive("dirWebglCanvas", Application.Directives.WebGLCanvasDirective.$inject);

}
