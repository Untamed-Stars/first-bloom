
import * as THREE from 'three';

// =====================================
// WORLD CONFIGURATION
// =====================================

const WORLD_SIZE = 500;
const TERRAIN_SEGMENTS = 180;

// =====================================
// TERRAIN GENERATION
// =====================================

export function createTerrain(scene) {

    const geometry = new THREE.PlaneGeometry(
        WORLD_SIZE,
        WORLD_SIZE,
        TERRAIN_SEGMENTS,
        TERRAIN_SEGMENTS
    );

    geometry.rotateX(-Math.PI / 2);

    const positions = geometry.attributes.position;

    // Generate natural elevation

   // Flat terrain

    for (let i = 0; i < positions.count; i++) {
        positions.setY(i, 0);
    }

    geometry.computeVertexNormals();

    // Terrain material

    const material = new THREE.MeshStandardMaterial({
        color: 0x263a20,,
        roughness: 1,
        metalness: 0
    });

    const terrain = new THREE.Mesh(
        geometry,
        material
    );

    terrain.receiveShadow = true;

    scene.add(terrain);

    return terrain;
}
