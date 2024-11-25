
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';
import { OrbitControls } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/shaders/FXAAShader.js';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

// Set 4K resolution
const setResolution = (width, height) => {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
};

// Set 4K resolution (3840x2160)
setResolution(3840, 2160);

// Post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.21;
bloomPass.strength = 1.2;
bloomPass.radius = 0.55;
composer.addPass(bloomPass);

const fxaaPass = new ShaderPass(FXAAShader);
const pixelRatio = renderer.getPixelRatio();
fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
composer.addPass(fxaaPass);

// Set camera position and add controls
camera.position.set(0, 50, 100);
const controls = new OrbitControls(camera, renderer.domElement);

// Create skybox
function createSkybox() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        'https://space-assets-1.s3.amazonaws.com/skybox/px.jpg',
        'https://space-assets-1.s3.amazonaws.com/skybox/nx.jpg',
        'https://space-assets-1.s3.amazonaws.com/skybox/py.jpg',
        'https://space-assets-1.s3.amazonaws.com/skybox/ny.jpg',
        'https://space-assets-1.s3.amazonaws.com/skybox/pz.jpg',
        'https://space-assets-1.s3.amazonaws.com/skybox/nz.jpg',
    ]);
    scene.background = texture;
}

createSkybox();

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

// Load high-resolution textures
const textureLoader = new THREE.TextureLoader();
const textures = {
    Sun: textureLoader.load('https://space-assets-1.s3.amazonaws.com/sun_4k.jpg'),
    Mercury: textureLoader.load('https://space-assets-1.s3.amazonaws.com/mercury_4k.jpg'),
    Venus: textureLoader.load('https://space-assets-1.s3.amazonaws.com/venus_4k.jpg'),
    Earth: textureLoader.load('https://space-assets-1.s3.amazonaws.com/earth_daymap_4k.jpg'),
    Mars: textureLoader.load('https://space-assets-1.s3.amazonaws.com/mars_4k.jpg'),
    Jupiter: textureLoader.load('https://space-assets-1.s3.amazonaws.com/jupiter_4k.jpg'),
    Saturn: textureLoader.load('https://space-assets-1.s3.amazonaws.com/saturn_4k.jpg'),
    SaturnRings: textureLoader.load('https://space-assets-1.s3.amazonaws.com/saturn_rings_4k.png'),
    Uranus: textureLoader.load('https://space-assets-1.s3.amazonaws.com/uranus_4k.jpg'),
    Neptune: textureLoader.load('https://space-assets-1.s3.amazonaws.com/neptune_4k.jpg'),
    Pluto: textureLoader.load('https://space-assets-1.s3.amazonaws.com/pluto_4k.jpg')
};

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

// Create asteroid belt
const asteroidBelt = new THREE.Group();
const asteroidGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });

for (let i = 0; i < 2000; i++) {
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    const angle = Math.random() * Math.PI * 2;
    const radius = THREE.MathUtils.randFloat(60, 65);
    asteroid.position.set(
        radius * Math.cos(angle),
        THREE.MathUtils.randFloatSpread(2),
        radius * Math.sin(angle)
    );
    asteroidBelt.add(asteroid);
}

scene.add(asteroidBelt);

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

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize
updatePlanetScale();
