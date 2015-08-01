window.requestAnimFrame = (
  function () {
      return window.requestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.oRequestAnimationFrame ||
              window.msRequestAnimationFrame ||
              function (callback) { window.setTimeout(callback, 1000 / 60); };
  }
)();

window.URL = window.URL || window.webkitURL;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

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

create2DContext = function (cv) {
    return cv.getContext("2d");
}

createHttpReques = function () {

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
}

getTime = function (timestamp) {
    var monthstr = new Array();
    monthstr[0] = "Jan";
    monthstr[1] = "Feb";
    monthstr[2] = "Mar";
    monthstr[3] = "Apr";
    monthstr[4] = "May";
    monthstr[5] = "Jun";
    monthstr[6] = "Jul";
    monthstr[7] = "Aug";
    monthstr[8] = "Sep";
    monthstr[9] = "Oct";
    monthstr[10] = "Nov";
    monthstr[11] = "Dec";

    var a = new Date(timestamp * 1000);

    //    var month = a.getMonth() + 1;
    //    var time = a.getDate() + "/" + month + "/" + a.getFullYear();

    var time = a.getFullYear() + "-" + monthstr[a.getMonth()] + "-" + a.getDate();

    return time;
}

function getSourceElement(e) {
    var ele = null;
    if (e.target) ele = e.target;
    if (e.srcElement) ele = e.srcElement;
    return ele;
}

function setWheelEvent(myHandler) {

    function wheel(event) {
        var delta = 0;
        if (!event) event = window.event;
        if (event.wheelDelta) {
            delta = event.wheelDelta / 120;
        }
        else if (event.detail) {
            delta = -event.detail / 3;
        }
        if (delta)
            myHandler(delta);
        if (event.preventDefault)
            event.preventDefault();
        event.returnValue = false;
    }

    if (window.addEventListener) window.addEventListener('DOMMouseScroll', wheel, false);
    window.onmousewheel = document.onmousewheel = wheel;

}


function getCoords(obj) {
    var x = y = 0;
    do {
        x += obj.offsetLeft;
        y += obj.offsetTop;
    } while (obj = obj.offsetParent);

    return { mX: x, mY: y };
}


function createNoWebGLMessage(base, old) {
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
    div.style.visibilty = "hidden";
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

/*
function strip_html( str )
{
  var tmp = document.createElement("DIV");
  tmp.innerHTML = str;
  return tmp.textContent || tmp.innerText;
}
*/

// from stackoverflow
function strip_html(text) {
    if (text === null) return null;

    if (undefined === strip_html.htmlTagRegexp) {
        strip_html.htmlTagRegexp = new RegExp('</?(?:article|aside|bdi|command|' +
            'details|dialog|summary|figure|figcaption|footer|header|hgroup|mark|' +
            'meter|nav|progress|ruby|rt|rp|section|time|wbr|audio|' +
            'video|source|embed|track|canvas|datalist|keygen|output|' +
            '!--|!DOCTYPE|a|abbr|address|area|b|base|bdo|blockquote|body|' +
            'br|button|canvas|caption|cite|code|col|colgroup|dd|del|dfn|div|' +
            'dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|' +
            'h5|h6|head|hr|html|i|iframe|img|input|ins|kdb|keygen|label|legend|' +
            'li|link|map|menu|meta|noscript|object|ol|optgroup|option|p|param|' +
            'pre|q|s|samp|script|select|small|source|span|strong|style|sub|' +
            'sup|table|tbody|td|textarea|tfoot|th|thead|title|tr|u|ul|var|' +
            'acronym|applet|basefont|big|center|dir|font|frame|' +
            'frameset|noframes|strike|tt)(?:(?: [^<>]*)>|>?)', 'i');
    }

    for (; ;) {
        var str = text.match(strip_html.htmlTagRegexp);
        if (str === null) break;
        text = text.replace(str[0], '');
    }

    return text;
}

function RequestFullScreen(ele) {
    if (ele == null) ele = document.documentElement;
    if (ele.requestFullscreen) ele.requestFullscreen();
    else if (ele.msRequestFullscreen) ele.msRequestFullscreen();
    else if (ele.mozRequestFullScreen) ele.mozRequestFullScreen();
    else if (ele.webkitRequestFullscreen) ele.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
}

function IsFullScreen() {
    return document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement || false;
}

function exitFullScreen() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
}

