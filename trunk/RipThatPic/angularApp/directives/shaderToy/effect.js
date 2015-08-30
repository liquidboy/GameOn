var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        var Effect = (function () {
            function Effect(vr, ac, gl, xres, yres, callback, obj, forceMuted, forcePaused) {
                var _this = this;
                this.StopOutputs = function () {
                    var gl = _this.mGLContext;
                    var wa = _this.mAudioContext;
                    var num = _this.mPasses.length;
                    for (var i = 0; i < num; i++) {
                        if (!_this.mPasses[i].mUsed)
                            continue;
                        _this.mPasses[i].StopOutput(wa, gl);
                    }
                };
                this.ResumeOutputs = function () {
                    var gl = _this.mGLContext;
                    var wa = _this.mAudioContext;
                    if (gl == null)
                        return;
                    var num = _this.mPasses.length;
                    for (var i = 0; i < num; i++) {
                        if (!_this.mPasses[i].mUsed)
                            continue;
                        _this.mPasses[i].ResumeOutput(wa, gl);
                    }
                };
                this.mAudioContext = ac;
                this.mGLContext = gl;
                this.mWebVR = vr;
                this.mRenderingStereo = false;
                this.mQuadVBO = null;
                this.mXres = xres;
                this.mYres = yres;
                this.mForceMuted = forceMuted; //| (ac == null);
                this.mGainNode = null;
                this.mPasses = new Array(2);
                if (gl == null)
                    return;
                var ext = gl.getExtension('OES_standard_derivatives');
                var supportsDerivatives = (ext != null);
                if (supportsDerivatives)
                    gl.hint(ext.FRAGMENT_SHADER_DERIVATIVE_HINT_OES, gl.NICEST);
                var ext2 = gl.getExtension('OES_texture_float');
                this.mSupportTextureFloat = (ext2 != null);
                var precision = this.determineShaderPrecission(gl);
                //-------------
                if (ac != null) {
                    this.mGainNode = ac.createGain();
                    this.mGainNode.connect(ac.destination);
                    this.mGainNode.gain.value = (this.mForceMuted) ? 0.0 : 1.0;
                }
                //-------------
                this.mQuadVBO = this.createQuadVBO(gl);
                for (var i = 0; i < 2; i++) {
                    this.mPasses[i] = new Directives.EffectPass(gl, precision, supportsDerivatives, callback, obj, forceMuted, forcePaused, this.mQuadVBO, this.mGainNode, i);
                }
            }
            Effect.prototype.determineShaderPrecission = function (gl) {
                var h1 = "#ifdef GL_ES\n" +
                    "precision highp float;\n" +
                    "#endif\n";
                var h2 = "#ifdef GL_ES\n" +
                    "precision mediump float;\n" +
                    "#endif\n";
                var h3 = "#ifdef GL_ES\n" +
                    "precision lowp float;\n" +
                    "#endif\n";
                var vstr = "void main() { gl_Position = vec4(1.0); }\n";
                var fstr = "void main() { gl_FragColor = vec4(1.0); }\n";
                if (this.createShader(gl, vstr, h1 + fstr, false).mSuccess == true)
                    return h1;
                if (this.createShader(gl, vstr, h2 + fstr, false).mSuccess == true)
                    return h2;
                if (this.createShader(gl, vstr, h3 + fstr, false).mSuccess == true)
                    return h3;
                return "";
            };
            Effect.prototype.createShader = function (gl, tvs, tfs, nativeDebug) {
                if (gl == null)
                    return { mSuccess: false, mInfo: "no GL" };
                var vs = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vs, tvs);
                gl.compileShader(vs);
                var fs = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fs, tfs);
                gl.compileShader(fs);
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
            };
            Effect.prototype.createQuadVBO = function (gl) {
                var vertices = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]);
                var vbo = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                return vbo;
            };
            Effect.prototype.createCubeVBO = function (gl) {
                var vertices = new Float32Array([-1.0, -1.0, -1.0,
                    1.0, -1.0, -1.0,
                    -1.0, 1.0, -1.0,
                    1.0, 1.0, -1.0,
                    -1.0, -1.0, 1.0,
                    1.0, -1.0, 1.0,
                    -1.0, 1.0, 1.0,
                    1.0, 1.0, 1.0]);
                var vbo = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                return vbo;
            };
            Effect.prototype.NewScriptJSON = function (jobj) {
                if (jobj.ver != "0.1") {
                    return { mFailed: true };
                }
                var numPasses = jobj.renderpass.length;
                if (numPasses == 0 || numPasses > 2) {
                    return { mFailed: true, mError: "Incorrect number of passes, Shadertoy supports up to two-pass shaders at this moment.", mShader: null };
                }
                var res = []; // = new Array( numPasses );
                res.mFailed = false;
                for (var j = 0; j < numPasses; j++) {
                    var rpass = jobj.renderpass[j];
                    // skip sound passes if in thumbnail mode
                    if (this.mForceMuted && rpass.type == "sound")
                        continue;
                    var numInputs = rpass.inputs.length;
                    for (var i = 0; i < 4; i++) {
                        this.mPasses[j].NewTexture(this.mAudioContext, this.mGLContext, i, null);
                    }
                    for (var i = 0; i < numInputs; i++) {
                        var lid = rpass.inputs[i].channel;
                        var styp = rpass.inputs[i].ctype;
                        var sid = rpass.inputs[i].id;
                        var ssrc = rpass.inputs[i].src;
                        this.mPasses[j].NewTexture(this.mAudioContext, this.mGLContext, lid, { mType: styp, mID: sid, mSrc: ssrc });
                    }
                    //------------------------
                    this.mPasses[j].Create(rpass.type, this.mAudioContext, this.mGLContext);
                    var shaderStr = rpass.code;
                    var result = this.mPasses[j].NewShader(this.mGLContext, shaderStr);
                    if (result != null) {
                        res.mFailed = true;
                        res[j] = {
                            mFailed: true,
                            mError: result,
                            mType: rpass.type,
                            mShader: shaderStr
                        };
                    }
                    else {
                        res[j] = {
                            mFailed: false,
                            mError: null,
                            mType: rpass.type,
                            mShader: shaderStr
                        };
                    }
                }
                return res;
            };
            Effect.prototype.NewTexture = function (passid, slot, url) {
                this.mPasses[passid].NewTexture(this.mAudioContext, this.mGLContext, slot, url);
            };
            Effect.prototype.NewShader = function (shaderCode, passid) {
                return this.mPasses[passid].NewShader(this.mGLContext, shaderCode);
            };
            Effect.prototype.CalcFlags = function () {
                var flagVR = false;
                var flagWebcam = false;
                var flagSoundInput = false;
                var flagSoundOutput = false;
                var flagKeyboard = false;
                var numPasses = this.mPasses.length;
                for (var j = 0; j < numPasses; j++) {
                    var pass = this.mPasses[j];
                    if (!pass.mUsed)
                        continue;
                    if (pass.mType == "sound")
                        flagSoundOutput = true;
                    for (var i = 0; i < 4; i++) {
                        if (pass.mInputs[i] == null)
                            continue;
                        if (pass.mInputs[i].mInfo.mType == "webcam")
                            flagWebcam = true;
                        else if (pass.mInputs[i].mInfo.mType == "keyboard")
                            flagKeyboard = true;
                        else if (pass.mInputs[i].mInfo.mType == "mic")
                            flagSoundInput = true;
                    }
                    var n1 = pass.mSource.indexOf("mainVR(");
                    var n2 = pass.mSource.indexOf("mainVR (");
                    if (n1 > 0 || n2 > 0)
                        flagVR = true;
                }
                return {
                    mFlagVR: flagVR,
                    mFlagWebcam: flagWebcam,
                    mFlagSoundInput: flagSoundInput,
                    mFlagSoundOutput: flagSoundOutput,
                    mFlagKeyboard: flagKeyboard
                };
            };
            Effect.prototype.ResetTime = function () {
                var gothere = '';
                //this.mTOffset = 0;
                //this.mTo = performance.now();
                //this.mTf = 0;
                //this.mFpsTo = this.mTo;
                //this.mFpsFrame = 0;
                //this.mForceFrame = true;
                //this.mEffect.ResetTime();
            };
            Effect.prototype.Paint = function (time, mouseOriX, mouseOriY, mousePosX, mousePosY, isPaused) {
                var gl = this.mGLContext;
                var wa = this.mAudioContext;
                if (gl == null)
                    return;
                var da = new Date();
                var vrData = null;
                if (this.mRenderingStereo)
                    vrData = this.mWebVR.GetData();
                var xres = this.mXres / 1; // iqiq
                var yres = this.mYres / 1; // iqiq
                var num = this.mPasses.length;
                for (var i = 0; i < num; i++) {
                    if (!this.mPasses[i].mUsed)
                        continue;
                    if (this.mPasses[i].mProgram == null)
                        continue;
                    this.mPasses[i].Paint(vrData, wa, gl, da, time, mouseOriX, mouseOriY, mousePosX, mousePosY, xres, yres, isPaused);
                }
            };
            Effect.prototype.UpdateInputs = function (passid, forceUpdate) {
                this.mPasses[passid].UpdateInputs(this.mAudioContext, forceUpdate);
            };
            return Effect;
        })();
        Directives.Effect = Effect;
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=effect.js.map