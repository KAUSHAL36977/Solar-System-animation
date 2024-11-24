
let scene, camera, renderer, controls;
let sun, planets = {};
const planetData = {
    mercury: { radius: 0.383, orbitRadius: 57.9, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mercury.jpg' },
    venus: { radius: 0.949, orbitRadius: 108.2, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/venus_surface.jpg' },
    earth: { radius: 1, orbitRadius: 149.6, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg' },
    mars: { radius: 0.532, orbitRadius: 227.9, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars.jpg' },
    jupiter: { radius: 11.21, orbitRadius: 778.6, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/jupiter.jpg' },
    saturn: { radius: 9.45, orbitRadius: 1433.5, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/saturn.jpg' },
    uranus: { radius: 4.01, orbitRadius: 2872.5, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/uranus.jpg' },
    neptune: { radius: 3.88, orbitRadius: 4495.1, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/neptune.jpg' },
};

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    createSun();
    createPlanets();
    createStars();

    window.addEventListener('resize', onWindowResize, false);
}

function createSun() {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    sun = new THREE.Mesh(geometry, material);
    scene.add(sun);

    const sunlight = new THREE.PointLight(0xffffff, 1.5, 1000);
    scene.add(sunlight);
}

function createPlanets() {
    const textureLoader = new THREE.TextureLoader();
    for (const [name, data] of Object.entries(planetData)) {
        const geometry = new THREE.SphereGeometry(data.radius * 0.1, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            map: textureLoader.load(data.texture),
        });
        const planet = new THREE.Mesh(geometry, material);
        planet.position.x = data.orbitRadius * 0.3;
        scene.add(planet);
        planets[name] = planet;

        // Create orbit
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
        const orbitPoints = [];
        for (let i = 0; i <= 360; i++) {
            const angle = (i * Math.PI) / 180;
            const x = Math.cos(angle) * data.orbitRadius * 0.3;
            const z = Math.sin(angle) * data.orbitRadius * 0.3;
            orbitPoints.push(new THREE.Vector3(x, 0, z));
        }
        orbitGeometry.setFromPoints(orbitPoints);
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbit);
    }
}

function createStars() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 10000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate planets
    for (const [name, planet] of Object.entries(planets)) {
        const data = planetData[name];
        const speed = 1 / Math.sqrt(data.orbitRadius);
        const angle = Date.now() * speed * 0.001;
        planet.position.x = Math.cos(angle) * data.orbitRadius * 0.3;
        planet.position.z = Math.sin(angle) * data.orbitRadius * 0.3;
        planet.rotation.y += 0.01;
    }

    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();
