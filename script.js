
// ... [Previous code remains the same] ...

function init() {
    // ... [Previous init code] ...
    
    createTimelineEvents();
    createSpaceMissions();
    createHabitableZone();
    createScaleComparison();
    
    // ... [Rest of init function] ...

    // Add event listeners for new features
    document.getElementById('toggle-habitable-zone').addEventListener('click', toggleHabitableZone);
    document.getElementById('show-timeline').addEventListener('click', toggleTimelineDisplay);
    document.getElementById('toggle-missions').addEventListener('click', toggleMissionDisplay);
    document.getElementById('toggle-scale-comparison').addEventListener('click', toggleScaleComparison);
}

function createTimelineEvents() {
    timelineEvents = [
        { year: 1957, event: "Sputnik 1: First artificial satellite" },
        { year: 1961, event: "Yuri Gagarin: First human in space" },
        { year: 1969, event: "Apollo 11: First humans on the Moon" },
        { year: 1990, event: "Hubble Space Telescope launched" },
        { year: 2012, event: "Curiosity rover lands on Mars" },
        { year: 2015, event: "New Horizons flyby of Pluto" },
        { year: 2020, event: "SpaceX Crew Dragon first crewed flight" }
    ];

    const timelineContainer = document.getElementById('timeline-events');
    timelineEvents.forEach(event => {
        const li = document.createElement('li');
        li.textContent = `${event.year}: ${event.event}`;
        timelineContainer.appendChild(li);
    });
}

function createSpaceMissions() {
    spaceMissions = [
        { name: "Voyager 1", launch: 1977, position: new THREE.Vector3(100, 50, 150) },
        { name: "New Horizons", launch: 2006, position: new THREE.Vector3(-80, 30, 120) },
        { name: "Juno", launch: 2011, position: new THREE.Vector3(60, -40, 90) },
        { name: "Parker Solar Probe", launch: 2018, position: new THREE.Vector3(-30, 20, 40) }
    ];

    const missionGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const missionMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });

    spaceMissions.forEach(mission => {
        const missionMesh = new THREE.Mesh(missionGeometry, missionMaterial);
        missionMesh.position.copy(mission.position);
        scene.add(missionMesh);
        mission.mesh = missionMesh;

        const missionListItem = document.createElement('li');
        missionListItem.textContent = `${mission.name} (Launched: ${mission.launch})`;
        document.getElementById('mission-list').appendChild(missionListItem);
    });
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

function getAverageColor(imageUrl) {
    // This is a placeholder function. In a real implementation,
    // you would load the image and calculate its average color.
    // For simplicity, we'll return a fixed color for each planet.
    const colors = {
        mercury: '#8c8c8c',
        venus: '#e6e6e6',
        earth: '#4ca6ff',
        mars: '#ff6b6b',
        jupiter: '#ffa500',
        saturn: '#f4d03f',
        uranus: '#73d7ff',
        neptune: '#3498db'
    };
    return colors[imageUrl.split('/').pop().split('.')[0]] || '#ffffff';
}

function updateMoonPhase() {
    if (moons['luna'] && planets['earth']) {
        const moonPosition = moons['luna'].position;
        const earthPosition = planets['earth'].position;
        const sunPosition = sun.position;

        const earthToMoon = new THREE.Vector3().subVectors(moonPosition, earthPosition);
        const earthToSun = new THREE.Vector3().subVectors(sunPosition, earthPosition);

        const angle = earthToMoon.angleTo(earthToSun);
        const phase = (1 - Math.cos(angle)) / 2;

        const moonPhaseDisplay = document.getElementById('moon-phase-display');
        moonPhaseDisplay.style.boxShadow = `inset ${phase * 100}px 0 0 0 #888`;
    }
}

function toggleHabitableZone() {
    showHabitableZone = !showHabitableZone;
    scene.getObjectByName('habitableZone').visible = showHabitableZone;
}

function toggleTimelineDisplay() {
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.style.display = timelineContainer.style.display === 'none' ? 'block' : 'none';
}

function toggleMissionDisplay() {
    const missionInfo = document.getElementById('mission-info');
    missionInfo.style.display = missionInfo.style.display === 'none' ? 'block' : 'none';
}

function toggleScaleComparison() {
    const scaleComparison = document.getElementById('scale-comparison');
    scaleComparison.style.display = scaleComparison.style.display === 'none' ? 'block' : 'none';
}

// Update the animate function
function animate() {
    requestAnimationFrame(animate);

    TWEEN.update();

    const delta = clock.getDelta();
    simulationTime += delta * timeSpeed;

    updateCelestialBodies();
    updateSpaceMissions();
    updateMoonPhase();
    updateInfoPanel();

    controls.update();
    renderer.render(scene, camera);
}

// ... [Rest of the previous code] ...

init();
animate();
