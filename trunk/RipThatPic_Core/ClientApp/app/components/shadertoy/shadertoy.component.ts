import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

declare var ActiveXObject: (type: string) => void;

@Component({
    selector: 'shadertoy',
    templateUrl: './shadertoy.component.html'
})
export class ShaderToyComponent implements AfterViewInit, IShaderToyScope {

    shaderToy: ShaderToy;
    shaderId: string;
    res: any;
    uiData: UIData;
    ChangeShader: Function;

    @ViewChild('editor') editorEl: ElementRef;
    @ViewChild('player') playerEl: ElementRef;
    @ViewChild('passManager') passManagerEl: ElementRef;
    @ViewChild('divFrameRate') divFrameRateEl: ElementRef;
    @ViewChild('divMyTime') divMyTimeEl: ElementRef;
    @ViewChild('butUpdateShader') butUpdateShaderEl: ElementRef;
    @ViewChild('demogl') demoglEl: ElementRef;
    @ViewChild('butPauseShader') butPauseShaderEl: ElementRef;
    
    constructor() {
        this.uiData = new UIData();
    }

    ngAfterViewInit(): void {
        // console.log(this.renderer);

        var editor = this.editorEl.nativeElement;
        var player = this.playerEl.nativeElement;
        var passManager = this.passManagerEl.nativeElement;
        var demogl = this.demoglEl.nativeElement;
        var butPauseShader = this.butPauseShaderEl.nativeElement;

        
        this.uiData.eFrameRate = this.divFrameRateEl.nativeElement;
        this.uiData.eMyTime = this.divMyTimeEl.nativeElement;
        this.uiData.UpdateUI = () => {
            // this.sc.$apply();
        };
        this.uiData.Pause = () => { this.shaderToy.PlayPauseTime(); };

        this.ChangeShader = () => {
            this.shaderToy.PauseShader();
            this.loadShader(this.shaderId);

            setTimeout(() => {
                this.shaderToy.PlayShader();
            }, 100);

        }

        // $(this.butUpdateShaderEl.nativeElement).on('click', this.updateShader.bind(this));

        this.shaderToy = new ShaderToy(player, editor, passManager, this.uiData, demogl, butPauseShader);
        //this.sc.shaderToy.UpdateCounter = (data) => { this.sc.uiData.ShaderCharCounter = data;};

        if (!this.shaderToy.mCreated)
            return;

        ////-- get info --------------------------------------------------------
        //this.sc.shaderId = '4t23RR';
        ////this.sc.shaderId = 'll23Rd';  //<-- ???? doesn't work :(
        //this.sc.shaderId = 'MlS3Rc';
        //this.sc.shaderId = 'XslGRr';
        this.shaderId = '4t23RR';
        this.loadShader(this.shaderId);
        this.shaderToy.PlayShader();

        //if (this.sc.shaderId == null) {
        //    this.loadNew();
        //}
        //else {
        //    this.loadShader(this.sc.shaderId);
        //}
    }


    private updateShader() {
        this.shaderToy.SetShaderFromEditor();
    }

    private dataLoadShader(jsonShader: any) {

        this.res = this.shaderToy.ParseJSON(jsonShader)
        if (this.res.mSuccess == false)
            return;

        document.title = this.res.mName;

        //inputs
        this.uiData.ShowInputs = false;
        this.uiData.Inputs = [];

        if (jsonShader.renderpass[0] && jsonShader.renderpass[0].inputs.length > 0) {
            this.uiData.ShowInputs = true;
            this.uiData.Inputs = jsonShader.renderpass[0].inputs;
        }

        //render
        this.shaderToy.StartRendering();
        this.shaderToy.ResetTime();

        if (!this.res.mFailed) {
            this.shaderToy.PauseShader();
        }

    }

