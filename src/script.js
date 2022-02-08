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
          // u_bg: {type: 'v3', value: rgb(230, 230, 230)},
          // u_bgMain: {type: 'v3', value: rgb(42, 146, 239)}, // 藍
          // u_color1: {type: 'v3', value: rgb(192, 242, 9)}, //率
          // u_color2: {type: 'v3', value: rgb(255, 206, 32)}, //黃
          u_bgMain: {type: 'v3', value: rgb(42,146,239)}, // 藍
          // u_color1: {type: 'v3', value: rgb(255,206,32)}, //率
          // u_color2: {type: 'v3', value: rgb(195,242,9)}, //黃
          u_velocity_g: {type: 'f', value: this.settings['velocity (G)']},
          u_velocity_b: {type: 'f', value: this.settings['velocity (B)']},
          u_wavelength_g: {type: 'f', value: this.settings['wavelength (G)']},
          u_wavelength_b: {type: 'f', value: this.settings['wavelength (B)']},
          u_color_depth_g: {type: 'f', value: this.settings['color depth (G)']},
          u_color_depth_b: {type: 'f', value: this.settings['color depth (B)']},
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
      'velocity (G)': 0.15,
      'velocity (B)': 0.01,
      'velocity 3': 0.005,
      'wavelength (G)': 2,
      'color depth (G)': 1,
      'wavelength (B)': 4,
      'color depth (B)': .9,
		}

    this.gui = new dat.GUI()
    this.gui.add(this.settings, 'bearing').min(-1 * Math.PI).max(Math.PI)
    this.gui.add(this.settings, 'velocity 3').min(-0.01).max(0.01)

    const greenFolder = this.gui.addFolder('----- MAIN GREEN -----')
    greenFolder.open()
    greenFolder.add(this.settings, 'velocity (G)').min(-0.5).max(0.5)
    greenFolder.add(this.settings, 'wavelength (G)').min(1).max(6)
    greenFolder.add(this.settings, 'color depth (G)').min(0.01).max(2)

    const blueFolder = this.gui.addFolder('----- MAIN BLUE -----')
    blueFolder.open()
    blueFolder.add(this.settings, 'velocity (B)').min(-0.5).max(0.5)
    blueFolder.add(this.settings, 'wavelength (B)').min(1).max(6)
    blueFolder.add(this.settings, 'color depth (B)').min(0.01).max(2)
  }

  animate = () => {
    requestAnimationFrame( this.animate )
    this.renderer.render( this.scene, this.camera )
    this.mesh.material.uniforms.u_randomisePosition.value = new THREE.Vector2(j, j);
    
    // this.mesh.material.uniforms.u_color1.value = new THREE.Vector3(R(x,y,t/2), G(x,y,t/2), B(x,y,t/2));

    this.mesh.material.uniforms.u_velocity_g.value = this.settings['velocity (G)']
    this.mesh.material.uniforms.u_velocity_b.value = this.settings['velocity (B)']
    this.mesh.material.uniforms.u_wavelength_g.value = this.settings['wavelength (G)']
    this.mesh.material.uniforms.u_wavelength_b.value = this.settings['wavelength (B)']
    this.mesh.material.uniforms.u_color_depth_g.value = this.settings['color depth (G)']
    this.mesh.material.uniforms.u_color_depth_b.value = this.settings['color depth (B)']

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