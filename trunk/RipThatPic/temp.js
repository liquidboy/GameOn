﻿[{ "ver": "0.1", "info": { "id": "MlS3Rc", "date": "1430940904", "viewed": 395, "name": "Echoplex", "username": "dila", "description": "Rusty beams inside some structure.<br\/>Simulated motion blur by blending in some of the previous frames.", "likes": 21, "published": 1, "flags": 0, "tags": ["sphere", "scene", "world"], "hasliked": 0 },
    "renderpass": [{ "inputs": [{ "id": 1, "src": "\/presets\/tex00.jpg", "ctype": "texture", "channel": 0 }], "outputs": [{ "channel": "0", "dst": "-1" }], "code": "const float pi = 3.14159;\n\nmat3 xrot(float t)\n{\n    return mat3(1.0, 0.0, 0.0,\n                0.0, cos(t),
    -sin(t),
   \n                0.0, sin(t),
        cos(t));
       \n}\n\nmat3 yrot(float t)\n{\n    return mat3(cos(t),
    0.0, -sin(t),
   \n                0.0, 1.0, 0.0,\n                sin(t),
    0.0, cos(t));
   \n}\n\nmat3 zrot(float t)\n{\n    return mat3(cos(t),
 -sin(t),
 0.0,\n                sin(t),
 cos(t),
 0.0,\n                0.0, 0.0, 1.0);
\n}\n\nfloat pshade(vec3 p)\n{\n\tfloat ac = texture2D(iChannel0, vec2(p.y,p.z)).x;\n    float bc = texture2D(iChannel0, vec2(p.x,p.z)).x;\n    float cc = texture2D(iChannel0, vec2(p.x,p.y)).x;\n    float s = ((ac + bc + cc) \/ 3.0) * 2.0 - 1.0;\n    return s;\n}\n\nfloat sphere(vec3 p)\n{\n    vec3 q = fract(p+0.5) * 2.0 - 1.0;\n\treturn 1.3 - length(q);
  \n}\n\nfloat map(vec3 p)\n{\n\treturn min(sphere(p),
 sphere(p+0.5));
\n}\n\nfloat trace(vec3 o, vec3 r)\n{\n    float t = 0.0;\n    for (int i = 0; i < 32; ++i) {\n        vec3 p = o + r * t;\n        float d = map(p);
\n        t += d * 0.5;\n    }\n    return t;\n}\n\nvec3 normal(vec3 p)\n{\n    vec3 o = vec3(0.01, 0.0, 0.0);
\n    return normalize(vec3(map(p+o.xyy) - map(p-o.xyy),
\n                          map(p+o.yxy) - map(p-o.yxy),
\n                          map(p+o.yyx) - map(p-o.yyx)));
\n}\n\nvec3 campos(float time)\n{\n    vec3 f = vec3(0.25);
\n    f.z += time;\n\treturn f;\n}\n\nfloat occlusion(vec3 origin, vec3 ray) {\n    float delta = 0.1;\n    const int samples = 16;\n    float r = 0.0;\n    for (int i = 1; i <= samples; ++i) {\n        float t = delta * float(i);
\n     \tvec3 pos = origin + ray * t;\n        float dist = map(pos);
\n        float len = abs(t - dist);
\n        r += len * pow(2.0, -float(i));
\n    }\n    return r;\n}\n\nvec4 surf(vec3 r, vec3 w, vec3 sn, float t)\n{\n    float prod = max(dot(sn,-r),
 0.0);
\n    float off = 0.5 + 0.5 * sin(pshade(w)*pi*5.0);
\n    float fog = prod \/ (1.0 + t * t + off);
\n    return vec4(vec3(fog),
off);
\n}\n\nvec3 shade(vec3 o, vec3 r)\n{\n    float t = trace(o, r);
\n    vec3 w = o + r * t;\n    vec3 sn = normal(w);
\n    \n\tfloat lit = occlusion(o, r) * 5.0;\n    \n    vec4 ac = surf(r, w, sn, t);
\n    \n    vec3 from = vec3(0.8, 0.2, 0.1);
\n    vec3 to = vec3(1.0, 1.0, 1.0);
\n    \n    float fx = 1.0 - ac.w;\n    \n    vec3 mixed = ac.xyz * mix(from, to, fx);
\n    \n    vec3 fc = lit * mixed;\n    \n    return fc;\n}\n\nvec3 raydir(vec3 r, float t)\n{\n    return r * yrot(t) * xrot(t*2.0);
\n}\n\nvoid mainImage( out vec4 fragColor, in vec2 fragCoord )\n{\n\tvec2 uv = fragCoord.xy \/ iResolution.xy;\n    uv = uv * 2.0 - 1.0;\n    uv.x *= iResolution.x \/ iResolution.y;\n    \n    vec3 r = normalize(vec3(uv, 1.0 - dot(uv,uv) * 0.333));
\n    float ms = iGlobalTime * 0.25;\n    float of = 0.01;\n    \n    vec3 ao = campos(ms);
\n    vec3 ar = raydir(r, ms);
\n    vec3 ac = shade(ao, ar);
\n    \n    vec3 bo = campos(ms-of);
\n    vec3 br = raydir(r, ms-of);
\n    vec3 bc = shade(bo, br);
\n    \n    vec3 co = campos(ms-of*2.0);
\n    vec3 cr = raydir(r, ms-of*2.0);
\n    vec3 cc = shade(co, cr);
\n    \n    ac = ac * 0.5 + bc * 0.25 + cc * 0.25;\n    \n\tfragColor = vec4(ac, 1.0);
\n}", "name": "", "description": "", "type": "image" }] }]