    loadShader(gShaderID: string){
        this.uiData.IsLoading = true;
        try {
            var httpReq = this.createHttpRequest();
            httpReq.open("GET", "/data/" + gShaderID + ".json", true);
            httpReq.onload = () => {
                var res = httpReq.responseText;
                var jsnShader = null;
                try { jsnShader = JSON.parse(res); } catch (e) { alert("ERROR in JSON: " + res); return; }
                this.dataLoadShader(jsnShader);
            }

            httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var str = "{ \"shaders\" : [\"" + gShaderID + "\"] }";
            str = "s=" + encodeURIComponent(str);
            httpReq.send(str);
        }
        catch (e) {
            return;
        }
        finally {
            this.uiData.IsLoading = false;
        }
    }

    private loadShaderFromToyShaderUri(gShaderID: string) {
        try {
            var httpReq = this.createHttpRequest();
            httpReq.open("POST", "https://www.shadertoy.com/shadertoy", true);
            httpReq.onload = function () {
                var res = httpReq.responseText;
                var jsnShader = null;
                try { jsnShader = JSON.parse(res); } catch (e) { alert("ERROR in JSON: " + res); return; }
                this.dataLoadShader(jsnShader);
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

    private createHttpRequest(): any {

        let xmlHttp: any = null;
        try {
            // Opera 8.0+, Firefox, Safari
            xmlHttp = new XMLHttpRequest();
        }
        catch (e) {
            //// Internet Explorer Browsers
            //try {
            //    xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            //}
            //catch (e) {
            //    try {
            //        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            //    }
            //    catch (e) {
            //        // Something went wrong
            //        alert("Your browser broke!");
            //    }
            //}
            alert("failed to load XMLHttpRequest");
        }

        return xmlHttp;
    }
}

interface IShaderToyScope {

    shaderToy: ShaderToy;
    shaderId: string;
    res: any;
    uiData: UIData;
    ChangeShader: Function;
}

class UIData {
    ShaderCharCounter: string;
    FrameRate: string;
    MyTime: string;

    eFrameRate: HTMLElement;
    eMyTime: HTMLElement;
    Pause: Function;

    Inputs: any;
    ShowInputs: boolean;

    IsLoading: boolean;

    UpdateUI: Function;

}


class ShaderToy {

    mCanvas: webgl.HTMLCanvasElement;
    mGLContext: any;
    mIsPaused: boolean;
    mIsRendering: boolean;
    mForceFrame: boolean;
    mCreated: boolean;
    mNeedsSave: boolean;

    mCodeEditor: any;
    mEditorState: any;

    mEffect: Effect;

    mDocs: any;


    mActiveDoc: any;
    mInfo: any;
    mTOffset: number;
    mTo: any;
    mTf: number;
    mFpsTo: any;
    mFpsFrame: any;

    mSendFrame: boolean;

    mMouseIsDown: boolean;
    mMouseOriX: number;
    mMouseOriY: number;
    mMousePosX: number;
    mMousePosY: number;

    UpdateCounter: Function;

    constructor(
        public playerElement: any,
        public editorElement: any,
        public passElement: any, // ng.IAugmentedJQuery,
        public uiData: UIData,
        canvas: any,
        public butPauseShader: any
    ) {

        // var canvas: any = $(playerElement).find('#demogl')[0];
        this.mCanvas = canvas;
        this.mDocs = {};

        this.mGLContext = this.createGlContext(this.mCanvas, false, true);
        if (this.mGLContext == null) {
            this.createNoWebGLMessage(this.playerElement, this.mCanvas);
            this.mIsPaused = true;
            this.mForceFrame = false;
        }

        this.mEditorState = { mCursorChange: false, mViewportChange: false, mCodeChange: false };

        this.mCodeEditor = (<any>window)['CodeMirror'](editorElement,
            {
                lineNumbers: true,
                matchBrackets: true,
                indentWithTabs: false,
                tabSize: 4,
                indentUnit: 4,
                mode: "text/x-glsl",
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                //extraKeys: {
                //    "Ctrl-S": function (instance) { doSaveShader(); me.mNeedsSave = false; },
                //    "Alt-Enter": function (instance) { me.SetShaderFromEditor(); },
                //    "Alt--": function (instance) { me.decreaseFontSize(); },
                //    "Alt-=": function (instance) { me.increaseFontSize(); },
                //    "Alt-F": function (instance) { me.changeEditorFullScreen(); }
                //}
            });
        var __this = this;
        this.mCodeEditor.on("change", (instance: any, ev: any) => { __this.mEditorState.mCodeChange = true; __this.mNeedsSave = true; });
        this.mCodeEditor.on("cursorActivity", (instance: any) => { __this.mEditorState.mCursorChange = true; });
        this.mCodeEditor.on("viewportChange", (instance: any, eFrom: any, eTo: any) => { __this.mEditorState.mViewportChange = true; });


        this.mEffect = new Effect(null, null, this.mGLContext, this.mCanvas.width, this.mCanvas.height, this.refreshTexturThumbail, this, false, false);

        this.mCreated = true;

    }


    private createGlContext(cv: any, useAlpha: any, usePreserveBuffer: any) {
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

    private createNoWebGLMessage(base: any, old: any) {
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

    ParseJSON(jsn: any) {
        try {
            var res = this.mEffect.ParseJSON(jsn);

            var num = res.length;
            for (var i = 0; i < num; i++) {
                this.mDocs[i] = (<any>window)['CodeMirror'].Doc(res[i].mShader, "text/x-glsl");
            }

            this.mActiveDoc = 0;

            this.mCodeEditor.swapDoc(this.mDocs[this.mActiveDoc]);
            this.setChars();
            this.setFlags();
            this.mCodeEditor.clearHistory()
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

    }

    private refreshTexturThumbail(myself: any, slot: any, img: any, forceFrame: any, gui: any, guiID: any, time: any, passID: any) {
        if (passID != myself.mActiveDoc) return;

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
    }

    private getSourceElement(e: any) {
        var ele = null;
        if (e.target) ele = e.target;
        if (e.srcElement) ele = e.srcElement;
        return ele;
    }


    StartRendering() {
        if (this.mIsRendering) return;
        else this.mIsRendering = true;

        //var me = this;

        let renderLoop = () => {

            if (this.mGLContext == null) return;


            requestAnimationFrame(renderLoop);

            if (this.mIsPaused && !this.mForceFrame) {
                this.mEffect.UpdateInputs(this.mActiveDoc, false);
                return;
            }

            this.mForceFrame = false;
            var time = performance.now();
            var ltime = this.mTOffset + time - this.mTo;

            if (this.mIsPaused) ltime = this.mTf; else this.mTf = ltime;

            this.mEffect.Paint(ltime / 1000.0, this.mMouseOriX, this.mMouseOriY, this.mMousePosX, this.mMousePosY, this.mIsPaused);

            //if (me.mSendFrame) me.mLiveCreator.SendUpdate();
            this.mSendFrame = false;


            this.mFpsFrame++;

            this.uiData.MyTime = (ltime / 1000.0).toFixed(2);
            this.uiData.eMyTime.innerHTML = this.uiData.MyTime + " seconds";

            if ((time - this.mFpsTo) > 1000) {
                var ffps = 1000.0 * this.mFpsFrame / (time - this.mFpsTo);
                this.uiData.FrameRate = ffps.toFixed(1) + " fps";
                this.uiData.eFrameRate.innerHTML = this.uiData.FrameRate;
                if (this.uiData.UpdateUI) this.uiData.UpdateUI.call(this);
                this.mFpsFrame = 0;
                this.mFpsTo = time;
            }

        }

        renderLoop();
    }

    PlayPauseTime() {

        if (!this.mIsPaused) {
            this.PauseShader();
        }
        else {
            this.PlayShader();
        }
    }

    PauseShader() {
        var time = performance.now();

        $(this.butPauseShader).attr('value', 'play');
        this.mIsPaused = true;
        this.mEffect.StopOutputs();

    }

    PlayShader() {
        var time = performance.now();

        $(this.butPauseShader).attr('value', 'pause');
        this.mTOffset = this.mTf;
        this.mTo = time;
        this.mIsPaused = false;
        this.mEffect.ResumeOutputs();

    }


    ResetTime() {
        this.mTOffset = 0;
        this.mTo = performance.now();
        this.mTf = 0;
        this.mFpsTo = this.mTo;
        this.mFpsFrame = 0;
        this.mForceFrame = true;
        this.mEffect.ResetTime();
    }

    private setChars() {
        var str = this.mCodeEditor.getValue();

        str = this.replaceChars(str);
        str = this.removeSingleComments(str);
        str = this.removeMultiComments(str);
        str = this.removeMultiSpaces(str);
        str = this.removeSingleSpaces(str);
        str = this.removeEmptyLines(str);


        this.uiData.ShaderCharCounter = str.length + " chars";

    }

    private setFlags() {
        if (this.mEffect == null) return;

        var flags = this.mEffect.CalcFlags();

        //var eleVR = document.getElementById("myVR");
        //eleVR.style.visibility = (flags.mFlagVR == true) ? "visible" : "hidden";
    }

    private showChars() {
        var str = this.mCodeEditor.getValue();

        str = this.minify(str);

        //alert( str );
        //var ve = document.getElementById("centerScreen");
        //doAlert(getCoords(ve), { mX: 480, mY: 400 }, "Minimal Shader Code, (" + str.length + " chars)", "<pre>" + str + "</pre>", false, null);
    }

    private isSpace(str: any, i: number) {
        return (str[i] === ' ') || (str[i] === '\t');
    }

    private isLine(str: any, i: number) {
        return (str[i] === '\n');
    }

    private replaceChars(str: any) {
        var dst = "";
        var num = str.length;
        for (var i = 0; i < num; i++) {
            if (str[i] === '\r') continue;
            if (str[i] === '\t') { dst = dst + " "; continue; }

            dst = dst + str[i];
        }
        return dst;
    }

    private removeEmptyLines(str: any) {
        var dst = "";
        var num = str.length;
        var isPreprocessor = false;
        for (var i = 0; i < num; i++) {
            if (str[i] === '#') isPreprocessor = true;
            var isDestroyableChar = this.isLine(str, i);

            if (isDestroyableChar && !isPreprocessor) continue;
            if (isDestroyableChar && isPreprocessor) isPreprocessor = false;

            dst = dst + str[i];
        }
        return dst;
    }

    private removeMultiSpaces(str: any) {
        var dst = "";
        var num = str.length;
        for (var i = 0; i < num; i++) {
            if (this.isSpace(str, i) && (i === (num - 1))) continue;
            if (this.isSpace(str, i) && this.isLine(str, i - 1)) continue;
            if (this.isSpace(str, i) && this.isLine(str, i + 1)) continue;
            if (this.isSpace(str, i) && this.isSpace(str, i + 1)) continue;
            dst = dst + str[i];
        }
        return dst;
    }

    private removeSingleSpaces(str: any) {
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
                    (str[i - 1] === '\r')

                )) continue;
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
                (str[i + 1] === '\r')

            )) continue;

            dst = dst + str[i];
        }
        return dst;
    }

    private removeSingleComments(str: any) {
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
    }

    private removeMultiComments(str: any) {
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
    }

    private minify(str: any) {
        str = this.replaceChars(str);
        str = this.removeSingleComments(str);
        str = this.removeMultiComments(str);
        str = this.removeMultiSpaces(str);
        str = this.removeSingleSpaces(str);
        str = this.removeEmptyLines(str);
        return str;
    }

    private setErrors(result: any, fromScript: any) {
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
    }

    private setPasses(passes: any) {
        //for (var i = 0; i < passes.length; i++)
        //    this.AddTab(passes[i].mType, i, i == 0);
        //this.AddPlusTab();
    }

    SetShaderFromEditor(): any {
        var shaderCode = this.mCodeEditor.getValue();

        var result = this.mEffect.NewShader(shaderCode, this.mActiveDoc);
        if (result == null) {
            this.mForceFrame = true;
            this.mSendFrame = true;
        }

        this.setChars();
        this.setFlags();

        return this.setErrors(result, false);
    }

    //gShaderToy.SetTexture(gCurrentEditingSlot, {mType:'texture', mID:28, mSrc:'/presets/tex15.png'})
    SetTexture(slot: any, url: any) {
        this.mEffect.NewTexture(this.mActiveDoc, slot, url);
    }
}

class Effect {

