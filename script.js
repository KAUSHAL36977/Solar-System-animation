let scene, camera, renderer, controls;
let planets = {};
let sun;
let orbitLines = [];
let habitableZone;
let isHabitableZoneVisible = false;
let earthMoon;

// Planet Data
const planetData = {
    mercury: { radius: 0.383, orbitRadius: 5, speed: 0.01, texture: 'path/to/mercury_texture.jpg' },
    venus: { radius: 0.949, orbitRadius: 7, speed: 0.007, texture: 'path/to/venus_texture.jpg' },
    earth: { radius: 1, orbitRadius: 10, speed: 0.006, texture: 'path/to/earth_texture.jpg' },
    mars: { radius: 0.532, orbitRadius: 15, speed: 0.005, texture: 'path/to/mars_texture.jpg' },
    jupiter: { radius: 11.21, orbitRadius: 50, speed: 0.002, texture: 'path/to/jupiter_texture.jpg' },
    saturn: { radius: 9.45, orbitRadius: 90, speed: 0.0009, texture: 'path/to/saturn_texture.jpg' },
    uranus: { radius: 4, orbitRadius: 170, speed: 0.0004, texture: 'path/to/uranus_texture.jpg' },
    neptune: { radius: 3.88, orbitRadius: 270, speed: 0.0001, texture: 'path/to/neptune_texture.jpg' }
};

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    createSun();
    createPlanets();
    createEarthMoon();
    createStars();
    createOrbitLines();
    createHabitableZone();
    createScaleComparison();

    window.addEventListener('resize', onWindowResize, false);

    // Event Listeners for Controls
    document.getElementById('toggle-orbits').addEventListener('click', toggleOrbits);
    document.getElementById('toggle-labels').addEventListener('click', toggleLabels);
    document.getElementById('toggle-scale').addEventListener('click', toggleScale);
    document.getElementById('start-tour').addEventListener('click', startTour);
    document.getElementById('toggle-planet-view').addEventListener('click', togglePlanetView);
    document.getElementById('toggle-habitable-zone').addEventListener('click', toggleHabitableZone);
    document.getElementById('search-button').addEventListener('click', searchCelestialBody);
    document.getElementById('apply-settings').addEventListener('click', applySettings);
}

function createSun() {
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunTexture = new THREE.TextureLoader().load('path/to/sun_texture.jpg');
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);
}

function createPlanets() {
    for (const [name, data] of Object.entries(planetData)) {
        const planetGeometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const planetTexture = new THREE.TextureLoader().load(data.texture);
        const planetMaterial = new THREE.MeshPhongMaterial({ map: planetTexture });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        
        planet.position.x = data.orbitRadius;
        scene.add(planet);
        planets[name] = planet;

        const planetLabel = createLabel(name);
        planet.add(planetLabel);
    }
}

function createEarthMoon() {
    const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
    const moonTexture = new THREE.TextureLoader().load('path/to/moon_texture.jpg');
    const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
    earthMoon = new THREE.Mesh(moonGeometry, moonMaterial);
    earthMoon.position.set(2, 0, 0);
    planets['earth'].
