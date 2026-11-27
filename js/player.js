
import * as THREE from 'three';

export class Player {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        // Movement settings
        this.speed = 8;
        this.sprintSpeed = 14;
        this.jumpForce = 9;
        this.gravity = 22;

        // Player state
        this.velocityY = 0;
        this.keys = {};
        this.canJump = false;
        this.isLocked = false;

        // Mouse look
        this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');

        this.camera.position.set(0, 2, 10);

        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;

            if (event.code === 'Space' && this.canJump) {
                this.velocityY = this.jumpForce;
                this.canJump = false;
            }
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });

        this.domElement.addEventListener('click', () => {
            this.domElement.requestPointerLock();
        });

        document.addEventListener('pointerlockchange', () => {
            this.isLocked = document.pointerLockElement === this.domElement;
        });

        document.addEventListener('mousemove', (event) => {
            if (!this.isLocked) return;

            this.rotation.y -= event.movementX * 0.002;
            this.rotation.x -= event.movementY * 0.002;

            this.rotation.x = Math.max(
                -Math.PI / 2,
                Math.min(Math.PI / 2, this.rotation.x)
            );

            this.camera.quaternion.setFromEuler(this.rotation);
        });
    }

    update(delta) {
        const direction = new THREE.Vector3();

        if (this.keys['KeyW']) direction.z -= 1;
        if (this.keys['KeyS']) direction.z += 1;
        if (this.keys['KeyA']) direction.x -= 1;
        if (this.keys['KeyD']) direction.x += 1;

        direction.normalize();
        direction.applyQuaternion(
            new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0, 1, 0),
                this.rotation.y
            )
        );

        const speed = this.keys['ShiftLeft'] || this.keys['ShiftRight']
            ? this.sprintSpeed
            : this.speed;

        this.camera.position.x += direction.x * speed * delta;
        this.camera.position.z += direction.z * speed * delta;

        // Gravity
        this.velocityY -= this.gravity * delta;
        this.camera.position.y += this.velocityY * delta;

        // Basic flat-ground collision
        if (this.camera.position.y <= 2) {
            this.camera.position.y = 2;
            this.velocityY = 0;
            this.canJump = true;
        }
    }
}
