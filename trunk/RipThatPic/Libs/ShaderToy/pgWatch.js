function LiveCreator(username, shadertoy) {
    this.mEnabled = false;

    if (username == null) return;

    this.mShadertoy = shadertoy;
    this.mSocket = null;
    this.mState = 0;
    this.mUserName = username + (Math.floor(Math.random() * 1000000.0) | 0).toString();
    this.mChannel = 'Global';
    this.mUpdateInterval = 5000;
    this.mEnabled = true;
}

LiveCreator.prototype.Start = function () {
    this.mState = 0;

    try {
        this.mSocket = new WebSocket('wss://shadertoy.herokuapp.com');
        //this.mSocket = new WebSocket('ws://192.168.1.121:5000');
    }
    catch (e) {
        return;
    }

    var me = this;
    this.mSocket.onopen = function () {
        if (me.mSocket.readyState != 1)
            return false;

        //console.log( '1. Socket connected. Sending identification (' + me.mUserName + ')' );

        me.mState = 1;
        lSend(me.mSocket, 'GLOBAL_ID', { userName: me.mUserName, channel: me.mChannel, userType: 'CREATOR' });
    }

    this.mSocket.onmessage = function (message) {
        var obj = null;
        try {
            obj = JSON.parse(message.data);
        }
        catch (e) {
            console.error('Message Discarded: Invalid JSON - ' + e);
            return;
        }

        //------

        if (obj.id === 'GLOBAL_IDENTIFIED') {
            //console.log( "2. We are identified. Setting creator state. Enter in loop mode" );
            me.mState = 2;
            lSend('CREATOR_STATE', '1'); // 1=broadcasting ON
            me.mState = 3;

            me.SendUpdate();

            me.StartHeartBeat();
            me.StartLiveCoding();

        }
        else if (obj.id === 'GLOBAL_NUM_VIEWERS') {
            var eleT = document.getElementById("numViewers");
            if (eleT == null) return;
            if (me.mState == 3)
                eleT.innerHTML = obj.data + ' viewers';
        }
        else {
            console.error('Message Discarded - ' + obj.id);
        }
    };

    this.mSocket.onerror = function (error) {
        //console.log( 'Socket error : ', error );
    };

    this.mSocket.onclose = function (error) {
        //console.log( 'Socket disconnected' );
        me.mState = 0;
        me.mShadertoy.UIBroadcastOff();
    };
}

LiveCreator.prototype.Stop = function () {
    if (this.mSocket == null) return;

    this.mState = 0;
    this.mSocket.close();
    this.mSocket = null;
    //console.log( '0. Stoped Broadcast' );
}

LiveCreator.prototype.SendUpdate = function () {
    if (this.mState != 3) return;

    //console.log( "Sending Shader" );

    var dataJSON = gShaderToy.exportToJSON();
    dataJSON.info.username = gUserName;
    var canvas = document.getElementById("demogl");
    var dataURL = canvas.toDataURL("image/jpeg");
    lSend(this.mSocket, 'CREATOR_SHADER', { code: dataJSON, image: dataURL });
}

LiveCreator.prototype.StartHeartBeat = function () {
    var me = this;

    function heartBeat() {
        if (me.mState != 3) return;

        lSend(me.mSocket, 'REQUEST_GLOBAL_NUM_VIEWERS');

        window.setTimeout(heartBeat, 5000);
    }

    heartBeat();
}

LiveCreator.prototype.StartLiveCoding = function () {
    var me = this;

    function liveCodingLoop() {
        if (me.mState != 3) return;

        var state = me.mShadertoy.GetEditorState();

        var thereAreChanges = state.mChanges;
        if (thereAreChanges) {
            lSend(me.mSocket, 'CREATOR_EDITOR_STATE', { mCursor: state.mCursor, mCode: state.mCode, mViewport: state.mViewport });
        }

        me.mShadertoy.ResetEditorState();

        if (thereAreChanges)
            window.setTimeout(liveCodingLoop, 1000);
        else
            window.setTimeout(liveCodingLoop, 4000);


        /*
        var thereAreChanges = (state.mState.mCursorChange==true) || (state.mState.mCodeChange==true) || (state.mState.mViewportChange==true);

        if( thereAreChanges )
        {
            //console.log( "Enviando" );
	        lSend( me.mSocket, 'CREATOR_EDITOR_STATE', state );
        }

        console.log(state.mState);
        me.mShadertoy.ResetEditorState();

        if( thereAreChanges )
           window.setTimeout( liveCodingLoop, 1000 );
        else
           window.setTimeout( liveCodingLoop, 5000 );
        */
    }

    liveCodingLoop();
}


//-----------------

function buildInputsUI(me) {
    var ww = 158;
    var hh = 100;
    var ss = 22;

    me.mMarks = null;

    for (var i = 0; i < 4; i++) {
        var par = document.getElementById("texture" + i);
        par.mId = i;

        ww = par.offsetWidth;
        hh = par.offsetHeight;

        par.onmouseover = function (ev) {
            var ele = getSourceElement(ev);
            var pattern = "iChannel" + ele.mId;

            me.mMarks = new Array();
            var cm = me.mCodeEditor;
            var num = cm.lineCount();
            for (var j = 0; j < num; j++) {
                var str = cm.getLine(j);
                var res = str.indexOf(pattern);
                if (res < 0) continue;
                cm.addLineClass(j, "background", "cm-highlight");
                me.mMarks.push(j);
            }
        }

        par.onmouseout = function (ev) {
            var cm = me.mCodeEditor;
            if (me.mMarks == null) return;
            var num = me.mMarks.length;
            for (var j = 0; j < num; j++) {
                var l = me.mMarks.pop();
                cm.removeLineClass(l, "background", "cm-highlight");
            }
            me.mMarks = null;
        }

        var can = document.createElement("canvas");
        can.width = ww;
        can.height = hh;
        can.style.width = "100%";//ww + "px";
        can.style.height = "100%";//hh + "px";
        can.style.left = "0px";
        can.style.bottom = "0px";
        can.style.position = "absolute";
        can.className = "inputSelectorCanvas";
        can.id = "myUnitCanvas" + i;
        can.mId = i;
        can.onclick = function (ev) {
            var passType = me.mEffect.GetPassType(me.mActiveDoc);
            overlay(getSourceElement(ev).mId, passType);
        }
        par.appendChild(can);


        var bar = document.createElement("div");
        bar.style.width = "24px";
        bar.style.height = hh + "px";
        bar.style.position = "absolute";
        bar.className = "inputSelectorControls";
        bar.id = "inputSelectorControls" + i;
        par.appendChild(bar);


        var z = document.createElement("img");
        z.src = "/img/pause.png";
        z.title = "pause/resume";
        z.id = "myPauseButton" + i;
        z.style.left = "1px";
        z.style.top = "10px";
        z.className = "uiButton";
        z.mId = i;
        z.onclick = function (ev) { var ele = getSourceElement(ev); var r = me.PauseInput(ele.mId); if (r === true) ele.src = "/img/play.png"; else ele.src = "/img/pause.png"; }
        bar.appendChild(z);


        z = document.createElement("img");
        z.src = "/img/rewind.png";
        z.title = "rewind";
        z.id = "myRewindButton" + i;
        z.style.left = "1px";
        z.style.top = "40px";
        z.className = "uiButton";
        z.mId = i;
        z.onclick = function (ev) { var ele = getSourceElement(ev); var r = me.RewindInput(ele.mId); }
        bar.appendChild(z);

        z = document.createElement("img");
        z.src = "/img/speakerOn.png";
        z.title = "mute";
        z.id = "myMuteButton" + i;
        z.style.left = "1px";
        z.style.top = "70px";
        z.className = "uiButton";
        z.mId = i;
        z.onclick = function (ev) { var ele = getSourceElement(ev); var r = me.MuteInput(ele.mId); if (r === true) ele.src = "/img/speakerOff.png"; else ele.src = "/img/speakerOn.png"; }
        bar.appendChild(z);

    }
}