    mAudioContext: any;
    mGLContext: any;
    mWebVR: any;
    mRenderingStereo: any;
    mQuadVBO: any;
    mXres: any;
    mYres: any;
    mForceMuted: any;
    mGainNode: any;
    mPasses: Array<EffectPass>;
    mSupportTextureFloat: boolean;

    constructor(vr: any, ac: any, gl: any, xres: any, yres: any, callback: any, obj: any, forceMuted: any, forcePaused: any) {

        this.mAudioContext = ac;
        this.mGLContext = gl;
        this.mWebVR = vr;
        this.mRenderingStereo = false;
        this.mQuadVBO = null;
        this.mXres = xres;
        this.mYres = yres;
        this.mForceMuted = forceMuted; // | (ac == null);
        this.mGainNode = null;
        this.mPasses = new Array(2);


        if (gl == null) return;

        var ext = gl.getExtension('OES_standard_derivatives');
        var supportsDerivatives = (ext != null);

        if (supportsDerivatives) gl.hint(ext.FRAGMENT_SHADER_DERIVATIVE_HINT_OES, gl.NICEST);

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
            this.mPasses[i] = new EffectPass(gl, precision, supportsDerivatives, callback, obj, forceMuted, forcePaused, this.mQuadVBO, this.mGainNode, i);
        }
    }

