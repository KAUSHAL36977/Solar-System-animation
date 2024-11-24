
let scene, camera, renderer, controls;
let planets = {};
let sun;
let orbitLines = [];
let habitableZone;
let isHabitableZoneVisible = false;
let earthMoon;

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

    document.getElementById('toggle-orbits').addEventListener('click', toggleOrbits);
    document.getElementById('toggle-labels').addEventListener('click', toggleLabels);
    document.getElementById('toggle-scale').addEventListener('click', toggleScale);
    document.getElementById('start-tour').addEventListener('click', startTour);
    document.getElementById('toggle-planet-view').addEventListener('click', togglePlanetView);
    document.getElementById('toggle-habitable-zone').addEventListener('click', toggleHabitableZone);
    document.getElementById('search-button').addEventListener('click', searchCelestialBody);
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
    planets['earth'].add(earthMoon);
}

function createLabel(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '12px Arial';
    context.fillStyle = 'white';
    context.fillText(text, 0, 12);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(5, 5, 1);
    sprite.position.set(0, 2, 0);

    return sprite;
}

function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function createOrbitLines() {
    for (const [name, data] of Object.entries(planetData)) {
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.3 });

        const orbitVertices = [];
        for (let i = 0; i <= 360; i++) {
            const angle = (i * Math.PI) / 180;
            const x = Math.cos(angle) * data.orbitRadius;
            const z = Math.sin(angle) * data.orbitRadius;
            orbitVertices.push(x, 0, z);
        }

        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitVertices, 3));
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbitLine);
        orbitLines.push(orbitLine);
    }
}

function animate() {
    requestAnimationFrame(animate);

    for (const [name, data] of Object.entries(planetData)) {
        const planet = planets[name];
        planet.rotation.y += 0.01;
        planet.position.x = Math.cos(Date.now() * data.speed) * data.orbitRadius;
        planet.position.z = Math.sin(Date.now() * data.speed) * data.orbitRadius;
    }

    earthMoon.rotation.y += 0.01;
    const moonOrbitRadius = 2;
    const moonSpeed = 0.02;
    earthMoon.position.x = Math.cos(Date.now() * moonSpeed) * moonOrbitRadius;
    earthMoon.position.z = Math.sin(Date.now() * moonSpeed) * moonOrbitRadius;

    updateMoonPhase();

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function toggleOrbits() {
    orbitLines.forEach(line => line.visible = !line.visible);
}

function toggleLabels() {
    for (const planet of Object.values(planets)) {
        planet.children[0].visible = !planet.children[0].visible;
    }
}

function toggleScale() {
    const scaleFactor = this.scaleToggle ? 1 : 0.2;
    this.scaleToggle = !this.scaleToggle;

    for (const [name, data] of Object.entries(planetData)) {
        const planet = planets[name];
        planet.scale.setScalar(scaleFactor);
    }
}

function startTour() {
    // Implement a guided tour of the solar system
}

function togglePlanetView() {
    // Implement view from planet perspective
}

function createHabitableZone() {
    const innerRadius = 8;
    const outerRadius = 12;
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
    habitableZone = new THREE.Mesh(geometry, material);
    habitableZone.rotation.x = Math.PI / 2;
    habitableZone.visible = false;
    scene.add(habitableZone);
}

function toggleHabitableZone() {
    isHabitableZoneVisible = !isHabitableZoneVisible;
    habitableZone.visible = isHabitableZoneVisible;
}

function createScaleComparison() {
    const comparisonContainer = document.getElementById('comparison-container');
    for (const [name, data] of Object.entries(planetData)) {
        const planetDiv = document.createElement('div');
        planetDiv.style.width = `${data.radius * 10}px`;
        planetDiv.style.height = `${data.radius * 10}px`;
        planetDiv.style.borderRadius = '50%';
        planetDiv.style.backgroundColor = getAverageColor(data.texture);
        planetDiv.title = `${name.charAt(0).toUpperCase() + name.slice(1)}: ${data.radius} Earth radii`;
        comparisonContainer.appendChild(planetDiv);
    }
}

function updateMoonPhase() {
    const moonPhaseDisplay = document.getElementById('moon-phase-display');
    const phase = (Date.now() / 2551443000) % 1;
    moonPhaseDisplay.style.backgroundPosition = `${phase * 100}% 0`;
}

function searchCelestialBody() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const planet = planets[searchTerm];
    if (planet) {
        const position = new THREE.Vector3();
        planet.getWorldPosition(position);
        new TWEEN.Tween(camera.position)
            .to({ x: position.x, y: position.y, z: position.z + 5 }, 1000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();
    }
}

function getAverageColor(imagePath) {
    // This is a placeholder function. In a real implementation, you would need to
    // load the image and calculate its average color.
    return '#CCCCCC';
}

init();
animate();


function createEarth(scene) {
    // Earth Texture URLs (Replace with your own paths if necessary)
    const earthTexture = 'path/to/earth_texture.jpg'; // Earth's surface texture
    const earthCloudTexture = 'path/to/earth_clouds.png'; // Earth's clouds texture
    const earthBumpMap = 'path/to/earth_bump_map.jpg'; // Elevation map for realistic terrain

    // Earth Geometry
    const earthRadius = 1; // Earth radius scaling
    const earthSegments = 64;

    // Earth Material
    const earthMaterial = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load(earthTexture), // Base texture for Earth's surface
        bumpMap: new THREE.TextureLoader().load(earthBumpMap), // Bump map for terrain
        bumpScale: 0.05, // Adjust bump intensity
    });

    // Earth Mesh
    const earthGeometry = new THREE.SphereGeometry(earthRadius, earthSegments, earthSegments);
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);

    // Add rotation axis tilt (23.5° tilt)
    earthMesh.rotation.z = THREE.MathUtils.degToRad(23.5);

    // Clouds Geometry and Material
    const cloudGeometry = new THREE.SphereGeometry(earthRadius + 0.02, earthSegments, earthSegments);
    const cloudMaterial = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load(earthCloudTexture),
        transparent: true,
        opacity: 0.8,
    });

    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);

    // Group Earth and Clouds
    const earthGroup = new THREE.Group();
    earthGroup.add(earthMesh);
    earthGroup.add(cloudMesh);

    // Add Earth Rotation
    function rotateEarth() {
        earthMesh.rotation.y += 0.001; // Rotate Earth slowly
        cloudMesh.rotation.y += 0.0012; // Clouds rotate slightly faster for realism
    }

    // Add Earth and Clouds to Scene
    scene.add(earthGroup);

    // Return Rotate Function for Animation Loop
    return rotateEarth;
}



const scene = new THREE.Scene();

// Create Earth
const rotateEarth = createEarth(scene);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate Earth
    rotateEarth();

    // Render the scene
    renderer.render(scene, camera);
}

animate();