function ShaderToy(parentElement, editorParent, passParent, username) {
    if (parentElement == null) return;
    if (editorParent == null) return;
    if (passParent == null) return;

    this.mPassParent = passParent

    this.mNeedsSave = false;
    this.mAudioContext = null;
    this.mCreated = false;
    this.mGLContext = null;
    this.mHttpReq = null;
    this.mEffect = null;
    this.mTo = null;
    this.mTOffset = 0;
    this.mCanvas = null;
    this.mFpsFrame = 0;
    this.mFpsTo = null;
    this.mIsPaused = false;
    this.mForceFrame = false;
    this.mSendFrame = false;
    this.mInfo = null;
    this.mCharCounter = document.getElementById("numCharacters");
    this.mDocs = {};
    this.mActiveDoc = 0;
    this.mIsEditorFullScreen = false;
    this.mFontSize = 0;
    this.mLiveCreator = new LiveCreator(username, this);
    this.mVR = null;

    buildInputsUI(this);

    this.mCanvas = document.getElementById("demogl");
    this.mCanvas.tabIndex = "0"; // make it react to keyboard
    this.mCanvas.width = this.mCanvas.offsetWidth;
    this.mCanvas.height = this.mCanvas.offsetHeight;


    this.mHttpReq = createHttpReques();
    this.mTo = (new Date()).getTime();
    this.mTf = 0;
    this.mFpsTo = this.mTo;
    this.mMouseIsDown = false;
    this.mMouseOriX = 0;
    this.mMouseOriY = 0;
    this.mMousePosX = 0;
    this.mMousePosY = 0;

    // --- rendering context ---------------------

    this.mGLContext = createGlContext(this.mCanvas, false, true);
    if (this.mGLContext == null) {
        createNoWebGLMessage(parentElement, this.mCanvas);
        this.mIsPaused = true;
        this.mForceFrame = false;
    }


    // --- audio context ---------------------

    try {
        if (window.AudioContext) this.mAudioContext = new AudioContext();
        if (this.mAudioContext == null && window.webkitAudioContext) this.mAudioContext = new webkitAudioContext();

    }
    catch (e) {
        this.mAudioContext = null;
    }

    if (this.mAudioContext == null) {
        //alert( "no audio!" );
    }

    // --- vr susbsystem ---------------------

    this.mVR = new WebVR(function (b) {
        var ele = document.getElementById("myVR");
        if (b)
            ele.style.background = "url('/img/vrOn.png')";
        else
            ele.style.background = "url('/img/vrOff.png')";
    },
                          this.mCanvas);

    var me = this;

    window.onfocus = function () {
        if (!this.mIsPaused) {
            me.mTOffset = me.mTf;
            me.mTo = performance.now();
        }
    };

    var refreshCharsAndFlags = function () {
        me.setChars();
        //me.setFlags();
        setTimeout(refreshCharsAndFlags, 1500);
    }
    // ---------------
    this.mEditorState = { mCursorChange: false, mViewportChange: false, mCodeChange: false };

    this.mErrors = new Array();
    this.mCodeEditor = CodeMirror(editorParent,
                                   {
                                       lineNumbers: true,
                                       matchBrackets: true,
                                       indentWithTabs: false,
                                       tabSize: 4,
                                       indentUnit: 4,
                                       mode: "text/x-glsl",
                                       foldGutter: true,
                                       gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                                       extraKeys: {
                                           "Ctrl-S": function (instance) { doSaveShader(); me.mNeedsSave = false; },
                                           "Alt-Enter": function (instance) { me.SetShaderFromEditor(); },
                                           "Alt--": function (instance) { me.decreaseFontSize(); },
                                           "Alt-=": function (instance) { me.increaseFontSize(); },
                                           "Alt-F": function (instance) { me.changeEditorFullScreen(); }
                                       }
                                   });
    this.mCodeEditor.on("change", function (instance, ev) { me.mEditorState.mCodeChange = true; me.mNeedsSave = true; });
    this.mCodeEditor.on("cursorActivity", function (instance) { me.mEditorState.mCursorChange = true; });
    this.mCodeEditor.on("viewportChange", function (instance, eFrom, eTo) { me.mEditorState.mViewportChange = true; });

    //--------------

    refreshCharsAndFlags(this);


    this.mCanvas.onmousedown = function (ev) {
        var pos = getCoords(me.mCanvas);
        me.mMouseOriX = (ev.pageX - pos.mX) * me.mCanvas.width / me.mCanvas.offsetWidth;
        me.mMouseOriY = me.mCanvas.height - (ev.pageY - pos.mY) * me.mCanvas.height / me.mCanvas.offsetHeight;
        me.mMousePosX = me.mMouseOriX;
        me.mMousePosY = me.mMouseOriY;
        me.mForceFrame = true;
        me.mMouseIsDown = true;
        //        return false; // prevent mouse pointer change
    }
    this.mCanvas.onmousemove = function (ev) {
        if (me.mMouseIsDown) {
            var pos = getCoords(me.mCanvas);
            me.mMousePosX = (ev.pageX - pos.mX) * me.mCanvas.width / me.mCanvas.offsetWidth;
            me.mMousePosY = me.mCanvas.height - (ev.pageY - pos.mY) * me.mCanvas.height / me.mCanvas.offsetHeight;
            me.mForceFrame = true;
        }
    }


    this.mCanvas.onmouseup = function (ev) {
        me.mMouseIsDown = false;
        me.mForceFrame = true;
        me.mMouseOriX = -Math.abs(me.mMouseOriX);
        me.mMouseOriY = -Math.abs(me.mMouseOriY);
    }

    this.mCanvas.onkeydown = function (ev) {
        me.mEffect.SetKeyDown(me.mActiveDoc, ev.keyCode);
    }
    this.mCanvas.onkeyup = function (ev) {
        me.mEffect.SetKeyUp(me.mActiveDoc, ev.keyCode);
    }

    document.getElementById("myResetButton").onclick = function (ev) {
        me.resetTime();
    }
    document.getElementById("myPauseButton").onclick = function (ev) {
        me.pauseTime();
    }
    document.getElementById("myVolume").onclick = function (ev) {
        var res = me.mEffect.ToggleVolume();
        if (res)
            this.style.background = "url('/img/speakerOff.png')";
        else
            this.style.background = "url('/img/speakerOn.png')";
    }

    document.getElementById("myVR").onclick = function (ev) {
        var vr = me.mVR.IsSupported();
        if (!vr) {
            alert("VR is not supported in this browser");
        }
        else {
            me.mEffect.EnableVR();
        }
    }

    var mFullScreenExitHandler = function () {
        if (IsFullScreen()) {
        }
        else {
            if (me.mVR.IsSupported()) {
                me.mEffect.DisableVR();
            }
        }
    };
    this.mCanvas.addEventListener('webkitfullscreenchange', mFullScreenExitHandler, false);
    this.mCanvas.addEventListener('mozfullscreenchange', mFullScreenExitHandler, false);
    this.mCanvas.addEventListener('fullscreenchange', mFullScreenExitHandler, false);
    this.mCanvas.addEventListener('MSFullscreenChange', mFullScreenExitHandler, false);

    this.mCanvas.ondblclick = function (ev) {
        if (IsFullScreen() == false)
            RequestFullScreen(me.mCanvas);
        else
            exitFullScreen();
    }

    document.getElementById("myFullScreen").onclick = function (ev) {
        RequestFullScreen(me.mCanvas);
    }

    //-------------------------

    this.mEffect = new Effect(this.mVR, this.mAudioContext, this.mGLContext, this.mCanvas.width, this.mCanvas.height, this.RefreshTexturThumbail, this, false, false);
    this.mCreated = true;
}

