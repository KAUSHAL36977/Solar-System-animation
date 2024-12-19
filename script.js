// Load Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('solar-system-container').appendChild(renderer.domElement);

// Create the Sun (Yellow)
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create Planets
const planets = [];
const planetData = [
    { name: 'Mercury', size: 1, distance: 8, color: 0xaaaaaa },
    { name: 'Venus', size: 2, distance: 12, color: 0xffcc00 },
    { name: 'Earth', size: 3, distance: 16, color: 0x0000ff },
    { name: 'Mars', size: 2.5, distance: 20, color: 0xff0000 },
    { name: 'Jupiter', size: 7, distance: 30, color: 0xffa500 },
    { name: 'Saturn', size: 6, distance: 40, color: 0xffff00 },
    { name: 'Uranus', size: 4, distance: 50, color: 0x00ffff },
    { name: 'Neptune', size: 4, distance: 60, color: 0x0000ff }
];

// Create planet meshes and add them to the scene
planetData.forEach(planet => {
    const planetGeometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: planet.color });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    
    // Position planets
    planetMesh.position.x = planet.distance;
    scene.add(planetMesh);
    planets.push(planetMesh);
});

// Position the camera
camera.position.z = 70;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the sun
    sun.rotation.y += 0.01;

    // Rotate the planets around the sun
    planets.forEach((planet, index) => {
        planet.rotation.y += 0.01;
        planet.position.x = Math.cos(Date.now() * 0.001 * (index + 1)) * planetData[index].distance;
        planet.position.z = Math.sin(Date.now() * 0.001 * (index + 1)) * planetData[index].distance;
    });

    renderer.render(scene, camera);
}

animate();
