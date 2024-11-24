
document.addEventListener('DOMContentLoaded', () => {
    const solarSystem = document.getElementById('solar-system');
    const planets = document.querySelectorAll('.planet');
    const asteroidBelt = document.getElementById('asteroid-belt');

    // Set initial positions and orbits
    planets.forEach((planet, index) => {
        const orbitRadius = 100 + index * 50; // Increase orbit radius for each planet
        planet.style.animation = `orbit ${10 + index * 5}s linear infinite`;
        planet.style.transform = `rotateY(${Math.random() * 360}deg) translateX(${orbitRadius}px) rotateY(${Math.random() * 360}deg)`;
    });

    // Create asteroids
    for (let i = 0; i < 200; i++) {
        const asteroid = document.createElement('div');
        asteroid.className = 'asteroid';
        asteroid.style.width = asteroid.style.height = Math.random() * 2 + 1 + 'px';
        asteroid.style.background = '#555';
        asteroid.style.position = 'absolute';
        asteroid.style.borderRadius = '50%';
        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 50;
        asteroid.style.left = 50 + Math.cos(angle) * distance + '%';
        asteroid.style.top = 50 + Math.sin(angle) * distance + '%';
        asteroidBelt.appendChild(asteroid);
    }

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
