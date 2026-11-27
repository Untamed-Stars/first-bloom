
import * as THREE from 'three';
import { createTerrain } from './world.js';
import { Player } from './player.js';

// =====================================
// SCENE
// =====================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x789b83);

scene.fog = new THREE.FogExp2(
    0x789b83,
    0.0008
);

// =====================================
// CAMERA
// =====================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
);

camera.position.set(0, 5, 10);

// =====================================
// RENDERER
// =====================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

document
    .getElementById('game-container')
    .appendChild(renderer.domElement);

// =====================================
// LIGHTING
// =====================================

// Ambient sky and ground lighting

const ambient = new THREE.HemisphereLight(
    0xc4e5d0,
    0x263a24,
    2
);

scene.add(ambient);

// Sunlight

const sunlight = new THREE.DirectionalLight(
    0xffe5b5,
    3
);

sunlight.position.set(80, 120, 40);
sunlight.castShadow = true;

sunlight.shadow.mapSize.set(2048, 2048);

scene.add(sunlight);

// =====================================
// WORLD
// =====================================

createTerrain(scene);

const player = new Player(camera, renderer.domElement);
document.getElementById('loading-screen').style.display = 'none';

// =====================================
// GAME LOOP
// =====================================

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);
    player.update(delta);

    renderer.render(scene, camera);
}

animate();

// =====================================
// WINDOW RESIZING
// =====================================

window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});