ShaderToy.prototype.setFontSize = function (id) {
    if (id < 0) id = 0;
    if (id > 3) id = 3;

    this.mFontSize = id;
    var edi = document.getElementById("editor");
    edi.style.fontSize = (100 + id * 35) + '%';
    this.mCodeEditor.refresh();
}

ShaderToy.prototype.decreaseFontSize = function () {
    this.setFontSize(this.mFontSize - 1);

    var ele = document.getElementById("uiFontSelector");
    ele.selectedIndex = this.mFontSize;
}

ShaderToy.prototype.increaseFontSize = function () {
    this.setFontSize(this.mFontSize + 1);

    var ele = document.getElementById("uiFontSelector");
    ele.selectedIndex = this.mFontSize;
}


ShaderToy.prototype.ResetEditorState = function () {
    this.mEditorState.mCursorChange = false;
    this.mEditorState.mCodeChange = false;
    this.mEditorState.mViewportChange = false;
}

ShaderToy.prototype.GetEditorState = function () {
    if (this.mEditorState.mCursorChange || this.mEditorState.mCodeChange)
        //         return { mChanges:true, mCursor:this.mCodeEditor.getCursor(), mCode:this.mCodeEditor.getValue(), mViewport:this.mCodeEditor.getViewport() };

        return { mChanges: true, mCursor: this.mCodeEditor.getCursor(), mCode: this.mCodeEditor.getValue(), mViewport: this.mCodeEditor.getScrollInfo() };
    else
        return { mChanges: false };

    //iqiq
    /*
         var cur = (this.mEditorState.mCursorChange   == true) ? this.mCodeEditor.getCursor() : null;
         var cod = (this.mEditorState.mCodeChange     == true) ? this.mCodeEditor.getValue() : null;
         var vie = (this.mEditorState.mViewportChange == true) ? null : null;
    
         var res = { mState: this.mEditorState, mCursor:cur, mCode:cod, mSelection:null };
    
         return res;
    */

}

ShaderToy.prototype.changeEditorFullScreen = function () {
    this.mIsEditorFullScreen = !this.mIsEditorFullScreen;

    var con = document.getElementById("content");
    var ele = document.getElementById("editorWrapper");
    var lef = document.getElementById("leftColumn");
    var rig = document.getElementById("rightColumn");

    if (this.mIsEditorFullScreen) {
        lef.style.visibility = "hidden";
        rig.style.visibility = "hidden";

        rig.removeChild(ele);
        con.appendChild(ele);

        ele.className = "yesFullScreen";
    }
    else {
        lef.style.visibility = "visible";
        rig.style.visibility = "visible";

        con.removeChild(ele);
        rig.appendChild(ele);

        ele.className = "noFullScreen";
    }
    this.mCodeEditor.focus();
}

ShaderToy.prototype.GetNeedSave = function () {
    return this.mNeedsSave;
}
ShaderToy.prototype.SetNeedSave = function (v) {
    this.mNeedsSave = v;
}

