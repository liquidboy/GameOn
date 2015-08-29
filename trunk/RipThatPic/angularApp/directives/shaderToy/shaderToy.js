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
                    _this.sc.uiData = new UIData();
                    _this.sc.uiData.UpdateUI = function () { _this.sc.$apply(); };
                    $(element.find('#butUpdateShader')[0]).on('click', _this.updateShader.bind(_this));
                    _this.sc.shaderToy = new ShaderToy(player, editor, passManager, _this.sc.uiData);
                    //this.sc.shaderToy.UpdateCounter = (data) => { this.sc.uiData.ShaderCharCounter = data;};
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
                this.sc.res = this.sc.shaderToy.NewScriptJSON(jsnShader[0]);
                if (this.sc.res.mSuccess == false)
                    return;
                document.title = this.sc.res.mName;
                this.sc.shaderToy.StartRendering();
                this.sc.shaderToy.ResetTime();
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
            ShaderToy.prototype.NewScriptJSON = function (jsn) {
                try {
                    var res = this.mEffect.NewScriptJSON(jsn);
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
                        me.uiData.FrameRate = ffps.toFixed(1) + " fps";
                        if (me.uiData.UpdateUI)
                            me.uiData.UpdateUI.call(this);
                        me.mFpsFrame = 0;
                        me.mFpsTo = time;
                    }
                }
                renderLoop2();
            };
            ShaderToy.prototype.PauseTime = function () {
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