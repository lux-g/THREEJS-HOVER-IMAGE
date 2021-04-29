import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import vertex from '../js/shaders/vertex.glsl'
import fragment from '../js/shaders/fragment.glsl'

import oceanImg from '../img/final-code(1).jpg'
import displacement from '../img/diss.png'




export default class Sketch{
    constructor(options) {
        this.time = 0;
        this.container = options.dom;
        this.scene = new THREE.Scene();

        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.camera = new THREE.PerspectiveCamera( 70, this.width / this.height, 0.01, 10 );
        this.camera.position.z = 1;

        this.renderer = new THREE.WebGL1Renderer( { antialias: true } );

        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.container.appendChild( this.renderer.domElement );

        //this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        //RAYCASTER
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();



        this.resize();
        this.setupResize();
        this.addObjects();
        this.mouseMovement();
        this.render();     
        //this.settings();   
    }

    // settings(){
    //     let that = this;
    //     this.settings = {
    //         progress: 0,
    //     };
    //     this.gui = new dat.GUI();
    //     this.gui.add(this.settings, "progress", 0, 1, 0.01);
    // }

    mouseMovement(){
        window.addEventListener( 'mousemove', (event)=> {
            this.mouse.x = ( event.clientX / this.width ) * 2 - 1;
	        this.mouse.y = - ( event.clientY / this.height ) * 2 + 1;

            // update the picking ray with the camera and mouse position
	        this.raycaster.setFromCamera( this.mouse, this.camera );

            // calculate objects intersecting the picking ray
            const intersects = this.raycaster.intersectObjects( this.scene.children );

            if(intersects.length > 0){
                //console.log(intersects[0])
                this.material.uniforms.mouse.value = intersects[0].point;
            }

    


        }, false );
    }

    setupResize(){
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize(){
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize( this.width, this.height );
        this.camera.aspect = this.width/this.height;
        this.camera.updateProjectionMatrix();

        // this.material.uniforms.resolution.value.x = this.width;
        // this.material.uniforms.resolution.value.y = this.height;
        // this.material.uniforms.resolution.value.z = a1;
        // this.material.uniforms.resolution.value.w = a2;
        


        // const dist = this.camera.position.z;
        // const height = 1;
        // this.camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

    }

    addObjects(){
        this.geometry = new THREE.PlaneBufferGeometry( 2.2, 1.7, 40, 40);
        this.material = new THREE.MeshNormalMaterial();

        this.material = new THREE.ShaderMaterial({
            uniforms:{
                time: {type: "f", value: 0},
                progress: {type: "f", value: 0},
                mouse: {type: "v3", value: new THREE.Vector3()},
                hover: { value: new THREE.Vector2(0.5, 0.5)},
                hoverState: { value: 0 },
                oceanTexture: {type: "t", value: new THREE.TextureLoader().load(oceanImg)},
                displacement: {type: "t", value: new THREE.TextureLoader().load(displacement)},
                resolution: { type: "v4", value: new THREE.Vector4()},
                uvRate1: { value: new THREE.Vector2(1, 1)}
            },
            fragmentShader: fragment,
            vertexShader: vertex,
            side: THREE.DoubleSide,
            //wireframe: true
        });


        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.mesh );
    }

    render() {
        this.time+=0.05;

        console.log(this.render)
        //this.mesh.rotation.x = this.time / 2000;
        //this.mesh.rotation.y = this.time / 1000;

        //uniforms time value updating
        this.material.uniforms.time.value = this.time;

        //uniforms progress
        //this.material.uniforms.progress.value = this.settings.progress;
    
        this.renderer.render( this.scene, this.camera );

        window.requestAnimationFrame(this.render.bind(this));
    }
}

new Sketch({
    dom: document.getElementById('container')
});




