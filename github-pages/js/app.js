/**
 * GemClawOS - Neural Background & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialization
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
        observer.observe(el);
    });

    // Make elements visible immediately if they're at the top (hero section)
    setTimeout(() => {
        document.querySelectorAll('.slide-up, .fade-in').forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);

    // 3. Neural Particles Canvas (The Cyberpunk Vibe)
    initNeuralCanvas();
});

function initNeuralCanvas() {
    const canvas = document.getElementById('neuralCanvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Config
    const config = {
        particleCount: Math.min(window.innerWidth / 15, 100), // scale with screen width
        connectionRadius: 150,
        particleSpeed: 0.5,
        baseColor: 'rgba(0, 243, 255, ', // Cyan neon base
    };

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.particleSpeed;
            this.vy = (Math.random() - 0.5) * config.particleSpeed;
            this.radius = Math.random() * 1.5 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = config.baseColor + '0.8)';
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    let mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < config.connectionRadius) {
                    ctx.beginPath();
                    // opacity inversely proportional to distance
                    const opacity = 1 - (dist / config.connectionRadius);
                    ctx.strokeStyle = config.baseColor + (opacity * 0.3) + ')';
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Mouse interaction
            const dxMouse = particles[i].x - mouse.x;
            const dyMouse = particles[i].y - mouse.y;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

            if (distMouse < 200) {
                ctx.beginPath();
                const opacity = 1 - (distMouse / 200);
                // Glowing purple/cyan mix for mouse interaction
                ctx.strokeStyle = `rgba(188, 19, 254, ${opacity * 0.5})`;
                ctx.lineWidth = 1.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    resize();
    createParticles();
    animate();
}