ShaderToy.prototype.startRendering = function () {
    var me = this;

    function renderLoop2() {
        if (me.mGLContext == null) return;

        requestAnimFrame(renderLoop2);

        if (me.mIsPaused && !me.mForceFrame) {
            me.mEffect.UpdateInputs(me.mActiveDoc, false);
            return;
        }

        me.mForceFrame = false;
        var time = performance.now();
        var ltime = me.mTOffset + time - me.mTo;

        if (me.mIsPaused) ltime = me.mTf; else me.mTf = ltime;

        me.mEffect.Paint(ltime / 1000.0, me.mMouseOriX, me.mMouseOriY, me.mMousePosX, me.mMousePosY, me.mIsPaused);

        if (me.mSendFrame)
            me.mLiveCreator.SendUpdate();
        me.mSendFrame = false;


        me.mFpsFrame++;

        document.getElementById("myTime").innerHTML = (ltime / 1000.0).toFixed(2);
        if ((time - me.mFpsTo) > 1000) {
            var ffps = 1000.0 * me.mFpsFrame / (time - me.mFpsTo);
            document.getElementById("myFramerate").innerHTML = ffps.toFixed(1) + " fps";
            me.mFpsFrame = 0;
            me.mFpsTo = time;
        }

    }

    renderLoop2();
}

ShaderToy.prototype.resize = function (xres, yres) {
    this.mCanvas.setAttribute("width", xres);
    this.mCanvas.setAttribute("height", yres);
    this.mCanvas.width = xres;
    this.mCanvas.height = yres;

    this.mEffect.SetSize(xres, yres);
    this.mForceFrame = true;
}

//---------------------------------


ShaderToy.prototype.pauseTime = function () {
    var time = performance.now();
    if (!this.mIsPaused) {
        document.getElementById("myPauseButton").style.background = "url('/img/play.png')";
        this.mIsPaused = true;
        this.mEffect.StopOutputs();
    }
    else {
        document.getElementById("myPauseButton").style.background = "url('/img/pause.png')";
        this.mTOffset = this.mTf;
        this.mTo = time;
        this.mIsPaused = false;
        this.mEffect.ResumeOutputs();
    }
}

ShaderToy.prototype.resetTime = function () {
    this.mTOffset = 0;
    this.mTo = performance.now();
    this.mTf = 0;
    this.mFpsTo = this.mTo;
    this.mFpsFrame = 0;
    this.mForceFrame = true;
    this.mEffect.ResetTime();
}


ShaderToy.prototype.SetErrors = function (result, fromScript) {
    var eleWrapper = document.getElementById('editorWrapper');

    while (this.mErrors.length > 0) {
        var mark = this.mErrors.pop();
        this.mCodeEditor.removeLineWidget(mark);
    }

    var eleWrapper = document.getElementById('editorWrapper');

    if (result == null) {
        this.mForceFrame = true;
        if (fromScript == false) {
            eleWrapper.className = "errorNo";
            setTimeout(function () { eleWrapper.className = ""; }, 500);
        }
    }
    else {
        eleWrapper.className = "errorYes";

        var lineOffset = this.mEffect.GetHeaderSize(this.mActiveDoc);
        var lines = result.match(/^.*((\r\n|\n|\r)|$)/gm);
        for (var i = 0; i < lines.length; i++) {
            var parts = lines[i].split(":");
            if (parts.length === 5 || parts.length === 6) {
                var lineNumber = parseInt(parts[2]) - lineOffset;
                var msg = document.createElement("div");
                msg.appendChild(document.createTextNode(parts[3] + " : " + parts[4]));
                msg.className = "errorMessage";
                var mark = this.mCodeEditor.addLineWidget(lineNumber - 1, msg, { coverGutter: false, noHScroll: true });

                this.mErrors.push(mark);
            }
            else if (lines[i] != null && lines[i] != "" && lines[i].length > 1 && parts[0] != "Warning") {
                console.log(parts.length + " **" + lines[i]);

                var txt = "";
                if (parts.length == 4)
                    txt = parts[2] + " : " + parts[3];
                else
                    txt = "Unknown error";

                var msg = document.createElement("div");
                msg.appendChild(document.createTextNode(txt));
                msg.className = "errorMessage";
                var mark = this.mCodeEditor.addLineWidget(0, msg, { coverGutter: false, noHScroll: true, above: true });
                this.mErrors.push(mark);

            }
        }
    }
}

ShaderToy.prototype.PauseInput = function (id) {
    return this.mEffect.PauseInput(this.mActiveDoc, id);
}

ShaderToy.prototype.MuteInput = function (id) {
    return this.mEffect.MuteInput(this.mActiveDoc, id);
}

ShaderToy.prototype.RewindInput = function (id) {
    this.mEffect.RewindInput(this.mActiveDoc, id);
}

ShaderToy.prototype.SetTexture = function (slot, url) {
    this.mEffect.NewTexture(this.mActiveDoc, slot, url);
}


ShaderToy.prototype.SetShaderFromEditor = function () {
    var shaderCode = this.mCodeEditor.getValue();

    var result = this.mEffect.NewShader(shaderCode, this.mActiveDoc);
    if (result == null) {
        this.mForceFrame = true;
        this.mSendFrame = true;
    }

    this.setChars();
    this.setFlags();

    return this.SetErrors(result, false);
}


