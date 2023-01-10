let canvas = document.getElementById('background');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let context = canvas.getContext('2d');
context.fillStyle = 'rgba(239, 239, 239, 1)';
context.fillRect(0, 0, canvas.width, canvas.height);

let mouseIsDown = false;

document.addEventListener('mousedown', event => {
    mouseIsDown = true;
});

document.addEventListener('mouseup', event => {
    mouseIsDown = false;
    bombs.push(new Bomb(
        event.clientX,
        event.clientY,
        bombSize,
    ));
    bombSize = 50;
});

document.addEventListener('touchstart', event => {
    mouseIsDown = true;
});

document.addEventListener('touchend', event => {
    mouseIsDown = false;
    bombs.push(new Bomb(
        event.clientX,
        event.clientY,
        bombSize,
    ));
    bombSize = 50;
});

let bombSize = 50;
let bombs = [];
let particles = [];

class Particle
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;

        let velocityX = rand(-2, 2);
        while (velocityX === 0) {
            velocityX = rand(-2, 2);
        }
        let velocityY = rand(-2, 2);
        while (velocityY === 0) {
            velocityY = rand(-2, 2);
        }

        this.velocity = [
            velocityX,
            velocityY
        ];

        this.color = '#F1F0FF';

        this.frozenFor = 0;
    }

    distanceTo(x, y)
    {
        let distanceX = this.x - x;
        let distanceY = this.y - y;

        return Math.sqrt((distanceX * distanceX) + (distanceY * distanceY));
    }
}

class Bomb
{
    constructor(x, y, maxSize)
    {
        this.x = x;
        this.y = y;
        this.maxSize = maxSize;
        this.radius = 0;
    }
}

makeParticles();
setInterval(() => {
    if (mouseIsDown) {
        if (bombSize <= 150) {
            bombSize += 4;
        }
    }
    handleObjects();
    updateObjects();
}, 32);

function rand(from, to)
{
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function makeParticles()
{
    for (let i = 0; i < Math.floor(window.innerWidth / 10); i++) {
        let randX = rand(0, window.innerWidth);
        let randY = rand(0, window.innerHeight);
        particles.push(new Particle(
            randX,
            randY
        ));
    }
}

function handleObjects()
{
    for (let i = 0; i < particles.length; i++) {
        let particle = particles[i];

        particle.x += particle.velocity[0];
        particle.y += particle.velocity[1];

        if (particle.x > window.innerWidth || particle.x < 0) {
            particle.velocity[0] *= -1;
        }

        if (particle.y > window.innerHeight || particle.y < 0) {
            particle.velocity[1] *= -1;
        }

        if (particle.frozenFor > 0) {
            particle.frozenFor--;
        } else {
            if (particle.velocity[0] === 0 || particle.velocity[1] === 0) {
                particle.color = '#F1F0FF';

                let velocityX = rand(-2, 2);
                while (velocityX === 0) {
                    velocityX = rand(-2, 2);
                }
                let velocityY = rand(-2, 2);
                while (velocityY === 0) {
                    velocityY = rand(-2, 2);
                }

                particle.velocity = [
                    velocityX,
                    velocityY
                ];
            }
        }
    }

    for (let i = 0; i < bombs.length; i++) {
        let bomb = bombs[i];

        if (bomb.radius >= bomb.maxSize) {
            bombs.splice(i, 1);
        }

        bomb.radius++;
    }
}

function updateObjects()
{
    context.fillStyle = 'rgba(239, 239, 239, 1)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        let particle = particles[i];

        context.beginPath();
        context.arc(particle.x, particle.y, 2, 0, 2 * Math.PI, false);
        context.fillStyle = particle.color;
        context.fill();

        for (let j = 0; j < particles.length; j++) {
            let otherParticle = particles[j];

            if (otherParticle.distanceTo(particle.x, particle.y) < 100) {
                context.moveTo(particle.x, particle.y);
                context.lineTo(otherParticle.x, otherParticle.y);
                if (particle.frozenFor > 0) {
                    context.strokeStyle = 'rgba(239, 100, 97, 0.05)';

                } else {
                    context.strokeStyle = 'rgba(239, 100, 97, 0.01)';
                }
                context.stroke();
            }
        }
    }

    for (let i = 0; i < bombs.length; i++) {
        context.beginPath();
        let bomb = bombs[i];
        context.arc(bomb.x, bomb.y, bomb.radius, 0, Math.PI * 2, false);
        context.strokeStyle = 'rgba(239, 100, 97, 0.5)';
        context.stroke();

        for (let j = 0; j < particles.length; j++) {
            let particle = particles[j];

            if (particle.distanceTo(bomb.x, bomb.y) < bomb.radius) {
                particle.color = 'rgba(239, 100, 97, 1)';
                particle.velocity = [0, 0];
                particle.frozenFor = 3 * bomb.maxSize;
            }
        }
    }
}
