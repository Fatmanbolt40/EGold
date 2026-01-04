// Particle Effects System for Casino Games

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
    }

    // Initialize canvas for particle effects
    init(container) {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '9999';
            document.body.appendChild(this.canvas);
            
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Create confetti explosion for wins
    createConfetti(x, y, count = 100) {
        this.init();
        const colors = ['#FFB800', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9', '#00B894'];
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 5,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                life: 1,
                decay: Math.random() * 0.015 + 0.01,
                shape: Math.random() > 0.5 ? 'rect' : 'circle',
                gravity: 0.3
            });
        }
        
        this.animate();
    }

    // Create coin burst effect
    createCoinBurst(x, y, amount) {
        this.init();
        const count = Math.min(Math.floor(amount / 10) + 10, 50);
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Math.random() * 5 + 3;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 15,
                color: '#FFB800',
                size: Math.random() * 15 + 10,
                life: 1,
                decay: 0.012,
                shape: 'coin',
                gravity: 0.25
            });
        }
        
        this.animate();
    }

    // Create sparkle effect
    createSparkles(x, y, count = 30) {
        this.init();
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                rotation: 0,
                rotationSpeed: 0,
                color: Math.random() > 0.5 ? '#FFB800' : '#FFF',
                size: Math.random() * 4 + 2,
                life: 1,
                decay: 0.02,
                shape: 'star',
                gravity: 0
            });
        }
        
        this.animate();
    }

    // Create card trail effect
    createCardTrail(x, y) {
        this.init();
        
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: Math.random() * 2 + 1,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 5,
                color: 'rgba(255, 255, 255, 0.6)',
                size: 30,
                life: 1,
                decay: 0.03,
                shape: 'card',
                gravity: 0.1
            });
        }
        
        this.animate();
    }

    // Create chip stack effect
    createChipStack(x, y, count = 10) {
        this.init();
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFB800', '#FFFFFF'];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.random() - 0.5) * Math.PI;
            const speed = Math.random() * 4 + 2;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 25,
                life: 1,
                decay: 0.015,
                shape: 'chip',
                gravity: 0.35
            });
        }
        
        this.animate();
    }

    // Create number pop effect
    createNumberPop(x, y, number, color = '#FFB800') {
        this.init();
        
        this.particles.push({
            x: x,
            y: y,
            vx: 0,
            vy: -3,
            rotation: 0,
            rotationSpeed: 0,
            color: color,
            size: 40,
            life: 1,
            decay: 0.02,
            shape: 'text',
            text: number.toString(),
            gravity: 0
        });
        
        this.animate();
    }

    // Animation loop
    animate() {
        if (this.animationId) return;
        
        const loop = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                
                // Update particle
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.rotation += p.rotationSpeed;
                p.life -= p.decay;
                
                // Remove dead particles
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }
                
                // Draw particle
                this.ctx.save();
                this.ctx.globalAlpha = p.life;
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation * Math.PI / 180);
                
                switch (p.shape) {
                    case 'circle':
                        this.ctx.fillStyle = p.color;
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                        this.ctx.fill();
                        break;
                        
                    case 'rect':
                        this.ctx.fillStyle = p.color;
                        this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                        break;
                        
                    case 'star':
                        this.drawStar(0, 0, 5, p.size, p.size/2, p.color);
                        break;
                        
                    case 'coin':
                        this.ctx.fillStyle = p.color;
                        this.ctx.strokeStyle = '#8B6914';
                        this.ctx.lineWidth = 2;
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
                        this.ctx.fill();
                        this.ctx.stroke();
                        this.ctx.fillStyle = '#8B6914';
                        this.ctx.font = `${p.size/2}px bold`;
                        this.ctx.textAlign = 'center';
                        this.ctx.textBaseline = 'middle';
                        this.ctx.fillText('$', 0, 0);
                        break;
                        
                    case 'card':
                        this.ctx.fillStyle = p.color;
                        this.ctx.strokeStyle = '#333';
                        this.ctx.lineWidth = 2;
                        this.ctx.fillRect(-p.size/2, -p.size*0.7, p.size, p.size*1.4);
                        this.ctx.strokeRect(-p.size/2, -p.size*0.7, p.size, p.size*1.4);
                        break;
                        
                    case 'chip':
                        // Outer circle
                        this.ctx.fillStyle = p.color;
                        this.ctx.strokeStyle = '#FFF';
                        this.ctx.lineWidth = 3;
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
                        this.ctx.fill();
                        this.ctx.stroke();
                        // Inner circle
                        this.ctx.beginPath();
                        this.ctx.arc(0, 0, p.size/4, 0, Math.PI * 2);
                        this.ctx.strokeStyle = '#FFF';
                        this.ctx.stroke();
                        break;
                        
                    case 'text':
                        this.ctx.fillStyle = p.color;
                        this.ctx.font = `bold ${p.size}px Arial`;
                        this.ctx.textAlign = 'center';
                        this.ctx.textBaseline = 'middle';
                        this.ctx.strokeStyle = '#000';
                        this.ctx.lineWidth = 3;
                        this.ctx.strokeText(p.text, 0, 0);
                        this.ctx.fillText(p.text, 0, 0);
                        break;
                }
                
                this.ctx.restore();
            }
            
            if (this.particles.length > 0) {
                this.animationId = requestAnimationFrame(loop);
            } else {
                this.animationId = null;
            }
        };
        
        loop();
    }

    // Draw star helper
    drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    // Clear all particles
    clear() {
        this.particles = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

// Global particle system instance
const particleSystem = new ParticleSystem();
