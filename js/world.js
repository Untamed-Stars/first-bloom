
import * as THREE from 'three';

// =====================================
// PANDORA TERRAIN CONFIGURATION
// =====================================

const WORLD_SIZE = 2000;
const TERRAIN_SEGMENTS = 400;

// =====================================
// TERRAIN SHAPING
// =====================================

function terrainHeight(x, z) {

    // Broad geographical variation
    const rolling =
        Math.sin(x * 0.0025) * 12 +
        Math.cos(z * 0.003) * 10 +
        Math.sin((x + z) * 0.002) * 8;

    // Mountainous ridges
    const ridgeNoise =
        Math.sin(x * 0.004 + Math.sin(z * 0.003)) *
        Math.cos(z * 0.0035);

    const ridges = Math.pow(Math.abs(ridgeNoise), 1.5) * 100;

    // Large central forest basin
    const distance = Math.sqrt(x * x + z * z);
    const basin = -Math.exp(-(distance * distance) / 180000) * 35;

    // Raised outer mountain regions
    const mountainRing =
        Math.pow(
            THREE.MathUtils.clamp((distance - 350) / 550, 0, 1),
            1.5
        ) * 100;

    // Smaller natural surface variation
    const detail =
        Math.sin(x * 0.018) * 2 +
        Math.cos(z * 0.016) * 2 +
        Math.sin((x - z) * 0.025);

    return rolling + ridges + basin + mountainRing + detail;
}

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

    for (let i = 0; i < positions.count; i++) {

        const x = positions.getX(i);
        const z = positions.getZ(i);

        positions.setY(i, terrainHeight(x, z));
    }

    geometry.computeVertexNormals();

    // Terrain material
    const material = new THREE.MeshStandardMaterial({
        color: 0x435b35,
        roughness: 1,
        metalness: 0
    });

    const terrain = new THREE.Mesh(geometry, material);

    terrain.receiveShadow = true;
    terrain.castShadow = true;

    scene.add(terrain);

    return terrain;
}
