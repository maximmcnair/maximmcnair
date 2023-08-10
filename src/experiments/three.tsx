import * as THREE from "three";
// import * as dat from "dat.gui";
import { useEffect, useState } from 'react';

import { OrbitControls } from "@/utils/three-OrbitControls.js";
import { OrbitControlsGizmo } from "@/utils/three-OrbitControlsGizmo.js";

function setupThree(
  canvas: HTMLCanvasElement,
) {
  // renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(new THREE.Color(0x333333));
  // renderer.setClearColor(0x000000, 1);
  renderer.setPixelRatio( window.devicePixelRatio );
  document.body.appendChild( renderer.domElement );

  // scene
  const scene = new THREE.Scene();

  // camera
  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
  camera.position.set( 15, 12, 12 );

  // Orbit Controls
  const controls = new OrbitControls( camera, renderer.domElement );

  // Obit Controls Gizmo
  const controlsGizmo = new OrbitControlsGizmo(controls, { size: 100, padding: 8 });
  // controlsGizmo.lock = false;
  // controlsGizmo.lockX = true;
  // controlsGizmo.lockY = true;

  // Add the Gizmo to the document
  document.body.appendChild(controlsGizmo.domElement);

  // ambient light
  scene.add( new THREE.AmbientLight( 0x222222 ) );

  // directional light
  const light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 2,2, 0 );
  scene.add( light );

  // axes Helper
  const axesHelper = new THREE.AxesHelper( 15 );
  scene.add( axesHelper );

  // Grid Helper
  scene.add(new THREE.GridHelper(10, 10, "#666666", "#222222"));

  // geometry
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );

  // material
  const material = new THREE.MeshPhongMaterial( {
    color: 0x00ffff,
    transparent: true,
    opacity: 0.9,
  });

  // mesh
  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.set(0, 0.5, 0);
  scene.add( mesh );

  // GUI
  // const gui = new dat.GUI();
  // gui.add(controls, 'enabled').name("Enable Orbit Controls");
  // gui.add(controlsGizmo, 'lock').name("Lock Gizmo");
  // gui.add(controlsGizmo, 'lockX').name("Lock Gizmo's X Axis");
  // gui.add(controlsGizmo, 'lockY').name("Lock Gizmo's Y Axis");

  function animate(){
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    controls.update();
  }
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = ( window.innerWidth / window.innerHeight );
    camera.updateProjectionMatrix();
  });
}

export default function Three() {
  useEffect(() => {
    const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
    if (!canvas) return;
    
    setupThree(canvas);
  }, []);

  return <canvas id="canvas" className="canvas canvas-collab" />;
}

