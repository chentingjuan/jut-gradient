import * as THREE from 'three'
import fragment from './shader/fragment.js'
import vertex from './shader/vertex.js'

import dat from 'dat.gui'

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function rgb(r, g, b) {
  return new THREE.Vector3(r, g, b)
}

var R = function(x, y, t) {
  return( Math.floor(192 + 64*Math.cos( (x*x-y*y)/300 + t )) )
}

var G = function(x, y, t) {
  return( Math.floor(192 + 64*Math.sin( (x*x*Math.cos(t/4)+y*y*Math.sin(t/3))/300 ) ) )
}

var B = function(x, y, t) {
  return( Math.floor(192 + 64*Math.sin( 5*Math.sin(t/9) + ((x-100)*(x-100)+(y-100)*(y-100))/1100) ))
}

let t = 0
let j = 0
let x = randomInteger(0, 32)
let y = randomInteger(0, 32)


class Sketch {

  constructor() {
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( this.renderer.domElement )
    
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
    this.camera.position.z = 5

    this.initSettings()

    this.vCheck = false;

    var randomisePosition = new THREE.Vector2(1, 2);

    let geometry = new THREE.PlaneGeometry(window.innerWidth / 2, 400, 100, 100);
    let material = new THREE.ShaderMaterial({
      uniforms: {
          u_bg: {type: 'v3', value: rgb(160, 235, 235)},
          // u_bgMain: {type: 'v3', value: rgb(42, 146, 239)}, // 藍
          // u_color1: {type: 'v3', value: rgb(192, 242, 9)}, //率
          // u_color2: {type: 'v3', value: rgb(255, 206, 32)}, //黃
          u_bgMain: {type: 'v3', value: rgb(42,146,239)}, // 藍
          u_color1: {type: 'v3', value: rgb(255,206,32)}, //率
          u_color2: {type: 'v3', value: rgb(195,242,9)}, //黃
          u_velocity_1: {type: 'f', value: this.settings['velocity 1']},
          u_velocity_2: {type: 'f', value: this.settings['velocity 2']},
          u_wavelength_1: {type: 'f', value: this.settings['wavelength 1']},
          u_wavelength_2: {type: 'f', value: this.settings['wavelength 2']},
          u_time: {type: 'f', value: 30},
          u_randomisePosition: { type: 'v2', value: randomisePosition }
      },
      fragmentShader: fragment,
      vertexShader: vertex,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    // this.mesh.position.set(-200, 270, -280);
    this.mesh.position.set(0, 0, -280);
    this.mesh.scale.multiplyScalar(4)
    this.scene.add(this.mesh);

    this.renderer.render( this.scene, this.camera );
    
    

    this.animate();
  }

  initSettings = () => {
    this.settings = {
      'bearing': 0,
      'velocity 1': 0.15,
      'velocity 2': 0.01,
      'velocity 3': 0.005,
      'wavelength 1': 2,
      'wavelength 2': 8,
		}

    this.gui = new dat.GUI()
    this.gui.add(this.settings, 'bearing').min(-1 * Math.PI).max(Math.PI)
    this.gui.add(this.settings, 'velocity 1').min(-0.5).max(0.5)
    this.gui.add(this.settings, 'velocity 2').min(-0.5).max(0.5)
    this.gui.add(this.settings, 'velocity 3').min(-0.01).max(0.01)
    this.gui.add(this.settings, 'wavelength 1').min(1).max(10)
    this.gui.add(this.settings, 'wavelength 2').min(1).max(10)
  }

  animate = () => {
    requestAnimationFrame( this.animate )
    this.renderer.render( this.scene, this.camera )
    this.mesh.material.uniforms.u_randomisePosition.value = new THREE.Vector2(j, j);
    
    this.mesh.material.uniforms.u_color1.value = new THREE.Vector3(R(x,y,t/2), G(x,y,t/2), B(x,y,t/2));

    this.mesh.material.uniforms.u_velocity_1.value = this.settings['velocity 1']
    this.mesh.material.uniforms.u_velocity_2.value = this.settings['velocity 2']
    this.mesh.material.uniforms.u_wavelength_1.value = this.settings['wavelength 1']
    this.mesh.material.uniforms.u_wavelength_2.value = this.settings['wavelength 2']

    this.mesh.material.uniforms.u_time.value = t;
    if(t % 0.1 == 0) {         
      if(this.vCheck == false) {
          x -= 1;
          if(x <= 0) {
              this.vCheck = true;
          }
      } else {
          x += 1;
          if(x >= 32) {
              this.vCheck = false;
          }

      }
    }

    this.mesh.rotation.z = this.settings.bearing

    // Increase t by a certain value every frame
    j = j + this.settings['velocity 3'];
    t = t + 0.05;
  };
  
  
}

export default Sketch