    private determineShaderPrecission(gl: any) {
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

        if (this.createShader(gl, vstr, h1 + fstr, false).mSuccess == true) return h1;
        if (this.createShader(gl, vstr, h2 + fstr, false).mSuccess == true) return h2;
        if (this.createShader(gl, vstr, h3 + fstr, false).mSuccess == true) return h3;

        return "";
    }

    private createShader(gl: any, tvs: any, tfs: any, nativeDebug: any): any {
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

    private createQuadVBO(gl: any) {
        var vertices = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]);

        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return vbo;
    }

    private createCubeVBO(gl: any) {
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
    }

    ParseJSON(jobj: any): any {
        if (jobj.ver != "0.1") {
            return { mFailed: true };
        }

        var numPasses = jobj.renderpass.length;

        if (numPasses == 0 || numPasses > 2) {
            return { mFailed: true, mError: "Incorrect number of passes, we only support up to two-pass shaders at this moment.", mShader: null };
        }

        var res: any = [];// = new Array( numPasses );
        res.mFailed = false;
        for (var j = 0; j < numPasses; j++) {
            var rpass = jobj.renderpass[j];

            // skip sound passes if in thumbnail mode
            if (this.mForceMuted && rpass.type == "sound") continue;
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
    }

    NewTexture(passid: number, slot: any, url: any) {
        this.mPasses[passid].NewTexture(this.mAudioContext, this.mGLContext, slot, url);
    }

    NewShader(shaderCode: string, passid: number) {
        return this.mPasses[passid].NewShader(this.mGLContext, shaderCode);
    }

    CalcFlags() {
        var flagVR = false;
        var flagWebcam = false;
        var flagSoundInput = false;
        var flagSoundOutput = false;
        var flagKeyboard = false;

        var numPasses = this.mPasses.length;
        for (var j = 0; j < numPasses; j++) {
            var pass = this.mPasses[j];
            if (!pass.mUsed) continue;

            if (pass.mType == "sound") flagSoundOutput = true;

            for (var i = 0; i < 4; i++) {
                if (pass.mInputs[i] == null) continue;

                if (pass.mInputs[i].mInfo.mType == "webcam") flagWebcam = true;
                else if (pass.mInputs[i].mInfo.mType == "keyboard") flagKeyboard = true;
                else if (pass.mInputs[i].mInfo.mType == "mic") flagSoundInput = true;
            }

            var n1 = pass.mSource.indexOf("mainVR(");
            var n2 = pass.mSource.indexOf("mainVR (");
            if (n1 > 0 || n2 > 0) flagVR = true;
        }

        return {
            mFlagVR: flagVR,
            mFlagWebcam: flagWebcam,
            mFlagSoundInput: flagSoundInput,
            mFlagSoundOutput: flagSoundOutput,
            mFlagKeyboard: flagKeyboard
        };
    }

    ResetTime() {
        var gothere = '';
        //this.mTOffset = 0;
        //this.mTo = performance.now();
        //this.mTf = 0;
        //this.mFpsTo = this.mTo;
        //this.mFpsFrame = 0;
        //this.mForceFrame = true;
        //this.mEffect.ResetTime();
    }

    Paint(time: any, mouseOriX: any, mouseOriY: any, mousePosX: any, mousePosY: any, isPaused: any) {
        var gl = this.mGLContext;
        var wa = this.mAudioContext;

        if (gl == null) return;

        var da = new Date();

        var vrData = null;
        if (this.mRenderingStereo) vrData = this.mWebVR.GetData();

        var xres = this.mXres / 1; // iqiq
        var yres = this.mYres / 1; // iqiq

        var num = this.mPasses.length;
        for (var i = 0; i < num; i++) {
            if (!this.mPasses[i].mUsed) continue;
            if (this.mPasses[i].mProgram == null) continue;

            this.mPasses[i].Paint(vrData, wa, gl, da, time, mouseOriX, mouseOriY, mousePosX, mousePosY, xres, yres, isPaused);
        }
    }

    UpdateInputs(passid: any, forceUpdate: any) {
        this.mPasses[passid].UpdateInputs(this.mAudioContext, forceUpdate);
    }

    StopOutputs = () => {
        var gl = this.mGLContext;
        var wa = this.mAudioContext;

        var num = this.mPasses.length;
        for (var i = 0; i < num; i++) {
            if (!this.mPasses[i].mUsed) continue;
            this.mPasses[i].StopOutput(wa, gl);
        }
    }

    ResumeOutputs = () => {
        var gl = this.mGLContext;
        var wa = this.mAudioContext;
        if (gl == null) return;

        var num = this.mPasses.length;
        for (var i = 0; i < num; i++) {
            if (!this.mPasses[i].mUsed) continue;
            this.mPasses[i].ResumeOutput(wa, gl);
        }
    }
}

