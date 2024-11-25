
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';
import { OrbitControls } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/shaders/FXAAShader.js';

const scene = new THREE.Scene(); // Creates the 3D scene.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Sets up a perspective camera.
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" }); // WebGL renderer with antialiasing for smooth visuals.
renderer.setSize(window.innerWidth, window.innerHeight); // Matches renderer to the screen size.
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // Adjusts rendering for high-DPI displays.
renderer.toneMapping = THREE.ACESFilmicToneMapping; // Applies realistic tone mapping.
renderer.outputEncoding = THREE.sRGBEncoding; // Ensures proper color encoding.
document.body.appendChild(renderer.domElement); // Attaches the renderer to the webpage.

// Set a background color for the scene
scene.background = new THREE.Color(0x1a1a1a); // Dark gray background

// Add ambient light for general illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Add a directional light for highlights and shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Bright white light
directionalLight.position.set(5, 10, 7); // Position the light
scene.add(directionalLight);

// Create a basic geometry (e.g., a rotating cube)
const geometry = new THREE.BoxGeometry(1, 1, 1); // Create a cube
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff }); // Use a standard material with color
const cube = new THREE.Mesh(geometry, material); // Create the mesh
scene.add(cube); // Add the cube to the scene

// Position the camera
camera.position.z = 5; // Move the camera back so we can see the cube

// Animation loop
function animate() {
    requestAnimationFrame(animate); // Request the next frame
    cube.rotation.x += 0.01; // Rotate the cube
    cube.rotation.y += 0.01; // Rotate the cube
    renderer.render(scene, camera); // Render the scene
}

// Start the animation
animate();

// Initialize renderer, camera, and composer (assuming composer is defined for post-processing)
const setResolution = (width, height) => { // Function to update resolution.
    // Update camera aspect ratio and projection matrix
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Set the renderer size
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance

    // Set composer size for post-processing
    if (composer) {
        composer.setSize(width, height);
    }

    // Log performance information
    console.log(`Resolution set to: ${width}x${height}`);
};

// Call the function to set 4K resolution
setResolution(3840, 2160); // Sets the resolution to 3840x2160 (4K)

// Additional improvements for better performance
const optimizeScene = () => {
    // Set the camera's near and far clipping planes for better depth perception
    camera.near = 0.1; // Closer near clipping plane
    camera.far = 1000; // Reasonable far clipping plane

    // Optionally, you can add a performance monitor
    const stats = new Stats(); // If you want to use the stats.js library
    document.body.appendChild(stats.dom);

    // Animation loop with performance monitoring
    const animate = () => {
        requestAnimationFrame(animate);
        
        // Update your scene objects, e.g., rotating a cube
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;

        // Render with composer if using post-processing
        if (composer) {
            composer.render();
        } else {
            renderer.render(scene, camera);
        }

        // Update performance stats
        stats.update();
    };

    animate();
};

// Call the optimization function
optimizeScene();

// Post-processing
const composer = new EffectComposer(renderer);

// Render pass to render the scene
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Bloom pass for enhanced lighting effects
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.21; // Adjust based on your scene's brightness
bloomPass.strength = 1.5; // Increase strength for a more pronounced bloom effect
bloomPass.radius = 0.4; // Adjust radius for softer or sharper bloom
composer.addPass(bloomPass);

// FXAA pass for anti-aliasing
const fxaaPass = new ShaderPass(FXAAShader);
const pixelRatio = Math.min(window.devicePixelRatio, 2); // Cap pixel ratio for performance
fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
composer.addPass(fxaaPass);

// Resize handler for maintaining resolution on window resize
window.addEventListener('resize', () => {
    setResolution(window.innerWidth, window.innerHeight); // Update resolution
    composer.setSize(window.innerWidth, window.innerHeight); // Update composer size
});

// Animation loop with post-processing
const animate = () => {
    requestAnimationFrame(animate);
    
    // Update your scene objects here, e.g., rotating planets, etc.
    // Example: planet.rotation.y += 0.01;

    // Render the scene with post-processing
    composer.render();
};

