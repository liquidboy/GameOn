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
                this.restrict = 'E';
                this.replace = true;
                this.templateUrl = '/angularApp/partials/shader-toy.html';
                this.link = function ($scope, element, attributes) {
                    _this.sc = $scope;
                    var editor = element.find('#editor')[0];
                    var player = element.find('#player')[0];
                    var passManager = element.find('#passManager');
                    $(element.find('#butUpdateShader')[0]).on('click', _this.updateShader.bind(_this));
                    _this.sc.shaderToy = new ShaderToy(player, editor, passManager);
                    if (!_this.sc.shaderToy.mCreated)
                        return;
                    //-- get info --------------------------------------------------------
                    _this.sc.shaderId = '4t23RR';
                    //this.sc.shaderId = 'll23Rd';  //<-- ???? doesn't work :(
                    //this.sc.shaderId = 'MlS3Rc';
                    if (_this.sc.shaderId == null) {
                        _this.loadNew();
                    }
                    else {
                        _this.loadShader(_this.sc.shaderId);
                    }
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
            ShaderToyDirective.prototype.loadNew = function () {
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
                            "inputs": {
                                "id": "3",
                                "src": ["/presets/tex03.jpg"],
                                "ctype": ["texture"],
                                "channel": [0]
                            },
                            "outputs": {
                                "channel": [],
                                "dst": []
                            },
                            "type": "image",
                            "code": "void mainImage( out vec4 fragColor, in vec2 fragCoord )\n{\n\tvec2 uv = fragCoord.xy / iResolution.xy;\n\tfragColor = vec4(uv,0.5+0.5*sin(iGlobalTime),1.0);\n}",
                            "name": "",
                            "description": ""
                        }]
                };
                this.dataLoadShader([kk]);
            };
            ShaderToyDirective.prototype.dataLoadShader = function (jsnShader) {
                this.sc.res = this.sc.shaderToy.newScriptJSON(jsnShader[0]);
                if (this.sc.res.mSuccess == false)
                    return;
                document.title = this.sc.res.mName;
                this.sc.shaderToy.startRendering();
                this.sc.shaderToy.resetTime();
                if (!this.sc.res.mFailed) {
                }
            };
            ShaderToyDirective.prototype.loadShader = function (gShaderID) {
                try {
                    var res;
                    var code;
                    if (gShaderID == '4t23RR') {
                        res = [{ ver: "0.1", info: { id: "4t23RR", date: "1426631078", viewed: 1101, name: "Toon Cloud", username: "AntoineC", description: "Simple 2D layered animation. Better in full screen (could become a screen saver?) ", likes: 43, published: 1, flags: 0, tags: ["2d", "minimalist"], hasliked: 0 }, renderpass: [{ inputs: [], outputs: [], code: "", name: "", description: "", type: "image" }] }];
                        code = '\/\/ ----------------------------------------------------------------------------------------\n\/\/\t\"Toon Cloud\" by Antoine Clappier - March 2015\n\/\/\n\/\/\tLicensed under:\n\/\/  A Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.\n\/\/\thttp:\/\/creativecommons.org\/licenses\/by-nc-sa\/4.0\/\n\/\/ ----------------------------------------------------------------------------------------\n\n#define TAU 6.28318530718\n\n\nconst vec3 BackColor\t= vec3(0.0, 0.4, 0.58);\nconst vec3 CloudColor\t= vec3(0.18,0.70,0.87);\n\n\nfloat Func(float pX)\n{\n\treturn 0.6*(0.5*sin(0.1*pX) + 0.5*sin(0.553*pX) + 0.7*sin(1.2*pX));\n}\n\n\nfloat FuncR(float pX)\n{\n\treturn 0.5 + 0.25*(1.0 + sin(mod(40.0*pX, TAU)));\n}\n\n\nfloat Layer(vec2 pQ, float pT)\n{\n\tvec2 Qt = 3.5*pQ;\n\tpT *= 0.5;\n\tQt.x += pT;\n\n\tfloat Xi = floor(Qt.x);\n\tfloat Xf = Qt.x - Xi -0.5;\n\n\tvec2 C;\n\tfloat Yi;\n\tfloat D = 1.0 - step(Qt.y,  Func(Qt.x));\n\n\t\/\/ Disk:\n\tYi = Func(Xi + 0.5);\n\tC = vec2(Xf, Qt.y - Yi ); \n\tD =  min(D, length(C) - FuncR(Xi+ pT\/80.0));\n\n\t\/\/ Previous disk:\n\tYi = Func(Xi+1.0 + 0.5);\n\tC = vec2(Xf-1.0, Qt.y - Yi ); \n\tD =  min(D, length(C) - FuncR(Xi+1.0+ pT\/80.0));\n\n\t\/\/ Next Disk:\n\tYi = Func(Xi-1.0 + 0.5);\n\tC = vec2(Xf+1.0, Qt.y - Yi ); \n\tD =  min(D, length(C) - FuncR(Xi-1.0+ pT\/80.0));\n\n\treturn min(1.0, D);\n}\n\n\n\nvoid mainImage( out vec4 fragColor, in vec2 fragCoord )\n{\n\t\/\/ Setup:\n\tvec2 UV = 2.0*(fragCoord.xy - iResolution.xy\/2.0) \/ min(iResolution.x, iResolution.y);\t\n\t\n\t\/\/ Render:\n\tvec3 Color= BackColor;\n\n\tfor(float J=0.0; J<=1.0; J+=0.2)\n\t{\n\t\t\/\/ Cloud Layer: \n\t\tfloat Lt =  iGlobalTime*(0.5  + 2.0*J)*(1.0 + 0.1*sin(226.0*J)) + 17.0*J;\n\t\tvec2 Lp = vec2(0.0, 0.3+1.5*( J - 0.5));\n\t\tfloat L = Layer(UV + Lp, Lt);\n\n\t\t\/\/ Blur and color:\n\t\tfloat Blur = 4.0*(0.5*abs(2.0 - 5.0*J))\/(11.0 - 5.0*J);\n\n\t\tfloat V = mix( 0.0, 1.0, 1.0 - smoothstep( 0.0, 0.01 +0.2*Blur, L ) );\n\t\tvec3 Lc=  mix( CloudColor, vec3(1.0), J);\n\n\t\tColor =mix(Color, Lc,  V);\n\t}\n\n\tfragColor = vec4(Color, 1.0);\n}\n\n\n';
                    }
                    else if (gShaderID == 'll23Rd') {
                        res = [{ ver: "0.1", info: { id: "ll23Rd", date: "1431588925", viewed: 2056, name: "Companion Cube Remix", username: "ChristinaCoffin", description: "Remixed a couple existing shadertoys that had nothing to do with a companion cube to make a [Companion Cube]  <br/>See the tex() + heartMapping() func for my main experiment of mixing procedural heart shape in raymarching object", likes: 42, published: 1, flags: 0, tags: ["procedural", "raymarching"], hasliked: 0 }, renderpass: [{ inputs: [], outputs: [], code: "", name: "", description: "", type: "image" }] }];
                        code = '\/\/ Companion Cube Remix - @christinacoffin\n\/\/\t- heart shape mapping doesnt completely play nice with the parallax mapping, something to improve upon.\n\/\/ \t\n\/\/ modified version of Parallax mapping demo by nimitz (twitter: @stormoid)  : https:\/\/www.shadertoy.com\/view\/4lSGRh\n\/\/ modified procedural heartshape by Iq : https:\/\/www.shadertoy.com\/view\/XsfGRn\n\n\/\/Show only the raymarched geometry (for comparison)\n\/\/#define RAYMARCHED_ONLY\n\n\/\/The amount of parallax\n#define PARALLAX_SCALE .2\n\n\/\/Scale the texture offset as a function of incidence (much better results)\n#define USE_OFFSET_SCALING\n#define OFFSET_SCALE 4.\n\n\/\/Bump mapping intensity\n#define BUMP_STRENGTH .21\n#define BUMP_WIDTH 0.004\n\n\/\/Main texture scale\nconst float texscl = 2.5;\n\n#define ITR 70\n#define FAR 15.\n#define time iGlobalTime\n\nmat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,-s,s,c);}\nfloat hash(vec2 x){\treturn fract(cos(dot(x.xy,vec2(2.31,53.21))*124.123)*412.0); }\n\nfloat sdfsw = 0.; \/\/Global mouse control\n\nfloat length4(in vec3 p ){\n\tp = p*p; p = p*p;\n\treturn pow( p.x + p.y + p.z, 1.0\/4.0 );\n}\n\nfloat map(vec3 p)\n{\n    float d = mix(length(p)-1.1,length4(p)-1.,sdfsw-0.3);\n    d = min(d, -(length4(p)-4.));\n    return d*.95;\n}\n\nfloat march(in vec3 ro, in vec3 rd)\n{\n\tfloat precis = 0.001;\n    float h=precis*2.0;\n    float d = 0.;\n    for( int i=0; i<ITR; i++ )\n    {\n        if( abs(h)<precis || d>FAR ) break;\n        d += h;\n\t    float res = map(ro+rd*d);\n        h = res;\n    }\n\treturn d;\n}\n\nvec3 normal(in vec3 p)\n{  \n    vec2 e = vec2(-1., 1.)*0.005;   \n\treturn normalize(e.yxx*map(p + e.yxx) + e.xxy*map(p + e.xxy) + \n\t\t\t\t\t e.xyx*map(p + e.xyx) + e.yyy*map(p + e.yyy) );   \n}\n\n\/\/From TekF (https:\/\/www.shadertoy.com\/view\/ltXGWS)\nfloat cells(in vec3 p)\n{\n    p = fract(p\/2.0)*2.0;\n    p = min(p, 2.0-p);\n    return 1.-min(length(p),length(p-1.0));\n}\n\nvec4 heartMapping( in vec2 p )\n{\t\n\tp.y -= 0.25;\n\n    \/\/ background color\n    \/\/ make this black for now since we use the heart shape to displace things and dont want the other parts affected (keep it black colored)\n    vec3 bcol = vec3(0,0,0);\/\/1.0,0.8,0.7-0.07*p.y)*(1.0-0.25*length(p));\n\n    float tt = mod(iGlobalTime,1.5)\/1.5;\n    float ss = pow(tt,.2)*0.5 + 0.5;\n    ss = 1.0 + ss*0.5*sin(tt*6.2831*3.0 + p.y*0.5)*exp(-tt*4.0);\n    p *= vec2(0.5,1.5) + ss*vec2(0.5,-0.5);\n\n    \/\/ shape\n    float a = atan(p.x,p.y)\/3.141593;\n    float r = length(p);\n    float h = abs(a);\n    float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)\/(6.0-5.0*h);\n\n\t\/\/ color\n\tfloat s = d;\/\/1.0-0.5*clamp(r\/d,0.0,1.0);\n    \n\ts = 0.5;\/\/ + 0.5*p.x;\n\ts *= 1.0;\/\/-0.25*r;\n\ts = 0.5 + 0.6*s;\n\n\ts *= 0.5+0.5*pow( 1.0-clamp(r\/d, 0.0, 1.0 ), 0.1 );\n\n\tvec3 hcol = vec3(1.0,0.0,0.3)*s;\n\t\n    vec3 col = mix( bcol, hcol, smoothstep( -0.01, 0.01, d-r) );\n\n    col.x *= ss;\/\/fluctate color based on the beating animation\n    col.y = ss;\/\/\n\n    \/\/todo: we could encode other shapes in other color channels and mix them in tex() differently\n    \n    return vec4(col,1.0);\n}\n\nfloat tex( vec3 p )\n{\n    p *= texscl;\n    float rz= 0.0;\/\/-0.5;\n    float z= 1.;\n    \n    \/\/ do the Heart shape mapping before the parallax loop warps the position data\n    \/\/ triplanar map it so we get it on all 6 sides\n    float heartScaleFactor = 1.1;\n    vec4 heart0 = heartMapping( p.xy * heartScaleFactor );\n    vec4 heart1 = heartMapping( p.zy * heartScaleFactor );\n    vec4 heart2 = heartMapping( p.xz * heartScaleFactor );\n    \n    heart0 = max( heart0, heart1 );\n    heart0 = max( heart0, heart2 );\n    float heartMask = (heart0.x + heart1.x + heart2.x *0.333);\n    heartMask = clamp(heartMask, 0.0, 1.0);\n    \n    for ( int i=0; i<2; i++ )\n    { \n        #ifndef RAYMARCHED_ONLY\n        rz += cells(p)\/z;\n        #endif\n        \n        p *= 2.5*0.15;\n        z *= -1.1*0.15;\n    }\n \n    return clamp(heartMask+(rz*rz)*4.95,0.,1.)*2.73 - 1.0-heartMask;\n}\n\n\/*\n\tThe idea is to displace the shaded position along the surface normal towards\n\tthe viewer,\tthe tgt vector is the displacement vector, then\tI apply a scaling\n\tfactor to the displacement and also have an incidence based\toffset scaling set up.\n*\/\nvec3 prlpos(in vec3 p, in vec3 n, in vec3 rd)\n{\n    \/\/vec3 tgt = cross(cross(rd,n), n); \/\/Naive method (easier to grasp?)\n    vec3 tgt = n*dot(rd, n) - rd; \/\/Optimized\n\n#ifdef USE_OFFSET_SCALING\n    tgt \/= (abs(dot(tgt,rd)))+OFFSET_SCALE;\n    \n#endif\n    \n    p += tgt*tex(p)*PARALLAX_SCALE;\n    return p;\n}\n\nfloat btex(in vec3 p)\n{\n    float rz=  tex(p);\n    rz += tex(p*20.)*0.01; \/\/Extra (non-parallaxed) bump mapping can be added\n    \n \/\/   rz += tex(p);\n    \n    return rz;\n}\n\nvec3 bump(in vec3 p, in vec3 n, in float ds)\n{\n    vec2 e = vec2(BUMP_WIDTH*sqrt(ds)*0.5, 0);\n    float n0 = btex(p);\n    vec3 d = vec3(btex(p+e.xyy)-n0, btex(p+e.yxy)-n0, btex(p+e.yyx)-n0)\/e.x;\n    vec3 tgd = d - n*dot(n ,d);\n    n = normalize(n-tgd*BUMP_STRENGTH*2.\/(ds));\n    return n;\n}\n\nvoid mainImage( out vec4 fragColor, in vec2 fragCoord )\n{\t\n\tvec2 bp = fragCoord.xy\/iResolution.xy*2.-1.; \n    vec2 p = bp;\n\tp.x*=iResolution.x\/iResolution.y;\n\tvec2 mo = iMouse.xy \/ iResolution.xy-.5;\n    mo = (mo==vec2(-.5))?mo=vec2(0.4,-0.25):mo;\n\tmo.x *= iResolution.x\/iResolution.y;\n\t\n    \n    mo.y = 0.425;\/\/ lock the shape to be companion cube-ish in appearance\n    mo.y += (0.5 * abs(sin(iGlobalTime)))-0.15; \n    \n    p.x += mo.x*1.;\n    sdfsw = mo.y*4.;\n    \n\tvec3 ro = vec3(0.,0.,4.);\n    vec3 rd = normalize(vec3(p,-3.+sin(time*0.9+sin(time))));\n    mat2 mx = mm2(time*.1+sin(time*0.4)-0.2);\n    mat2 my = mm2(time*0.07+cos(time*0.33)-0.1);\n    ro.xz *= mx;rd.xz *= mx;\n    ro.xy *= my;rd.xy *= my;\n\t\n\tfloat rz = march(ro,rd);\n\t\n    vec3 col = vec3(0);\n    \n    if ( rz < FAR )\n    {\n        vec3 pos = ro+rz*rd;\n        vec3 nor= normal( pos );\n        pos = prlpos(pos,nor,rd);\n        float d = distance(ro,pos);\n        nor = bump(pos, nor, d);\n\n        vec3 ligt = normalize( vec3(-.5, 0.5, -0.3) );\n        float dif = clamp( dot( nor, ligt ), 0.0, 1.0 );\n        float bac = clamp( dot( nor, normalize(vec3(-ligt))), 0.0, 1.0 );\n        float spe = pow(clamp( dot( reflect(rd,nor), ligt ), 0.0, 1.0 ),10.);\n        float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );\n        vec3 brdf = vec3(0.3);\n        brdf += bac*vec3(0.3);\n        brdf += dif*0.5;\n        \n        float tx=  tex(pos);\n        col = sin(vec3(1.5+mo.x*0.4,2.2+mo.x*0.25,2.7)+tx*1.2+4.2)*0.6+0.55;\n        col = col*brdf + spe*.5\/sqrt(rz) +.25*fre;\n        \n        col = mix(col,vec3(.0),clamp(exp(rz*0.43-4.),0.,1.));\n    }\n \n    col.x *= col.z;\/\/colorize\n    col.xyz = col.zxy;\/\/color channel flip!   \n    \n    \n    col = clamp(col*1.05,0.,1.);\n    col *= pow(smoothstep(0.,.2,(bp.x + 1.)*(bp.y + 1.)*(bp.x - 1.)*(bp.y - 1.)),.3);\n    col *= smoothstep(3.9,.5,sin(p.y*.5*iResolution.y+time*10.))+0.1;\n    col -= hash(col.xy+p.xy)*.025;\n\t\n\n    \n\tfragColor = vec4( col, 1.0 );\n}';
                    }
                    else if (gShaderID == 'MlS3Rc') {
                        res = [{ "ver": "0.1", "info": { "id": "MlS3Rc", "date": "1430940904", "viewed": 395, "name": "Echoplex", "username": "dila", "description": "Rusty beams inside some structure.<br\/>Simulated motion blur by blending in some of the previous frames.", "likes": 21, "published": 1, "flags": 0, "tags": ["sphere", "scene", "world"], "hasliked": 0 }, "renderpass": [{ "inputs": [{ "id": 1, "src": "\/Assets\/Textures\/tex00.jpg", "ctype": "texture", "channel": 0 }], "outputs": [{ "channel": "0", "dst": "-1" }], "code": "", "name": "", "description": "", "type": "image" }] }];
                        code = 'const float pi = 3.14159;\n\nmat3 xrot(float t)\n{\n    return mat3(1.0, 0.0, 0.0,\n                0.0, cos(t), -sin(t),\n                0.0, sin(t), cos(t));\n}\n\nmat3 yrot(float t)\n{\n    return mat3(cos(t), 0.0, -sin(t),\n                0.0, 1.0, 0.0,\n                sin(t), 0.0, cos(t));\n}\n\nmat3 zrot(float t)\n{\n    return mat3(cos(t), -sin(t), 0.0,\n                sin(t), cos(t), 0.0,\n                0.0, 0.0, 1.0);\n}\n\nfloat pshade(vec3 p)\n{\n\tfloat ac = texture2D(iChannel0, vec2(p.y,p.z)).x;\n    float bc = texture2D(iChannel0, vec2(p.x,p.z)).x;\n    float cc = texture2D(iChannel0, vec2(p.x,p.y)).x;\n    float s = ((ac + bc + cc) \/ 3.0) * 2.0 - 1.0;\n    return s;\n}\n\nfloat sphere(vec3 p)\n{\n    vec3 q = fract(p+0.5) * 2.0 - 1.0;\n\treturn 1.3 - length(q);  \n}\n\nfloat map(vec3 p)\n{\n\treturn min(sphere(p), sphere(p+0.5));\n}\n\nfloat trace(vec3 o, vec3 r)\n{\n    float t = 0.0;\n    for (int i = 0; i < 32; ++i) {\n        vec3 p = o + r * t;\n        float d = map(p);\n        t += d * 0.5;\n    }\n    return t;\n}\n\nvec3 normal(vec3 p)\n{\n    vec3 o = vec3(0.01, 0.0, 0.0);\n    return normalize(vec3(map(p+o.xyy) - map(p-o.xyy),\n                          map(p+o.yxy) - map(p-o.yxy),\n                          map(p+o.yyx) - map(p-o.yyx)));\n}\n\nvec3 campos(float time)\n{\n    vec3 f = vec3(0.25);\n    f.z += time;\n\treturn f;\n}\n\nfloat occlusion(vec3 origin, vec3 ray) {\n    float delta = 0.1;\n    const int samples = 16;\n    float r = 0.0;\n    for (int i = 1; i <= samples; ++i) {\n        float t = delta * float(i);\n     \tvec3 pos = origin + ray * t;\n        float dist = map(pos);\n        float len = abs(t - dist);\n        r += len * pow(2.0, -float(i));\n    }\n    return r;\n}\n\nvec4 surf(vec3 r, vec3 w, vec3 sn, float t)\n{\n    float prod = max(dot(sn,-r), 0.0);\n    float off = 0.5 + 0.5 * sin(pshade(w)*pi*5.0);\n    float fog = prod \/ (1.0 + t * t + off);\n    return vec4(vec3(fog),off);\n}\n\nvec3 shade(vec3 o, vec3 r)\n{\n    float t = trace(o, r);\n    vec3 w = o + r * t;\n    vec3 sn = normal(w);\n    \n\tfloat lit = occlusion(o, r) * 5.0;\n    \n    vec4 ac = surf(r, w, sn, t);\n    \n    vec3 from = vec3(0.8, 0.2, 0.1);\n    vec3 to = vec3(1.0, 1.0, 1.0);\n    \n    float fx = 1.0 - ac.w;\n    \n    vec3 mixed = ac.xyz * mix(from, to, fx);\n    \n    vec3 fc = lit * mixed;\n    \n    return fc;\n}\n\nvec3 raydir(vec3 r, float t)\n{\n    return r * yrot(t) * xrot(t*2.0);\n}\n\nvoid mainImage( out vec4 fragColor, in vec2 fragCoord )\n{\n\tvec2 uv = fragCoord.xy \/ iResolution.xy;\n    uv = uv * 2.0 - 1.0;\n    uv.x *= iResolution.x \/ iResolution.y;\n    \n    vec3 r = normalize(vec3(uv, 1.0 - dot(uv,uv) * 0.333));\n    float ms = iGlobalTime * 0.25;\n    float of = 0.01;\n    \n    vec3 ao = campos(ms);\n    vec3 ar = raydir(r, ms);\n    vec3 ac = shade(ao, ar);\n    \n    vec3 bo = campos(ms-of);\n    vec3 br = raydir(r, ms-of);\n    vec3 bc = shade(bo, br);\n    \n    vec3 co = campos(ms-of*2.0);\n    vec3 cr = raydir(r, ms-of*2.0);\n    vec3 cc = shade(co, cr);\n    \n    ac = ac * 0.5 + bc * 0.25 + cc * 0.25;\n    \n\tfragColor = vec4(ac, 1.0);\n}';
                    }
                    res[0].renderpass[0].code = code;
                    this.dataLoadShader(res);
                }
                catch (e) {
                    var ttt = e;
                }
            };
            ShaderToyDirective.prototype.loadShaderOld = function (gShaderID) {
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
        var ShaderToy = (function () {
            function ShaderToy(playerElement, editorElement, passElement) {
                this.playerElement = playerElement;
                this.editorElement = editorElement;
                this.passElement = passElement;
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
                this.SetErrors = function (result, fromScript) {
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
                this.SetPasses = function (passes) {
                    //for (var i = 0; i < passes.length; i++)
                    //    this.AddTab(passes[i].mType, i, i == 0);
                    //this.AddPlusTab();
                };
                var canvas = $(playerElement).find('#demogl')[0];
                this.mCharCounter = $('#shaderCharCounter');
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
                this.mEffect = new Effect(null, null, this.mGLContext, this.mCanvas.width, this.mCanvas.height, this.refreshTexturThumbail, this, false, false);
                this.mCreated = true;
            }
            ShaderToy.prototype.newScriptJSON = function (jsn) {
                try {
                    var res = this.mEffect.newScriptJSON(jsn);
                    var num = res.length;
                    for (var i = 0; i < num; i++) {
                        this.mDocs[i] = window['CodeMirror'].Doc(res[i].mShader, "text/x-glsl");
                    }
                    this.mActiveDoc = 0;
                    this.mCodeEditor.swapDoc(this.mDocs[this.mActiveDoc]);
                    this.setChars();
                    this.setFlags();
                    this.mCodeEditor.clearHistory();
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
            ShaderToy.prototype.startRendering = function () {
                var me = this;
                function renderLoop2() {
                    if (me.mGLContext == null)
                        return;
                    requestAnimationFrame(renderLoop2);
                    if (me.mIsPaused && !me.mForceFrame) {
                        me.mEffect.UpdateInputs(me.mActiveDoc, false);
                        return;
                    }
                    me.mForceFrame = false;
                    var time = performance.now();
                    var ltime = me.mTOffset + time - me.mTo;
                    if (me.mIsPaused)
                        ltime = me.mTf;
                    else
                        me.mTf = ltime;
                    me.mEffect.Paint(ltime / 1000.0, me.mMouseOriX, me.mMouseOriY, me.mMousePosX, me.mMousePosY, me.mIsPaused);
                    //if (me.mSendFrame) me.mLiveCreator.SendUpdate();
                    me.mSendFrame = false;
                    me.mFpsFrame++;
                    //document.getElementById("myTime").innerHTML = (ltime / 1000.0).toFixed(2);
                    if ((time - me.mFpsTo) > 1000) {
                        var ffps = 1000.0 * me.mFpsFrame / (time - me.mFpsTo);
                        //document.getElementById("myFramerate").innerHTML = ffps.toFixed(1) + " fps";
                        me.mFpsFrame = 0;
                        me.mFpsTo = time;
                    }
                }
                renderLoop2();
            };
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
            };
            ShaderToy.prototype.resetTime = function () {
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
                this.mCharCounter.innerHTML = str.length + " chars";
            };
            ShaderToy.prototype.setFlags = function () {
                if (this.mEffect == null)
                    return;
                var flags = this.mEffect.calcFlags();
                //var eleVR = document.getElementById("myVR");
                //eleVR.style.visibility = (flags.mFlagVR == true) ? "visible" : "hidden";
            };
            ShaderToy.prototype.showChars = function () {
                var str = this.mCodeEditor.getValue();
                str = this.minify(str);
                //alert( str );
                var ve = document.getElementById("centerScreen");
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
            };
            //gShaderToy.SetTexture(gCurrentEditingSlot, {mType:'texture', mID:28, mSrc:'/presets/tex15.png'})
            ShaderToy.prototype.SetTexture = function (slot, url) {
                this.mEffect.NewTexture(this.mActiveDoc, slot, url);
            };
            return ShaderToy;
        })();
        var Effect = (function () {
            function Effect(vr, ac, gl, xres, yres, callback, obj, forceMuted, forcePaused) {
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
                var precision = this.DetermineShaderPrecission(gl);
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
            Effect.prototype.DetermineShaderPrecission = function (gl) {
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
                if (this.CreateShader(gl, vstr, h1 + fstr, false).mSuccess == true)
                    return h1;
                if (this.CreateShader(gl, vstr, h2 + fstr, false).mSuccess == true)
                    return h2;
                if (this.CreateShader(gl, vstr, h3 + fstr, false).mSuccess == true)
                    return h3;
                return "";
            };
            Effect.prototype.CreateShader = function (gl, tvs, tfs, nativeDebug) {
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
            Effect.prototype.newScriptJSON = function (jobj) {
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
            Effect.prototype.calcFlags = function () {
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
            Effect.prototype.StopOutputs = function () {
                var gl = this.mGLContext;
                var wa = this.mAudioContext;
                var num = this.mPasses.length;
                for (var i = 0; i < num; i++) {
                    if (!this.mPasses[i].mUsed)
                        continue;
                    this.mPasses[i].StopOutput(wa, gl);
                }
            };
            Effect.prototype.ResumeOutputs = function () {
                var gl = this.mGLContext;
                var wa = this.mAudioContext;
                if (gl == null)
                    return;
                var num = this.mPasses.length;
                for (var i = 0; i < num; i++) {
                    if (!this.mPasses[i].mUsed)
                        continue;
                    this.mPasses[i].ResumeOutput(wa, gl);
                }
            };
            return Effect;
        })();
        var EffectPass = (function () {
            function EffectPass(gl, precission, supportDerivatives, callback, obj, forceMuted, forcePaused, quadVBO, outputGainNode, id) {
                this.MakeHeader_Image = function (precission, supportDerivatives) {
                    var header = this.mPrecision;
                    var headerlength = 3;
                    if (this.mSupportsDerivatives) {
                        header += "#extension GL_OES_standard_derivatives : enable\n";
                        headerlength++;
                    }
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
                };
                this.MakeHeader_Sound = function (precission, supportDerivatives) {
                    var header = this.mPrecision;
                    var headerlength = 3;
                    if (this.mSupportsDerivatives) {
                        header += "#extension GL_OES_standard_derivatives : enable\n";
                        headerlength++;
                    }
                    header += "uniform float     iChannelTime[4];\n" +
                        "uniform float     iBlockOffset;\n" +
                        "uniform vec4      iDate;\n" +
                        "uniform float     iSampleRate;\n" +
                        "uniform vec3      iChannelResolution[4];\n";
                    headerlength += 5;
                    for (var i = 0; i < this.mInputs.length; i++) {
                        var inp = this.mInputs[i];
                        if (inp != null && inp.mInfo.mType == "cubemap")
                            header += "uniform samplerCube iChannel" + i + ";\n";
                        else
                            header += "uniform sampler2D iChannel" + i + ";\n";
                        headerlength++;
                    }
                    this.mHeader = header;
                    this.mHeaderLength = headerlength;
                };
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
            EffectPass.prototype.NewShader = function (gl, shaderCode) {
                if (gl == null)
                    return "No GL";
                var res = null;
                if (this.mType == "sound")
                    res = this.NewShader_Sound(gl, shaderCode);
                else
                    res = this.NewShader_Image(gl, shaderCode);
                this.mSource = shaderCode;
                return res;
            };
            EffectPass.prototype.NewTexture = function (wa, gl, slot, url) {
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
                    };
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
                        };
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
                    texture.video.paused = true; //this.mForcePaused;
                    texture.video.mPaused = true; //this.mForcePaused;
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
                        if (texture.video.hasFalled == true) {
                            alert("Error: cannot load video");
                            return;
                        }
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
                        if (this.mForceMuted)
                            return;
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
                        if (this.mForceMuted)
                            return;
                        if (texture.audio.hasFalled == true) {
                            return;
                        }
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
                    };
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
            };
            EffectPass.prototype.NewShader_Image = function (gl, shaderCode) {
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
            };
            EffectPass.prototype.NewShader_Sound = function (gl, shaderCode) {
                var vsSource = "attribute vec2 pos; void main() { gl_Position = vec4(pos.xy,0.0,1.0); }";
                var res = this.CreateShader(gl, vsSource, this.mHeader + shaderCode + this.mSoundPassFooter, false);
                if (res.mSuccess == false)
                    return res.mInfo;
                if (this.mProgram != null)
                    gl.deleteProgram(this.mProgram);
                this.mProgram = res.mProgram;
                // force sound to be regenerated
                this.mFrame = 0;
                return null;
            };
            EffectPass.prototype.createGLTexture = function (ctx, image, format, texture) {
                if (ctx == null)
                    return;
                ctx.bindTexture(ctx.TEXTURE_2D, texture);
                ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
                ctx.texImage2D(ctx.TEXTURE_2D, 0, format, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR_MIPMAP_LINEAR);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.REPEAT);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.REPEAT);
                ctx.generateMipmap(ctx.TEXTURE_2D);
                ctx.bindTexture(ctx.TEXTURE_2D, null);
            };
            EffectPass.prototype.createGLTextureNearestRepeat = function (ctx, image, texture) {
                if (ctx == null)
                    return;
                ctx.bindTexture(ctx.TEXTURE_2D, texture);
                ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
                ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
                ctx.bindTexture(ctx.TEXTURE_2D, null);
            };
            EffectPass.prototype.createGLTextureNearest = function (ctx, image, texture) {
                if (ctx == null)
                    return;
                ctx.bindTexture(ctx.TEXTURE_2D, texture);
                ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
                ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                ctx.bindTexture(ctx.TEXTURE_2D, null);
            };
            EffectPass.prototype.createGLTextureLinear = function (ctx, image, texture) {
                if (ctx == null)
                    return;
                ctx.bindTexture(ctx.TEXTURE_2D, texture);
                ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, false);
                ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, image);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                ctx.bindTexture(ctx.TEXTURE_2D, null);
            };
            EffectPass.prototype.createAudioTexture = function (ctx, texture) {
                if (ctx == null)
                    return;
                ctx.bindTexture(ctx.TEXTURE_2D, texture);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.LUMINANCE, 512, 2, 0, ctx.LUMINANCE, ctx.UNSIGNED_BYTE, null);
                ctx.bindTexture(ctx.TEXTURE_2D, null);
            };
            EffectPass.prototype.createKeyboardTexture = function (ctx, texture) {
                if (ctx == null)
                    return;
                ctx.bindTexture(ctx.TEXTURE_2D, texture);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
                ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
                ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.LUMINANCE, 256, 2, 0, ctx.LUMINANCE, ctx.UNSIGNED_BYTE, null);
                ctx.bindTexture(ctx.TEXTURE_2D, null);
            };
            EffectPass.prototype.Create = function (passType, wa, gl) {
                this.mType = passType;
                this.mUsed = true;
                this.mSource = null;
                if (passType == "image")
                    this.Create_Image(wa, gl);
                else
                    this.Create_Sound(wa, gl);
            };
            EffectPass.prototype.CreateShader = function (gl, tvs, tfs, nativeDebug) {
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
            EffectPass.prototype.Create_Image = function (wa, gl) {
                this.MakeHeader(null, null);
                this.mSampleRate = 44100;
                this.mSupportsVR = false;
                this.mProgram = null;
                this.mProgramVR = null;
            };
            EffectPass.prototype.Destroy_Image = function (wa, gl) {
            };
            EffectPass.prototype.Create_Sound = function (wa, gl) {
                this.MakeHeader(null, null);
                this.mSoundPassFooter = "void main()" +
                    "{" +
                    "float t = iBlockOffset + (gl_FragCoord.x + gl_FragCoord.y*512.0)/44100.0;" +
                    "vec2 y = mainSound( t );" +
                    "vec2 v  = floor((0.5+0.5*y)*65536.0);" +
                    "vec2 vl =   mod(v,256.0)/255.0;" +
                    "vec2 vh = floor(v/256.0)/255.0;" +
                    "gl_FragColor = vec4(vl.x,vh.x,vl.y,vh.y);" +
                    "}";
                this.mProgram = null;
                this.mSampleRate = 44100;
                this.mPlayTime = 60;
                this.mPlaySamples = this.mPlayTime * this.mSampleRate;
                this.mBuffer = wa.createBuffer(2, this.mPlaySamples, this.mSampleRate);
                //-------------------
                this.mTextureDimensions = 512;
                this.mRenderTexture = this.createEmptyTextureNearest(gl, this.mTextureDimensions, this.mTextureDimensions);
                this.mRenderFBO = this.createFBO(gl, this.mRenderTexture);
                //-----------------------------
                // ArrayBufferView pixels;
                this.mTmpBufferSamples = this.mTextureDimensions * this.mTextureDimensions;
                this.mData = new Uint8Array(this.mTmpBufferSamples * 4);
                this.mPlayNode = null;
            };
            EffectPass.prototype.Destroy_Sound = function (wa, gl) {
                if (this.mPlayNode != null)
                    this.mPlayNode.stop();
                this.mPlayNode = null;
                this.mBuffer = null;
                this.mData = null;
                this.deleteFBO(gl, this.mRenderFBO);
                this.deleteTexture(gl, this.mRenderTexture);
            };
            EffectPass.prototype.MakeHeader = function (precission, supportDerivatives) {
                if (this.mType == "image")
                    this.MakeHeader_Image(precission, supportDerivatives);
                else
                    this.MakeHeader_Sound(precission, supportDerivatives);
            };
            EffectPass.prototype.createEmptyTextureNearest = function (gl, xres, yres) {
                var tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, xres, yres, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.bindTexture(gl.TEXTURE_2D, null);
                return tex;
            };
            EffectPass.prototype.createFBO = function (gl, texture0) {
                var fbo = gl.createFramebuffer();
                gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture0, 0);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                return fbo;
            };
            EffectPass.prototype.deleteFBO = function (gl, fbo) {
                gl.deleteFramebuffer(fbo);
            };
            EffectPass.prototype.Paint = function (vrData, wa, gl, da, time, mouseOriX, mouseOriY, mousePosX, mousePosY, xres, yres, isPaused) {
                if (this.mType == "sound") {
                    if (this.mFrame == 0 && !isPaused) {
                        // make sure all textures are loaded
                        for (var i = 0; i < this.mInputs.length; i++) {
                            var inp = this.mInputs[i];
                            if (inp == null)
                                continue;
                            if (inp.mInfo.mType == "texture" && !inp.loaded)
                                return;
                            if (inp.mInfo.mType == "cubemap" && !inp.loaded)
                                return;
                        }
                        this.Paint_Sound(wa, gl, da);
                        this.mFrame++;
                    }
                }
                else {
                    this.Paint_Image(vrData, wa, gl, da, time, mouseOriX, mouseOriY, mousePosX, mousePosY, xres, yres);
                    this.mFrame++;
                }
            };
            EffectPass.prototype.Paint_Sound = function (wa, gl, d) {
                var dates = [d.getFullYear(),
                    d.getMonth(),
                    d.getDate(),
                    d.getHours() * 60.0 * 60 + d.getMinutes() * 60 + d.getSeconds()];
                var resos = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.mRenderFBO);
                gl.viewport(0, 0, this.mTextureDimensions, this.mTextureDimensions);
                gl.useProgram(this.mProgram);
                for (var i = 0; i < this.mInputs.length; i++) {
                    var inp = this.mInputs[i];
                    gl.activeTexture(gl.TEXTURE0 + i);
                    if (inp == null) {
                        gl.bindTexture(gl.TEXTURE_2D, null);
                    }
                    else if (inp.mInfo.mType == "texture") {
                        if (inp.loaded == false) {
                            gl.bindTexture(gl.TEXTURE_2D, null);
                        }
                        else {
                            gl.bindTexture(gl.TEXTURE_2D, inp.globject);
                            resos[3 * i + 0] = inp.image.width;
                            resos[3 * i + 1] = inp.image.height;
                            resos[3 * i + 2] = 1;
                        }
                    }
                }
                var l2 = gl.getUniformLocation(this.mProgram, "iBlockOffset");
                var l7 = gl.getUniformLocation(this.mProgram, "iDate");
                gl.uniform4fv(l7, dates);
                var l8 = gl.getUniformLocation(this.mProgram, "iChannelResolution");
                gl.uniform3fv(l8, resos);
                var l9 = gl.getUniformLocation(this.mProgram, "iSampleRate");
                gl.uniform1f(l9, this.mSampleRate);
                var ich0 = gl.getUniformLocation(this.mProgram, "iChannel0");
                if (ich0 != null)
                    gl.uniform1i(ich0, 0);
                var ich1 = gl.getUniformLocation(this.mProgram, "iChannel1");
                if (ich1 != null)
                    gl.uniform1i(ich1, 1);
                var ich2 = gl.getUniformLocation(this.mProgram, "iChannel2");
                if (ich2 != null)
                    gl.uniform1i(ich2, 2);
                var ich3 = gl.getUniformLocation(this.mProgram, "iChannel3");
                if (ich3 != null)
                    gl.uniform1i(ich3, 3);
                var l1 = gl.getAttribLocation(this.mProgram, "pos");
                gl.bindBuffer(gl.ARRAY_BUFFER, this.mQuadVBO);
                gl.vertexAttribPointer(l1, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(l1);
                //--------------------------------
                var bufL = this.mBuffer.getChannelData(0); // Float32Array
                var bufR = this.mBuffer.getChannelData(1); // Float32Array
                var numBlocks = this.mPlaySamples / this.mTmpBufferSamples;
                for (var j = 0; j < numBlocks; j++) {
                    var off = j * this.mTmpBufferSamples;
                    gl.uniform1f(l2, off / this.mSampleRate);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                    gl.readPixels(0, 0, this.mTextureDimensions, this.mTextureDimensions, gl.RGBA, gl.UNSIGNED_BYTE, this.mData);
                    for (var i = 0; i < this.mTmpBufferSamples; i++) {
                        bufL[off + i] = -1.0 + 2.0 * (this.mData[4 * i + 0] + 256.0 * this.mData[4 * i + 1]) / 65535.0;
                        bufR[off + i] = -1.0 + 2.0 * (this.mData[4 * i + 2] + 256.0 * this.mData[4 * i + 3]) / 65535.0;
                    }
                }
                gl.disableVertexAttribArray(l1);
                gl.useProgram(null);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                //-------------------------------
                if (this.mPlayNode != null) {
                    this.mPlayNode.disconnect();
                    this.mPlayNode.stop();
                }
                this.mPlayNode = wa.createBufferSource();
                this.mPlayNode.buffer = this.mBuffer;
                this.mPlayNode.connect(this.mGainNode);
                this.mPlayNode.state = this.mPlayNode.noteOn;
                this.mPlayNode.start(0);
            };
            EffectPass.prototype.Paint_Image = function (vrData, wa, gl, d, time, mouseOriX, mouseOriY, mousePosX, mousePosY, xres, yres) {
                var times = [0.0, 0.0, 0.0, 0.0];
                var dates = [d.getFullYear(),
                    d.getMonth(),
                    d.getDate(),
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
                    else if (inp.mInfo.mType == "music") {
                        if (inp.audio.mPaused == false && inp.audio.mForceMuted == false) {
                            if (wa != null) {
                                inp.audio.mSound.mAnalyser.getByteFrequencyData(inp.audio.mSound.mFreqData);
                                inp.audio.mSound.mAnalyser.getByteTimeDomainData(inp.audio.mSound.mWaveData);
                            }
                            if (this.mTextureCallbackFun != null)
                                this.mTextureCallbackFun(this.mTextureCallbackObj, i, (wa == null) ? null : inp.audio.mSound.mFreqData, false, false, 2, inp.audio.currentTime, this.mID);
                        }
                        if (inp.loaded == false) {
                            gl.bindTexture(gl.TEXTURE_2D, null);
                        }
                        else {
                            times[i] = inp.audio.currentTime;
                            gl.bindTexture(gl.TEXTURE_2D, inp.globject);
                            if (inp.audio.mForceMuted == true) {
                                times[i] = 10.0 + time;
                                var num = inp.audio.mSound.mFreqData.length;
                                for (var j = 0; j < num; j++) {
                                    var x = j / num;
                                    var f = (0.75 + 0.25 * Math.sin(10.0 * j + 13.0 * time)) * Math.exp(-3.0 * x);
                                    if (j < 3)
                                        f = Math.pow(0.50 + 0.5 * Math.sin(6.2831 * time), 4.0) * (1.0 - j / 3.0);
                                    inp.audio.mSound.mFreqData[j] = Math.floor(255.0 * f) | 0;
                                }
                                var num = inp.audio.mSound.mFreqData.length;
                                for (var j = 0; j < num; j++) {
                                    var f = 0.5 + 0.15 * Math.sin(17.0 * time + 10.0 * 6.2831 * j / num) * Math.sin(23.0 * time + 1.9 * j / num);
                                    inp.audio.mSound.mWaveData[j] = Math.floor(255.0 * f) | 0;
                                }
                            }
                            if (inp.audio.mPaused == false) {
                                var waveLen = Math.min(inp.audio.mSound.mWaveData.length, 512);
                                gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 512, 1, gl.LUMINANCE, gl.UNSIGNED_BYTE, inp.audio.mSound.mFreqData);
                                gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 1, waveLen, 1, gl.LUMINANCE, gl.UNSIGNED_BYTE, inp.audio.mSound.mWaveData);
                            }
                            resos[3 * i + 0] = 512;
                            resos[3 * i + 1] = 2;
                            resos[3 * i + 2] = 1;
                        }
                    }
                    else if (inp.mInfo.mType == "mic") {
                        if (inp.mForceMuted == false) {
                            if (wa != null && inp.mAnalyser != null) {
                                inp.mAnalyser.getByteFrequencyData(inp.mFreqData);
                                inp.mAnalyser.getByteTimeDomainData(inp.mWaveData);
                            }
                            if (this.mTextureCallbackFun != null)
                                this.mTextureCallbackFun(this.mTextureCallbackObj, i, (wa == null) ? null : inp.mFreqData, false, false, 2, 0, this.mID);
                        }
                        if (inp.loaded == false) {
                            gl.bindTexture(gl.TEXTURE_2D, null);
                        }
                        else {
                            gl.bindTexture(gl.TEXTURE_2D, inp.globject);
                            if (inp.mForceMuted == true) {
                                times[i] = 10.0 + time;
                                var num = inp.mFreqData.length;
                                for (var j = 0; j < num; j++) {
                                    var x = j / num;
                                    var f = (0.75 + 0.25 * Math.sin(10.0 * j + 13.0 * time)) * Math.exp(-3.0 * x);
                                    if (j < 3)
                                        f = Math.pow(0.50 + 0.5 * Math.sin(6.2831 * time), 4.0) * (1.0 - j / 3.0);
                                    inp.mFreqData[j] = Math.floor(255.0 * f) | 0;
                                }
                                var num = inp.mFreqData.length;
                                for (var j = 0; j < num; j++) {
                                    var f = 0.5 + 0.15 * Math.sin(17.0 * time + 10.0 * 6.2831 * j / num) * Math.sin(23.0 * time + 1.9 * j / num);
                                    inp.mWaveData[j] = Math.floor(255.0 * f) | 0;
                                }
                                if (this.mTextureCallbackFun != null)
                                    this.mTextureCallbackFun(this.mTextureCallbackObj, i, (wa == null) ? null : inp.mFreqData, false, false, 2, 0, this.mID);
                            }
                            var waveLen = Math.min(inp.mWaveData.length, 512);
                            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 512, 1, gl.LUMINANCE, gl.UNSIGNED_BYTE, inp.mFreqData);
                            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 1, waveLen, 1, gl.LUMINANCE, gl.UNSIGNED_BYTE, inp.mWaveData);
                            resos[3 * i + 0] = 512;
                            resos[3 * i + 1] = 2;
                            resos[3 * i + 2] = 1;
                        }
                    }
                }
                //-----------------------------------
                var prog = (vrData == null) ? this.mProgram : this.mProgramVR;
                gl.useProgram(prog);
                var l2 = gl.getUniformLocation(prog, "iGlobalTime");
                if (l2 != null)
                    gl.uniform1f(l2, time);
                var l3 = gl.getUniformLocation(prog, "iResolution");
                if (l3 != null)
                    gl.uniform3f(l3, xres, yres, 1.0);
                var l4 = gl.getUniformLocation(prog, "iMouse");
                if (l4 != null)
                    gl.uniform4fv(l4, mouse);
                var l5 = gl.getUniformLocation(prog, "iChannelTime");
                if (l5 != null)
                    gl.uniform1fv(l5, times);
                var l7 = gl.getUniformLocation(prog, "iDate");
                if (l7 != null)
                    gl.uniform4fv(l7, dates);
                var l8 = gl.getUniformLocation(prog, "iChannelResolution");
                if (l8 != null)
                    gl.uniform3fv(l8, resos);
                var l9 = gl.getUniformLocation(prog, "iSampleRate");
                if (l9 != null)
                    gl.uniform1f(l9, this.mSampleRate);
                var ich0 = gl.getUniformLocation(prog, "iChannel0");
                if (ich0 != null)
                    gl.uniform1i(ich0, 0);
                var ich1 = gl.getUniformLocation(prog, "iChannel1");
                if (ich1 != null)
                    gl.uniform1i(ich1, 1);
                var ich2 = gl.getUniformLocation(prog, "iChannel2");
                if (ich2 != null)
                    gl.uniform1i(ich2, 2);
                var ich3 = gl.getUniformLocation(prog, "iChannel3");
                if (ich3 != null)
                    gl.uniform1i(ich3, 3);
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
            };
            EffectPass.prototype.invertFast = function (m) {
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
                for (var i = 0; i < 16; i++)
                    inv[i] = inv[i] * det;
                return inv;
            };
            EffectPass.prototype.matMulpoint = function (m, v) {
                return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3],
                    m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7],
                    m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11]];
            };
            EffectPass.prototype.deleteTexture = function (gl, tex) {
                gl.deleteTexture(tex);
            };
            EffectPass.prototype.UpdateInputs = function (wa, forceUpdate) {
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
                    else if (inp.mInfo.mType == "music") {
                        if (inp.audio.mPaused == false && inp.audio.mForceMuted == false) {
                            if (wa != null) {
                                inp.audio.mSound.mAnalyser.getByteFrequencyData(inp.audio.mSound.mFreqData);
                                inp.audio.mSound.mAnalyser.getByteTimeDomainData(inp.audio.mSound.mWaveData);
                            }
                            if (this.mTextureCallbackFun != null)
                                this.mTextureCallbackFun(this.mTextureCallbackObj, i, (wa == null) ? null : inp.audio.mSound.mFreqData, false, false, 2, inp.audio.currentTime, this.mID);
                        }
                    }
                    else if (inp.mInfo.mType == "mic") {
                        if (inp.mForceMuted == false) {
                            if (wa != null) {
                                inp.mAnalyser.getByteFrequencyData(inp.mFreqData);
                                inp.mAnalyser.getByteTimeDomainData(inp.mWaveData);
                            }
                            if (this.mTextureCallbackFun != null)
                                this.mTextureCallbackFun(this.mTextureCallbackObj, i, (wa == null) ? null : inp.mFreqData, false, false, 2, 0, this.mID);
                        }
                    }
                }
            };
            return EffectPass;
        })();
        var myapp = angular.module('bootstrapApp');
        myapp.directive("dShaderToy", ShaderToyDirective.prototype.injection());
    })(Directives = Application.Directives || (Application.Directives = {}));
})(Application || (Application = {}));
//# sourceMappingURL=shaderToy.js.map