ShaderToy.prototype.RefreshTexturThumbail = function (myself, slot, img, forceFrame, gui, guiID, time, passID) {
    if (passID != myself.mActiveDoc) return;

    var canvas = document.getElementById('myUnitCanvas' + slot);

    var w = canvas.width;
    var h = canvas.height;

    var ctx = canvas.getContext('2d');
    if (img == null) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        if (guiID == 2) {
            ctx.strokeStyle = "#808080";
            ctx.lineWidth = 1;
            ctx.beginPath();
            var num = w / 2;
            for (var i = 0; i < num; i++) {
                var y = Math.sin(64.0 * 6.2831 * i / num + time) * Math.sin(2.0 * 6.2831 * i / num + time);
                var ix = w * i / num;
                var iy = h * (0.5 + 0.4 * y);
                if (i == 0) ctx.moveTo(ix, iy);
                else ctx.lineTo(ix, iy);
            }
            ctx.stroke();

            var str = "Audio error";
            ctx.font = "normal bold 20px Arial";
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#000000";
            ctx.strokeText(str, 14, h / 2);
            ctx.fillStyle = "#ff0000";
            ctx.fillText(str, 14, h / 2);

            document.getElementById("myPauseButton" + slot).src = "/img/pause.png";
        }
    }
    else {
        if (guiID == 0 || guiID == 1 || guiID == 3) {
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
        }
        else if (guiID == 2) {
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, w - 24, h);

            ctx.fillStyle = "#ffffff";

            var numfft = img.length; numfft /= 2; if (numfft > 512) numfft = 512;
            var num = 32;
            var numb = (numfft / num) | 0;
            var s = ((w - 24 - 8 * 2) / num);
            var k = 0;
            for (var i = 0; i < num; i++) {
                var f = 0.0;
                for (var j = 0; j < numb; j++) {
                    f += img[k++];
                }
                f /= numb;
                f /= 255.0;

                var fr = f;
                var fg = 4.0 * f * (1.0 - f);
                var fb = 1.0 - f;

                var rr = (255.0 * fr) | 0;
                var gg = (255.0 * fg) | 0;
                var bb = (255.0 * fb) | 0;
                //             ctx.fillStyle = "rgb(" + rr + "," + gg + "," + bb + ");"

                var decColor = 0x1000000 + bb + 0x100 * gg + 0x10000 * rr;
                ctx.fillStyle = '#' + decColor.toString(16).substr(1);


                var a = Math.max(2, f * (h - 2 * 20));
                ctx.fillRect(8 + i * s, h - 20 - a, 3 * s / 4, a);
            }
        }
        else if (guiID == 4) {
            /*
                     ctx.fillStyle = "#404040";
                     ctx.fillRect(0,0,w,h);
                     ctx.lineWidth = 2;
                     ctx.strokeStyle = "#ffffff";
                     ctx.strokeRect(w/10,3*h/10,8*w/10,5*h/10);
                     ctx.fillStyle = "#ffffff";
                     var s = (7*w/10)/(2*12);
                     for( var i=0; i<48; i++ )
                     {
                         var u = (i%12) | 0;
                         var v = (i/12) | 0;
                         ctx.fillRect( w/10+s+s*2*u, 3*h/10 + s + s*2*v, s, s );
                     }
              */
            var thereskey = false;
            ctx.fillStyle = "#ffffff";
            for (var i = 0; i < 256; i++) {
                var x = (w * i / 256) | 0;
                if (img.mData[i] > 0) {
                    thereskey = true;
                    //ctx.fillRect( x, 0+h/4, 1, h/2 );
                    break;
                }
            }


            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, w, h);

            ctx.drawImage(img.mImage, 0, 20, w, h - 20);

            if (thereskey) {
                ctx.fillStyle = "#ff8040";
                ctx.globalAlpha = 0.4;
                ctx.fillRect(0, 0, w, h);
                ctx.globalAlpha = 1.0;
            }

        }

    }

    ctx.font = "normal normal 12px Arial";
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.lineWidth = 4;
    ctx.strokeText("iChannel" + slot, 4, 14);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    ctx.fillText("iChannel" + slot, 4, 14);

    if (time > 0.0) {
        var str = time.toFixed(2) + "s";
        ctx.font = "normal normal 10px Arial";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 4;
        ctx.strokeText(str, 4, 96);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(str, 4, 96);
    }

    //--------------

    if (gui == true) {
        var ele = document.getElementById("inputSelectorControls" + slot);

        if (guiID == 0) ele.style.visibility = "hidden";
        if (guiID == 1) ele.style.visibility = "visible";
        if (guiID == 2) ele.style.visibility = "visible";
        if (guiID == 3) ele.style.visibility = "visible";

        if (guiID == 3) {
            var me = this;

            var ele1 = document.getElementById("myPauseButton" + slot);
            ele1.src = "/img/next.png";
            ele1.title = "next";
            ele1.onclick = function (ev) { var ele = getSourceElement(ev); var r = me.PauseInput(ele.mId); }


            var ele2 = document.getElementById("myRewindButton" + slot);
            ele2.src = "/img/previous.png";
            ele2.title = "previous";
            ele2.onclick = function (ev) { var ele = getSourceElement(ev); var r = me.RewindInput(ele.mId); }

            var ele3 = document.getElementById("myMuteButton" + slot);
            ele3.src = "/img/rewind.png";
            ele3.title = "rewind";
            ele3.onclick = function (ev) { var ele = getSourceElement(ev); var r = me.MuteInput(ele.mId); }
        }

    }

    //--------------

    myself.mForceFrame = forceFrame;
}


ShaderToy.prototype.setChars = function () {
    var str = this.mCodeEditor.getValue();

    str = replaceChars(str);
    str = removeSingleComments(str);
    str = removeMultiComments(str);
    str = removeMultiSpaces(str);
    str = removeSingleSpaces(str);
    str = removeEmptyLines(str);

    this.mCharCounter.innerHTML = str.length + " chars";
}

ShaderToy.prototype.setFlags = function () {
    if (this.mEffect == null) return;

    var flags = this.mEffect.calcFlags();

    var eleVR = document.getElementById("myVR");
    eleVR.style.visibility = (flags.mFlagVR == true) ? "visible" : "hidden";
}


ShaderToy.prototype.showChars = function () {
    var str = this.mCodeEditor.getValue();

    str = minify(str);

    //alert( str );
    var ve = document.getElementById("centerScreen");
    doAlert(getCoords(ve), { mX: 480, mY: 400 }, "Minimal Shader Code, (" + str.length + " chars)", "<pre>" + str + "</pre>", false, null);
}


ShaderToy.prototype.ChangePass = function (id) {
    this.mActiveDoc = id;
    this.mCodeEditor.swapDoc(this.mDocs[id]);
    this.setChars();
    this.mEffect.UpdateInputs(id, true);

    //this.SetErrors( res[0].mError, true );
    var num = 2;
    for (var i = 0; i < num; i++) {
        var eleLab = document.getElementById("tab" + i);
        if (eleLab == null) break;
        if (i == id)
            eleLab.className = "tab selected";
        else
            eleLab.className = "tab";
    }
}

ShaderToy.prototype.KillPass = function (id) {
    this.mEffect.DestroyPass(id);

    var eleLab = document.getElementById("tab" + id);
    this.mPassParent.removeChild(eleLab);
    this.AddPlusTab();

    if (id == this.mActiveDoc) {
        this.ChangePass((id - 1 < 0) ? 0 : id - 1);
    }
}

ShaderToy.prototype.AddPass = function () {
    var res = this.mEffect.AddPass("sound");
    var id = res.mId;

    if (this.mEffect.GetNumPasses() > 1) {
        var eleLab = document.getElementById("tabAdd");
        if (eleLab != null)
            this.mPassParent.removeChild(eleLab);
    }

    this.AddTab("sound", id, true);

    this.mDocs[id] = CodeMirror.Doc(res.mShader, "text/x-glsl");

    this.ChangePass(id);
    /*
    
        //-------
        this.mActiveDoc = id;
    
        this.mCodeEditor.swapDoc( this.mDocs[this.mActiveDoc] );
        this.setChars();
        this.mCodeEditor.clearHistory()
        this.SetErrors( res.mError, true );
      */
}

