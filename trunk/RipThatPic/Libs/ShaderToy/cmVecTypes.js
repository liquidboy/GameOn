//===================================

function vec3(a, b, c) {
    return [a, b, c];
}

function add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function mul(a, s) {
    return [a[0] * s, a[1] * s, a[2] * s];
}

function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1],
             a[2] * b[0] - a[0] * b[2],
             a[0] * b[1] - a[1] * b[0]];
}

function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalize(v) {
    var is = 1.0 / Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] * is, v[1] * is, v[2] * is];
}

//===================================

function vec4(a, b, c, d) {
    return [a, b, c, d];
}

//===================================

function setIdentity() {
    return [1.0, 0.0, 0.0, 0.0,
             0.0, 1.0, 0.0, 0.0,
             0.0, 0.0, 1.0, 0.0,
             0.0, 0.0, 0.0, 1.0];
}


function setFromQuaternion(q) {
    var ww = q[3] * q[3];
    var xx = q[0] * q[0];
    var yy = q[1] * q[1];
    var zz = q[2] * q[2];

    return [ww + xx - yy - zz, 2.0 * (q[0] * q[1] - q[3] * q[2]), 2.0 * (q[0] * q[2] + q[3] * q[1]), 0.0,
               2.0 * (q[0] * q[1] + q[3] * q[2]), ww - xx + yy - zz, 2.0 * (q[1] * q[2] - q[3] * q[0]), 0.0,
               2.0 * (q[0] * q[2] - q[3] * q[1]), 2.0 * (q[1] * q[2] + q[3] * q[0]), ww - xx - yy + zz, 0.0,
               0.0, 0.0, 0.0, 1.0];
}

function setPerspective(fovy, aspect, znear, zfar) {
    var tan = Math.tan(fovy * Math.PI / 180.0);
    var x = 1.0 / (tan * aspect);
    var y = 1.0 / (tan);
    var c = -(zfar + znear) / (zfar - znear);
    var d = -(2.0 * zfar * znear) / (zfar - znear);

    return [x, 0.0, 0.0, 0.0,
             0.0, y, 0.0, 0.0,
             0.0, 0.0, c, d,
             0.0, 0.0, -1.0, 0.0];
}

function setLookAt(eye, tar, up) {
    var dir = [-tar[0] + eye[0], -tar[1] + eye[1], -tar[2] + eye[2]];

    m00 = dir[2] * up[1] - dir[1] * up[2];
    m01 = dir[0] * up[2] - dir[2] * up[0];
    m02 = dir[1] * up[0] - dir[0] * up[1];
    im = 1.0 / Math.sqrt(m00 * m00 + m01 * m01 + m02 * m02);
    m00 *= im;
    m01 *= im;
    m02 *= im;

    m04 = m02 * dir[1] - m01 * dir[2];
    m05 = m00 * dir[2] - m02 * dir[0];
    m06 = m01 * dir[0] - m00 * dir[1];
    im = 1.0 / Math.sqrt(m04 * m04 + m05 * m05 + m06 * m06);
    m04 *= im;
    m05 *= im;
    m06 *= im;

    m08 = dir[0];
    m09 = dir[1];
    m10 = dir[2];
    im = 1.0 / Math.sqrt(m08 * m08 + m09 * m09 + m10 * m10);
    m08 *= im;
    m09 *= im;
    m10 *= im;

    m03 = -(m00 * eye[0] + m01 * eye[1] + m02 * eye[2]);
    m07 = -(m04 * eye[0] + m05 * eye[1] + m06 * eye[2]);
    m11 = -(m08 * eye[0] + m09 * eye[1] + m10 * eye[2]);

    return [m00, m01, m02, m03,
             m04, m05, m06, m07,
             m08, m09, m10, m11,
             0.0, 0.0, 0.0, 1.0];
}


function setOrtho(left, right, bottom, top, znear, zfar) {
    var x = 2.0 / (right - left);
    var y = 2.0 / (top - bottom);
    var a = (right + left) / (right - left);
    var b = (top + bottom) / (top - bottom);
    var c = -2.0 / (zfar - znear);
    var d = -(zfar + znear) / (zfar - znear);

    return [x, 0.0, 0.0, a,
            0.0, y, 0.0, b,
            0.0, 0.0, c, d,
            0.0, 0.0, 0.0, 1.0];
}

function setTranslation(p) {
    return [1.0, 0.0, 0.0, p[0],
             0.0, 1.0, 0.0, p[1],
             0.0, 0.0, 1.0, p[2],
             0.0, 0.0, 0.0, 1.0];
}

function setProjection(fov, znear, zfar) {
    var x = 2.0 / (fov[3] + fov[2]);
    var y = 2.0 / (fov[0] + fov[1]);
    var a = (fov[3] - fov[2]) / (fov[3] + fov[2]);
    var b = (fov[0] - fov[1]) / (fov[0] + fov[1]);
    var c = -(zfar + znear) / (zfar - znear);
    var d = -(2.0 * zfar * znear) / (zfar - znear);
    return [x, 0.0, a, 0.0,
             0.0, y, b, 0.0,
             0.0, 0.0, c, d,
             0.0, 0.0, -1.0, 0.0];
    // inverse is:
    //return mat4x4( 1.0/x, 0.0f,  0.0f,   a/x,
    //               0.0f,  1.0/y, 0.0f,   b/x,
    //               0.0f,  0.0f,  0.0f,   -1.0,
    //               0.0f,  0.0f,  1.0f/d, c/d );
}


function invertFast(m) {
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

function matMul(a, b) {
    var res = [];
    for (var i = 0; i < 4; i++) {
        var x = a[4 * i + 0];
        var y = a[4 * i + 1];
        var z = a[4 * i + 2];
        var w = a[4 * i + 3];

        res[4 * i + 0] = x * b[0] + y * b[4] + z * b[8] + w * b[12];
        res[4 * i + 1] = x * b[1] + y * b[5] + z * b[9] + w * b[13];
        res[4 * i + 2] = x * b[2] + y * b[6] + z * b[10] + w * b[14];
        res[4 * i + 3] = x * b[3] + y * b[7] + z * b[11] + w * b[15];
    }

    return res;
}

function matMulpoint(m, v) {
    return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3],
             m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7],
             m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11]];
}

function matMulvec(m, v) {
    return [m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
             m[4] * v[0] + m[5] * v[1] + m[6] * v[2],
             m[8] * v[0] + m[9] * v[1] + m[10] * v[2]];
}