// Start the animation
animate();
// Set camera position and add controls
camera.position.set(0, 50, 100);
const controls = new OrbitControls(camera, renderer.domElement);

// Import Three.js
import * as THREE from 'three';

// Setup the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the skybox
const loader = new THREE.CubeTextureLoader();
const skyboxTexture = loader.load([
    'path/to/px.jpg', 'path/to/nx.jpg',
    'path/to/py.jpg', 'path/to/ny.jpg',
    'path/to/pz.jpg', 'path/to/nz.jpg'
]);
scene.background = skyboxTexture;

// Add stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const starCount = 10000;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Create asteroids
const asteroidGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
for (let i = 0; i < 50; i++) {
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    asteroid.position.set((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
    asteroid.rotation.x = Math.random() * Math.PI;
    asteroid.rotation.y = Math.random() * Math.PI;
    scene.add(asteroid);
}

// Create a black hole
const blackHoleGeometry = new THREE.SphereGeometry(1, 32, 32);
const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
blackHole.position.set(0, 0, -50);
scene.add(blackHole);

// Create a nebula
const nebulaGeometry = new THREE.SphereGeometry(15, 32, 32);
const nebulaMaterial = new THREE.MeshBasicMaterial({ color: 0xFF00FF, transparent: true, opacity: 0.5 });
const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
scene.add(nebula);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

// Set camera position
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate asteroids
    scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) {
            child.rotation.y += 0.01; // Rotate asteroids
        }
    });

    // Render the scene
    renderer.render(scene, camera);
}

animate();

// Import Three.js
import * as THREE from 'three';

// Setup the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the skybox
const loader = new THREE.CubeTextureLoader();
const skyboxTexture = loader.load([
    'path/to/px.jpg', 'path/to/nx.jpg',
    'path/to/py.jpg', 'path/to/ny.jpg',
    'path/to/pz.jpg', 'path/to/nz.jpg'
]);
scene.background = skyboxTexture;

// Add stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const starCount = 10000;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Create asteroids
const asteroidGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
for (let i = 0; i < 50; i++) {
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    asteroid.position.set((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
    asteroid.rotation.x = Math.random() * Math.PI;
    asteroid.rotation.y = Math.random() * Math.PI;
    scene.add(asteroid);
}

// Create a black hole
const blackHoleGeometry = new THREE.SphereGeometry(1, 32, 32);
const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
blackHole.position.set(0, 0, -50);
scene.add(blackHole);

// Create a nebula
const nebulaGeometry = new THREE.SphereGeometry(15, 32, 32);
const nebulaMaterial = new THREE.MeshBasicMaterial({ color: 0xFF00FF, transparent: true, opacity: 0.5 });
const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
scene.add(nebula);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Soft ambient light
scene.add(ambientLight);

// Add point light
const pointLight = new THREE.PointLight(0xFFFFFF, 1.5, 300); // Bright point light
pointLight.position.set(50, 50, 50); // Position the light
pointLight.castShadow = true; // Enable shadows
pointLight.shadow.mapSize.width = 1024; // Adjust shadow map size
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.bias = -0.001; // Adjust bias to reduce shadow artifacts
scene.add(pointLight);

// Optional: Add a helper to visualize the point light
const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointLightHelper);

// Set camera position
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate asteroids
    scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) {
            child.rotation.y += 0.01; // Rotate asteroids
        }
    });

    // Render the scene
    renderer.render(scene, camera);
}

animate();

// Import Three.js
import * as THREE from 'three';