//-------------------------

ShaderToy.prototype.AddPlusTab = function (passes) {
    var me = this;
    var num = this.mEffect.GetNumPasses();

    if (num > 1) {
        var eleLab = document.getElementById("tabAdd");
        if (eleLab != null)
            this.mPassParent.removeChild(eleLab);
    }
    else {
        var eleTab = document.createElement("div");
        eleTab.id = "tabAdd";
        eleTab.className = "tabAdd";
        eleTab.onclick = function (ev) { me.AddPass(); ev.stopPropagation(); }

        var eleImg = document.createElement("img");
        eleImg.className = "tabImage";
        eleImg.src = "/img/add.png";
        eleTab.appendChild(eleImg);

        this.mPassParent.appendChild(eleTab);
    }
}

ShaderToy.prototype.AddTab = function (passType, id, isSelected) {
    var me = this;

    var eleTab = document.createElement("div");
    eleTab.mNum = id;
    eleTab.onclick = function (ev) { me.ChangePass(this.mNum); }
    eleTab.id = "tab" + id;
    eleTab.className = "tab";
    if (isSelected)
        eleTab.className = "tab selected";

    var eleImg = document.createElement("img");
    eleImg.className = "tabImage";
    if (passType == "sound") eleImg.src = "/img/music.png";
    if (passType == "image") eleImg.src = "/img/image.png";
    eleTab.appendChild(eleImg);

    var eleLab = document.createElement("label");
    eleLab.textContent = passType;
    if (passType == "image") eleLab.textContent = "Image";
    if (passType == "sound") eleLab.textContent = "Sound";
    eleTab.appendChild(eleLab);

    if (id > 0) {
        eleImg = document.createElement("img");
        eleImg.src = "/img/closeSmall.png";
        eleImg.className = "tabClose";
        eleImg.mNum = id;
        eleImg.onclick = function (ev) { me.KillPass(this.mNum); ev.stopPropagation(); }
        eleTab.appendChild(eleImg);
    }

    this.mPassParent.appendChild(eleTab);
}


ShaderToy.prototype.SetPasses = function (passes) {
    for (var i = 0; i < passes.length; i++)
        this.AddTab(passes[i].mType, i, i == 0);
    this.AddPlusTab();
}

