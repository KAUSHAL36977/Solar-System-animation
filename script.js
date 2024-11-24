
let scene, camera, renderer, controls, clock;
let sun, planets = {}, moons = {}, orbits = {}, labels = {}, atmospheres = {};
let timeSpeed = 1, simulationTime = 0;
let selectedObject = null;
let realScale = false;
let touring = false;
let tourTargets = [];
let currentTourIndex = 0;

const planetData = {
    mercury: { radius: 0.383, orbitRadius: 57.9, rotationPeriod: 58.65, orbitPeriod: 88, axialTilt: 0.034, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mercury.jpg', normalMap: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mercury_normal.jpg' },
    venus: { radius: 0.949, orbitRadius: 108.2, rotationPeriod: -243, orbitPeriod: 224.7, axialTilt: 177.4, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/venus_surface.jpg', normalMap: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/venus_normal.jpg', hasAtmosphere: true },
    earth: { radius: 1, orbitRadius: 149.6, rotationPeriod: 1, orbitPeriod: 365.2, axialTilt: 23.44, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg', normalMap: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg', specularMap: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg', hasAtmosphere: true, hasClouds: true },
    mars: { radius: 0.532, orbitRadius: 227.9, rotationPeriod: 1.03, orbitPeriod: 687, axialTilt: 25.19, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars.jpg', normalMap: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars_normal.jpg', hasAtmosphere: true },
    jupiter: { radius: 11.21, orbitRadius: 778.6, rotationPeriod: 0.41, orbitPeriod: 4331, axialTilt: 3.13, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/jupiter.jpg' },
    saturn: { radius: 9.45, orbitRadius: 1433.5, rotationPeriod: 0.44, orbitPeriod: 10747, axialTilt: 26.73, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/saturn.jpg', hasRings: true },
    uranus: { radius: 4.01, orbitRadius: 2872.5, rotationPeriod: -0.72, orbitPeriod: 30589, axialTilt: 97.77, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/uranus.jpg' },
    neptune: { radius: 4.01, orbitRadius: 4495.1, rotationPeriod: 0.67, orbitPeriod: 59800, axialTilt: 28.32, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/neptune.jpg' },
};

const moonData = {
    luna: { parent: 'earth', radius: 0.2724, orbitRadius: 2.5, rotationPeriod: 27.3, orbitPeriod: 27.3, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon.jpg', normalMap: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_normal.jpg' },
    // ... other moons ...
};

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    clock = new THREE.Clock();

    createSun();
    createPlanets();
    createMoons();
    createStars();
    createAsteroidBelt();
    createLensFlare();

    // ... [rest of the init function] ...
}

function createSun() {
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ 
        map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/sun.jpg'),
        emissive: 0xffff00,
        emissiveIntensity: 0.7
    });
    sun = new THREE.Mesh(geometry, material);
    sun.castShadow = true;
    scene.add(sun);

    const sunlight = new THREE.PointLight(0xffffff, 1.5, 1000);
    sunlight.castShadow = true;
    scene.add(sunlight);

    // Add sun glow
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/glow.png'), 
        color: 0xffff00, 
        transparent: true, 
        blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(30, 30, 1);
    sun.add(sprite);
}

function createPlanets() {
    const textureLoader = new THREE.TextureLoader();
    for (const [name, data] of Object.entries(planetData)) {
        const geometry = new THREE.SphereGeometry(data.radius * 0.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            map: textureLoader.load(data.texture),
            normalMap: data.normalMap ? textureLoader.load(data.normalMap) : null,
            specularMap: data.specularMap ? textureLoader.load(data.specularMap) : null,
            bumpMap: data.bumpMap ? textureLoader.load(data.bumpMap) : null,
            bumpScale: 0.05,
        });
        const planet = new THREE.Mesh(geometry, material);
        planet.rotation.x = THREE.MathUtils.degToRad(data.axialTilt);
        planet.name = name;
        planet.castShadow = true;
        planet.receiveShadow = true;
        scene.add(planet);
        planets[name] = planet;

        if (data.hasRings) {
            createRings(planet, data);
        }

        if (data.hasAtmosphere) {
            createAtmosphere(planet, data);
        }

        if (data.hasClouds) {
            createClouds(planet, data);
        }

        createOrbit(name, data);
        createLabel(name, data);
        createAxisLine(planet, data);
    }
}

function createClouds(planet, data) {
    const cloudGeometry = new THREE.SphereGeometry(data.radius * 0.51, 32, 32);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds.jpg'),
        transparent: true,
        opacity: 0.8
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    planet.add(clouds);
}

function createLensFlare() {
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare0.png');
    const textureFlare3 = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare3.png');

    const lensflare = new THREE.Lensflare();
    lensflare.addElement(new THREE.LensflareElement(textureFlare0, 700, 0, new THREE.Color(0xffff00)));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.7));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.9));
    lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 1));
    sun.add(lensflare);
}

// ... [rest of the previous functions] ...

function animate() {
    requestAnimationFrame(animate);

    TWEEN.update();

    const delta = clock.getDelta();
    simulationTime += delta * timeSpeed;

    updateCelestialBodies();
    updateInfoPanel();
    updateDayNightCycle();

    controls.update();
    renderer.render(scene, camera);
}

function updateDayNightCycle() {
    if (planets['earth']) {
        const earth = planets['earth'];
        const sunDirection = new THREE.Vector3().subVectors(sun.position, earth.position).normalize();
        earth.material.uniforms.sunDirection.value.copy(sunDirection);
    }
}

// ... [rest of the previous functions] ...

function togglePlanetView() {
    if (selectedObject && planetData[selectedObject.name]) {
        const planet = planets[selectedObject.name];
        const distance = planet.geometry.parameters.radius * 2;
        new TWEEN.Tween(camera.position)
            .to({
                x: planet.position.x,
                y: planet.position.y + distance * 0.5,
                z: planet.position.z + distance
            }, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start()
            .onComplete(() => {
                controls.target.copy(planet.position);
            });
    }
}

// Add event listener for the new "View from Planet" button
document.getElementById('toggle-planet-view').addEventListener('click', togglePlanetView);

init();
animate();