// Setup the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load high-resolution textures
const textureLoader = new THREE.TextureLoader();
const textures = {
    Sun: textureLoader.load('https://example.com/high-res-sun-texture.jpg'),
    Mercury: textureLoader.load('https://example.com/high-res-mercury-texture.jpg'),
    Venus: textureLoader.load('https://example.com/high-res-venus-texture.jpg'),
    Earth: textureLoader.load('https://example.com/high-res-earth-texture.jpg'),
    Mars: textureLoader.load('https://example.com/high-res-mars-texture.jpg'),
    Jupiter: textureLoader.load('https://example.com/high-res-jupiter-texture.jpg'),
    Saturn: textureLoader.load('https://example.com/high-res-saturn-texture.jpg'),
    SaturnRings: textureLoader.load('https://example.com/high-res-saturn-rings-texture.png'),
    Uranus: textureLoader.load('https://example.com/high-res-uranus-texture.jpg'),
    Neptune: textureLoader.load('https://example.com/high-res-neptune-texture.jpg'),
    Pluto: textureLoader.load('https://example.com/high-res-pluto-texture.jpg')
};

// Create planets with better materials
function createPlanet(texture, size, position) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.5,
        metalness: 0.1
    });
    const planet = new THREE.Mesh(geometry, material);
    planet.position.copy(position);
    return planet;
}

// Add planets to the scene
scene.add(createPlanet(textures.Sun, 5, new THREE.Vector3(0, 0, 0)));
scene.add(createPlanet(textures.Mercury, 0.3, new THREE.Vector3(6, 0, 0)));
scene.add(createPlanet(textures.Venus, 0.5, new THREE.Vector3(8, 0, 0)));
scene.add(createPlanet(textures.Earth, 0.5, new THREE.Vector3(10, 0, 0)));
scene.add(createPlanet(textures.Mars, 0.4, new THREE.Vector3(12, 0, 0)));
scene.add(createPlanet(textures.Jupiter, 1.2, new THREE.Vector3(15, 0, 0)));
scene.add(createPlanet(textures.Saturn, 1, new THREE.Vector3(18, 0, 0)));
scene.add(createPlanet(textures.Uranus, 0.8, new THREE.Vector3(21, 0, 0)));
scene.add(createPlanet(textures.Neptune, 0.8, new THREE.Vector3(24, 0, 0)));
scene.add(createPlanet(textures.Pluto, 0.2, new THREE.Vector3(26, 0, 0)));

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Add point light
const pointLight = new THREE.PointLight(0xFFFFFF, 1.5, 300);
pointLight.position.set(50, 50, 50);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.bias = -0.001;
scene.add(pointLight);







import * as THREE from 'three';

// Setup the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load textures
const textureLoader = new THREE.TextureLoader();
const textures = {
    Sun: textureLoader.load('https://example.com/high-res-sun-texture.jpg'),
    Mercury: textureLoader.load('https://example.com/high-res-mercury-texture.jpg'),
    Venus: textureLoader.load('https://example.com/high-res-venus-texture.jpg'),
    Earth: textureLoader.load('https://example.com/high-res-earth-texture.jpg'),
    Mars: textureLoader.load('https://example.com/high-res-mars-texture.jpg'),
    Jupiter: textureLoader.load('https://example.com/high-res-jupiter-texture.jpg'),
    Saturn: textureLoader.load('https://example.com/high-res-saturn-texture.jpg'),
    Uranus: textureLoader.load('https://example.com/high-res-uranus-texture.jpg'),
    Neptune: textureLoader.load('https://example.com/high-res-neptune-texture.jpg'),
    Pluto: textureLoader.load('https://example.com/high-res-pluto-texture.jpg'),
    Moon: textureLoader.load('https://example.com/high-res-moon-texture.jpg'),
    Nebula: textureLoader.load('https://example.com/nebulatexture.png'),
};

