const canvas = document.getElementById('board');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');

let launchers = [];
let fireworks = [];
let particles = [];

class Launcher
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

class Firework
{
    constructor(x, y, velocityX, velocityY, size, color)
    {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.size = size;
        this.color = color;
    }
}

class Particle
{
    constructor(x, y, velocityX, velocityY, color)
    {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
        this.energy = 255;
    }
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function makeLaunchers()
{
    const launchersPosX = window.innerWidth / 2;
    const launchersPosY = window.innerHeight;
    const countOfLaunchers = 5;
    const startPos = 16 + launchersPosX - (32 * countOfLaunchers) / 2;
    for (let i = 0; i < countOfLaunchers; i++) {
        const launcherX = startPos + 32 * i;
        launchers.push(new Launcher(launcherX, launchersPosY));
        console.log(launcherX, launchersPosY);
    }
}

function drawObjects()
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < fireworks.length; i++) {
        const firework = fireworks[i];
        context.beginPath();
        context.arc(
            firework.x,
            firework.y,
            2,
            0,
            2 * Math.PI,
            false,
        );
        context.fillStyle = 'rgba(239, 239, 239, 0.5)';
        context.fill();
    }

    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        context.beginPath();
        context.arc(
            particle.x,
            particle.y,
            1,
            0,
            2 * Math.PI,
            false,
        );
        context.fillStyle = 'rgba(' + particle.color[0] + ', ' + particle.color[1] + ', ' + particle.color[2] + ', ' + (1 / 255 * particle.energy) + ')';
        context.fill();
    }

    for (let i = 0; i < launchers.length; i++) {
        const launcher = launchers[i];
        context.beginPath();
        context.arc(
            launcher.x,
            launcher.y,
            5,
            0,
            2 * Math.PI,
             false,
        );
        context.fillStyle = 'rgba(239, 239, 239, 1)';
        context.fill();
    }
}

function handleObjects(index) {
    let fireworksToRemove = [];
    for (let i = 0; i < fireworks.length; i++) {
        const firework = fireworks[i];
        firework.x += firework.velocityX;
        firework.y += firework.velocityY;

        if (firework.y < window.innerHeight / 2) {
            const explodes = randomBetween(1, 5) === 1;
            if (explodes) {
                fireworksToRemove.push(i);
            }
        }
    }

    let particlesToRemove = [];
    for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.energy -= 2;
        if (particle.energy <= 0) {
            particlesToRemove.push(i);
        }
    }

    for (let i = fireworksToRemove.length - 1; i > 0; i--) {
        const fireworkToRemove = fireworks[fireworksToRemove[i]];
        for (let i = 0; i < fireworkToRemove.size; i++) {
            particles.push(new Particle(
                fireworkToRemove.x,
                fireworkToRemove.y,
                randomBetween(-10, 10),
                randomBetween(-10, 10),
                fireworkToRemove.color,
            ));
        }
        fireworks.splice(fireworksToRemove[i], 1);
    }

    for (let i = particlesToRemove.length - 1; i > 0; i--) {
        particles.splice(particlesToRemove[i], 1);
    }

    if (index <= 2 && launchers.length > 0) {
        const random = randomBetween(0, launchers.length - 1);
        const randomLauncher = launchers[random];
        let randomColor = randomBetween(1, 9);
        let color = [];
        if (randomColor === 1) {
            color = [
                randomBetween(192, 255),
                randomBetween(1, 64),
                randomBetween(1, 64),
            ];
        } else if (randomColor === 2) {
            color = [
                randomBetween(1, 64),
                randomBetween(192, 255),
                randomBetween(1, 64),
            ];
        } else if (randomColor === 3) {
            color = [
                randomBetween(1, 64),
                randomBetween(1, 64),
                randomBetween(192, 255),
            ];
        } else if (randomColor === 4) {
            color = [
                randomBetween(192, 255),
                randomBetween(1, 64),
                randomBetween(192, 255),
            ];
        } else if (randomColor === 5) {
            color = [
                randomBetween(1, 64),
                randomBetween(192, 255),
                randomBetween(192, 255),
            ];
        } else {
            color = [
                randomBetween(192, 255),
                randomBetween(192, 255),
                randomBetween(1, 64),
            ];
        }
        fireworks.push(new Firework(
            randomLauncher.x,
            randomLauncher.y,
            randomBetween(-50, 50) / 100,
            randomBetween(1, 2) * -1,
            randomBetween(25, 100),
            color,
        ))
    }
}

setTimeout(() => {
    makeLaunchers();
}, 500)

let pos = 0;
setInterval(() => {
    handleObjects(pos);
    drawObjects();
    pos++;
    if (pos >= 60) {
        pos = 0;
    }
}, 1000 / 60);
