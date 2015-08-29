module Application.Directives {

    export class EffectPass {

        mID: any;
        mInputs: any;
        mSource: any;
        mUsed: any;
        mGainNode: any;

        mType: any;
        mFrame: any;

        mPrecision: any;
        mSupportsDerivatives: any;
        mTextureCallbackFun: any;
        mTextureCallbackObj: any;
        mForceMuted: any;
        mForcePaused: any;

        mQuadVBO: any;
        mRenderFBO: any;
        mTextureDimensions: any;
        mSampleRate: any;
        mBuffer: any;
        mPlaySamples: any;
        mTmpBufferSamples: any;
        mData: any;
        mPlayNode: any;

        mImagePassFooter: string;
        mImagePassFooterVR: string;
        mHeader: string;
        mHeaderLength: number;
        mProgram: any;
        mProgramVR: any;
        mSupportsVR: boolean;

        mSoundPassFooter: string;
        mPlayTime: number;
        mRenderTexture: any;


        constructor(gl, precission, supportDerivatives, callback, obj, forceMuted, forcePaused, quadVBO, outputGainNode, id) {

            this.mID = id;
            this.mInputs = new Array(4);
            this.mInputs[0] = null;
            this.mInputs[1] = null;
            this.mInputs[2] = null;
            this.mInputs[3] = null;
            this.mSource = null;
            this.mUsed = false;
            this.mGainNode = outputGainNode;

            this.mQuadVBO = quadVBO;

            this.mType = "image";
            this.mFrame = 0;

            this.mPrecision = precission;
            this.mSupportsDerivatives = supportDerivatives;
            this.mTextureCallbackFun = callback;
            this.mTextureCallbackObj = obj;
            this.mForceMuted = forceMuted;
            this.mForcePaused = forcePaused;


        }

        private NewShader(gl, shaderCode) {
            if (gl == null) return "No GL";

            var res = null;

            if (this.mType == "image") res = this.NewShader_Image(gl, shaderCode);

            this.mSource = shaderCode;

            return res;
        }

        private NewTexture(wa, gl, slot, url) {
            var me = this;

            var texture = null;

            if (url != null && url.mType == "webcam" && this.mForceMuted) {
                url.mType = "texture";
            }

            if (url == null) {
                if (me.mTextureCallbackFun != null)
                    me.mTextureCallbackFun(this.mTextureCallbackObj, slot, null, false, true, 0, -1.0, me.mID);
                return false;
            }
            else if (url.mType == "texture") {
                texture = {};
                texture.mInfo = url;
                texture.globject = (gl != null) ? gl.createTexture() : null;
                texture.loaded = false;
                texture.image = new Image();
                texture.image.crossOrigin = '';
                texture.image.onload = function () {
                    var format = gl.RGBA;
                    if (url.mSrc == "/presets/tex15.png" || url.mSrc == "/presets/tex17.png")
                        format = gl.LUMINANCE;

                    if (url.mSrc == "/presets/tex14.png")
                        me.createGLTextureNearest(gl, texture.image, texture.globject);
                    else if (url.mSrc == "/presets/tex15.png")
                        me.createGLTextureNearestRepeat(gl, texture.image, texture.globject);
                    else
                        me.createGLTexture(gl, texture.image, format, texture.globject);

                    texture.loaded = true;
                    if (me.mTextureCallbackFun != null)
                        me.mTextureCallbackFun(me.mTextureCallbackObj, slot, texture.image, true, true, 0, -1.0, me.mID);
                }
                texture.image.src = url.mSrc;
            }
            else if (url.mType == "cubemap") {
                texture = {};
                texture.mInfo = url;
                texture.globject = (gl != null) ? gl.createTexture() : null;
                texture.loaded = false;
                texture.image = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];

                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture.globject);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

                texture.loaded = true;

                for (var i = 0; i < 6; i++) {
                    texture.image[i].mId = i;
                    texture.image[i].crossOrigin = '';
                    texture.image[i].onload = function () {
                        var id = this.mId;
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture.globject);
                        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + id, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image[id]);
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                        if (me.mTextureCallbackFun != null)
                            me.mTextureCallbackFun(me.mTextureCallbackObj, slot, texture.image[0], true, true, 0, -1.0, me.mID);
                    }

                    texture.image[i].src = url.mSrc.replace("_0.", "_" + i + ".");
                }
            }
            else if (url.mType == "video") {
                texture = {};
                texture.mInfo = url;
                texture.globject = null;
                texture.loaded = false;
                texture.video = document.createElement('video');
                texture.video.width = 256;
                texture.video.height = 256;
                texture.video.loop = true;
                texture.video.paused = true;//this.mForcePaused;
                texture.video.mPaused = true;//this.mForcePaused;
                texture.video.mMuted = this.mForceMuted;
                texture.video.muted = this.mForceMuted;
                if (this.mForceMuted == true)
                    texture.video.volume = 0;
                texture.video.autoplay = false;
                texture.video.hasFalled = false;

                texture.video.addEventListener("canplay", function (e) {
                    texture.video.play();
                    texture.video.paused = false;
                    texture.video.mPaused = false;

                    texture.globject = gl.createTexture();
                    this.createGLTextureLinear(gl, texture.video, texture.globject);
                    texture.loaded = true;

                    if (me.mTextureCallbackFun != null)
                        me.mTextureCallbackFun(me.mTextureCallbackObj, slot, texture.video, true, true, 1, -1.0, me.mID);

                });

                texture.video.addEventListener("error", function (e) {
                    if (texture.video.hasFalled == true) { alert("Error: cannot load video"); return; }
                    var str = texture.video.src;
                    str = str.substr(0, str.lastIndexOf('.')) + ".mp4";
                    texture.video.src = str;
                    texture.video.hasFalled = true;
                });


                texture.video.src = url.mSrc;
            }
            else if (url.mType == "music") {
                texture = {};
                texture.mInfo = url;
                texture.globject = null;
                texture.loaded = false;
                texture.audio = document.createElement('audio');
                texture.audio.loop = true;
                texture.audio.mMuted = this.mForceMuted;
                texture.audio.mForceMuted = this.mForceMuted;

                texture.audio.muted = this.mForceMuted;
                if (this.mForceMuted == true)
                    texture.audio.volume = 0;
                texture.audio.autoplay = true;
                texture.audio.hasFalled = false;
                texture.audio.paused = true;
                texture.audio.mPaused = true;
                texture.audio.mSound = {};

                if (wa == null && this.mForceMuted == false) {
                    alert("Shadertoy: Web Audio not implement in this browser");
                }

                if (this.mForceMuted) {
                    texture.globject = gl.createTexture();
                    this.createAudioTexture(gl, texture.globject);
                    var num = 512;
                    texture.audio.mSound.mFreqData = new Uint8Array(num);
                    texture.audio.mSound.mWaveData = new Uint8Array(num);
                    texture.loaded = true;
                    texture.audio.paused = false;
                    texture.audio.mPaused = false;
                }

                texture.audio.addEventListener("canplay", function () {
                    if (this.mForceMuted) return;

                    texture.globject = gl.createTexture();
                    this.createAudioTexture(gl, texture.globject);

                    texture.audio.mSound.mSource = wa.createMediaElementSource(texture.audio);
                    texture.audio.mSound.mAnalyser = wa.createAnalyser();
                    texture.audio.mSound.mGain = wa.createGain();

                    texture.audio.mSound.mSource.connect(texture.audio.mSound.mAnalyser);
                    texture.audio.mSound.mAnalyser.connect(texture.audio.mSound.mGain);
                    texture.audio.mSound.mGain.connect(wa.destination);

                    texture.audio.mSound.mFreqData = new Uint8Array(texture.audio.mSound.mAnalyser.frequencyBinCount);
                    texture.audio.mSound.mWaveData = new Uint8Array(texture.audio.mSound.mAnalyser.frequencyBinCount);

                    texture.loaded = true;
                    texture.audio.paused = false;
                    texture.audio.mPaused = false;
                });

                texture.audio.addEventListener("error", function (e) {
                    if (this.mForceMuted) return;

                    if (texture.audio.hasFalled == true) { /*alert("Error: cannot load music" ); */return; }
                    var str = texture.audio.src;
                    str = str.substr(0, str.lastIndexOf('.')) + ".ogg";
                    texture.audio.src = str;
                    texture.audio.hasFalled = true;
                });

                if (!this.mForceMuted) {
                    texture.audio.src = url.mSrc;
                }


                if (me.mTextureCallbackFun != null)
                    me.mTextureCallbackFun(me.mTextureCallbackObj, slot, null, false, true, 2, -1.0, me.mID);
            }
            else if (url.mType == "keyboard") {
                texture = {};
                texture.mInfo = url;
                texture.globject = gl.createTexture();
                texture.loaded = true;

                texture.keyboard = {};

                texture.keyboard.mImage = new Image();
                texture.keyboard.mImage.onload = function () {
                    texture.loaded = true;
                    if (me.mTextureCallbackFun != null)
                        me.mTextureCallbackFun(me.mTextureCallbackObj, slot, { mImage: texture.keyboard.mImage, mData: texture.keyboard.mData }, false, false, 4, -1.0, me.mID);
                }
                texture.keyboard.mImage.src = "/img/keyboard.png";


                texture.keyboard.mNewTextureReady = true;
                texture.keyboard.mData = new Uint8Array(256 * 2);

                this.createKeyboardTexture(gl, texture.globject);

                for (var j = 0; j < (256 * 2); j++) {
                    texture.keyboard.mData[j] = 0;
                }

                if (me.mTextureCallbackFun != null)
                    me.mTextureCallbackFun(me.mTextureCallbackObj, slot, { mImage: texture.keyboard.mImage, mData: texture.keyboard.mData }, false, false, 4, -1.0);
            }
            else if (url.mType == null) {
                if (me.mTextureCallbackFun != null)
                    me.mTextureCallbackFun(this.mTextureCallbackObj, slot, null, false, true, 0, -1.0, me.mID);
            }
            else {
                alert("texture type error");
                return;
            }

            //this.DestroyInput(gl, slot);
            this.mInputs[slot] = texture;

            //this.MakeHeader();
        }

        private NewShader_Image(gl, shaderCode) {
            //--------------
            {
                var vsSource = "attribute vec2 pos; void main() { gl_Position = vec4(pos.xy,0.0,1.0); }";

                var res = this.CreateShader(gl, vsSource, this.mHeader + shaderCode + this.mImagePassFooter, false);
                if (res.mSuccess == false)
                    return res.mInfo;

                if (this.mProgram != null)
                    gl.deleteProgram(this.mProgram);

                this.mProgram = res.mProgram;
            }
            //--------------

            this.mSupportsVR = false;

            var n1 = shaderCode.indexOf("mainVR(");
            var n2 = shaderCode.indexOf("mainVR (");
            var n3 = shaderCode.indexOf("mainVR  (");
            if (n1 > 0 || n2 > 0 || n3 > 0) {
                var vsSourceVR = "attribute vec2 pos; void main() { gl_Position = vec4(pos.xy,0.0,1.0); }";

                var res = this.CreateShader(gl, vsSource, this.mHeader + shaderCode + this.mImagePassFooterVR, false);
                if (res.mSuccess == false)
                    return res.mInfo;

                if (this.mProgramVR != null)
                    gl.deleteProgram(this.mProgramVR);

                this.mProgramVR = res.mProgram;
            }

            return null;
        }

        private createGLTexture(ctx, image, format, texture) {
            if (ctx == null) return;

            ctx.bindTexture(ctx.TEXTURE_2D, texture);
            ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
            ctx.texImage2D(ctx.TEXTURE_2D, 0, format, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.REPEAT);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.REPEAT);
            ctx.generateMipmap(ctx.TEXTURE_2D);
            ctx.bindTexture(ctx.TEXTURE_2D, null);
        }

        private createGLTextureNearestRepeat(ctx, image, texture) {
            if (ctx == null) return;

            ctx.bindTexture(ctx.TEXTURE_2D, texture);
            ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
            ctx.bindTexture(ctx.TEXTURE_2D, null);
        }

        private createGLTextureNearest(ctx, image, texture) {
            if (ctx == null) return;

            ctx.bindTexture(ctx.TEXTURE_2D, texture);
            ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);

            ctx.bindTexture(ctx.TEXTURE_2D, null);
        }

        private createGLTextureLinear(ctx, image, texture) {
            if (ctx == null) return;

            ctx.bindTexture(ctx.TEXTURE_2D, texture);
            ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
            ctx.bindTexture(ctx.TEXTURE_2D, null);
        }

        private createAudioTexture(ctx, texture) {
            if (ctx == null) return;

            ctx.bindTexture(ctx.TEXTURE_2D, texture);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.LUMINANCE, 512, 2, 0, ctx.LUMINANCE, ctx.UNSIGNED_BYTE, null);
            ctx.bindTexture(ctx.TEXTURE_2D, null);
        }

        private createKeyboardTexture(ctx, texture) {
            if (ctx == null) return;

            ctx.bindTexture(ctx.TEXTURE_2D, texture);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
            ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
            ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.LUMINANCE, 256, 2, 0, ctx.LUMINANCE, ctx.UNSIGNED_BYTE, null);
            ctx.bindTexture(ctx.TEXTURE_2D, null);
        }

        private Create(passType, wa, gl) {
            this.mType = passType;
            this.mUsed = true;
            this.mSource = null;

            if (passType == "image") this.Create_Image(wa, gl);

        }

        private CreateShader(gl, tvs, tfs, nativeDebug): any {
            if (gl == null) return { mSuccess: false, mInfo: "no GL" };

            var vs = gl.createShader(gl.VERTEX_SHADER); gl.shaderSource(vs, tvs); gl.compileShader(vs);
            var fs = gl.createShader(gl.FRAGMENT_SHADER); gl.shaderSource(fs, tfs); gl.compileShader(fs);

            if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
                var infoLog = gl.getShaderInfoLog(vs);
                return { mSuccess: false, mInfo: infoLog };
            }

            if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
                var infoLog = gl.getShaderInfoLog(fs);
                return { mSuccess: false, mInfo: infoLog };
            }

            if (nativeDebug) {
                var dbgext = gl.getExtension("WEBGL_debug_shaders");
                if (dbgext != null) {
                    var hlsl = dbgext.getTranslatedShaderSource(fs);
                    console.log("------------------------\nHLSL code\n------------------------\n" + hlsl + "\n------------------------\n");
                }
            }

            var tmpProgram = gl.createProgram();

            gl.attachShader(tmpProgram, vs);
            gl.attachShader(tmpProgram, fs);

            gl.deleteShader(vs);
            gl.deleteShader(fs);

            gl.linkProgram(tmpProgram);

            if (!gl.getProgramParameter(tmpProgram, gl.LINK_STATUS)) {
                var infoLog = gl.getProgramInfoLog(tmpProgram);
                gl.deleteProgram(tmpProgram);
                return { mSuccess: false, mInfo: infoLog };
            }

            return { mSuccess: true, mProgram: tmpProgram };
        }

        private Create_Image(wa, gl) {
            this.MakeHeader(null, null);
            this.mSampleRate = 44100;
            this.mSupportsVR = false;
            this.mProgram = null;
            this.mProgramVR = null;
        }

        private Destroy_Image(wa, gl) {
        }

        private MakeHeader(precission, supportDerivatives) {
            if (this.mType == "image") this.MakeHeader_Image(precission, supportDerivatives);
        }

        private MakeHeader_Image(precission, supportDerivatives) {
            var header = this.mPrecision;
            var headerlength = 3;

            if (this.mSupportsDerivatives) { header += "#extension GL_OES_standard_derivatives : enable\n"; headerlength++; }

            header += "uniform vec3      iResolution;\n" +
            "uniform float     iGlobalTime;\n" +
            "uniform float     iChannelTime[4];\n" +
            "uniform vec4      iMouse;\n" +
            "uniform vec4      iDate;\n" +
            "uniform float     iSampleRate;\n" +
            "uniform vec3      iChannelResolution[4];\n";
            headerlength += 7;

            for (var i = 0; i < this.mInputs.length; i++) {
                var inp = this.mInputs[i];

                if (inp != null && inp.mInfo.mType == "cubemap")
                    header += "uniform samplerCube iChannel" + i + ";\n";
                else
                    header += "uniform sampler2D iChannel" + i + ";\n";
                headerlength++;
            }

            this.mImagePassFooter = "\nvoid main( void )" +
            "{" +
            "vec4 color = vec4(0.0,0.0,0.0,1.0);" +
            "mainImage( color, gl_FragCoord.xy );" +
            "color.w = 1.0;" +
            "gl_FragColor = color;" +
            "}";

            this.mImagePassFooterVR = "\n" +
            "uniform vec4 unViewport;\n" +
            "uniform vec3 unCorners[5];\n" +
            "void main( void )" +
            "{" +
            "vec4 color = vec4(0.0,0.0,0.0,1.0);" +

            "vec3 ro = unCorners[4];" +
            "vec2 uv = (gl_FragCoord.xy - unViewport.xy)/unViewport.zw;" +
            "vec3 rd = normalize( mix( mix( unCorners[0], unCorners[1], uv.x )," +
            "mix( unCorners[3], unCorners[2], uv.x ), uv.y ) - ro);" +

            "mainVR( color, gl_FragCoord.xy-unViewport.xy, ro, rd );" +
            "color.w = 1.0;" +
            "gl_FragColor = color;" +
            "}";


            this.mHeader = header;
            this.mHeaderLength = headerlength;
        }

        private createEmptyTextureNearest(gl, xres, yres) {
            var tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, xres, yres, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.bindTexture(gl.TEXTURE_2D, null);
            return tex;
        }

        private createFBO(gl, texture0) {
            var fbo = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture0, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            return fbo;
        }

        private deleteFBO(gl, fbo) {
            gl.deleteFramebuffer(fbo);
        }

        private Paint(vrData, wa, gl, da, time, mouseOriX, mouseOriY, mousePosX, mousePosY, xres, yres, isPaused) {
            if (this.mType == "image") {
                this.Paint_Image(vrData, wa, gl, da, time, mouseOriX, mouseOriY, mousePosX, mousePosY, xres, yres);
                this.mFrame++;
            }
        }

        private Paint_Image(vrData, wa, gl, d, time, mouseOriX, mouseOriY, mousePosX, mousePosY, xres, yres) {
            var times = [0.0, 0.0, 0.0, 0.0];

            var dates = [d.getFullYear(), // the year (four digits)
                d.getMonth(),	   // the month (from 0-11)
                d.getDate(),     // the day of the month (from 1-31)
                d.getHours() * 60.0 * 60 + d.getMinutes() * 60 + d.getSeconds() + d.getMilliseconds() / 1000.0];

            var mouse = [mousePosX, mousePosY, mouseOriX, mouseOriY];

            var resos = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];



            //------------------------


            for (var i = 0; i < this.mInputs.length; i++) {
                var inp = this.mInputs[i];

                gl.activeTexture(gl.TEXTURE0 + i);

                if (inp == null) {
                    gl.bindTexture(gl.TEXTURE_2D, null);
                }
                else if (inp.mInfo.mType == "texture") {
                    if (inp.loaded == false)
                        gl.bindTexture(gl.TEXTURE_2D, null);
                    else {
                        gl.bindTexture(gl.TEXTURE_2D, inp.globject);
                        resos[3 * i + 0] = inp.image.width;
                        resos[3 * i + 1] = inp.image.height;
                        resos[3 * i + 2] = 1;
                    }
                }
                else if (inp.mInfo.mType == "keyboard") {
                    if (inp.loaded == false)
                        gl.bindTexture(gl.TEXTURE_2D, null);
                    else {
                        gl.bindTexture(gl.TEXTURE_2D, inp.globject);
                        if (inp.keyboard.mNewTextureReady == true) {

                            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 256, 2, gl.LUMINANCE, gl.UNSIGNED_BYTE, inp.keyboard.mData);
                            inp.keyboard.mNewTextureReady = false;

                            if (this.mTextureCallbackFun != null)
                                this.mTextureCallbackFun(this.mTextureCallbackObj, i, { mImage: inp.keyboard.mImage, mData: inp.keyboard.mData }, false, false, 4, -1.0, this.mID);
                        }
                    }
                }
                else if (inp.mInfo.mType == "cubemap") {
                    if (inp.loaded == false)
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                    else
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, inp.globject);
                }
                else if (inp.mInfo.mType == "webcam") {
                    if (inp.video.readyState === inp.video.HAVE_ENOUGH_DATA) {
                        if (this.mTextureCallbackFun != null)
                            this.mTextureCallbackFun(this.mTextureCallbackObj, i, inp.video, false, false, 0, -1, this.mID);

                        if (inp.loaded == false) {
                            gl.bindTexture(gl.TEXTURE_2D, null);
                        }
                        else {
                            gl.bindTexture(gl.TEXTURE_2D, inp.globject);
                            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inp.video);
                            resos[3 * i + 0] = inp.video.width;
                            resos[3 * i + 1] = inp.video.height;
                            resos[3 * i + 2] = 1;
                        }
                    }
                }
                else if (inp.mInfo.mType == "video") {
                    if (inp.video.mPaused == false) {
                        if (this.mTextureCallbackFun != null)
                            this.mTextureCallbackFun(this.mTextureCallbackObj, i, inp.video, false, false, 0, inp.video.currentTime, this.mID);
                    }

                    if (inp.loaded == false) {
                        gl.bindTexture(gl.TEXTURE_2D, null);
                    }
                    else {
                        times[i] = inp.video.currentTime;

                        gl.bindTexture(gl.TEXTURE_2D, inp.globject);

                        if (inp.video.mPaused == false) {
                            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inp.video);
                        }
                        resos[3 * i + 0] = inp.video.width;
                        resos[3 * i + 1] = inp.video.height;
                        resos[3 * i + 2] = 1;
                    }
                }



            }

            //-----------------------------------
            var prog = (vrData == null) ? this.mProgram : this.mProgramVR;

            gl.useProgram(prog);

            var l2 = gl.getUniformLocation(prog, "iGlobalTime"); if (l2 != null) gl.uniform1f(l2, time);
            var l3 = gl.getUniformLocation(prog, "iResolution"); if (l3 != null) gl.uniform3f(l3, xres, yres, 1.0);
            var l4 = gl.getUniformLocation(prog, "iMouse"); if (l4 != null) gl.uniform4fv(l4, mouse);
            var l5 = gl.getUniformLocation(prog, "iChannelTime"); if (l5 != null) gl.uniform1fv(l5, times);
            var l7 = gl.getUniformLocation(prog, "iDate"); if (l7 != null) gl.uniform4fv(l7, dates);
            var l8 = gl.getUniformLocation(prog, "iChannelResolution"); if (l8 != null) gl.uniform3fv(l8, resos);
            var l9 = gl.getUniformLocation(prog, "iSampleRate"); if (l9 != null) gl.uniform1f(l9, this.mSampleRate);
            var ich0 = gl.getUniformLocation(prog, "iChannel0"); if (ich0 != null) gl.uniform1i(ich0, 0);
            var ich1 = gl.getUniformLocation(prog, "iChannel1"); if (ich1 != null) gl.uniform1i(ich1, 1);
            var ich2 = gl.getUniformLocation(prog, "iChannel2"); if (ich2 != null) gl.uniform1i(ich2, 2);
            var ich3 = gl.getUniformLocation(prog, "iChannel3"); if (ich3 != null) gl.uniform1i(ich3, 3);

            var l1 = gl.getAttribLocation(prog, "pos");


            if (vrData == null) {
                gl.viewport(0, 0, xres, yres);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.mQuadVBO);
                gl.vertexAttribPointer(l1, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(l1);

                gl.drawArrays(gl.TRIANGLES, 0, 6);

                gl.disableVertexAttribArray(l1);
            }
            else {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.mQuadVBO);
                gl.vertexAttribPointer(l1, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(l1);

                for (var i = 0; i < 2; i++) {
                    var ei = (i == 0) ? vrData.mLeftEye : vrData.mRightEye;

                    var vp = [i * xres / 2, 0, xres / 2, yres];
                    //vp = ei.mVP;
                    gl.viewport(vp[0], vp[1], vp[2], vp[3]);

                    var fov = ei.mProjection;
                    var corA = [-fov[2], -fov[1], -1.0];
                    var corB = [fov[3], -fov[1], -1.0];
                    var corC = [fov[3], fov[0], -1.0];
                    var corD = [-fov[2], fov[0], -1.0];
                    var apex = [0.0, 0.0, 0.0];

                    var ma = this.invertFast(ei.mCamera);
                    corA = this.matMulpoint(ma, corA);
                    corB = this.matMulpoint(ma, corB);
                    corC = this.matMulpoint(ma, corC);
                    corD = this.matMulpoint(ma, corD);
                    apex = this.matMulpoint(ma, apex);

                    var corners = [corA[0], corA[1], corA[2],
                        corB[0], corB[1], corB[2],
                        corC[0], corC[1], corC[2],
                        corD[0], corD[1], corD[2],
                        apex[0], apex[1], apex[2]];
                    gl.uniform3fv(gl.getUniformLocation(prog, "unCorners"), corners);
                    gl.uniform4fv(gl.getUniformLocation(prog, "unViewport"), vp);

                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                }

                gl.disableVertexAttribArray(l1);



            }

        }

        private invertFast(m) {
            var inv = [

                m[5] * m[10] * m[15] -
                m[5] * m[11] * m[14] -
                m[9] * m[6] * m[15] +
                m[9] * m[7] * m[14] +
                m[13] * m[6] * m[11] -
                m[13] * m[7] * m[10],

                -m[1] * m[10] * m[15] +
                m[1] * m[11] * m[14] +
                m[9] * m[2] * m[15] -
                m[9] * m[3] * m[14] -
                m[13] * m[2] * m[11] +
                m[13] * m[3] * m[10],

                m[1] * m[6] * m[15] -
                m[1] * m[7] * m[14] -
                m[5] * m[2] * m[15] +
                m[5] * m[3] * m[14] +
                m[13] * m[2] * m[7] -
                m[13] * m[3] * m[6],

                -m[1] * m[6] * m[11] +
                m[1] * m[7] * m[10] +
                m[5] * m[2] * m[11] -
                m[5] * m[3] * m[10] -
                m[9] * m[2] * m[7] +
                m[9] * m[3] * m[6],

                -m[4] * m[10] * m[15] +
                m[4] * m[11] * m[14] +
                m[8] * m[6] * m[15] -
                m[8] * m[7] * m[14] -
                m[12] * m[6] * m[11] +
                m[12] * m[7] * m[10],

                m[0] * m[10] * m[15] -
                m[0] * m[11] * m[14] -
                m[8] * m[2] * m[15] +
                m[8] * m[3] * m[14] +
                m[12] * m[2] * m[11] -
                m[12] * m[3] * m[10],

                -m[0] * m[6] * m[15] +
                m[0] * m[7] * m[14] +
                m[4] * m[2] * m[15] -
                m[4] * m[3] * m[14] -
                m[12] * m[2] * m[7] +
                m[12] * m[3] * m[6],


                m[0] * m[6] * m[11] -
                m[0] * m[7] * m[10] -
                m[4] * m[2] * m[11] +
                m[4] * m[3] * m[10] +
                m[8] * m[2] * m[7] -
                m[8] * m[3] * m[6],


                m[4] * m[9] * m[15] -
                m[4] * m[11] * m[13] -
                m[8] * m[5] * m[15] +
                m[8] * m[7] * m[13] +
                m[12] * m[5] * m[11] -
                m[12] * m[7] * m[9],



                -m[0] * m[9] * m[15] +
                m[0] * m[11] * m[13] +
                m[8] * m[1] * m[15] -
                m[8] * m[3] * m[13] -
                m[12] * m[1] * m[11] +
                m[12] * m[3] * m[9],

                m[0] * m[5] * m[15] -
                m[0] * m[7] * m[13] -
                m[4] * m[1] * m[15] +
                m[4] * m[3] * m[13] +
                m[12] * m[1] * m[7] -
                m[12] * m[3] * m[5],

                -m[0] * m[5] * m[11] +
                m[0] * m[7] * m[9] +
                m[4] * m[1] * m[11] -
                m[4] * m[3] * m[9] -
                m[8] * m[1] * m[7] +
                m[8] * m[3] * m[5],

                -m[4] * m[9] * m[14] +
                m[4] * m[10] * m[13] +
                m[8] * m[5] * m[14] -
                m[8] * m[6] * m[13] -
                m[12] * m[5] * m[10] +
                m[12] * m[6] * m[9],

                m[0] * m[9] * m[14] -
                m[0] * m[10] * m[13] -
                m[8] * m[1] * m[14] +
                m[8] * m[2] * m[13] +
                m[12] * m[1] * m[10] -
                m[12] * m[2] * m[9],

                -m[0] * m[5] * m[14] +
                m[0] * m[6] * m[13] +
                m[4] * m[1] * m[14] -
                m[4] * m[2] * m[13] -
                m[12] * m[1] * m[6] +
                m[12] * m[2] * m[5],

                m[0] * m[5] * m[10] -
                m[0] * m[6] * m[9] -
                m[4] * m[1] * m[10] +
                m[4] * m[2] * m[9] +
                m[8] * m[1] * m[6] -
                m[8] * m[2] * m[5]];

            var det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

            det = 1.0 / det;

            for (var i = 0; i < 16; i++) inv[i] = inv[i] * det;

            return inv;
        }

        private matMulpoint(m, v) {
            return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3],
                m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7],
                m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11]];
        }

        private deleteTexture(gl, tex) {
            gl.deleteTexture(tex);
        }

        UpdateInputs(wa, forceUpdate) {
            for (var i = 0; i < this.mInputs.length; i++) {
                var inp = this.mInputs[i];

                if (inp == null) {
                    if (forceUpdate) {
                        if (this.mTextureCallbackFun != null)
                            this.mTextureCallbackFun(this.mTextureCallbackObj, i, null, false, true, 0, -1.0, this.mID);
                    }
                }
                else if (inp.mInfo.mType == "texture") {
                    if (inp.loaded && forceUpdate) {
                        if (this.mTextureCallbackFun != null)
                            this.mTextureCallbackFun(this.mTextureCallbackObj, i, inp.image, true, true, 0, -1.0, this.mID);
                    }

                }
                else if (inp.mInfo.mType == "cubemap") {
                    if (inp.loaded && forceUpdate) {
                        if (this.mTextureCallbackFun != null)
                            this.mTextureCallbackFun(this.mTextureCallbackObj, i, inp.image[0], true, true, 0, -1.0, this.mID);
                    }

                }
                else if (inp.mInfo.mType == "video") {
                    if (inp.video.readyState === inp.video.HAVE_ENOUGH_DATA) {
                        if (this.mTextureCallbackFun != null)
                            this.mTextureCallbackFun(this.mTextureCallbackObj, i, inp.video, false, false, 0, -1, this.mID);
                    }
                }
                
            }
        }
        
        StopOutput = function (wa, gl) {

                //this.stopOutput_Image(wa, gl);
        }


    }
}