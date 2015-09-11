var Application;
(function (Application) {
    var Directives;
    (function (Directives) {
        //'use strict';
        var ShaderToyDirective = (function () {
            function ShaderToyDirective(pubSubConstants, dataSvc, authService, radioPubSubSvc) {
                var _this = this;
                this.pubSubConstants = pubSubConstants;
                this.dataSvc = dataSvc;
                this.authService = authService;
                this.radioPubSubSvc = radioPubSubSvc;
                this.loadShader = function (gShaderID) {
                    _this.sc.uiData.IsLoading = true;
                    try {
                        var httpReq = _this.createHttpRequest();
                        httpReq.open("GET", "/data/" + gShaderID + ".json", true);
                        httpReq.onload = function () {
                            var res = httpReq.responseText;
                            var jsnShader = null;
                            try {
                                jsnShader = JSON.parse(res);
                            }
                            catch (e) {
                                alert("ERROR in JSON: " + res);
                                return;
                            }
                            _this.dataLoadShader(jsnShader);
                        };
                        httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        var str = "{ \"shaders\" : [\"" + gShaderID + "\"] }";
                        str = "s=" + encodeURIComponent(str);
                        httpReq.send(str);
                    }
                    catch (e) {
                        return;
                    }
                    finally {
                        _this.sc.uiData.IsLoading = false;
                    }
                };
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/shader-toy.html';
                this.link = function ($scope, element, attributes) {
                    _this.sc = $scope;
                    var editor = element.find('#editor')[0];
                    var player = element.find('#player')[0];
                    var passManager = element.find('#passManager');
                    _this.sc.uiData = new UIData();
                    _this.sc.uiData.eFrameRate = element.find('#divFrameRate')[0];
                    _this.sc.uiData.eMyTime = element.find('#divMyTime')[0];
                    _this.sc.uiData.UpdateUI = function () { _this.sc.$apply(); };
                    _this.sc.uiData.Pause = function () { _this.sc.shaderToy.PlayPauseTime(); };
                    _this.sc.ChangeShader = function () {
                        _this.sc.shaderToy.PauseShader();
                        _this.loadShader($scope.shaderId);
                        setTimeout(function () {
                            _this.sc.shaderToy.PlayShader();
                        }, 100);
                    };
                    $(element.find('#butUpdateShader')[0]).on('click', _this.updateShader.bind(_this));
                    _this.sc.shaderToy = new ShaderToy(player, editor, passManager, _this.sc.uiData);
                    //this.sc.shaderToy.UpdateCounter = (data) => { this.sc.uiData.ShaderCharCounter = data;};
                    if (!_this.sc.shaderToy.mCreated)
                        return;
                    ////-- get info --------------------------------------------------------
                    //this.sc.shaderId = '4t23RR';
                    ////this.sc.shaderId = 'll23Rd';  //<-- ???? doesn't work :(
                    //this.sc.shaderId = 'MlS3Rc';
                    //this.sc.shaderId = 'XslGRr';
                    _this.sc.shaderId = '4t23RR';
                    _this.loadShader(_this.sc.shaderId);
                    _this.sc.shaderToy.PlayShader();
                    //if (this.sc.shaderId == null) {
                    //    this.loadNew();
                    //}
                    //else {
                    //    this.loadShader(this.sc.shaderId);
                    //}
                };
            }
            ShaderToyDirective.prototype.injection = function () {
                return [
                    "pubSubConstants", "dataSvc", "authSvc", "radioPubSubSvc",
                    function (pubSubConstants, dataSvc, authSvc, radioPubSubSvc) { return new ShaderToyDirective(pubSubConstants, dataSvc, authSvc, radioPubSubSvc); }
                ];
            };
            ShaderToyDirective.prototype.updateShader = function () {
                this.sc.shaderToy.SetShaderFromEditor();
            };
            ShaderToyDirective.prototype.dataLoadShader = function (jsonShader) {
                this.sc.res = this.sc.shaderToy.ParseJSON(jsonShader);
                if (this.sc.res.mSuccess == false)
                    return;
                document.title = this.sc.res.mName;
                //inputs
                this.sc.uiData.ShowInputs = false;
                this.sc.uiData.Inputs = [];
                if (jsonShader.renderpass[0] && jsonShader.renderpass[0].inputs.length > 0) {
                    this.sc.uiData.ShowInputs = true;
                    this.sc.uiData.Inputs = jsonShader.renderpass[0].inputs;
                }
                //render
                this.sc.shaderToy.StartRendering();
                this.sc.shaderToy.ResetTime();
                if (!this.sc.res.mFailed) {
                    this.sc.shaderToy.PauseShader();
                }
            };
            ShaderToyDirective.prototype.loadShaderFromToyShaderUri = function (gShaderID) {
                try {
                    var httpReq = this.createHttpRequest();
                    httpReq.open("POST", "https://www.shadertoy.com/shadertoy", true);
                    httpReq.onload = function () {
                        var res = httpReq.responseText;
                        var jsnShader = null;
                        try {
                            jsnShader = JSON.parse(res);
                        }
                        catch (e) {
                            alert("ERROR in JSON: " + res);
                            return;
                        }
                        this.dataLoadShader(jsnShader);
                    };
                    httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    var str = "{ \"shaders\" : [\"" + gShaderID + "\"] }";
                    str = "s=" + encodeURIComponent(str);
                    httpReq.send(str);
                }
                catch (e) {
                    return;
                }
            };
            ShaderToyDirective.prototype.createHttpRequest = function () {
                var xmlHttp = null;
                try {
                    // Opera 8.0+, Firefox, Safari
                    xmlHttp = new XMLHttpRequest();
                }
                catch (e) {
                    // Internet Explorer Browsers
                    try {
                        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
                    }
                    catch (e) {
                        try {
                            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                        }
                        catch (e) {
                            // Something went wrong
                            alert("Your browser broke!");
                        }
                    }
                }
                return xmlHttp;
            };
            return ShaderToyDirective;
        })();
        Directives.ShaderToyDirective = ShaderToyDirective;
        var UIData = (function () {
            function UIData() {
            }
            return UIData;
        })();
        var ShaderToy = (function () {
            function ShaderToy(playerElement, editorElement, passElement, uiData) {
                this.playerElement = playerElement;
                this.editorElement = editorElement;
                this.passElement = passElement;
                this.uiData = uiData;
                this.createGlContext = function (cv, useAlpha, usePreserveBuffer) {
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
                };
                this.createNoWebGLMessage = function (base, old) {
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
                    if (fontSize < 6)
                        fontSize = 6;
                    if (fontSize > 16)
                        fontSize = 16;
                    divText.style.font = "italic bold " + fontSize + "px arial,serif";
                    divText.innerHTML = 'Shadertoy needs a WebGL-enabled browser. Minimum Requirements: <ul><li>Firefox 17</li><li>Chrome 23</li><li>Internet Explorer 11</li><li>Safari 8</li></ul>';
                    div.appendChild(divText);
                };
                var canvas = $(playerElement).find('#demogl')[0];
                this.mCanvas = canvas;
                this.mDocs = {};
                this.mGLContext = this.createGlContext(this.mCanvas, false, true);
                if (this.mGLContext == null) {
                    this.createNoWebGLMessage(this.playerElement, this.mCanvas);
                    this.mIsPaused = true;
                    this.mForceFrame = false;
                }
                this.mEditorState = { mCursorChange: false, mViewportChange: false, mCodeChange: false };
                this.mCodeEditor = window['CodeMirror'](editorElement, {
                    lineNumbers: true,
                    matchBrackets: true,
                    indentWithTabs: false,
                    tabSize: 4,
                    indentUnit: 4,
                    mode: "text/x-glsl",
                    foldGutter: true,
                    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                });
                var __this = this;
                this.mCodeEditor.on("change", function (instance, ev) { __this.mEditorState.mCodeChange = true; __this.mNeedsSave = true; });
                this.mCodeEditor.on("cursorActivity", function (instance) { __this.mEditorState.mCursorChange = true; });
                this.mCodeEditor.on("viewportChange", function (instance, eFrom, eTo) { __this.mEditorState.mViewportChange = true; });
                this.mEffect = new Directives.Effect(null, null, this.mGLContext, this.mCanvas.width, this.mCanvas.height, this.refreshTexturThumbail, this, false, false);
                this.mCreated = true;
            }
            ShaderToy.prototype.ParseJSON = function (jsn) {
                try {
                    var res = this.mEffect.ParseJSON(jsn);
                    var num = res.length;
                    for (var i = 0; i < num; i++) {
                        this.mDocs[i] = window['CodeMirror'].Doc(res[i].mShader, "text/x-glsl");
                    }
                    this.mActiveDoc = 0;
                    this.mCodeEditor.swapDoc(this.mDocs[this.mActiveDoc]);
                    this.setChars();
                    this.setFlags();
                    this.mCodeEditor.clearHistory();
                    this.setErrors(res[this.mActiveDoc].mError, true);
                    this.setPasses(res);
                    this.ResetTime();
                    this.mInfo = jsn.info;
                    return {
                        mSuccess: true,
                        mFailed: res.mFailed,
                        mDate: jsn.info.date,
                        mViewed: jsn.info.viewed,
                        mName: jsn.info.name,
                        mUserName: jsn.info.username,
                        mDescription: jsn.info.description,
                        mLikes: jsn.info.likes,
                        mPublished: jsn.info.published,
                        mHasLiked: jsn.info.hasliked,
                        mTags: jsn.info.tags
                    };
                }
                catch (e) {
                    console.log(e);
                    return { mSuccess: false };
                }
            };
            ShaderToy.prototype.refreshTexturThumbail = function (myself, slot, img, forceFrame, gui, guiID, time, passID) {
                if (passID != myself.mActiveDoc)
                    return;
                //var canvas: any = document.getElementById('myUnitCanvas' + slot);
                //var w = canvas.width;
                //var h = canvas.height;
                //var ctx = canvas.getContext('2d');
                //if (img == null) {
                //    ctx.fillStyle = "#000000";
                //    ctx.fillRect(0, 0, w, h);
                //    if (guiID == 2) {
                //        ctx.strokeStyle = "#808080";
                //        ctx.lineWidth = 1;
                //        ctx.beginPath();
                //        var num = w / 2;
                //        for (var i = 0; i < num; i++) {
                //            var y = Math.sin(64.0 * 6.2831 * i / num + time) * Math.sin(2.0 * 6.2831 * i / num + time);
                //            var ix = w * i / num;
                //            var iy = h * (0.5 + 0.4 * y);
                //            if (i == 0) ctx.moveTo(ix, iy);
                //            else ctx.lineTo(ix, iy);
                //        }
                //        ctx.stroke();
                //        var str = "Audio error";
                //        ctx.font = "normal bold 20px Arial";
                //        ctx.lineWidth = 4;
                //        ctx.strokeStyle = "#000000";
                //        ctx.strokeText(str, 14, h / 2);
                //        ctx.fillStyle = "#ff0000";
                //        ctx.fillText(str, 14, h / 2);
                //        var pb: any = document.getElementById("myPauseButton" + slot);
                //        pb.src = "/img/pause.png";
                //    }
                //}
                //else {
                //    if (guiID == 0 || guiID == 1 || guiID == 3) {
                //        ctx.fillStyle = "#000000";
                //        ctx.fillRect(0, 0, w, h);
                //        ctx.drawImage(img, 0, 0, w, h);
                //    }
                //    else if (guiID == 2) {
                //        ctx.fillStyle = "#000000";
                //        ctx.fillRect(0, 0, w - 24, h);
                //        ctx.fillStyle = "#ffffff";
                //        var numfft = img.length; numfft /= 2; if (numfft > 512) numfft = 512;
                //        var num = 32;
                //        var numb = (numfft / num) | 0;
                //        var s = ((w - 24 - 8 * 2) / num);
                //        var k = 0;
                //        for (var i = 0; i < num; i++) {
                //            var f = 0.0;
                //            for (var j = 0; j < numb; j++) {
                //                f += img[k++];
                //            }
                //            f /= numb;
                //            f /= 255.0;
                //            var fr = f;
                //            var fg = 4.0 * f * (1.0 - f);
                //            var fb = 1.0 - f;
                //            var rr = (255.0 * fr) | 0;
                //            var gg = (255.0 * fg) | 0;
                //            var bb = (255.0 * fb) | 0;
                //            //             ctx.fillStyle = "rgb(" + rr + "," + gg + "," + bb + ");"
                //            var decColor = 0x1000000 + bb + 0x100 * gg + 0x10000 * rr;
                //            ctx.fillStyle = '#' + decColor.toString(16).substr(1);
                //            var a = Math.max(2, f * (h - 2 * 20));
                //            ctx.fillRect(8 + i * s, h - 20 - a, 3 * s / 4, a);
                //        }
                //    }
                //    else if (guiID == 4) {
                //        /*
                //                 ctx.fillStyle = "#404040";
                //                 ctx.fillRect(0,0,w,h);
                //                 ctx.lineWidth = 2;
                //                 ctx.strokeStyle = "#ffffff";
                //                 ctx.strokeRect(w/10,3*h/10,8*w/10,5*h/10);
                //                 ctx.fillStyle = "#ffffff";
                //                 var s = (7*w/10)/(2*12);
                //                 for( var i=0; i<48; i++ )
                //                 {
                //                     var u = (i%12) | 0;
                //                     var v = (i/12) | 0;
                //                     ctx.fillRect( w/10+s+s*2*u, 3*h/10 + s + s*2*v, s, s );
                //                 }
                //          */
                //        var thereskey = false;
                //        ctx.fillStyle = "#ffffff";
                //        for (var i = 0; i < 256; i++) {
                //            var x = (w * i / 256) | 0;
                //            if (img.mData[i] > 0) {
                //                thereskey = true;
                //                //ctx.fillRect( x, 0+h/4, 1, h/2 );
                //                break;
                //            }
                //        }
                //        ctx.fillStyle = "#000000";
                //        ctx.fillRect(0, 0, w, h);
                //        ctx.drawImage(img.mImage, 0, 20, w, h - 20);
                //        if (thereskey) {
                //            ctx.fillStyle = "#ff8040";
                //            ctx.globalAlpha = 0.4;
                //            ctx.fillRect(0, 0, w, h);
                //            ctx.globalAlpha = 1.0;
                //        }
                //    }
                //}
                //ctx.font = "normal normal 12px Arial";
                //ctx.strokeStyle = "#000000";
                //ctx.fillStyle = "#000000";
                //ctx.lineWidth = 4;
                //ctx.strokeText("iChannel" + slot, 4, 14);
                //ctx.fillStyle = "#ffffff";
                //ctx.strokeStyle = "#ffffff";
                //ctx.fillText("iChannel" + slot, 4, 14);
                //if (time > 0.0) {
                //    var str = time.toFixed(2) + "s";
                //    ctx.font = "normal normal 10px Arial";
                //    ctx.strokeStyle = "#000000";
                //    ctx.lineWidth = 4;
                //    ctx.strokeText(str, 4, 96);
                //    ctx.fillStyle = "#ffffff";
                //    ctx.fillText(str, 4, 96);
                //}
                ////--------------
                //if (gui == true) {
                //    var ele: any = document.getElementById("inputSelectorControls" + slot);
                //    if (guiID == 0) ele.style.visibility = "hidden";
                //    if (guiID == 1) ele.style.visibility = "visible";
                //    if (guiID == 2) ele.style.visibility = "visible";
                //    if (guiID == 3) ele.style.visibility = "visible";
                //    if (guiID == 3) {
                //        var me = this;
                //        var ele1: any = document.getElementById("myPauseButton" + slot);
                //        ele1.src = "/img/next.png";
                //        ele1.title = "next";
                //        ele1.onclick = function (ev) { var ele = this.getSourceElement(ev); var r = me.PauseInput(ele.mId); }
                //        var ele2: any = document.getElementById("myRewindButton" + slot);
                //        ele2.src = "/img/previous.png";
                //        ele2.title = "previous";
                //        ele2.onclick = function (ev) { var ele = this.getSourceElement(ev); var r = me.RewindInput(ele.mId); }
                //        var ele3: any = document.getElementById("myMuteButton" + slot);
                //        ele3.src = "/img/rewind.png";
                //        ele3.title = "rewind";
                //        ele3.onclick = function (ev) { var ele = this.getSourceElement(ev); var r = me.MuteInput(ele.mId); }
                //    }
                //}
                //--------------
                myself.mForceFrame = forceFrame;
            };
            ShaderToy.prototype.getSourceElement = function (e) {
                var ele = null;
                if (e.target)
                    ele = e.target;
                if (e.srcElement)
                    ele = e.srcElement;
                return ele;
            };
            ShaderToy.prototype.StartRendering = function () {
                var _this = this;
                if (this.mIsRendering)
                    return;
                else
                    this.mIsRendering = true;
                //var me = this;
                var renderLoop = function () {
                    if (_this.mGLContext == null)
                        return;
                    requestAnimationFrame(renderLoop);
                    if (_this.mIsPaused && !_this.mForceFrame) {
                        _this.mEffect.UpdateInputs(_this.mActiveDoc, false);
                        return;
                    }
                    _this.mForceFrame = false;
                    var time = performance.now();
                    var ltime = _this.mTOffset + time - _this.mTo;
                    if (_this.mIsPaused)
                        ltime = _this.mTf;
                    else
                        _this.mTf = ltime;
                    _this.mEffect.Paint(ltime / 1000.0, _this.mMouseOriX, _this.mMouseOriY, _this.mMousePosX, _this.mMousePosY, _this.mIsPaused);
                    //if (me.mSendFrame) me.mLiveCreator.SendUpdate();
                    _this.mSendFrame = false;
                    _this.mFpsFrame++;
                    _this.uiData.MyTime = (ltime / 1000.0).toFixed(2);
                    _this.uiData.eMyTime.innerHTML = _this.uiData.MyTime + " seconds";
                    if ((time - _this.mFpsTo) > 1000) {
                        var ffps = 1000.0 * _this.mFpsFrame / (time - _this.mFpsTo);
                        _this.uiData.FrameRate = ffps.toFixed(1) + " fps";
                        _this.uiData.eFrameRate.innerHTML = _this.uiData.FrameRate;
                        if (_this.uiData.UpdateUI)
                            _this.uiData.UpdateUI.call(_this);
                        _this.mFpsFrame = 0;
                        _this.mFpsTo = time;
                    }
                };
                renderLoop();
            };
            ShaderToy.prototype.PlayPauseTime = function () {
                if (!this.mIsPaused) {
                    this.PauseShader();
                }
                else {
                    this.PlayShader();
                }
            };
            ShaderToy.prototype.PauseShader = function () {
                var time = performance.now();
                $("#butPauseShader").attr('value', 'play');
                this.mIsPaused = true;
                this.mEffect.StopOutputs();
            };
            ShaderToy.prototype.PlayShader = function () {
                var time = performance.now();
                $("#butPauseShader").attr('value', 'pause');
                this.mTOffset = this.mTf;
                this.mTo = time;
                this.mIsPaused = false;
                this.mEffect.ResumeOutputs();
            };
            ShaderToy.prototype.ResetTime = function () {
                this.mTOffset = 0;
                this.mTo = performance.now();
                this.mTf = 0;
                this.mFpsTo = this.mTo;
                this.mFpsFrame = 0;
                this.mForceFrame = true;
                this.mEffect.ResetTime();
            };
            ShaderToy.prototype.setChars = function () {
                var str = this.mCodeEditor.getValue();
                str = this.replaceChars(str);
                str = this.removeSingleComments(str);
                str = this.removeMultiComments(str);
                str = this.removeMultiSpaces(str);
                str = this.removeSingleSpaces(str);
                str = this.removeEmptyLines(str);
                this.uiData.ShaderCharCounter = str.length + " chars";
            };
            ShaderToy.prototype.setFlags = function () {
                if (this.mEffect == null)
                    return;
                var flags = this.mEffect.CalcFlags();
                //var eleVR = document.getElementById("myVR");
                //eleVR.style.visibility = (flags.mFlagVR == true) ? "visible" : "hidden";
            };
            ShaderToy.prototype.showChars = function () {
                var str = this.mCodeEditor.getValue();
                str = this.minify(str);
                //alert( str );
                //var ve = document.getElementById("centerScreen");
                //doAlert(getCoords(ve), { mX: 480, mY: 400 }, "Minimal Shader Code, (" + str.length + " chars)", "<pre>" + str + "</pre>", false, null);
            };
            ShaderToy.prototype.isSpace = function (str, i) {
                return (str[i] === ' ') || (str[i] === '\t');
            };
            ShaderToy.prototype.isLine = function (str, i) {
                return (str[i] === '\n');
            };
            ShaderToy.prototype.replaceChars = function (str) {
                var dst = "";
                var num = str.length;
                for (var i = 0; i < num; i++) {
                    if (str[i] === '\r')
                        continue;
                    if (str[i] === '\t') {
                        dst = dst + " ";
                        continue;
                    }
                    dst = dst + str[i];
                }
                return dst;
            };
            ShaderToy.prototype.removeEmptyLines = function (str) {
                var dst = "";
                var num = str.length;
                var isPreprocessor = false;
                for (var i = 0; i < num; i++) {
                    if (str[i] === '#')
                        isPreprocessor = true;
                    var isDestroyableChar = this.isLine(str, i);
                    if (isDestroyableChar && !isPreprocessor)
                        continue;
                    if (isDestroyableChar && isPreprocessor)
                        isPreprocessor = false;
                    dst = dst + str[i];
                }
                return dst;
            };
            ShaderToy.prototype.removeMultiSpaces = function (str) {
                var dst = "";
                var num = str.length;
                for (var i = 0; i < num; i++) {
                    if (this.isSpace(str, i) && (i === (num - 1)))
                        continue;
                    if (this.isSpace(str, i) && this.isLine(str, i - 1))
                        continue;
                    if (this.isSpace(str, i) && this.isLine(str, i + 1))
                        continue;
                    if (this.isSpace(str, i) && this.isSpace(str, i + 1))
                        continue;
                    dst = dst + str[i];
                }
                return dst;
            };
            ShaderToy.prototype.removeSingleSpaces = function (str) {
                var dst = "";
                var num = str.length;
                for (var i = 0; i < num; i++) {
                    if (i > 0) {
                        if (this.isSpace(str, i) && ((str[i - 1] === ';') ||
                            (str[i - 1] === ',') ||
                            (str[i - 1] === '}') ||
                            (str[i - 1] === '{') ||
                            (str[i - 1] === '(') ||
                            (str[i - 1] === ')') ||
                            (str[i - 1] === '+') ||
                            (str[i - 1] === '-') ||
                            (str[i - 1] === '*') ||
                            (str[i - 1] === '/') ||
                            (str[i - 1] === '?') ||
                            (str[i - 1] === '<') ||
                            (str[i - 1] === '>') ||
                            (str[i - 1] === '[') ||
                            (str[i - 1] === ']') ||
                            (str[i - 1] === ':') ||
                            (str[i - 1] === '=') ||
                            (str[i - 1] === '^') ||
                            (str[i - 1] === '\n') ||
                            (str[i - 1] === '\r')))
                            continue;
                    }
                    if (this.isSpace(str, i) && ((str[i + 1] === ';') ||
                        (str[i + 1] === ',') ||
                        (str[i + 1] === '}') ||
                        (str[i + 1] === '{') ||
                        (str[i + 1] === '(') ||
                        (str[i + 1] === ')') ||
                        (str[i + 1] === '+') ||
                        (str[i + 1] === '-') ||
                        (str[i + 1] === '*') ||
                        (str[i + 1] === '/') ||
                        (str[i + 1] === '?') ||
                        (str[i + 1] === '<') ||
                        (str[i + 1] === '>') ||
                        (str[i + 1] === '[') ||
                        (str[i + 1] === ']') ||
                        (str[i + 1] === ':') ||
                        (str[i + 1] === '=') ||
                        (str[i + 1] === '^') ||
                        (str[i + 1] === '\n') ||
                        (str[i + 1] === '\r')))
                        continue;
                    dst = dst + str[i];
                }
                return dst;
            };
            ShaderToy.prototype.removeSingleComments = function (str) {
                var dst = "";
                var num = str.length;
                var detected = false;
                for (var i = 0; i < num; i++) {
                    if (i <= (num - 2)) {
                        if (str[i] === '/' && str[i + 1] === '/')
                            detected = true;
                    }
                    if (detected && (str[i] === "\n" || str[i] === "\r"))
                        detected = false;
                    if (!detected)
                        dst = dst + str[i];
                }
                return dst;
            };
            ShaderToy.prototype.removeMultiComments = function (str) {
                var dst = "";
                var num = str.length;
                var detected = false;
                for (var i = 0; i < num; i++) {
                    if (i <= (num - 2)) {
                        if (str[i] === '/' && str[i + 1] === '*') {
                            detected = true;
                            continue;
                        }
                        if (detected && str[i] === "*" && str[i + 1] === "/") {
                            detected = false;
                            i += 2;
                            continue;
                        }
                    }
                    if (!detected)
                        dst = dst + str[i];
                }
                return dst;
            };
            ShaderToy.prototype.minify = function (str) {
                str = this.replaceChars(str);
                str = this.removeSingleComments(str);
                str = this.removeMultiComments(str);
                str = this.removeMultiSpaces(str);
                str = this.removeSingleSpaces(str);
                str = this.removeEmptyLines(str);
                return str;
            };
            ShaderToy.prototype.setErrors = function (result, fromScript) {
                //var eleWrapper = document.getElementById('editorWrapper');
                //while (this.mErrors.length > 0) {
                //    var mark = this.mErrors.pop();
                //    this.mCodeEditor.removeLineWidget(mark);
                //}
                //var eleWrapper = document.getElementById('editorWrapper');
                //if (result == null) {
                //    this.mForceFrame = true;
                //    if (fromScript == false) {
                //        eleWrapper.className = "errorNo";
                //        setTimeout(function () { eleWrapper.className = ""; }, 500);
                //    }
                //}
                //else {
                //    eleWrapper.className = "errorYes";
                //    var lineOffset = this.mEffect.GetHeaderSize(this.mActiveDoc);
                //    var lines = result.match(/^.*((\r\n|\n|\r)|$)/gm);
                //    for (var i = 0; i < lines.length; i++) {
                //        var parts = lines[i].split(":");
                //        if (parts.length === 5 || parts.length === 6) {
                //            var lineNumber = parseInt(parts[2]) - lineOffset;
                //            var msg = document.createElement("div");
                //            msg.appendChild(document.createTextNode(parts[3] + " : " + parts[4]));
                //            msg.className = "errorMessage";
                //            var mark = this.mCodeEditor.addLineWidget(lineNumber - 1, msg, { coverGutter: false, noHScroll: true });
                //            this.mErrors.push(mark);
                //        }
                //        else if (lines[i] != null && lines[i] != "" && lines[i].length > 1 && parts[0] != "Warning") {
                //            console.log(parts.length + " **" + lines[i]);
                //            var txt = "";
                //            if (parts.length == 4)
                //                txt = parts[2] + " : " + parts[3];
                //            else
                //                txt = "Unknown error";
                //            var msg = document.createElement("div");
                //            msg.appendChild(document.createTextNode(txt));
                //            msg.className = "errorMessage";
                //            var mark = this.mCodeEditor.addLineWidget(0, msg, { coverGutter: false, noHScroll: true, above: true });
                //            this.mErrors.push(mark);
                //        }
                //    }
                //}
            };
            ShaderToy.prototype.setPasses = function (passes) {
                //for (var i = 0; i < passes.length; i++)
                //    this.AddTab(passes[i].mType, i, i == 0);
                //this.AddPlusTab();
            };
            ShaderToy.prototype.SetShaderFromEditor = function () {
                var shaderCode = this.mCodeEditor.getValue();
                var result = this.mEffect.NewShader(shaderCode, this.mActiveDoc);
                if (result == null) {
                    this.mForceFrame = true;
                    this.mSendFrame = true;
                }
                this.setChars();
                this.setFlags();
                return this.setErrors(result, false);
            };
            //gShaderToy.SetTexture(gCurrentEditingSlot, {mType:'texture', mID:28, mSrc:'/presets/tex15.png'})
            ShaderToy.prototype.SetTexture = function (slot, url) {
                this.mEffect.NewTexture(this.mActiveDoc, slot, url);
            };
            return ShaderToy;
        })();
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dShaderToy", ShaderToyDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=shaderToy.js.map