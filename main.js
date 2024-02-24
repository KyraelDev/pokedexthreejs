import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
const light = new THREE.AmbientLight( 0xC1C1C1 );
const directionallight = new THREE.DirectionalLight(0xffffff); // soft white light

// raycaster variabili
var mouse, raycaster;
    
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

function onMouseMove(event) {
 
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function pickBottonedirezione() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  for (let i = 0; i < intersects.length; i++) {
    // You can do anything you want here, this is just an example to make the hovered object transparent
    const newMaterial = intersects[i].object.material.clone();
    newMaterial.transparent = true;
    newMaterial.opacity = 0.5;
    intersects[i].object.material = newMaterial;
  }
}

window.addEventListener('mousemove', onMouseMove, false);

directionallight.position.set(6,1,1)

controls.update();

loader.load( '/assets/pokedex/scene2.gltf', function ( gltf ) {

  const pokedex = gltf.scene;
  const bottonidirezionali = pokedex.getObjectByName('Cube071');

  bottonidirezionali.rotation.set(0,0,0)
  // per tasto su 0,0,0.1
  //per tasto giu' 0,0,-0.1
  //per tasto destra 0,0.1,0
  //per tasto sinistra 0,-0.1 ,0

	scene.add( pokedex );
  scene.add( light );
  scene.add(directionallight);
  // pokedex.traverse(function(child){console.log(child.name);});
  console.log(bottonidirezionali);
}, undefined, function ( error ) {

	console.error( error );

} );

camera.position.z = 20;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

function onWindowResize() {
 
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
 
  renderer.setSize( window.innerWidth, window.innerHeight );
 
}

function onClick(event) {
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    console.log(intersects[0].uv);
    return;
  }
}


// window.addEventListener('resize', onWindowResize);
window.addEventListener('click', onClick);
window.addEventListener( 'mousemove', onMouseMove, false );

animate();