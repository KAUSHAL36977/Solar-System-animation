
// Updated 2D Solar System Animation with realistic planet appearances
document.addEventListener('DOMContentLoaded', () => {
    const solarSystem = document.getElementById('solar-system');
    const planets = document.querySelectorAll('.planet, .celestial-body');
    const asteroidBelt = document.getElementById('asteroid-belt');

    // Solar system data (scaled for visualization)
    const solarSystemData = {
        sun: { radius: 40, color: '#FDB813', gradient: 'radial-gradient(circle at 30% 30%, #FFF76B 0%, #FDB813 50%, #F89B29 100%)' },
        mercury: { radius: 2, orbitRadius: 60, color: '#B5B5B5', period: 2, gradient: 'radial-gradient(circle at 30% 30%, #E2E2E2 0%, #B5B5B5 50%, #8C8C8C 100%)' },
        venus: { radius: 3.5, orbitRadius: 80, color: '#FFC649', period: 5, gradient: 'radial-gradient(circle at 30% 30%, #FFF3C3 0%, #FFC649 50%, #FFB800 100%)' },
        earth: { radius: 4, orbitRadius: 100, color: '#6B93D6', period: 8, gradient: 'radial-gradient(circle at 30% 30%, #B3CFFF 0%, #6B93D6 50%, #4578C4 100%)' },
        mars: { radius: 3, orbitRadius: 130, color: '#C1440E', period: 15, gradient: 'radial-gradient(circle at 30% 30%, #F1A285 0%, #C1440E 50%, #8C3308 100%)' },
        jupiter: { radius: 12, orbitRadius: 200, color: '#C9B5A0', period: 95, gradient: 'radial-gradient(circle at 30% 30%, #F0E4D3 0%, #C9B5A0 50%, #A89078 100%)' },
        saturn: { radius: 10, orbitRadius: 270, color: '#F4D4A9', period: 235, gradient: 'radial-gradient(circle at 30% 30%, #FFF2D8 0%, #F4D4A9 50%, #E6B87D 100%)' },
        uranus: { radius: 7, orbitRadius: 340, color: '#CAE9FF', period: 670, gradient: 'radial-gradient(circle at 30% 30%, #EFFFFF 0%, #CAE9FF 50%, #A1D6F7 100%)' },
        neptune: { radius: 6.5, orbitRadius: 400, color: '#5B5DDF', period: 1315, gradient: 'radial-gradient(circle at 30% 30%, #8B8BE3 0%, #5B5DDF 50%, #3F3FC7 100%)' },
        pluto: { radius: 1.5, orbitRadius: 450, color: '#FBF2E1', period: 1980, gradient: 'radial-gradient(circle at 30% 30%, #FFFAF0 0%, #FBF2E1 50%, #E5D7B4 100%)' }
    };

    // Set initial positions and orbits
    planets.forEach(planet => {
        const name = planet.id;
        const data = solarSystemData[name];
        if (data) {
            planet.style.width = planet.style.height = `${data.radius * 2}px`;
            planet.style.background = data.gradient;
            planet.style.boxShadow = `0 0 10px ${data.color}`;
            if (name !== 'sun') {
                planet.style.position = 'absolute';
                planet.style.left = '50%';
                planet.style.top = '50%';
                planet.style.marginLeft = `-${data.radius}px`;
                planet.style.marginTop = `-${data.radius}px`;
                animatePlanet(planet, data);
            } else {
                planet.style.position = 'absolute';
                planet.style.left = '50%';
                planet.style.top = '50%';
                planet.style.marginLeft = `-${data.radius}px`;
                planet.style.marginTop = `-${data.radius}px`;
                planet.style.boxShadow = `0 0 60px ${data.color}`;
            }
        }
    });

    function animatePlanet(planet, data) {
        let angle = 0;
        setInterval(() => {
            angle += (2 * Math.PI) / (data.period * 60); // 60 fps
            const x = Math.cos(angle) * data.orbitRadius;
            const y = Math.sin(angle) * data.orbitRadius;
            planet.style.transform = `translate(${x}px, ${y}px)`;
        }, 1000 / 60); // 60 fps
    }

    // Update asteroid belt
    asteroidBelt.style.width = `${solarSystemData.jupiter.orbitRadius * 2}px`;
    asteroidBelt.style.height = `${solarSystemData.jupiter.orbitRadius * 2}px`;
    asteroidBelt.style.left = '50%';
    asteroidBelt.style.top = '50%';
    asteroidBelt.style.marginLeft = `-${solarSystemData.jupiter.orbitRadius}px`;
    asteroidBelt.style.marginTop = `-${solarSystemData.jupiter.orbitRadius}px`;

    // Create asteroids
    for (let i = 0; i < 200; i++) {
        const asteroid = document.createElement('div');
        asteroid.className = 'asteroid';
        asteroid.style.width = asteroid.style.height = `${Math.random() * 2 + 1}px`;
        asteroid.style.background = 'radial-gradient(circle at 30% 30%, #888 0%, #555 50%, #333 100%)';
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
});