function doSyntaxHighlight(str) {
    str = str.replace(/\t/g, "    ");
    str = str.replace(/ivec4/g, "<span class='cCodeKeyWord'>ivec4</span>");
    str = str.replace(/ivec3/g, "<span class='cCodeKeyWord'>ivec3</span>");
    str = str.replace(/ivec2/g, "<span class='cCodeKeyWord'>ivec2</span>");
    str = str.replace(/float/g, "<span class='cCodeKeyWord'>float</span>");
    str = str.replace(/vec4/g, "<span class='cCodeKeyWord'>vec4</span>");
    str = str.replace(/vec3/g, "<span class='cCodeKeyWord'>vec3</span>");
    str = str.replace(/vec2/g, "<span class='cCodeKeyWord'>vec2</span>");
    str = str.replace(/int/g, "<span class='cCodeKeyWord'>void</span>");
    str = str.replace(/void/g, "<span class='cCodeKeyWord'>int</span>");

    str = str.replace(/#define/g, "<span class='cCodePreprocessor'>#define</span>");
    str = str.replace(/#ifdef/g, "<span class='cCodePreprocessor'>#ifdef</span>");
    str = str.replace(/#if/g, "<span class='cCodePreprocessor'>#if</span>");
    str = str.replace(/#else/g, "<span class='cCodePreprocessor'>#else</span>");
    str = str.replace(/#endif/g, "<span class='cCodePreprocessor'>#endif</span>");

    str = str.replace(/any/g, "<span class='cCodeInstruction'>any</span>");
    str = str.replace(/all/g, "<span class='cCodeInstruction'>all</span>");
    str = str.replace(/abs/g, "<span class='cCodeInstruction'>abs</span>");
    str = str.replace(/acos/g, "<span class='cCodeInstruction'>acos</span>");
    str = str.replace(/asin/g, "<span class='cCodeInstruction'>asin</span>");
    str = str.replace(/atan/g, "<span class='cCodeInstruction'>atan</span>");
    str = str.replace(/break/g, "<span class='cCodeInstruction'>break</span>");
    str = str.replace(/ceil/g, "<span class='cCodeInstruction'>ceil</span>");
    str = str.replace(/clamp/g, "<span class='cCodeInstruction'>clamp</span>");
    str = str.replace(/continue/g, "<span class='cCodeInstruction'>continue</span>");
    str = str.replace(/cos/g, "<span class='cCodeInstruction'>cos</span>");
    str = str.replace(/cross/g, "<span class='cCodeInstruction'>cross</span>");
    str = str.replace(/degrees/g, "<span class='cCodeInstruction'>degrees</span>");
    str = str.replace(/distance/g, "<span class='cCodeInstruction'>distance</span>");
    str = str.replace(/dot/g, "<span class='cCodeInstruction'>dot</span>");
    str = str.replace(/dFdx/g, "<span class='cCodeInstruction'>dFdx</span>");
    str = str.replace(/dFdy/g, "<span class='cCodeInstruction'>dFdy</span>");
    str = str.replace(/equal/g, "<span class='cCodeInstruction'>equal</span>");
    str = str.replace(/exp/g, "<span class='cCodeInstruction'>exp</span>");
    str = str.replace(/exp2/g, "<span class='cCodeInstruction'>exp2</span>");
    str = str.replace(/faceforward/g, "<span class='cCodeInstruction'>faceforward</span>");
    str = str.replace(/floor/g, "<span class='cCodeInstruction'>floor</span>");
    str = str.replace(/fract/g, "<span class='cCodeInstruction'>fract</span>");
    str = str.replace(/fwidth/g, "<span class='cCodeInstruction'>fwidth</span>");
    str = str.replace(/inversesqrt/g, "<span class='cCodeInstruction'>inversesqrt</span>");
    str = str.replace(/length/g, "<span class='cCodeInstruction'>length</span>");
    str = str.replace(/log/g, "<span class='cCodeInstruction'>log</span>");
    str = str.replace(/log2/g, "<span class='cCodeInstruction'>log2</span>");
    str = str.replace(/max/g, "<span class='cCodeInstruction'>max</span>");
    str = str.replace(/mix/g, "<span class='cCodeInstruction'>mix</span>");
    str = str.replace(/min/g, "<span class='cCodeInstruction'>min</span>");
    str = str.replace(/mod/g, "<span class='cCodeInstruction'>mod</span>");
    str = str.replace(/normalize/g, "<span class='cCodeInstruction'>normalize</span>");
    str = str.replace(/not/g, "<span class='cCodeInstruction'>not</span>");
    str = str.replace(/notEqual/g, "<span class='cCodeInstruction'>notEqual</span>");
    str = str.replace(/pow/g, "<span class='cCodeInstruction'>pow</span>");
    str = str.replace(/radians/g, "<span class='cCodeInstruction'>radians</span>");
    str = str.replace(/reflect/g, "<span class='cCodeInstruction'>reflect</span>");
    str = str.replace(/refract/g, "<span class='cCodeInstruction'>refract</span>");
    str = str.replace(/sin/g, "<span class='cCodeInstruction'>sin</span>");
    str = str.replace(/sign/g, "<span class='cCodeInstruction'>sign</span>");
    str = str.replace(/sqrt/g, "<span class='cCodeInstruction'>sqrt</span>");
    str = str.replace(/step/g, "<span class='cCodeInstruction'>step</span>");
    str = str.replace(/smoothstep/g, "<span class='cCodeInstruction'>smoothstep</span>");
    str = str.replace(/tan/g, "<span class='cCodeInstruction'>tan</span>");
    str = str.replace(/texture2D/g, "<span class='cCodeInstruction'>texture2D</span>");
    str = str.replace(/texture2DProj/g, "<span class='cCodeInstruction'>texture2DProj</span>");
    str = str.replace(/textureCube/g, "<span class='cCodeInstruction'>textureCube</span>");

    return str;
}


function isSpace(str, i) {
    return (str[i] === ' ') || (str[i] === '\t');
}
function isLine(str, i) {
    return (str[i] === '\n');
}

function replaceChars(str) {
    var dst = "";
    var num = str.length;
    for (var i = 0; i < num; i++) {
        if (str[i] === '\r') continue;
        if (str[i] === '\t') { dst = dst + " "; continue; }

        dst = dst + str[i];
    }
    return dst;
}


function removeEmptyLines(str) {
    var dst = "";
    var num = str.length;
    var isPreprocessor = false;
    for (var i = 0; i < num; i++) {
        if (str[i] === '#') isPreprocessor = true;
        var isDestroyableChar = isLine(str, i);

        if (isDestroyableChar && !isPreprocessor) continue;
        if (isDestroyableChar && isPreprocessor) isPreprocessor = false;

        dst = dst + str[i];
    }
    return dst;
}

function removeMultiSpaces(str) {
    var dst = "";
    var num = str.length;
    for (var i = 0; i < num; i++) {
        if (isSpace(str, i) && (i === (num - 1))) continue;
        if (isSpace(str, i) && isLine(str, i - 1)) continue;
        if (isSpace(str, i) && isLine(str, i + 1)) continue;
        if (isSpace(str, i) && isSpace(str, i + 1)) continue;
        dst = dst + str[i];
    }
    return dst;
}
function removeSingleSpaces(str) {
    var dst = "";
    var num = str.length;
    for (var i = 0; i < num; i++) {
        if (i > 0) {
            if (isSpace(str, i) && ((str[i - 1] === ';') ||
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

        if (isSpace(str, i) && ((str[i + 1] === ';') ||
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

function removeSingleComments(str) {
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

function removeMultiComments(str) {
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

function minify(str) {
    str = replaceChars(str);
    str = removeSingleComments(str);
    str = removeMultiComments(str);
    str = removeMultiSpaces(str);
    str = removeSingleSpaces(str);
    str = removeEmptyLines(str);
    return str;
}