// Create a point light for the Sun
const sunLight = new THREE.PointLight(0xffffff, 1, 500);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Create celestial bodies
const celestialBodies = [
    { name: 'Sun', radius: 10, orbitRadius: 0, rotationSpeed: 0.001, revolutionSpeed: 0, texture: textures.Sun },
    { name: 'Mercury', radius: 0.383, orbitRadius: 20, rotationSpeed: 0.0059, revolutionSpeed: 4.74, texture: textures.Mercury },
    { name: 'Venus', radius: 0.949, orbitRadius: 30, rotationSpeed: 0.0243, revolutionSpeed: 3.50, texture: textures.Venus },
    { name: 'Earth', radius: 1, orbitRadius: 40, rotationSpeed: 1, revolutionSpeed: 2.98, texture: textures.Earth },
    { name: 'Mars', radius: 0.532, orbitRadius: 50, rotationSpeed: 0.9747, revolutionSpeed: 2.41, texture: textures.Mars },
    { name: 'Jupiter', radius: 11.21, orbitRadius: 70, rotationSpeed: 2.4, revolutionSpeed: 1.31, texture: textures.Jupiter },
    { name: 'Saturn', radius: 9.45, orbitRadius: 90, rotationSpeed: 2.3, revolutionSpeed: 0.97, texture: textures.Saturn },
    { name: 'Uranus', radius: 4, orbitRadius: 110, rotationSpeed: 1.4, revolutionSpeed: 0.68, texture: textures.Uranus },
    { name: 'Neptune', radius: 3.88, orbitRadius: 130, rotationSpeed: 1.5, revolutionSpeed: 0.54, texture: textures.Neptune },
    { name: 'Pluto', radius: 0.186, orbitRadius: 150, rotationSpeed: 0.67, revolutionSpeed: 0.47, texture: textures.Pluto },
];

// Create planets and their moons
const planets = [];
celestialBodies.forEach(body => {
    const geometry = new THREE.SphereGeometry(body.radius, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: body.texture });
    const planet = new THREE.Mesh(geometry, material);
    planet.userData = { rotationSpeed: body.rotationSpeed, revolutionSpeed: body.revolutionSpeed, orbitRadius: body.orbitRadius };
    planets.push(planet);
    scene.add(planet);
});

// Create Earth's Moon
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
const moonMaterial = new THREE.MeshStandardMaterial({ map: textures.Moon });
const moon = new

