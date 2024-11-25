
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import { OrbitControls } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/jsm/renderers/CSS2DRenderer.js';

// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Set up CSS2DRenderer for labels
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
document.getElementById('canvas-container').appendChild(labelRenderer.domElement);

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

// Load textures
const textureLoader = new THREE.TextureLoader();
const textures = {
    Sun: textureLoader.load('https://space-assets-1.s3.amazonaws.com/sun.jpg'),
    Mercury: textureLoader.load('https://space-assets-1.s3.amazonaws.com/mercury.jpg'),
    Venus: textureLoader.load('https://space-assets-1.s3.amazonaws.com/venus.jpg'),
    Earth: textureLoader.load('https://space-assets-1.s3.amazonaws.com/earth_daymap.jpg'),
    Mars: textureLoader.load('https://space-assets-1.s3.amazonaws.com/mars.jpg'),
    Jupiter: textureLoader.load('https://space-assets-1.s3.amazonaws.com/jupiter.jpg'),
    Saturn: textureLoader.load('https://space-assets-1.s3.amazonaws.com/saturn.jpg'),
    SaturnRings: textureLoader.load('https://space-assets-1.s3.amazonaws.com/saturn_rings.png'),
    Uranus: textureLoader.load('https://space-assets-1.s3.amazonaws.com/uranus.jpg'),
    Neptune: textureLoader.load('https://space-assets-1.s3.amazonaws.com/neptune.jpg'),
    Pluto: textureLoader.load('https://space-assets-1.s3.amazonaws.com/pluto.jpg')
};

// Create celestial bodies (using more accurate scale)
const celestialBodies = [
    { name: 'Sun', radius: 10, orbitRadius: 0, rotationSpeed: 0.001, description: 'The Sun is the star at the center of the Solar System.' },
    { name: 'Mercury', radius: 0.383, orbitRadius: 20, rotationSpeed: 0.0059, description: 'Mercury is the smallest planet in the Solar System and the closest to the Sun.' },
    { name: 'Venus', radius: 0.949, orbitRadius: 30, rotationSpeed: 0.0243, description: 'Venus is the second planet from the Sun and is Earth's closest planetary neighbor.' },
    { name: 'Earth', radius: 1, orbitRadius: 40, rotationSpeed: 1, description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.' },
    { name: 'Mars', radius: 0.532, orbitRadius: 50, rotationSpeed: 0.9747, description: 'Mars is the fourth planet from the Sun and is often described as the "Red Planet".' },
    { name: 'Jupiter', radius: 11.21, orbitRadius: 70, rotationSpeed: 2.4, description: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System.' },
    { name: 'Saturn', radius: 9.45, orbitRadius: 90, rotationSpeed: 2.2, description: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System.' },
    { name: 'Uranus', radius: 4, orbitRadius: 110, rotationSpeed: 1.4, description: 'Uranus is the seventh planet from the Sun and has the third-largest diameter in our solar system.' },
    { name: 'Neptune', radius: 3.88, orbitRadius: 130, rotationSpeed: 1.5, description: 'Neptune is the eighth and farthest-known Solar planet from the Sun.' },
    { name: 'Pluto', radius: 0.186, orbitRadius: 150, rotationSpeed: 0.157, description: 'Pluto is a dwarf planet in the Kuiper belt, a ring of bodies beyond the orbit of Neptune.' }
];

const planets = new Map();
const orbits = new Map();
const labels = new Map();

celestialBodies.forEach(body => {
    const geometry = new THREE.SphereGeometry(body.radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ map: textures[body.name] });
    const mesh = new THREE.Mesh(geometry, material);
    
    if (body.name !== 'Sun') {
        const orbitGeometry = new THREE.RingGeometry(body.orbitRadius, body.orbitRadius + 0.1, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.1 });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
        orbits.set(body.name, orbit);

        // Create label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = body.name;
        labelDiv.style.marginTop = '-1em';
        const label = new THREE.CSS2DObject(labelDiv);
        label.position.set(0, body.radius, 0);
        mesh.add(label);
        labels.set(body.name, label);
    } else {
        pointLight.position.copy(mesh.position);
    }
    
    // Add Saturn's rings
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
    planets.set(body.name, { mesh, orbitRadius: body.orbitRadius, rotationSpeed: body.rotationSpeed, description: body.description });
});

// Create asteroid belt
const asteroidBelt = new THREE.Group();
const asteroidGeometry = new THREE.SphereGeometry(0.1, 8, 8);
const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

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
            const speed = 1 / Math.sqrt(planet.orbitRadius);
            const angle = time * speed;
            planet.mesh.position.x = Math.cos(angle) * planet.orbitRadius;
            planet.mesh.position.z = Math.sin(angle) * planet.orbitRadius;
        }
        planet.mesh.rotation.y += 0.01 * planet.rotationSpeed * simulationSpeed;
        
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
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize
updatePlanetScale();
