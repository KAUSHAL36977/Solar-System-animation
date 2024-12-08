import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';
import { OrbitControls } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/shaders/FXAAShader.js';
import { CSS2DRenderer, CSS2DObject } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/examples/jsm/renderers/CSS2DRenderer.js';
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js';

// DOM Element References
const loadingSpinner = document.getElementById('loading-spinner');
const canvasContainer = document.getElementById('canvas-container');
const infoPanel = document.getElementById('info-panel');
const celestialNameElement = document.getElementById('celestial-name');
const celestialDescriptionElement = document.getElementById('celestial-description');

// Control Button References
const toggleOrbitsBtn = document.getElementById('toggle-orbits');
const toggleLabelsBtn = document.getElementById('toggle-labels');
const toggleAsteroidsBtn = document.getElementById('toggle-asteroids');
const toggleScaleBtn = document.getElementById('toggle-scale');
const togglePlanetViewBtn = document.getElementById('toggle-planet-view');
const resetCameraBtn = document.getElementById('reset-camera');
const startTourBtn = document.getElementById('start-tour');
const toggleHabitableZoneBtn = document.getElementById('toggle-habitable-zone');
const toggleSettingsBtn = document.getElementById('toggle-settings');

// Search Feature References
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Simulation Information References
const simulationTimeElement = document.getElementById('simulation-time');
const simulationSpeedElement = document.getElementById('simulation-speed');

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background to match CSS

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    powerPreference: "high-performance" 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
canvasContainer.appendChild(renderer.domElement);

// CSS2D Renderer for Labels
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
canvasContainer.appendChild(labelRenderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 1, 500);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Celestial Bodies Configuration
const celestialBodies = [
    { 
        name: 'Mercury', 
        cssClass: 'mercury',
        radius: 0.383, 
        orbitRadius: 20, 
        description: 'The smallest planet in the Solar System and closest to the Sun.'
    },
    { 
        name: 'Venus', 
        cssClass: 'venus',
        radius: 0.949, 
        orbitRadius: 30, 
        description: 'Earth's closest planetary neighbor, known for its extreme temperatures.'
    },
    { 
        name: 'Earth', 
        cssClass: 'earth',
        radius: 1, 
        orbitRadius: 40, 
        description: 'The only known astronomical object to harbor life.'
    },
    { 
        name: 'Mars', 
        cssClass: 'mars',
        radius: 0.532, 
        orbitRadius: 50, 
        description: 'Often called the "Red Planet" due to its reddish appearance.'
    },
    { 
        name: 'Jupiter', 
        cssClass: 'jupiter',
        radius: 11.21, 
        orbitRadius: 70, 
        description: 'The largest planet in the Solar System, a gas giant.'
    },
    { 
        name: 'Saturn', 
        cssClass: 'saturn',
        radius: 9.45, 
        orbitRadius: 90, 
        description: 'Known for its prominent ring system.'
    },
    { 
        name: 'Uranus', 
        cssClass: 'uranus',
        radius: 4, 
        orbitRadius: 110, 
        description: 'An ice giant with a unique rotational tilt.'
    },
    { 
        name: 'Neptune', 
        cssClass: 'neptune',
        radius: 3.88, 
        orbitRadius: 130, 
        description: 'The windiest planet in the Solar System.'
    }
];

// Create Planets
const createPlanets = () => {
    celestialBodies.forEach(body => {
        const geometry = new THREE.SphereGeometry(body.radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: getComputedStyle(document.querySelector(`.${body.cssClass}`)).background 
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Orbit creation
        const orbitGeometry = new THREE.RingGeometry(body.orbitRadius, body.orbitRadius + 0.2, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, 
            side: THREE.DoubleSide, 
            transparent: true, 
            opacity: 0.2 
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);

        scene.add(mesh);
    });
};

// Interaction Handlers
const setupInteractions = () => {
    // Search functionality
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const foundBody = celestialBodies.find(body => 
            body.name.toLowerCase() === searchTerm
        );
        
        if (foundBody) {
            showBodyInfo(foundBody);
        }
    });

    // Toggle buttons
    toggleOrbitsBtn.addEventListener('click', () => {
        // Implement orbit visibility toggle
    });

    toggleLabelsBtn.addEventListener('click', () => {
        // Implement label visibility toggle
    });
};

// Information Display
const showBodyInfo = (body) => {
    celestialNameElement.textContent = body.name;
    celestialDescriptionElement.textContent = body.description;
    infoPanel.style.display = 'block';
};

// Animation Loop
const animate = () => {
    requestAnimationFrame(animate);
    
    // Rotate and orbit planets
    celestialBodies.forEach((body, index) => {
        const angle = Date.now() * 0.0001 * (index + 1);
        const mesh = scene.children.find(child => 
            child.isMesh && 
            child.geometry.parameters.radius === body.radius
        );
        
        if (mesh) {
            mesh.position.x = Math.cos(angle) * body.orbitRadius;
            mesh.position.z = Math.sin(angle) * body.orbitRadius;
        }
    });

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
};

// Initialization
const init = () => {
    createPlanets();
    setupInteractions();
    animate();

    // Hide loading spinner
    loadingSpinner.style.display = 'none';
};

// Responsive Handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the simulation
init();