// Optional: Add a helper to
// Create celestial bodies (using more accurate scale)
const celestialBodies = [
    { name: 'Sun', radius: 10, orbitRadius: 0, rotationSpeed: 0.001, revolutionSpeed: 0, axialTilt: 7.25, description: 'The Sun is the star at the center of the Solar System.' },
    { name: 'Mercury', radius: 0.383, orbitRadius: 20, rotationSpeed: 0.0059, revolutionSpeed: 4.74, axialTilt: 0.034, description: 'Mercury is the smallest planet in the Solar System and the closest to the Sun.' },
    { name: 'Venus', radius: 0.949, orbitRadius: 30, rotationSpeed: 0.0243, revolutionSpeed: 3.50, axialTilt: 177.3, description: 'Venus is the second planet from the Sun and is Earth's closest planetary neighbor.' },
    { name: 'Earth', radius: 1, orbitRadius: 40, rotationSpeed: 1, revolutionSpeed: 2.98, axialTilt: 23.5, description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.' },
    { name: 'Mars', radius: 0.532, orbitRadius: 50, rotationSpeed: 0.9747, revolutionSpeed: 2.41, axialTilt: 25.2, description: 'Mars is the fourth planet from the Sun and is often described as the "Red Planet".' },
    { name: 'Jupiter', radius: 11.21, orbitRadius: 70, rotationSpeed: 2.4, revolutionSpeed: 1.31, axialTilt: 3.1, description: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System.' },
    { name: 'Saturn', radius: 9.45, orbitRadius: 90, rotationSpeed: 2.3, revolutionSpeed: 0.97, axialTilt: 26.7, description: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System.' },
    { name: 'Uranus', radius: 4, orbitRadius: 110, rotationSpeed: 1.4, revolutionSpeed: 0.68, axialTilt: 97.8, description: 'Uranus is the seventh planet from the Sun and is the third-largest planetary radius and fourth-largest planetary mass in the Solar System.' },
    { name: 'Neptune', radius: 3.88, orbitRadius: 130, rotationSpeed: 1.5, revolutionSpeed: 0.54, axialTilt: 28.3, description: 'Neptune is the eighth and farthest-known Solar planet from the Sun.' },
    { name: 'Pluto', radius: 0.186, orbitRadius: 150, rotationSpeed: 0.16, revolutionSpeed: 0.47, axialTilt: 122.5, description: 'Pluto is a dwarf planet in the Kuiper belt, a ring of bodies beyond the orbit of Neptune.' }
];

const planets = new Map();
const orbits = [];
const labels = [];

celestialBodies.forEach(body => {
    const geometry = new THREE.SphereGeometry(body.radius, 64, 64);
    const material = new THREE.MeshPhongMaterial({
        map: textures[body.name],
        bumpScale: 0.05,
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    if (body.name === 'Saturn') {
        const ringGeometry = new THREE.RingGeometry(body.radius * 1.2, body.radius * 2, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            map: textures.SaturnRings,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        mesh.add(rings);
    }
    
    scene.add(mesh);
    planets.set(body.name, { mesh, ...body });
    
    if (body.name !== 'Sun') {
        const orbitGeometry = new THREE.RingGeometry(body.orbitRadius, body.orbitRadius + 0.1, 128);
        const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
        orbits.push(orbit);
    }
    
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = body.name;
    const label = new CSS2DObject(labelDiv);
    label.position.set(0, body.radius + 0.5, 0);
    mesh.add(label);
    labels.push(label);
});
import * as THREE from 'three';

// Create the scene
const scene = new THREE.Scene();

// Create asteroid belt
const asteroidBelt = new THREE.Group();
const asteroidGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });

for (let i = 0; i < 2000; i++) {
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    const angle = Math.random() * Math.PI * 2; // Random angle
    const radius = THREE.MathUtils.randFloat(60, 65); // Random radius for placement
    asteroid.position.set(
        radius * Math.cos(angle), // x position
        THREE.MathUtils.randFloatSpread(2), // random y position for some variation
        radius * Math.sin(angle) // z position
    );
    asteroidBelt.add(asteroid);
}

scene.add(asteroidBelt);

// Setup camera, renderer, and animation loop (if needed)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    // Optionally rotate the asteroid belt for a dynamic effect
    asteroidBelt.rotation.y += 0.001;
    renderer.render(scene, camera);
}

animate();
// Improve lighting
const sunLight = new THREE.PointLight(0xFFFFFF, 2, 300);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// UI Controls
let showOrbits = true;
let showLabels = true;
let showAsteroids = true;
let realScale = false;
let simulationSpeed = 1;
let viewFromEarth = false;

document.getElementById('toggle-orbits').addEventListener('click', () => {
    showOrbits = !showOrbits;
    orbits.forEach(orbit => {
        orbit.visible = showOrbits;
    });
});

document.getElementById('toggle-labels').addEventListener('click', () => {
    showLabels = !showLabels;
    labels.forEach(label => {
        label.visible = showLabels;
    });
});

document.getElementById('toggle-asteroids').addEventListener('click', () => {
    showAsteroids = !showAsteroids;
    asteroidBelt.visible = showAsteroids;
});

document.getElementById('toggle-scale').addEventListener('click', () => {
    realScale = !realScale;
    updatePlanetScale();
});

document.getElementById('toggle-planet-view').addEventListener('click', () => {
    viewFromEarth = !viewFromEarth;
});

document.getElementById('simulation-speed-input').addEventListener('input', (event) => {
    simulationSpeed = parseFloat(event.target.value);
    document.getElementById('simulation-speed').textContent = `Simulation Speed: ${simulationSpeed.toFixed(1)}x`;
});

document.getElementById('reset-camera').addEventListener('click', () => {
    camera.position.set(0, 50, 100);
    camera.lookAt(scene.position);
    controls.reset();
});

function updatePlanetScale() {
    celestialBodies.forEach(body => {
        const planet = planets.get(body.name);
        const scale = realScale ? body.radius : body.radius * (body.name === 'Sun' ? 1 : 3);
        planet.mesh.scale.setScalar(scale);
        if (body.name === 'Saturn') {
            planet.mesh.children[0].scale.setScalar(1 / scale);
        }
    });
}

// Info panel
const infoPanel = document.getElementById('info-panel');
const celestialName = document.getElementById('celestial-name');
const celestialDescription = document.getElementById('celestial-description');

function showInfo(name) {
    const body = planets.get(name);
    if (body) {
        celestialName.textContent = name;
        celestialDescription.textContent = body.description;
        infoPanel.style.display = 'block';
    }
}

function hideInfo() {
    infoPanel.style.display = 'none';
}

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        const planet = Array.from(planets.entries()).find(([_, p]) => p.mesh === object);
        if (planet) {
            showInfo(planet[0]);
            document.body.style.cursor = 'pointer';
        } else {
            hideInfo();
            document.body.style.cursor = 'default';
        }
    } else {
        hideInfo();
        document.body.style.cursor = 'default';
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001 * simulationSpeed;

    planets.forEach((planet, name) => {
        if (name !== 'Sun') {
            const revolutionSpeed = planet.revolutionSpeed * 0.1;
            const angle = time * revolutionSpeed;
            planet.mesh.position.x = Math.cos(angle) * planet.orbitRadius;
            planet.mesh.position.z = Math.sin(angle) * planet.orbitRadius;
        }
        
        // Apply axial tilt
        planet.mesh.rotation.x = planet.axialTilt * Math.PI / 180;
        
        // Rotate around tilted axis
        const rotationMatrix = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0).applyAxisAngle(new THREE.Vector3(1, 0, 0), planet.axialTilt * Math.PI / 180), 0.01 * planet.rotationSpeed * simulationSpeed);
        planet.mesh.applyMatrix4(rotationMatrix);
        
        if (name === 'Saturn') {
            planet.mesh.children[0].rotation.z += 0.001 * simulationSpeed;
        }
    });

    asteroidBelt.rotation.y += 0.0001 * simulationSpeed;

    if (viewFromEarth) {
        const earth = planets.get('Earth').mesh;
        camera.position.copy(earth.position);
        camera.position.y += 2;
        camera.lookAt(scene.position);
    }

    controls.update();
    composer.render();
}

animate();
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

// Core Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// 4K Resolution
const setResolution = (width, height) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
};
setResolution(3840, 2160);

