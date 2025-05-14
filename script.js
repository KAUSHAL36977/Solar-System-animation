// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 20;
controls.maxDistance = 200;
controls.maxPolarAngle = Math.PI / 2;

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffffff, 2, 300);
scene.add(sunLight);

// Create starfield background
function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
}

// Create Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffff00,
    emissive: 0xffff00,
    emissiveIntensity: 0.5
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet data with more accurate relative sizes and distances
const planets = [
    { name: 'Mercury', radius: 0.4, distance: 10, speed: 0.04, color: 0x888888, tilt: 0.034 },
    { name: 'Venus', radius: 0.6, distance: 15, speed: 0.015, color: 0xe39e1c, tilt: 0.001 },
    { name: 'Earth', radius: 0.7, distance: 20, speed: 0.01, color: 0x2233ff, tilt: 0.409 },
    { name: 'Mars', radius: 0.5, distance: 25, speed: 0.008, color: 0xc1440e, tilt: 0.439 },
    { name: 'Jupiter', radius: 1.5, distance: 32, speed: 0.002, color: 0xd8ca9d, tilt: 0.055 },
    { name: 'Saturn', radius: 1.2, distance: 38, speed: 0.0009, color: 0xead6b8, tilt: 0.466 },
    { name: 'Uranus', radius: 0.9, distance: 44, speed: 0.0004, color: 0x5580aa, tilt: 1.706 },
    { name: 'Neptune', radius: 0.9, distance: 50, speed: 0.0001, color: 0x366896, tilt: 0.494 }
];

// Create orbital lines
const orbitalLines = [];
planets.forEach(planet => {
    const geometry = new THREE.RingGeometry(planet.distance - 0.1, planet.distance + 0.1, 128);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x444444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
    });
    const orbit = new THREE.Mesh(geometry, material);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
    orbitalLines.push(orbit);
});

// Create planets and their labels
const planetMeshes = planets.map(planet => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ 
        color: planet.color,
        shininess: 30
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance;
    mesh.rotation.x = planet.tilt;
    scene.add(mesh);

    // Create label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    context.font = '24px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(planet.name, 128, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ map: texture });
    const label = new THREE.Sprite(labelMaterial);
    label.scale.set(5, 1.25, 1);
    label.position.set(planet.distance, planet.radius + 1, 0);
    scene.add(label);

    return { ...planet, mesh, label };
});

// Camera position
camera.position.z = 80;

// Raycaster for planet selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listeners
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('resize', onWindowResize);

document.getElementById('toggleOrbits').addEventListener('click', () => {
    orbitalLines.forEach(orbit => {
        orbit.visible = !orbit.visible;
    });
});

document.getElementById('toggleLabels').addEventListener('click', () => {
    planetMeshes.forEach(planet => {
        planet.label.visible = !planet.label.visible;
    });
});

document.getElementById('toggleAutoRotate').addEventListener('click', () => {
    controls.autoRotate = !controls.autoRotate;
});

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planetMeshes.map(p => p.mesh));

    const tooltip = document.getElementById('tooltip');
    if (intersects.length > 0) {
        const planet = planetMeshes.find(p => p.mesh === intersects[0].object);
        tooltip.style.display = 'block';
        tooltip.style.left = event.clientX + 10 + 'px';
        tooltip.style.top = event.clientY + 10 + 'px';
        tooltip.textContent = planet.name;
    } else {
        tooltip.style.display = 'none';
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Create starfield
createStarfield();

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate sun
    sun.rotation.y += 0.004;

    // Update planets
    planetMeshes.forEach(planet => {
        planet.mesh.rotation.y += 0.01;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
        planet.angle += planet.speed;

        // Update label position
        planet.label.position.x = planet.mesh.position.x;
        planet.label.position.z = planet.mesh.position.z;
    });

    controls.update();
    renderer.render(scene, camera);
}

// Initialize planet angles
planetMeshes.forEach(planet => {
    planet.angle = Math.random() * Math.PI * 2;
});

// Start animation
animate(); 
