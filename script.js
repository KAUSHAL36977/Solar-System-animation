// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('solar-system-container').appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x333333); // Dim light for general illumination
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2); // Sun's light
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Create the Sun with a texture
const sunTexture = new THREE.TextureLoader().load('textures/sun.jpg');
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create planets with textures
const planetData = [
    { name: 'Mercury', size: 1, distance: 10, texture: 'textures/mercury.jpg' },
    { name: 'Venus', size: 2, distance: 15, texture: 'textures/venus.jpg' },
    { name: 'Earth', size: 2.5, distance: 20, texture: 'textures/earth.jpg' },
    { name: 'Mars', size: 2, distance: 25, texture: 'textures/mars.jpg' },
    { name: 'Jupiter', size: 6, distance: 35, texture: 'textures/jupiter.jpg' },
    { name: 'Saturn', size: 5, distance: 45, texture: 'textures/saturn.jpg' },
    { name: 'Uranus', size: 4, distance: 55, texture: 'textures/uranus.jpg' },
    { name: 'Neptune', size: 4, distance: 65, texture: 'textures/neptune.jpg' }
];

const planets = [];
planetData.forEach((planet) => {
    const texture = new THREE.TextureLoader().load(planet.texture);
    const planetGeometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({ map: texture });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

    // Position planets
    planetMesh.position.x = planet.distance;
    scene.add(planetMesh);
    planets.push(planetMesh);
});

// Position the camera
camera.position.z = 100;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the Sun
    sun.rotation.y += 0.005;

    // Rotate planets and simulate orbits
    planets.forEach((planet, index) => {
        planet.rotation.y += 0.01; // Rotation on axis
        const speed = 0.001 * (index + 1); // Orbit speed
        planet.position.x = Math.cos(Date.now() * speed) * planetData[index].distance;
        planet.position.z = Math.sin(Date.now() * speed) * planetData[index].distance;
    });

    renderer.render(scene, camera);
}

animate();
