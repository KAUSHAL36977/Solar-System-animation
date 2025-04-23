// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Enable antialiasing
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add Ambient Light (Dim general illumination)
const ambientLight = new THREE.AmbientLight(0x333333, 0.5); // Dim light for general illumination, reduced intensity
scene.add(ambientLight);


// Add Point Light (Sun's light)
const pointLight = new THREE.PointLight(0xffffff, 2, 1000); // Sun's light with intensity and distance
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Optional: Add a PointLight helper to debug (remove later if not needed)
const pointLightHelper = new THREE.PointLightHelper(pointLight, 2);
scene.add(pointLightHelper);

// Load textures
const textureLoader = new THREE.TextureLoader();
const textures = {
    sun: textureLoader.load('textures/sun.jpg'),
    mercury: textureLoader.load('textures/mercury.jpg'),
    venus: textureLoader.load('textures/venus.jpg'),
    earth: textureLoader.load('textures/earth.jpg'),
    mars: textureLoader.load('textures/mars.jpg'),
    jupiter: textureLoader.load('textures/jupiter.jpg'),
    saturn: textureLoader.load('textures/saturn.jpg'),
    uranus: textureLoader.load('textures/uranus.jpg'),
    neptune: textureLoader.load('textures/neptune.jpg'),
};

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({ map: textures.sun });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create planets
const planetData = [
    { name: 'Mercury', size: 0.38, distance: 7, orbitSpeed: 0.04, texture: textures.mercury },
    { name: 'Venus', size: 0.95, distance: 10, orbitSpeed: 0.03, texture: textures.venus },
    { name: 'Earth', size: 1, distance: 15, orbitSpeed: 0.02, texture: textures.earth },
    { name: 'Mars', size: 0.53, distance: 20, orbitSpeed: 0.015, texture: textures.mars },
    { name: 'Jupiter', size: 11.2, distance: 35, orbitSpeed: 0.008, texture: textures.jupiter },
    { name: 'Saturn', size: 9.4, distance: 50, orbitSpeed: 0.006, texture: textures.saturn },
    { name: 'Uranus', size: 4, distance: 65, orbitSpeed: 0.004, texture: textures.uranus },
    { name: 'Neptune', size: 3.8, distance: 80, orbitSpeed: 0.003, texture: textures.neptune },
];

const planets = [];
planetData.forEach((planet) => {
    const planetGeometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({ map: planet.texture });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.name = planet.name;
    scene.add(planetMesh);
    planets.push(planetMesh);
});

// Add Saturn's rings
const saturnRingsGeometry = new THREE.RingGeometry(10, 15, 64);
const saturnRingsMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load('textures/saturn_rings.png'), side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
const saturnRings = new THREE.Mesh(saturnRingsGeometry, saturnRingsMaterial);
saturnRings.rotation.x = Math.PI / 2.5;
scene.add(saturnRings);


// Add Skybox (Cube Texture for space background)
const skyboxTexture = new THREE.CubeTextureLoader().load(['textures/space_right.jpg', 'textures/space_left.jpg', 'textures/space_top.jpg', 'textures/space_bottom.jpg', 'textures/space_front.jpg', 'textures/space_back.jpg']);
scene.background = skyboxTexture;
// Step 2: Add Point Light (Simulate Sun's Light)
scene.add(pointLight);

// Step 3: Add Point Light Helper (Optional, for debugging the light source)
scene.add(pointLightHelper);

// Step 4: Set up Skybox (Cube Texture for space background)

// Position the camera
camera.position.z = 150;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the Sun
    sun.rotation.y += 0.004;

     // Move Saturn's rings with Saturn
     const saturn = planets.find(p => p.name === 'Saturn');
     if (saturn) {
        saturnRings.position.copy(saturn.position);
     }

     
    // Rotate planets and simulate orbits
    planets.forEach((planet, index) => {
        planet.rotation.y += 0.01; // Rotation on axis
        const speed = 0.001 * (index + 1); // Orbit speed
        planet.position.x = Math.cos(Date.now() * speed) * planetData[index].distance;
        planet.position.z = Math.sin(Date.now() * speed) * planetData[index].distance;
    });
    
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
}

animate();
