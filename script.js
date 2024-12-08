import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import Stats from 'stats.js';

class SolarSystemSimulation {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance"
        });
        
        this.composer = new EffectComposer(this.renderer);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.stats = new Stats();
        
        this.planets = new Map();
        this.labels = new Map();
        this.orbits = new Map();
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupLighting();
        this.setupPostProcessing();
        this.createPlanets();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        this.scene.background = new THREE.Color(0x000000);
        this.camera.position.set(0, 50, 100);
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Setup CSS2D renderer
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.top = '0';
        
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        document.getElementById('canvas-container').appendChild(this.labelRenderer.domElement);
        document.body.appendChild(this.stats.dom);
    }

    setupPostProcessing() {
        const renderPass = new RenderPass(this.scene, this.camera);
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 0.4, 0.85
        );
        const fxaaPass = new ShaderPass(FXAAShader);
        
        this.composer.addPass(renderPass);
        this.composer.addPass(bloomPass);
        this.composer.addPass(fxaaPass);
    }

    createPlanet(data) {
        const textureLoader = new THREE.TextureLoader();
        
        // Create planet mesh
        const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            map: textureLoader.load(`/textures/${data.name.toLowerCase()}.jpg`),
            normalMap: textureLoader.load(`/textures/${data.name.toLowerCase()}_normal.jpg`),
            roughnessMap: textureLoader.load(`/textures/${data.name.toLowerCase()}_roughness.jpg`)
        });
        
        const planet = new THREE.Mesh(geometry, material);
        
        // Create orbit
        const orbitGeometry = new THREE.RingGeometry(data.orbitRadius, data.orbitRadius + 0.1, 128);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        
        // Create label
        const labelDiv = document.createElement('div');
        labelDiv.className = 'celestial-label';
        labelDiv.textContent = data.name;
        const label = new CSS2DObject(labelDiv);
        
        this.scene.add(planet);
        this.scene.add(orbit);
        this.scene.add(label);
        
        this.planets.set(data.name, planet);
        this.orbits.set(data.name, orbit);
        this.labels.set(data.name, label);
        
        return { planet, orbit, label };
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.planets.forEach((planet, name) => {
            const data = celestialBodies.find(body => body.name === name);
            const time = performance.now() * 0.001;
            
            planet.rotation.y += 0.01;
            planet.position.x = Math.cos(time * 0.5) * data.orbitRadius;
            planet.position.z = Math.sin(time * 0.5) * data.orbitRadius;
            
            const label = this.labels.get(name);
            label.position.copy(planet.position);
            label.position.y += data.radius + 2;
        });
        
        this.controls.update();
        this.composer.render();
        this.labelRenderer.render(this.scene, this.camera);
        this.stats.update();
    }
}