// Post-Processing Effects
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.21;
composer.addPass(bloomPass);

const fxaaPass = new ShaderPass(FXAAShader);
const pixelRatio = renderer.getPixelRatio();
fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
composer.addPass(fxaaPass);

// Skybox
function createSkybox() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        'https://space-assets-1.s3.amazonaws.com/skybox/px.jpg', // Right.
        'https://space-assets-1.s3.amazonaws.com/skybox/nx.jpg', // Left.
        'https://space-assets-1.s3.amazonaws.com/skybox/py.jpg', // Top.
        'https://space-assets-1.s3.amazonaws.com/skybox/ny.jpg', // Bottom.
        'https://space-assets-1.s3.amazonaws.com/skybox/pz.jpg', // Front.
        'https://space-assets-1.s3.amazonaws.com/skybox/nz.jpg', // Back.
    ]);
    scene.background = texture;
}
createSkybox();

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040); // Soft light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300); // Bright light for focused areas
scene.add(pointLight);

// Load textures
const textureLoader = new THREE.TextureLoader();
const textures = {
    Sun: textureLoader.load('https://example.com/high-res-sun-texture.jpg'),
    Mercury: textureLoader.load('https://example.com/high-res-mercury-texture.jpg'),
    Venus: textureLoader.load('https://example.com/high-res-venus-texture.jpg'),
    Earth: textureLoader.load('https://example.com/high-res-earth-texture.jpg'),
    Mars: textureLoader.load('https://example.com/high-res-mars-texture.jpg'),
    Jupiter: textureLoader.load('https://example.com/high-res-jupiter-texture.jpg'),
    Saturn: textureLoader.load('https://example.com/high-res-saturn-texture.jpg'),
    Uranus: textureLoader.load('https://example.com/high-res-uranus-texture.jpg'),
    Neptune: textureLoader.load('https://example.com/high-res-neptune-texture.jpg'),
    Pluto: textureLoader.load('https://example.com/high-res-pluto-texture.jpg'),
};

