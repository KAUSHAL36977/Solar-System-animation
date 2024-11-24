// Updated 2D Solar System Animation

document.addEventListener('DOMContentLoaded', () => {
    const solarSystem = document.getElementById('solar-system');
    const planets = document.querySelectorAll('.planet, .celestial-body');
    const asteroidBelt = document.getElementById('asteroid-belt');

    // Solar system data (scaled for visualization)
    const solarSystemData = {
        sun: { radius: 40, color: '#FDB813' },
        mercury: { radius: 2, orbitRadius: 60, color: '#B5B5B5', period: 2 },
        venus: { radius: 3.5, orbitRadius: 80, color: '#FFC649', period: 5 },
        earth: { radius: 4, orbitRadius: 100, color: '#6B93D6', period: 8 },
        mars: { radius: 3, orbitRadius: 130, color: '#C1440E', period: 15 },
        jupiter: { radius: 12, orbitRadius: 200, color: '#C9B5A0', period: 95 },
        saturn: { radius: 10, orbitRadius: 270, color: '#F4D4A9', period: 235 },
        uranus: { radius: 7, orbitRadius: 340, color: '#CAE9FF', period: 670 },
        neptune: { radius: 6.5, orbitRadius: 400, color: '#5B5DDF', period: 1315 },
        pluto: { radius: 1.5, orbitRadius: 450, color: '#FBF2E1', period: 1980 }
    };

    // Set initial positions and orbits
    planets.forEach(planet => {
        const name = planet.id;
        const data = solarSystemData[name];
        if (data) {
            planet.style.width = planet.style.height = `${data.radius * 2}px`;
            planet.style.backgroundColor = data.color;
            if (name !== 'sun') {
                planet.style.animation = `orbit ${data.period}s linear infinite`;
                planet.style.transform = `rotateY(${Math.random() * 360}deg) translateX(${data.orbitRadius}px) rotateY(${Math.random() * 360}deg)`;
            } else {
                planet.style.boxShadow = `0 0 60px ${data.color}`;
            }
        }
    });

    // Update asteroid belt
    asteroidBelt.style.width = asteroidBelt.style.height = `${solarSystemData.jupiter.orbitRadius * 2}px`;

    // Create asteroids
    for (let i = 0; i < 200; i++) {
        const asteroid = document.createElement('div');
        asteroid.className = 'asteroid';
        asteroid.style.width = asteroid.style.height = `${Math.random() * 2 + 1}px`;
        asteroid.style.background = '#555';
        asteroid.style.position = 'absolute';
        asteroid.style.borderRadius = '50%';
        const angle = Math.random() * Math.PI * 2;
        const distance = 165 + Math.random() * 35; // Between Mars and Jupiter
        asteroid.style.left = `${50 + Math.cos(angle) * distance}%`;
        asteroid.style.top = `${50 + Math.sin(angle) * distance}%`;
        asteroidBelt.appendChild(asteroid);
    }

    // Add tooltips
    planets.forEach(planet => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = planet.dataset.name;
        planet.appendChild(tooltip);

        planet.addEventListener('mouseover', () => {
            tooltip.style.opacity = 1;
        });

        planet.addEventListener('mouseout', () => {
            tooltip.style.opacity = 0;
        });
    });

    // Add mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    solarSystem.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
        };

        const rotationSpeed = 0.5;
        solarSystem.style.transform = `rotateX(${-deltaMove.y * rotationSpeed}deg) rotateY(${deltaMove.x * rotationSpeed}deg)`;

        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});
