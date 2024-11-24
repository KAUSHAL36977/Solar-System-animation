// script.js
const container = document.getElementById("canvas-container");

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Add Ambient and Point Light (Sunlight)
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 100);
pointLight.position.set(0, 0, 0); // Sun's position
scene.add(pointLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xfdb813,
    emissive: 0xffa500,
    emissiveIntensity: 1
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planets and Orbits
const planets = [];
const orbits = [];
const planetData = [
    { name: "Mercury", color: 0xb5b5b5, size: 0.3, distance: 4, speed: 0.02 },
    { name: "Venus", color: 0xffc649, size: 0.8, distance: 6, speed: 0.015 },
    { name: "Earth", color: 0x6b93d6, size: 1, distance: 8, speed: 0.01 },
    { name: "Mars", color: 0xc1440e, size: 0.7, distance: 10, speed: 0.008 },
    { name: "Jupiter", color: 0xc9b5a0, size: 1.5, distance: 14, speed: 0.005 },
    { name: "Saturn", color: 0xf4d4a9, size: 1.3, distance: 18, speed: 0.004 },
    { name: "Uranus", color: 0xcae9ff, size: 1, distance: 22, speed: 0.003 },
    { name: "Neptune", color: 0x5b5ddf, size: 0.9, distance: 26, speed: 0.002 }
];

// Create Planets and Orbits
planetData.forEach((data) => {
    // Planet Geometry
    const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({ color: data.color });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);

    // Orbit Path
    const orbitGeometry = new THREE.RingGeometry(data.distance - 0.05, data.distance + 0.05, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2; // Rotate to align with the plane

    // Add to Scene
    scene.add(planet);
    scene.add(orbit);

    planets.push({ mesh: planet, ...data });
    orbits.push(orbit);
});

// Position Camera
camera.position.z = 40;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate planets around the sun
    planets.forEach((planet, index) => {
        const time = Date.now() * planet.speed * 0.001;
        planet.mesh.position.x = Math.cos(time) * planet.distance;
        planet.mesh.position.z = Math.sin(time) * planet.distance;
    });

    // Render Scene
    renderer.render(scene, camera);
}

// Responsive Resizing
window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});

animate();