ShaderToy.prototype.newScriptJSON = function (jsn) {
    try {
        var res = this.mEffect.newScriptJSON(jsn);

        var num = res.length;
        for (var i = 0; i < num; i++) {
            this.mDocs[i] = CodeMirror.Doc(res[i].mShader, "text/x-glsl");
        }

        this.mActiveDoc = 0;

        this.mCodeEditor.swapDoc(this.mDocs[this.mActiveDoc]);
        this.setChars();
        this.setFlags();
        this.mCodeEditor.clearHistory()
        this.SetErrors(res[this.mActiveDoc].mError, true);

        this.SetPasses(res);
        this.resetTime();

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

}

ShaderToy.prototype.exportToJSON = function () {
    var res = this.mEffect.exportToJSON();

    if (this.mNeedsSave) {
        for (var i = 0; i < res.renderpass.length; i++)
            res.renderpass[i].code = this.mDocs[i].getValue();
    }

    res.info = this.mInfo;

    return res;
}

ShaderToy.prototype.ToggleBroadcast = function () {
    if (!this.mLiveCreator.mEnabled) return;

    var eleB = document.getElementById("broadcastButton");
    if (eleB == null) return;

    var eleT = document.getElementById("numViewers");

    if (this.mLiveCreator.mState == 0) {
        this.UIBroadcastOn();
        this.mLiveCreator.Start();
    }
    else {
        this.UIBroadcastOff();
        this.mLiveCreator.Stop();
    }
}

ShaderToy.prototype.UIBroadcastOn = function () {
    var eleB = document.getElementById("broadcastButton");
    var eleT = document.getElementById("numViewers");

    eleB.style.background = "url('/img/broadcastON.png')";
    eleT.innerHTML = 'o viewers';
}

ShaderToy.prototype.UIBroadcastOff = function () {
    var eleB = document.getElementById("broadcastButton");
    var eleT = document.getElementById("numViewers");

    eleB.style.background = "url('/img/broadcastOFF.png')";
    eleT.innerHTML = '';
}



//----------------------------------------------------------------------------

var gShaderToy = null;
var gCode = null;
var gIsLiked = 0;
var gRes = null;
var gNnumComments = 0;

function loadNew() {
    var kk = {
        "ver": "0.1",
        "info": {
            "id": "-1",
            "date": "1358124981",
            "viewed": 0,
            "name": "",
            "username": "None",
            "description": "",
            "likes": 0,
            "hasliked": 0,
            "tags": [],
            "published": 0
        },

        "flags": {
            "mFlagVR": "false",
            "mFlagWebcam": "false",
            "mFlagSoundInput": "false",
            "mFlagSoundOutput": "false",
            "mFlagKeyboard": "false"
        },

        "renderpass": [
            {
                "inputs":
                   {
                       "id": "3",
                       "src": ["/presets/tex03.jpg"],
                       "ctype": ["texture"],
                       "channel": [0]
                   },
                "outputs":
                    {
                        "channel": [],
                        "dst": []
                    },
                "type": "image",
                "code": "void mainImage( out vec4 fragColor, in vec2 fragCoord )\n{\n\tvec2 uv = fragCoord.xy / iResolution.xy;\n\tfragColor = vec4(uv,0.5+0.5*sin(iGlobalTime),1.0);\n}",
                "name": "",
                "description": ""
            }]
    };

    dataLoadShader([kk]);
}

function loadComments() {
    try {
        var httpReq = createHttpReques();
        httpReq.onload = function () {
            var xmlC = httpReq.responseText;
            var jsn = JSON.parse(xmlC);
            updatepage(jsn);
        }
        httpReq.open("POST", "/comment", true);
        httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpReq.send("s=" + gShaderID);
    }
    catch (e) {
        return;
    }
}


function dataLoadShader(jsnShader) {
    gRes = gShaderToy.newScriptJSON(jsnShader[0])
    if (gRes.mSuccess == false)
        return;

    document.title = gRes.mName;

    var st = document.getElementById("shaderTitle"); if (st) { if (st.value === undefined) { st.innerHTML = gRes.mName; st.title = gRes.mName; } else st.value = gRes.mName; }
    var sd = document.getElementById("shaderDescription"); if (sd) { if (sd.value === undefined) { sd.innerHTML = gRes.mDescription; } else sd.value = gRes.mDescription; }
    var sp = document.getElementById("published");
    if (sp && sp !== undefined && sp.length == 4) {
        if (gRes.mPublished == 0) {
            sp.selectedIndex = 3;
        }
        else if (gRes.mPublished == 1) {
            sp.selectedIndex = 1;
        }
        else if (gRes.mPublished == 2) {
            sp.selectedIndex = 2;
        }
        else if (gRes.mPublished == 3) {
            sp.selectedIndex = 0;
        }
    }

    updateLikes();
    var timeVar = "-";
    if (gRes.mDate != 0) {
        timeVar = getTime(gRes.mDate);
    }
    var shaderAuthor = document.getElementById("shaderAuthor"); if (shaderAuthor) shaderAuthor.innerHTML = ((gShaderID == null) ? "Created" : "Uploaded") + " by <a class='user' href='/user/" + gRes.mUserName + "'>" + gRes.mUserName + "</a> in " + timeVar;

    var txtHtml = "Tags: ";
    var txtPlain = "";
    var numTags = gRes.mTags.length;
    for (var i = 0; i < numTags; i++) {
        txtHtml += "<a class='user' href='/results?query=tag%3D" + gRes.mTags[i] + "'>" + gRes.mTags[i] + "</a>";
        txtPlain += gRes.mTags[i];
        if (i != (numTags - 1)) { txtHtml += ", "; txtPlain += ", "; }
    }
    var sts = document.getElementById("shaderTags"); if (sts) { if (sts.value === undefined) sts.innerHTML = txtHtml; else sts.value = txtPlain; }

    var shareShader = document.getElementById("shaderShare");

    // like
    var shaderLike = document.getElementById("shaderLike");
    if (shaderLike != null) {
        gIsLiked = gRes.mHasLiked;
        updateLikes();
        shaderLike.onclick = function () {
            var url = "s=" + gShaderID + "&l=" + ((gIsLiked == 1) ? 0 : 1);
            var mHttpReq = createHttpReques();
            mHttpReq.open("POST", "/shadertoy", false);
            mHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            mHttpReq.send(url);
            var res = mHttpReq.responseText;
            if (res == "true") {
                if (gIsLiked == 1) gRes.mLikes--; else gRes.mLikes++;
                gIsLiked = 1 - gIsLiked;
                updateLikes();
            }
        }
    }
    gShaderToy.startRendering();
    gShaderToy.resetTime();

    if (!gRes.mFailed) {
        //gShaderToy.pauseTime();
    }

}

function loadShader() {
    try {
        var httpReq = createHttpReques();
        httpReq.open("POST", "/shadertoy", true);
        httpReq.onload = function () {
            var res = httpReq.responseText;
            var jsnShader = null;
            try { jsnShader = JSON.parse(res); } catch (e) { alert("ERROR in JSON: " + res); return; }
            dataLoadShader(jsnShader);
        }

        httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var str = "{ \"shaders\" : [\"" + gShaderID + "\"] }";
        str = "s=" + encodeURIComponent(str);
        httpReq.send(str);
    }
    catch (e) {
        return;
    }
}

function watchResize() {
    var srdiv = document.getElementById("demogl");
    if (srdiv) {
        var xres = srdiv.offsetWidth;
        var yres = srdiv.offsetHeight;
        gShaderToy.resize(xres, yres);
    }
}

function changeEditorFont() {
    var ele = document.getElementById("uiFontSelector");
    gShaderToy.setFontSize(ele.selectedIndex);
}

function watchInit() {
    var editorHeader = document.getElementById("editorHeader");
    editorHeader.mExpanded = false;

    //-- shadertoy --------------------------------------------------------

    var editorParent = document.getElementById("editor");
    var viewerParent = document.getElementById("player");
    var passParent = document.getElementById("passManager")

    // cancel/intercept browsers default behaviour for CTRL+S (save the web page to disk)
    document.addEventListener("keydown", function (e) { if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) { e.preventDefault(); } }, false);

    // cancel/intercept browsers default behaviour for CTRL+F (search)
    document.addEventListener("keydown", function (e) { if (e.keyCode == 70 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) { e.preventDefault(); } }, false);

    // prevent unloading page without saving changes to shader
    window.onbeforeunload = function (e) { if (gShaderToy != null && gShaderToy.GetNeedSave()) return "You are about to lose your changes in the code editor."; };

    gShaderToy = new ShaderToy(viewerParent, editorParent, passParent, gUserName);
    if (!gShaderToy.mCreated)
        return;

    //-- get info --------------------------------------------------------

    if (gShaderID == null) {
        loadNew();
    }
    else {
        loadComments(gShaderID);
        loadShader(gShaderID);
    }
}

function updateLikes() {
    //if( gRes.mFailed ) return;

    var shaderLike = document.getElementById("shaderLike");
    if (shaderLike != null) {
        if (gIsLiked == 1) {
            shaderLike.src = "/img/likeYes.png";
        }
        else {
            shaderLike.src = "/img/likeNo.png";
        }
    }

    var shaderStats = document.getElementById("shaderStats");
    if (shaderStats)
        shaderStats.innerHTML = "<img src='/img/views.png' class='viewsIcon'></img><span style='font-weight:bold'>" + gRes.mViewed + "</span>    &nbsp;&nbsp;  <img src='/img/likes.png' class='likesIcon'></img><span style='font-weight:bold'>" + gRes.mLikes + "</span> &nbsp;&nbsp; <img src='/img/comments.png' class='commentsIcon'></img><span style='font-weight:bold'>" + gNnumComments;
}