class EffectPass {

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


    constructor(gl: any, precission: any, supportDerivatives: any, callback: any, obj: any, forceMuted: any, forcePaused: any, quadVBO: any, outputGainNode: any, id: any) {

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

    public NewShader(gl: any, shaderCode: any) {
        if (gl == null) return "No GL";

        var res = null;

        if (this.mType == "image") res = this.NewShader_Image(gl, shaderCode);

        this.mSource = shaderCode;

        return res;
    }

    public NewTexture(wa: any, gl: any, slot: number, url: any) {
        let me = this;

        let texture: any = null;

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

            texture.video.addEventListener("canplay", (e: any) => {
                texture.video.play();
                texture.video.paused = false;
                texture.video.mPaused = false;

                texture.globject = gl.createTexture();
                this.createGLTextureLinear(gl, texture.video, texture.globject);
                texture.loaded = true;

                if (me.mTextureCallbackFun != null)
                    me.mTextureCallbackFun(me.mTextureCallbackObj, slot, texture.video, true, true, 1, -1.0, me.mID);

            });

            texture.video.addEventListener("error", (e: any) => {
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

            texture.audio.addEventListener("canplay", () => {
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

            texture.audio.addEventListener("error", (e: any) => {
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

        this.DestroyInput(gl, slot);
        this.mInputs[slot] = texture;

        this.MakeHeader(null, null);
    }

    private NewShader_Image(gl: any, shaderCode: any) {
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

    private createGLTexture(ctx: any, image: any, format: any, texture: any) {
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

    private createGLTextureNearestRepeat(ctx: any, image: any, texture: any) {
        if (ctx == null) return;

        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
        ctx.bindTexture(ctx.TEXTURE_2D, null);
    }

    private createGLTextureNearest(ctx: any, image: any, texture: any) {
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

    private createGLTextureLinear(ctx: any, image: any, texture: any) {
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

    private createAudioTexture(ctx: any, texture: any) {
        if (ctx == null) return;

        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.LUMINANCE, 512, 2, 0, ctx.LUMINANCE, ctx.UNSIGNED_BYTE, null);
        ctx.bindTexture(ctx.TEXTURE_2D, null);
    }

    private createKeyboardTexture(ctx: any, texture: any) {
        if (ctx == null) return;

        ctx.bindTexture(ctx.TEXTURE_2D, texture);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
        ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.LUMINANCE, 256, 2, 0, ctx.LUMINANCE, ctx.UNSIGNED_BYTE, null);
        ctx.bindTexture(ctx.TEXTURE_2D, null);
    }

    public Create(passType: any, wa: any, gl: any) {
        this.mType = passType;
        this.mUsed = true;
        this.mSource = null;

        if (passType == "image") this.Create_Image(wa, gl);

    }

    private CreateShader(gl: any, tvs: any, tfs: any, nativeDebug: any): any {
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

    private Create_Image(wa: any, gl: any) {
        this.MakeHeader(null, null);
        this.mSampleRate = 44100;
        this.mSupportsVR = false;
        this.mProgram = null;
        this.mProgramVR = null;
    }

    private DestroyInput(gl: any, id: any) {
        if (gl == null) return;

        if (this.mInputs[id] == null) return;

        if (this.mInputs[id].mInfo.mType == "texture") {
            gl.deleteTexture(this.mInputs[id].globject);
        }
        else if (this.mInputs[id].mInfo.mType == "webcam") {
            gl.deleteTexture(this.mInputs[id].globject);
        }
        else if (this.mInputs[id].mInfo.mType == "video") {
            this.mInputs[id].video.pause();
            this.mInputs[id].video = null;
            gl.deleteTexture(this.mInputs[id].globject);
        }
        else if (this.mInputs[id].mInfo.mType == "music") {
            this.mInputs[id].audio.pause();
            this.mInputs[id].audio = null;
            gl.deleteTexture(this.mInputs[id].globject);
        }
        else if (this.mInputs[id].mInfo.mType == "cubemap") {
            gl.deleteTexture(this.mInputs[id].globject);
        }
        else if (this.mInputs[id].mInfo.mType == "keyboard") {
            gl.deleteTexture(this.mInputs[id].globject);
        }
        else if (this.mInputs[id].mInfo.mType == "mic") {
            this.mInputs[id].mic = null;
            gl.deleteTexture(this.mInputs[id].globject);
        }

        this.mInputs[id] = null;
    }

    private Destroy_Image(wa: any, gl: any) {
    }

    private MakeHeader(precission: any, supportDerivatives: any) {
        if (this.mType == "image") this.MakeHeader_Image(precission, supportDerivatives);
    }

    private MakeHeader_Image(precission: any, supportDerivatives: any) {
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

    private createEmptyTextureNearest(gl: any, xres: any, yres: any) {
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, xres, yres, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return tex;
    }

    private createFBO(gl: any, texture0: any) {
        var fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture0, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return fbo;
    }

    private deleteFBO(gl: any, fbo: any) {
        gl.deleteFramebuffer(fbo);
    }

    public Paint(vrData: any, wa: any, gl: any, da: any, time: any, mouseOriX: any, mouseOriY: any, mousePosX: any, mousePosY: any, xres: any, yres: any, isPaused: any) {
        if (this.mType == "image") {
            this.Paint_Image(vrData, wa, gl, da, time, mouseOriX, mouseOriY, mousePosX, mousePosY, xres, yres);
            this.mFrame++;
        }
    }

    private Paint_Image(vrData: any, wa: any, gl: any, d: any, time: any, mouseOriX: any, mouseOriY: any, mousePosX: any, mousePosY: any, xres: any, yres: any) {
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

    private invertFast(m: any) {
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

    private matMulpoint(m: any, v: any) {
        return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3],
        m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7],
        m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11]];
    }

    private deleteTexture(gl: any, tex: any) {
        gl.deleteTexture(tex);
    }

    UpdateInputs(wa: any, forceUpdate: any) {
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

    StopOutput(wa: any, gl: any){

        //this.stopOutput_Image(wa, gl);
    }

    ResumeOutput(wa: any, gl: any){ }
}