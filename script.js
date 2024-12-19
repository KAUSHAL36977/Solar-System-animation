// Load Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('solar-system-container').appendChild(renderer.domElement);

// Create the sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Position the camera
camera.position.z = 30;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the sun
    sun.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();