function updatepage(jsn) {
    var txt = "";
    gNnumComments = jsn.text ? jsn.text.length : 0;
    for (var i = 0; i < gNnumComments; i++) {
        var timeVar = "-";
        if (jsn.date[i] != 0) {
            timeVar = getTime(jsn.date[i]);
        }
        if ((i & 1) == 0)
            txt += "<div class=\"comment1\">";
        else
            txt += "<div class=\"comment2\">";
        txt += "<table width=\"100%\"><tr><td class=\"commentPicture\"><img class=\"userPictureSmall\" src=\"" + jsn.userpicture[i] + "\"></img></td>";
        txt += "<td class=\"commentContent\"><a class='user' href='/user/" + jsn.username[i] + "'>" + jsn.username[i] + "</a>, " + timeVar + "<br>" + jsn.text[i] + "</td></tr></table>";
        txt += "</div>";
    }

    var cc = document.getElementById("myComments"); if (cc) cc.innerHTML = txt;
    var dd = document.getElementById("commentTextArea"); if (dd) dd.value = "";
}

function addComment(usr, form) {
    var xmlHttp = createHttpReques();
    if (xmlHttp == null) return;

    // disable comment input elements while we process the comment submision
    form.mybutton.disabled = true;
    form.comment.disabled = true;

    // encode comments
    var commentsformated = form.comment.value;
    commentsformated = encodeURIComponent(commentsformated);


    var url = "s=" + usr + "&comment=" + commentsformated;
    xmlHttp.open('POST', "/comment", true);
    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            var str = xmlHttp.responseText;
            var jsn = JSON.parse(str);

            if (jsn.added && jsn.added == 0) {
                var ve = document.getElementById("centerScreen");
                doAlert(getCoords(ve), { mX: 320, mY: 100 }, "Error", "We are sorry, we couldn't submit your comment", false, null);
            }
            else {
                updatepage(jsn);
            }

            // reenable comment input elements
            form.mybutton.disabled = false;
            form.comment.disabled = false;
        }
    }
    xmlHttp.send(url);
}

function checkFormComment(str) {
    var str2 = strip_html(str);

    if (str != str2) {
        var ve = document.getElementById("centerScreen");
        doAlert(getCoords(ve), { mX: 320, mY: 100 }, "Error", "HTML is not allowed here", false, null);
        return false;
    }

    if (str == "") {
        var ve = document.getElementById("centerScreen");
        doAlert(getCoords(ve), { mX: 320, mY: 100 }, "Error", "You need to write at least 1 character", false, null);
        return false;
    }
    return true;
}

function validateComment(form) {
    if (checkFormComment(form.comment.value)) {
        addComment(gShaderID, form);
        return true;
    }

    form.comment.focus();
    return false;
}

function openSubmitShaderForm(isUpdate) {
    var ve = document.getElementById("centerScreen");
    var s1 = document.getElementById('shaderTitle');
    var s2 = document.getElementById('shaderTags');
    var s3 = document.getElementById('shaderDescription');

    if (!s1.validity.valid) { doAlert(getCoords(ve), { mX: 320, mY: 100 }, "Error", "You must give a name to your shader", false, null); return; }
    if (!s2.validity.valid) { doAlert(getCoords(ve), { mX: 320, mY: 100 }, "Error", "You must assign at least one tag to your shader", false, null); return; }
    if (!s3.validity.valid) { doAlert(getCoords(ve), { mX: 320, mY: 100 }, "Error", "You must give a description to your shader", false, null); return; }
    if (!checkFormComment(s1.value)) return false;
    //if( !checkFormComment(s1.value) ) return false;
    if (!checkFormComment(s3.value)) return false;

    var publishedStatus = 3;
    var sp = document.getElementById('published');
    var op = sp.options[sp.selectedIndex].value;
    // HTML: 0: draft   1: private   2: public    3: public+api
    // DB  : 0: draft   2: private   1: public    3: public + api
    if (op == "0") publishedStatus = 0;
    else if (op == "1") publishedStatus = 2;
    else if (op == "2") publishedStatus = 1;
    else if (op == "3") publishedStatus = 3;

    var dataJSON = gShaderToy.exportToJSON();

    dataJSON.info.name = s1.value;
    dataJSON.info.tags = s2.value.split(",");
    dataJSON.info.description = s3.value;

    // Initial support for drafts
    dataJSON.info.published = publishedStatus;

    // Generate the screenshot
    var canvas = document.getElementById("demogl");
    var dataURL = canvas.toDataURL("image/jpeg");

    var dataTXT = JSON.stringify(dataJSON, null);
    dataTXT = encodeURIComponent(dataTXT);

    // Submit the values to the cloud
    var mHttpReq = createHttpReques();
    mHttpReq.open("POST", "/shadertoy", false);
    mHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    var url = "a="; if (isUpdate) url = "u=";
    url += dataTXT;
    url += "&ss=" + dataURL;

    mHttpReq.send(url);
    var res = mHttpReq.responseText;


    if (res == 0) {
        gShaderToy.SetNeedSave(false);
        if (isUpdate) {
            //doAlert( getCoords(ve), {mX:400,mY:160}, "Update", "The shader was updated successfully", false, null );
            var eleWrapper = document.getElementById('editorWrapper');
            eleWrapper.className = "saved";
            setTimeout(function () { eleWrapper.className = ""; }, 500);

        }
        else {
            window.location = "/profile";
        }
    }
    else if (res == -2) {
        doAlert(getCoords(ve), { mX: 400, mY: 160 }, "Error", "Shader name \"" + dataJSON.info.name + "\" is already used by another shader. Please change the name of your shader.", false, null);
    }
    else {
        doAlert(getCoords(ve), { mX: 400, mY: 180 }, "Error", "The shader could not be " + ((isUpdate == true) ? "updated" : "added") + ", please try again. Error code : " + res, false, null);
    }
}

function saveCodeFromAdmin() {
    var dataJSON = gShaderToy.exportToJSON();
    var dataTXT = JSON.stringify(dataJSON, null);
    dataTXT = encodeURIComponent(dataTXT);

    var mHttpReq = createHttpReques();
    mHttpReq.open("POST", "/shadertoy", false);
    mHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    var url = "z=" + dataTXT;

    mHttpReq.send(url);
    var res = mHttpReq.responseText;

    if (res == 0) {
        gShaderToy.SetNeedSave(false);
        //doAlert( getCoords(ve), {mX:400,mY:160}, "Update", "The shader was updated successfully", false, null );
        var eleWrapper = document.getElementById('editorWrapper');
        eleWrapper.className = "saved";
        setTimeout(function () { eleWrapper.className = ""; }, 500);
    }
    else {
        var ve = document.getElementById("centerScreen");
        doAlert(getCoords(ve), { mX: 400, mY: 180 }, "Error", "The shader could not be updated, please try again. Error code : " + res, false, null);
    }
}


//==================================================================