// Planets and Orbits
const celestialBodies = [
    { name: 'Sun', radius: 10, orbitRadius: 0, rotationSpeed: 0.001, revolutionSpeed: 0, axialTilt: 7.25 },
    { name: 'Mercury', radius: 0.383, orbitRadius: 20, rotationSpeed: 0.0059, revolutionSpeed: 4.



            const texture = loader.load([
        'https://space-assets-1.s3.amazonaws.com/skybox/px.jpg', // Right.
        'https://space-assets-1.s3.amazonaws.com/skybox/nx.jpg', // Left.
        'https://space-assets-1.s3.amazonaws.com/skybox/py.jpg', // Top.
        'https://space-assets-1.s3.amazonaws.com/skybox/ny.jpg', // Bottom.
        'https://space-assets-1.s3.amazonaws.com/skybox/pz.jpg', // Front.
        'https://space-assets-1.s3.amazonaws.com/skybox/nz.jpg', // Back.
    ]);
    scene.background = texture;
}
createSkybox();

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040); // Soft light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300); // Bright light for focused areas
scene.add(pointLight);

// Load textures
const textureLoader = new THREE.TextureLoader();
const textures = {
    Sun: textureLoader.load('https://example.com/high-res-sun-texture.jpg'),
    Mercury: textureLoader.load('https://example.com/high-res-mercury-texture.jpg'),
    Venus: textureLoader.load('https://example.com/high-res-venus-texture.jpg'),
    Earth: textureLoader.load('https://example.com/high-res-earth-texture.jpg'),
    Mars: textureLoader.load('https://example.com/high-res-mars-texture.jpg'),
    Jupiter: textureLoader.load('https://example.com/high-res-jupiter-texture.jpg'),
    Saturn: textureLoader.load('https://example.com/high-res-saturn-texture.jpg'),
    Uranus: textureLoader.load('https://example.com/high-res-uranus-texture.jpg'),
    Neptune: textureLoader.load('https://example.com/high-res-neptune-texture.jpg'),
    Pluto: textureLoader.load('https://example.com/high-res-pluto-texture.jpg'),
};

// Planets and Orbits
const celestialBodies = [
    { name: 'Sun', radius: 10, orbitRadius: 0, rotationSpeed: 0.001, revolutionSpeed: 0, axialTilt: 7.25 },
    { name: 'Mercury', radius: 0.383, orbitRadius: 20, rotationSpeed: 0.0059, revolutionSpeed: 4.74, axialTilt: 0.034 },
    { name: 'Venus', radius: 0.949, orbitRadius: 30, rotationSpeed: 0.0243, revolutionSpeed: 3.50, axialTilt: 177.3 },
    { name: 'Earth', radius: 1, orbitRadius: 40, rotationSpeed: 1, revolutionSpeed: 2.98, axialTilt: 23.5 },
    { name: 'Mars', radius: 0.532, orbitRadius: 50, rotationSpeed: 0.9747, revolutionSpeed: 2.41, axialTilt: 25.2 },
    // Add more planets as needed...
];

const orbits = []; // Store orbit meshes for toggling visibility

celestialBodies.forEach(body => {
    const geometry = new THREE.SphereGeometry(body.radius, 64, 64);
    const material = new THREE.MeshPhongMaterial({ map: textures[body.name] });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Create orbits
    if (body.name !== 'Sun') {
        const orbitGeometry = new THREE.RingGeometry(body.orbitRadius, body.orbitRadius + 0.1, 128);
        const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
        orbits.push(orbit); // Store the orbit for toggling
    }
});

// User Interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoPanel = document.getElementById('info-panel');

renderer.domElement.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        showInfo(object.name);
    }

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize
updatePlanetScale();
