
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

    for (let i = 0; i < positions.count; i++) {

        const x = positions.getX(i);
        const z = positions.getZ(i);

        const elevation =
            Math.sin(x * 0.018) * 3 +
            Math.cos(z * 0.022) * 2 +
            Math.sin((x + z) * 0.035) * 1.5 +
            Math.cos(x * 0.009) * Math.sin(z * 0.012) * 4;

        positions.setY(i, elevation);
    }

    geometry.computeVertexNormals();

    // Terrain material

    const material = new THREE.MeshStandardMaterial({
        color: 0x354b2d,
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
