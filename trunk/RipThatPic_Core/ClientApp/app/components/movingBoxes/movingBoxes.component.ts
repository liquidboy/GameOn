import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import {
    Scene, OrthographicCamera, WebGLRenderer, PCFSoftShadowMap, BoxGeometry, MeshLambertMaterial,
    FlatShading, Object3D, Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide, DirectionalLight,
    Material
} from 'three';

declare var TimelineMax: any;
declare var Expo: any;

@Component({
    selector: 'moving-boxes',
    templateUrl: './movingBoxes.component.html',
    styleUrls: ['./movingBoxes.component.css']
})
export class MovingBoxesComponent implements AfterViewInit {
    // https://codepen.io/Ivolvy/pen/VvLRmO/

    @ViewChild('container') containerEl: ElementRef;
    containerElement: HTMLDivElement;
    canvasElement: HTMLCanvasElement;
    
    constructor() {

        // if (!Detector.deferredCapable) this.useDeferred = false;

    }

    ngAfterViewInit(): void {
        this.containerElement = this.containerEl.nativeElement;

        var movingBoxes = new MovingCubes();
        movingBoxes.init(this.containerElement);
    }
}

class MovingCubes {
    scene: any = new Scene();
    camera: any;
    renderer: any;

    groupBoxes: any;
    leftBoxes: any;
    middleBoxes: any;
    rightBoxes: any;

    boxe: any;

    init = (container: HTMLElement) => {
        this.createCamera();
        this.createRenderer(container);

        this.createBoxes();

        this.createFloor();
        this.createLights();

        this.animateBoxes();

        this.render();
    };

    createCamera = () => {
        this.camera = new OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1000, 1000);
        this.camera.position.x = 100;
        this.camera.position.y = 100;
        this.camera.position.z = 100;
        //this.camera.updateProjectionMatrix();
        this.camera.lookAt(this.scene.position);
    };

    createRenderer = (container: HTMLElement) => {
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xf2f2f2);
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapType = PCFSoftShadowMap;
        this.renderer.shadowMapSoft = true;
        container.appendChild(this.renderer.domElement);
    };

    createBoxes = () => {
        var geometry = new BoxGeometry(50, 50, 50);
        var material = new MeshLambertMaterial({ color: 0xf2f2f2, shading: FlatShading });

        this.groupBoxes = new Object3D();
        this.leftBoxes = new Object3D();
        this.middleBoxes = new Object3D();
        this.rightBoxes = new Object3D();

        //create all the boxes
        for (var i = 0; i < 9; i++) {
            this.boxe = new Mesh(geometry, material);

            if (i == 0 || i == 3 || i == 6) {
                this.boxe.castShadow = true;
            }

            if (i < 3) {
                this.leftBoxes.add(this.boxe);
            }
            else if (i >= 3 && i < 6) {
                this.middleBoxes.add(this.boxe);
            }
            else {
                this.rightBoxes.add(this.boxe);
            }
        }

        this.groupBoxes.add(this.leftBoxes);
        this.groupBoxes.add(this.middleBoxes);
        this.groupBoxes.add(this.rightBoxes);

        this.scene.add(this.groupBoxes);
    };
    
    createFloor = () => {
        var geometry2 = new PlaneGeometry(500, 500); //use PlaneBufferGeometry  ? todo
        var material2 = new MeshBasicMaterial({ color: 0xf2f2f2 });
        var floor = new Mesh(geometry2, material2);
        let mat: Material = <Material>floor.material;
        mat.side = DoubleSide;
        floor.position.y = -80;
        floor.rotation.x = 90 * Math.PI / 180;
        floor.rotation.y = 0;
        floor.rotation.z = 0;
        // floor.doubleSided = true;
        floor.receiveShadow = true;
        this.scene.add(floor);
    };

    createLights = () => {
        //scene.add(new THREE.AmbientLight(0x666666));

        var shadowLight = new DirectionalLight(0xffffff, 0.5);
        shadowLight.position.set(0, 60, 0);
        shadowLight.castShadow = true;
        //shadowLight.shadowDarkness = 0.1;
        shadowLight.shadow.bias = 0.1;
        //directionalLightshadow.shadowCameraVisible = true;
        shadowLight.shadowCameraFar = 1000;
        this.scene.add(shadowLight);


        var directionalLight = new DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 40, 50);
        this.scene.add(directionalLight);
    };

    animateBoxes = () => {

        var tl = new TimelineMax({ repeat: -1, repeatDelay: 0.5 });
        tl.to(this.leftBoxes.position, 0.7, { z: 75, ease: Expo.easeOut });
        tl.to(this.rightBoxes.position, 0.7, { z: -75, ease: Expo.easeOut }, "=-0.7"); //"=-0.7" permit to synchronise the different animations by advancing the timeline execution

        tl.to(this.leftBoxes.children[1].position, 0.7, { y: 75, ease: Expo.easeOut });
        tl.to(this.leftBoxes.children[2].position, 0.7, { y: 75, ease: Expo.easeOut }, "=-0.7");
        tl.to(this.middleBoxes.children[1].position, 0.7, { y: 75, ease: Expo.easeOut }, "=-0.7");
        tl.to(this.middleBoxes.children[2].position, 0.7, { y: 75, ease: Expo.easeOut }, "=-0.7");
        tl.to(this.rightBoxes.children[1].position, 0.7, { y: 75, ease: Expo.easeOut }, "=-0.7");
        tl.to(this.rightBoxes.children[2].position, 0.7, { y: 75, ease: Expo.easeOut }, "=-0.7");

        tl.to(this.leftBoxes.children[2].position, 0.7, { y: 150, ease: Expo.easeOut });
        tl.to(this.middleBoxes.children[2].position, 0.7, { y: 150, ease: Expo.easeOut }, "=-0.7");
        tl.to(this.rightBoxes.children[2].position, 0.7, { y: 150, ease: Expo.easeOut }, "=-0.7");

        tl.to(this.leftBoxes.position, 0.7, { z: 0, ease: Expo.easeOut });
        tl.to(this.rightBoxes.position, 0.7, { z: 0, ease: Expo.easeOut }, "=-0.7");

        tl.to(this.leftBoxes.children[1].position, 0.7, { y: 0, ease: Expo.easeOut });
        tl.to(this.leftBoxes.children[2].position, 0.7, { y: 0, ease: Expo.easeOut }, "=-0.7");
        tl.to(this.middleBoxes.children[1].position, 0.7, { y: 0, ease: Expo.easeOut }, "=-0.7");
        tl.to(this.middleBoxes.children[2].position, 0.7, { y: 0, ease: Expo.easeOut }, "=-0.7");
        tl.to(this.rightBoxes.children[1].position, 0.7, { y: 0, ease: Expo.easeOut }, "=-0.7");
        tl.to(this.rightBoxes.children[2].position, 0.7, { y: 0, ease: Expo.easeOut }, "=-0.7");
        tl.to(this.groupBoxes.rotation, 0.7, { y: -Math.PI, ease: Expo.easeOut }, "=-0.7");

    };

    render = () => {
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    };
};