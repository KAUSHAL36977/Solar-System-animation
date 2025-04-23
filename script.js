// Enhanced Solar System Animation with improved camera controls and lighting

// Performance monitoring
let lastTime = 0;
let frameCount = 0;
const fpsElement = document.getElementById('fps');
let debugMode = false;

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Texture URLs - replace with your actual texture paths when available
    const textures = {
        sun: "/api/placeholder/400/400",
        mercury: "/api/placeholder/400/400",
        venus: "/api/placeholder/400/400",
        earth: "/api/placeholder/400/400",
        moon: "/api/placeholder/400/400",
        mars: "/api/placeholder/400/400",
        jupiter: "/api/placeholder/400/400",
        saturn: "/api/placeholder/400/400",
        saturnRing: "/api/placeholder/400/400",
        uranus: "/api/placeholder/400/400",
        neptune: "/api/placeholder/400/400"
    };

    // Configuration data for the planets
    const planetData = [
        { name: "Mercury", texture: textures.mercury, size: 0.38, distance: 10, speed: 4.1, color: 0xAAAAAA, 
          emissive: 0x222222, roughness: 0.8, metalness: 0.1 },
        { name: "Venus", texture: textures.venus, size: 0.95, distance: 15, speed: 1.6, color: 0xE39E1C, 
          emissive: 0x331100, roughness: 0.7, metalness: 0.2 },
        { name: "Earth", texture: textures.earth, size: 1, distance: 20, speed: 1, color: 0x2E97D8, 
          emissive: 0x112233, roughness: 0.6, metalness: 0.2,
          moons: [{ name: "Moon", texture: textures.moon, size: 0.27, distance: 2, speed: 10, color: 0xDDDDDD,
                   emissive: 0x222222, roughness: 0.9, metalness: 0.0 }] },
        { name: "Mars", texture: textures.mars, size: 0.53, distance: 30, speed: 0.53, color: 0xD83A18, 
          emissive: 0x331100, roughness: 0.8, metalness: 0.1 },
        { name: "Jupiter", texture: textures.jupiter, size: 11.2, distance: 50, speed: 0.084, color: 0xE3DCCB, 
          emissive: 0x221100, roughness: 0.4, metalness: 0.3 },
        { name: "Saturn", texture: textures.saturn, size: 9.45, distance: 90, speed: 0.034, color: 0xEAD6B8, 
          emissive: 0x221100, roughness: 0.4, metalness: 0.3,
          ring: { texture: textures.saturnRing, innerRadius: 10, outerRadius: 20 } },
        { name: "Uranus", texture: textures.uranus, size: 4, distance: 130, speed: 0.012, color: 0xCAF8F3, 
          emissive: 0x112233, roughness: 0.5, metalness: 0.4 },
        { name: "Neptune", texture: textures.neptune, size: 3.88, distance: 180, speed: 0.006, color: 0x3E5BF6, 
          emissive: 0x112244, roughness: 0.5, metalness: 0.4 }
    ];

    // Set up the scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0005);

    // Get the canvas element and set up renderer
    const canvas = document.getElementById('solarSystem');
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 100);

    // Lighting
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Point light at sun's position
    const sunLight = new THREE.PointLight(0xFFFFAA, 2, 1000, 0.5);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.bias = -0.001;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Secondary light sources for better visibility
    const fillLight = new THREE.DirectionalLight(0xFFFFFF, 0.3);
    fillLight.position.set(200, 100, 50);
    scene.add(fillLight);

    // Add some stars in the background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.7,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const starsVertices = [];
    for (let i = 0; i < 15000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Create stardust particles with improved visuals
    const dustGeometry = new THREE.BufferGeometry();
    const dustColors = [];
    const dustVertices = [];
    const dustVelocities = [];
    const dustSizes = [];
    const dustParticleCount = 3000;
    
    for (let i = 0; i < dustParticleCount; i++) {
        // Position dust in a disc shape around the solar system
        const radius = 5 + Math.random() * 400;
        const theta = Math.random() * Math.PI * 2;
        
        const x = radius * Math.cos(theta);
        const z = radius * Math.sin(theta);
        const y = (Math.random() - 0.5) * 30; // Thicker disc
        
        dustVertices.push(x, y, z);
        
        // Store velocity for animation
        const speed = 0.01 + Math.random() * 0.05;
        dustVelocities.push({
            x: Math.cos(theta + Math.PI/2) * speed * (1 / Math.sqrt(radius)),
            y: (Math.random() - 0.5) * 0.01,
            z: Math.sin(theta + Math.PI/2) * speed * (1 / Math.sqrt(radius))
        });
        
        // Color variation for dust
        const colorValue = 0.5 + Math.random() * 0.5;
        dustColors.push(colorValue, colorValue, colorValue);
        
        // Size variation
        dustSizes.push(0.5 + Math.random() * 1.5);
    }

    dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustVertices, 3));
    dustGeometry.setAttribute('color', new THREE.Float32BufferAttribute(dustColors, 3));
    
    const dustMaterial = new THREE.PointsMaterial({
        size: 1.2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        sizeAttenuation: true
    });
    
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // Create the Sun with enhanced materials and effects
    const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
    const sunTexture = new THREE.TextureLoader().load(textures.sun);
    const sunMaterial = new THREE.MeshBasicMaterial({
        map: sunTexture,
        color: 0xFFDD00,
        emissive: 0xFFAA00,
        emissiveIntensity: 1,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Create a more impressive glow effect for the sun
    const sunGlowGeometry = new THREE.SphereGeometry(6, 32, 32);
    const sunGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFDD00,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });
    const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
    scene.add(sunGlow);

    // Create an even larger, softer glow
    const sunOuterGlowGeometry = new THREE.SphereGeometry(10, 32, 32);
    const sunOuterGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFAA00,
        transparent: true,
        opacity: 0.07,
        side: THREE.BackSide
    });
    const sunOuterGlow = new THREE.Mesh(sunOuterGlowGeometry, sunOuterGlowMaterial);
    scene.add(sunOuterGlow);

    // Create lens flare
    const textureFlare = new THREE.TextureLoader().load("/api/placeholder/64/64");
    const lensflare = new THREE.Lensflare();
    lensflare.addElement(new THREE.LensflareElement(textureFlare, 700, 0, new THREE.Color(0xFFFFFF)));
    lensflare.addElement(new THREE.LensflareElement(textureFlare, 60, 0.6, new THREE.Color(0xFFAAFF)));
    lensflare.addElement(new THREE.LensflareElement(textureFlare, 100, 0.8, new THREE.Color(0xAAFFFF)));
    lensflare.addElement(new THREE.LensflareElement(textureFlare, 120, 1, new THREE.Color(0xFFFF22)));
    sunLight.add(lensflare);

    // Create planets with enhanced materials
    const planets = [];
    const planetLabels = [];
    const planetOrbits = [];
    
    const loader = new THREE.TextureLoader();

    planetData.forEach(planet => {
        // Create orbit
        const orbitGeometry = new THREE.RingGeometry(planet.distance, planet.distance + 0.1, 128);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
        planetOrbits.push(orbit);

        // Create planet with improved materials
        const geometry = new THREE.SphereGeometry(planet.size, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            map: loader.load(planet.texture),
            color: planet.color,
            emissive: planet.emissive || 0x000000,
            metalness: planet.metalness || 0.2,
            roughness: planet.roughness || 0.7,
            envMapIntensity: 1.0
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Position planet
        const angle = Math.random() * Math.PI * 2;
        mesh.position.x = Math.cos(angle) * planet.distance;
        mesh.position.z = Math.sin(angle) * planet.distance;
        
        const planetObj = {
            mesh,
            angle,
            data: planet,
            moons: []
        };
        
        planets.push(planetObj);
        scene.add(mesh);
        
        // Create planet label
        const planetDiv = document.createElement('div');
        planetDiv.className = 'label';
        planetDiv.textContent = planet.name;
        document.body.appendChild(planetDiv);
        planetLabels.push(planetDiv);
        
        // Add moons if the planet has any
        if (planet.moons) {
            planet.moons.forEach(moon => {
                const moonGeometry = new THREE.SphereGeometry(moon.size, 32, 32);
                const moonMaterial = new THREE.MeshStandardMaterial({
                    map: loader.load(moon.texture),
                    color: moon.color,
                    emissive: moon.emissive || 0x000000,
                    metalness: moon.metalness || 0.1,
                    roughness: moon.roughness || 0.8
                });
                const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
                moonMesh.castShadow = true;
                moonMesh.receiveShadow = true;
                
                const moonObj = {
                    mesh: moonMesh,
                    angle: Math.random() * Math.PI * 2,
                    data: moon,
                    parent: planetObj
                };
                
                planetObj.moons.push(moonObj);
                scene.add(moonMesh);
            });
        }
        
        // Add ring for Saturn
        if (planet.ring) {
            const ringGeometry = new THREE.RingGeometry(
                planet.size + 2, 
                planet.size + 7, 
                64
            );
            const ringMaterial = new THREE.MeshStandardMaterial({
                map: loader.load(planet.ring.texture),
                color: 0xCCBB99,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8,
                roughness: 0.7,
                metalness: 0.2
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            planetObj.ring = ring;
            mesh.add(ring);
        }
    });

    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 500;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;

    // Camera control sliders
    const cameraXSlider = document.getElementById('cameraX');
    const cameraYSlider = document.getElementById('cameraY');
    const cameraZSlider = document.getElementById('cameraZ');
    const cameraXValue = document.getElementById('cameraXValue');
    const cameraYValue = document.getElementById('cameraYValue');
    const cameraZValue = document.getElementById('cameraZValue');

    // Update camera position based on sliders
    function updateCameraPosition() {
        const x = parseInt(cameraXSlider.value);
        const y = parseInt(cameraYSlider.value);
        const z = parseInt(cameraZSlider.value);
        
        camera.position.set(x, y, z);
        controls.update();
        
        cameraXValue.textContent = x;
        cameraYValue.textContent = y;
        cameraZValue.textContent = z;
    }

    cameraXSlider.addEventListener('input', updateCameraPosition);
    cameraYSlider.addEventListener('input', updateCameraPosition);
    cameraZSlider.addEventListener('input', updateCameraPosition);

    // Reset camera button
    document.getElementById('resetCamera').addEventListener('click', () => {
        cameraXSlider.value = 0;
        cameraYSlider.value = 50;
        cameraZSlider.value = 100;
        updateCameraPosition();
    });

    // Top view button
    document.getElementById('topView').addEventListener('click', () => {
        cameraXSlider.value = 0;
        cameraYSlider.value = 200;
        cameraZSlider.value = 0;
        updateCameraPosition();
    });

    // Side view button
    document.getElementById('sideView').addEventListener('click', () => {
        cameraXSlider.value = 200;
        cameraYSlider.value = 0;
        cameraZSlider.value = 0;
        updateCameraPosition();
    });

    // Time tracking
    let time = 0;
    let timeScale = 1.0;
    let showLabels = false;

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Speed control buttons
    document.getElementById('speedDown').addEventListener('click', () => {
        timeScale = Math.max(0.1, timeScale * 0.5);
    });
    
    document.getElementById('speedUp').addEventListener('click', () => {
        timeScale = Math.min(10, timeScale * 2);
    });
    
    document.getElementById('toggleLabels').addEventListener('click', () => {
        showLabels = !showLabels;
        planetLabels.forEach(label => {
            label.style.display = showLabels ? 'block' : 'none';
        });
    });

    // Debug toggle
    document.getElementById('toggleDebug').addEventListener('click', () => {
        debugMode = !debugMode;
        document.getElementById('debugInfo').classList.toggle('hidden');
    });

    // Calculate FPS
    function updateFPS(now) {
        if (!lastTime) {
            lastTime = now;
            return;
        }
        
        frameCount++;
        
        if (now > lastTime + 1000) {
            fpsElement.textContent = frameCount;
            frameCount = 0;
            lastTime = now;
        }
    }

    // Count visible planets for debugging
    function countVisiblePlanets() {
        if (!debugMode) return;
        
        let count = 0;
        planets.forEach(planet => {
            // Check if planet is in camera frustum
            const frustum = new THREE.Frustum().setFromProjectionMatrix(
                new THREE.Matrix4().multiplyMatrices(
                    camera.projectionMatrix,
                    camera.matrixWorldInverse
                )
            );
            
            if (frustum.containsPoint(planet.mesh.position)) {
                count++;
            }
        });
        
        document.getElementById('visiblePlanets').textContent = count;
    }

    // Animation loop with enhanced effects
    function animate(now) {
        requestAnimationFrame(animate);
        
        // Update FPS counter
        if (debugMode) {
            updateFPS(now);
            countVisiblePlanets();
        }
        
        time += 0.001 * timeScale;
        
        // Rotate and pulse the sun
        sun.rotation.y += 0.002 * timeScale;
        const pulseScale = 1 + 0.05 * Math.sin(time * 2);
        
        sunGlow.scale.set(pulseScale, pulseScale, pulseScale);
        sunOuterGlow.scale.set(pulseScale * 1.1, pulseScale * 1.1, pulseScale * 1.1);
        
        // Make sun light flicker slightly
        sunLight.intensity = 1.9 + Math.sin(time * 10) * 0.1;
        
        // Animate stardust with improved effects
        const dustPositions = dust.geometry.attributes.position.array;
        
        for (let i = 0; i < dustParticleCount; i++) {
            const i3 = i * 3;
            
            dustPositions[i3] += dustVelocities[i].x * timeScale;
            dustPositions[i3 + 1] += dustVelocities[i].y * timeScale;
            dustPositions[i3 + 2] += dustVelocities[i].z * timeScale;
            
            // Reset particles that get too far away
            const distance = Math.sqrt(
                dustPositions[i3] * dustPositions[i3] + 
                dustPositions[i3 + 1] * dustPositions[i3 + 1] + 
                dustPositions[i3 + 2] * dustPositions[i3 + 2]
            );
            
            if (distance > 500) {
                // Reset to a new position on the disc
                const radius = 5 + Math.random() * 400;
                const theta = Math.random() * Math.PI * 2;
                
                dustPositions[i3] = radius * Math.cos(theta);
                dustPositions[i3 + 1] = (Math.random() - 0.5) * 30;
                dustPositions[i3 + 2] = radius * Math.sin(theta);
                
                // Update velocity
                const speed = 0.01 + Math.random() * 0.05;
                dustVelocities[i] = {
                    x: Math.cos(theta + Math.PI/2) * speed * (1 / Math.sqrt(radius)),
                    y: (Math.random() - 0.5) * 0.01,
                    z: Math.sin(theta + Math.PI/2) * speed * (1 / Math.sqrt(radius))
                };
            }
        }
        
        dust.geometry.attributes.position.needsUpdate = true;
        
        // Update planet positions with improved animation
        planets.forEach((planet, index) => {
            planet.angle += planet.data.speed * 0.001 * timeScale;
            
            planet.mesh.position.x = Math.cos(planet.angle) * planet.data.distance;
            planet.mesh.position.z = Math.sin(planet.angle) * planet.data.distance;
            planet.mesh.rotation.y += 0.005 * timeScale;
            
            // Add slight wobble to orbit
            const wobbleAmount = 0.05 * planet.data.size;
            planet.mesh.position.y = Math.sin(time * 2 + index) * wobbleAmount;
            
            // Update label position
            if (showLabels) {
                const vector = new THREE.Vector3();
                vector.copy(planet.mesh.position);
                vector.project(camera);
                
                const x = (vector.x * 0.5 +
