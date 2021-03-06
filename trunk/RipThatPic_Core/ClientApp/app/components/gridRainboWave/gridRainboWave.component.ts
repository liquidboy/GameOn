import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

declare var starlings: any;

@Component({
    selector: 'grid-rainbo-wave',
    templateUrl: './gridrainbowave.component.html',
    styleUrls: ['./gridRainboWave.component.css']
})
export class GridRainboWaveComponent implements AfterViewInit {
    // https://codepen.io/anon/pen/EbpYMq/
    // https://use-the-platform.com/starlings@1.2.0/dist/starlings.min.js


    // Do you like rainbow waves?
    readonly rainbow = true;

    // Need more performance?
    readonly HD = true;

    @ViewChild('canvas') canvasEl: ElementRef;
    
    readonly vertices = () => {
        const pixelRatio = this.HD ? window.devicePixelRatio : 1;
        const rows = this.HD ? 150 : 100;
        const multiplier = rows * rows;
        const duration = 0.4;
        const geometry = [{ x: 0, y: 0, z: 0 }];
        const pointSize = (this.HD ? 6 : 2).toFixed(1);

        let step = 0.004;
        const size = 5;
        const attributes = [
            {
                name: "aPositionStart",
                data: (i: number, total: number) => [
                    size - ((i % rows) / rows + 0.5 / rows) * (size * 2),
                    -1,
                    (size - (Math.floor(i / rows) / rows + 0.5 / rows) * size * 2) * -1
                ]
            },
            {
                name: "aControlPointOne",
                data: (i: number) => [
                    size - ((i % rows) / rows + 0.5 / rows) * (size * 2),
                    -0.5 + this.getRandom(0.2),
                    (size - (Math.floor(i / rows) / rows + 0.5 / rows) * size * 2) * -1
                ]
            },
            {
                name: "aControlPointTwo",
                data: (i: number) => [
                    size - ((i % rows) / rows + 0.5 / rows) * (size * 2),
                    -0.5 + this.getRandom(0.2),
                    (size - (Math.floor(i / rows) / rows + 0.5 / rows) * size * 2) * -1
                ]
            },
            {
                name: "aPositionEnd",
                data: (i: number) => [
                    size - ((i % rows) / rows + 0.5 / rows) * (size * 2),
                    -1,
                    (size - (Math.floor(i / rows) / rows + 0.5 / rows) * size * 2) * -1
                ]
            },
            {
                name: "aOffset",
                data: (i: number) => [i * ((1 - duration) / (multiplier - 1))]
            },
            {
                name: "aColor",
                data: (i: number, total: number) => this.getHSL(
                    this.rainbow ? i / total * 1.0 : 0.5 + i / total * 0.4,
                    0.5,
                    0.5
                )
            }
        ];

        const uniforms = [
            {
                name: "uProgress",
                type: "float",
                value: 0.8
            }
        ];

        const vertexShader = `
              attribute vec3 aPositionStart;
              attribute vec3 aControlPointOne;
              attribute vec3 aControlPointTwo;
              attribute vec3 aPositionEnd;
              attribute float aOffset;
              attribute vec3 aColor;

              uniform float uProgress;
              uniform mat4 uMVP;

              varying vec3 vColor;

              vec3 bezier4(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
                return mix(mix(mix(a, b, t), mix(b, c, t), t), mix(mix(b, c, t), mix(c, d, t), t), t);
              }

              float easeInOutQuint(float t){
                return t < 0.5 ? 16.0 * t * t * t * t * t : 1.0 + 16.0 * (--t) * t * t * t * t;
              }

              void main () {
                float tProgress = easeInOutQuint(min(1.0, max(0.0, (uProgress - aOffset)) / ${duration}));
                vec3 newPosition = bezier4(aPositionStart, aControlPointOne, aControlPointTwo, aPositionEnd, tProgress);
                gl_PointSize = ${pointSize} + ((newPosition.y + 1.0) * 80.0);
                gl_Position = uMVP * vec4(newPosition, 1.0);
                vColor = aColor;
              }
        `;

        const fragmentShader = `
              precision mediump float;

              varying vec3 vColor;

              void main() {
                 vec2 pc = 2.0 * gl_PointCoord - 1.0;
                 gl_FragColor = vec4(vColor, 1.0 - dot(pc, pc));
              }
        `;

        const onSetup = (gl: any) => {
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            gl.enable(gl.BLEND);
        };

        const onRepeat = () => {
            this.rotateY(uniforms[uniforms.length - 1].value, 0.002);
            if (uniforms[0].value < 0) {
                uniforms[0].value = 1;
            }
            uniforms[0].value -= step;
        };

        // const diff = (a, b) => Math.abs(a - b);

        // const ratio = window.innerWidth / window.innerHeight;
        // const halfWidth = window.innerWidth / 2;
        // const halfHeight = window.innerHeight / 2;
        // window.addEventListener('mousemove', (e) => {
        //   uniforms[0].value = (((e.clientX - halfWidth) / halfWidth) * ratio).toFixed(4);
        //   uniforms[1].value = (((e.clientY - halfHeight) / halfHeight)).toFixed(4) * -1;
        // });

        const options = {
            onSetup,
            onRepeat,
            pixelRatio
        };

        starlings(
            this.canvasEl.nativeElement,
            geometry,
            multiplier,
            attributes,
            uniforms,
            vertexShader,
            fragmentShader,
            options
        );
    };

    readonly initialize = this.vertices;

    readonly getRandom = (value: any) => Math.random() * value - value / 2;

    readonly rotateY = (matrix: any, angle: number) => {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const clone = JSON.parse(JSON.stringify(matrix));

        matrix[0] = clone[0] * cos - clone[8] * sin;
        matrix[1] = clone[1] * cos - clone[9] * sin;
        matrix[2] = clone[2] * cos - clone[10] * sin;
        matrix[3] = clone[3] * cos - clone[11] * sin;
        matrix[8] = clone[0] * sin + clone[8] * cos;
        matrix[9] = clone[1] * sin + clone[9] * cos;
        matrix[10] = clone[2] * sin + clone[10] * cos;
        matrix[11] = clone[3] * sin + clone[11] * cos;
    };

    readonly h2r = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
        return p;
    };

    readonly getHSL = (h: number, s: number, l: number) => {
        h = (h % 1 + 1) % 1;
        s = Math.max(0, Math.min(1, s));
        l = Math.max(0, Math.min(1, l));
        if (s === 0) return [l, l, l];
        const p = l <= 0.5 ? l * (1 + s) : l + s - l * s;
        const q = 2 * l - p;
        return [this.h2r(q, p, h + 1 / 3), this.h2r(q, p, h), this.h2r(q, p, h - 1 / 3)];
    };

    constructor() {
        
    }

    ngAfterViewInit(): void {
        this.initialize();
    }
    
}
// http://alteredqualia.com/xg/examples/abstract_mountains.html