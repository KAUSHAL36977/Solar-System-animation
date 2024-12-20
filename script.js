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

// Load textures
const textureLoader = new THREE.TextureLoader();
const textures = {
    sun: textureLoader.load('textures/2k_sun.jpg'),
    mercury: textureLoader.load('textures/2k_mercury.jpg'),
    venus: textureLoader.load('textures/2k_venus_surface.jpg'),
    earth: textureLoader.load('textures/2k_earth_daymap.jpg'),
    mars: textureLoader.load('textures/2k_mars.jpg'),
    jupiter: textureLoader.load('textures/2k_jupiter.jpg'),
    saturn: textureLoader.load('textures/2k_saturn.jpg'),
    uranus: textureLoader.load('textures/2k_uranus.jpg'),
    neptune: textureLoader.load('textures/2k_neptune.jpg'),
};

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ map: textures.sun });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create planets
const planetData = [
    { name: 'Mercury', size: 1, distance: 10, texture: textures.mercury },
    { name: 'Venus', size: 2, distance: 15, texture: textures.venus },
    { name: 'Earth', size: 2.5, distance: 20, texture: textures.earth },
    { name: 'Mars', size: 2, distance: 25, texture: textures.mars },
    { name: 'Jupiter', size: 6, distance: 35, texture: textures.jupiter },
    { name: 'Saturn', size: 5, distance: 45, texture: textures.saturn },
    { name: 'Uranus', size: 4, distance: 55, texture: textures.uranus },
    { name: 'Neptune', size: 4, distance: 65, texture: textures.neptune },
];

const planets = [];
planetData.forEach((planet) => {
    const planetGeometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({ map: planet.texture });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

    // Position planets
    planetMesh.position.x = planet.distance;
    scene.add(planetMesh);
    planets.push(planetMesh);
});


// Step 1: Add Ambient Light (Dim general illumination)
const ambientLight = new THREE.AmbientLight(0x333333); // Dim light for general illumination
scene.add(ambientLight);

// Step 2: Add Point Light (Simulate Sun's Light)
const pointLight = new THREE.PointLight(0xffffff, 2, 1000); // Light intensity and distance (1000 units)
pointLight.position.set(0, 0, 0); // Position at the Sun's location (center of the scene)
scene.add(pointLight);

// Step 3: Add Point Light Helper (Optional, for debugging the light source)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 2); // Size of the helper is 2 units
scene.add(pointLightHelper);


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
