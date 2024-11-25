
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';
import { OrbitControls } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/shaders/FXAAShader.js';
import { CSS2DObject, CSS2DRenderer } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/renderers/CSS2DRenderer.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js';

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

// Consolidated lighting setup
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xFFFFFF, 1.5, 300);
pointLight.position.set(50, 50, 50);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.bias = -0.001;
scene.add(pointLight);

const sunLight = new THREE.PointLight(0xffffff, 1, 500);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Position the camera
camera.position.z = 100; // Move the camera back to see the entire solar system

// Define celestial bodies
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

// Global variables
let composer, stats;
const planets = new Map();
const orbits = [];
const labels = [];

// Get the info panel element
const infoPanel = document.getElementById('info-panel');

// Initialize scene, renderer, camera, and composer
const initializeScene = (width = window.innerWidth, height = window.innerHeight) => {
    // Set the camera's near and far clipping planes for better depth perception
    camera.near = 0.1;
    camera.far = 1000;

    // Initialize stats
    if (!stats) {
        stats = new Stats();
        document.body.appendChild(stats.dom);
    }

    // Update camera aspect ratio and projection matrix
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(width, height);

    // Post-processing
    if (!composer) {
        composer = new EffectComposer(renderer);

        // Render pass
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        // Bloom pass
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(width, height),
            1.5,
            0.4,
            0.85
        );
        bloomPass.threshold = 0;
        bloomPass.strength = 0.5;
        bloomPass.radius = 0;
        composer.addPass(bloomPass);

        // FXAA pass
        const fxaaPass = new ShaderPass(FXAAShader);
        composer.addPass(fxaaPass);
    }

    // Update composer and FXAA pass size
    composer.setSize(width, height);
    const pixelRatio = renderer.getPixelRatio();
    const fxaaPass = composer.passes.find(pass => pass instanceof ShaderPass && pass.material.defines.FXAA);
    if (fxaaPass) {
        fxaaPass.material.uniforms['resolution'].value.x = 1 / (width * pixelRatio);
        fxaaPass.material.uniforms['resolution'].value.y = 1 / (height * pixelRatio);
    }

    // Update OrbitControls
    if (controls) {
        controls.update();
    }
};

// Function to load textures and create planets
const loadTexturesAndCreatePlanets = () => {
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
        Pluto: textureLoader.load('https://example.com/high-res-pluto-texture.jpg'),
    };

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
};

// Load textures and create planets
loadTexturesAndCreatePlanets();

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Function to show information about a celestial body
const showInfo = (name) => {
    const body = celestialBodies.find(body => body.name === name);
    if (body) {
        infoPanel.innerHTML = `
            <h2>${body.name}</h2>
            <p>${body.description}</p>
            <p>Radius: ${body.radius} Earth radii</p>
            <p>Orbit Radius: ${body.orbitRadius} million km</p>
            <p>Rotation Speed: ${body.rotationSpeed} Earth days</p>
            <p>Revolution Speed: ${body.revolutionSpeed} Earth years</p>
            <p>Axial Tilt: ${body.axialTilt}°</p>
        `;
        infoPanel.style.display = 'block';
    } else {
        infoPanel.style.display = 'none';
    }
};

// Update the animation loop to include controls update
const animate = () => {
    requestAnimationFrame(animate);
    
    // Update planet positions and rotations
    celestialBodies.forEach(body => {
        const planet = planets.get(body.name);
        if (planet && body.name !== 'Sun') {
            const angle = Date.now() * 0.001 * body.revolutionSpeed;
            planet.mesh.position.x = Math.cos(angle) * body.orbitRadius;
            planet.mesh.position.z = Math.sin(angle) * body.orbitRadius;
            planet.mesh.rotation.y += 0.01 * body.rotationSpeed;
        }
    });

    controls.update(); // Update controls

    // Render with composer if using post-processing
    if (composer) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }

    // Update performance stats
    if (stats) {
        stats.update();
    }
};

// Initialize the scene
initializeScene();

// Start the animation
animate();

// Add event listener for window resize
window.addEventListener('resize', () => {
    initializeScene(window.innerWidth, window.innerHeight);
});

// Log completion message
console.log('Solar system simulation initialized and running.');
