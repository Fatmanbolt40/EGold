// Advanced Visual Effects and Animations
class AdvancedEffects {
    constructor() {
        this.activeEffects = [];
    }

    // 3D Card flip animation
    flipCard3D(element, frontContent, backContent, duration = 600) {
        element.style.transformStyle = 'preserve-3d';
        element.style.transition = `transform ${duration}ms`;
        
        // Flip to back
        element.style.transform = 'rotateY(90deg)';
        
        setTimeout(() => {
            element.innerHTML = backContent;
            element.style.transform = 'rotateY(0deg)';
        }, duration / 2);
    }

    // Holographic glow effect
    holographicGlow(element, duration = 2000) {
        const originalBoxShadow = element.style.boxShadow;
        let hue = 0;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed < duration) {
                hue = (hue + 2) % 360;
                element.style.boxShadow = `
                    0 0 20px hsl(${hue}, 100%, 50%),
                    0 0 40px hsl(${hue}, 100%, 50%),
                    inset 0 0 20px hsl(${hue}, 100%, 50%)
                `;
                element.style.borderColor = `hsl(${hue}, 100%, 50%)`;
                requestAnimationFrame(animate);
            } else {
                element.style.boxShadow = originalBoxShadow;
            }
        };
        
        animate();
    }

    // Coin spin animation
    spinCoin(element, result, duration = 2000) {
        const spins = 10;
        element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
        element.style.transform = `rotateY(${spins * 360}deg)`;
        
        setTimeout(() => {
            element.textContent = result === 'heads' ? '👑' : '🦅';
            element.style.background = result === 'heads' 
                ? 'linear-gradient(135deg, #ffd700, #ffed4e)' 
                : 'linear-gradient(135deg, #c0c0c0, #e8e8e8)';
        }, duration);
    }

    // Dice roll 3D animation
    rollDice3D(element, result, duration = 2000) {
        const spins = 5;
        element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
        element.style.transform = `
            rotateX(${spins * 360 + Math.random() * 360}deg) 
            rotateY(${spins * 360 + Math.random() * 360}deg) 
            rotateZ(${spins * 360 + Math.random() * 360}deg)
        `;
        
        setTimeout(() => {
            element.style.transition = 'transform 500ms ease-out';
            element.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';
            element.textContent = result;
        }, duration);
    }

    // Energy beam effect
    energyBeam(startX, startY, endX, endY, color = '#00ffff', width = 5) {
        const beam = document.createElement('div');
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
        
        beam.style.cssText = `
            position: fixed;
            left: ${startX}px;
            top: ${startY}px;
            width: ${length}px;
            height: ${width}px;
            background: linear-gradient(90deg, 
                transparent, 
                ${color} 50%, 
                transparent
            );
            transform-origin: 0 0;
            transform: rotate(${angle}deg);
            pointer-events: none;
            z-index: 10001;
            box-shadow: 0 0 20px ${color}, 0 0 40px ${color};
            animation: beamPulse 0.5s ease-in-out;
        `;
        
        document.body.appendChild(beam);
        setTimeout(() => beam.remove(), 500);
    }

    // Particle explosion
    explosion(x, y, intensity = 50, colors = ['#ff6b6b', '#ffd700', '#ff8c00']) {
        for (let i = 0; i < intensity; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / intensity;
            const velocity = 5 + Math.random() * 5;
            const size = 5 + Math.random() * 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.textContent = ['🔥', '💥', '⭐', '✨'][Math.floor(Math.random() * 4)];
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                font-size: ${size}px;
                pointer-events: none;
                z-index: 10002;
                filter: drop-shadow(0 0 5px ${color});
            `;
            
            document.body.appendChild(particle);
            
            let posX = x;
            let posY = y;
            let velX = Math.cos(angle) * velocity;
            let velY = Math.sin(angle) * velocity;
            let opacity = 1;
            let scale = 1;
            
            const animate = () => {
                velY += 0.3; // gravity
                posX += velX;
                posY += velY;
                opacity -= 0.02;
                scale += 0.02;
                
                particle.style.left = posX + 'px';
                particle.style.top = posY + 'px';
                particle.style.opacity = opacity;
                particle.style.transform = `scale(${scale})`;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            requestAnimationFrame(animate);
        }
    }

    // Matrix rain effect
    matrixRain(element, duration = 3000, color = '#00ff00') {
        const chars = '01アイウエオカキクケコサシスセソタチツテト';
        const columns = Math.floor(element.offsetWidth / 20);
        const drops = [];
        
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = element.offsetWidth;
        canvas.height = element.offsetHeight;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        
        element.style.position = 'relative';
        element.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const startTime = Date.now();
        
        const draw = () => {
            if (Date.now() - startTime > duration) {
                canvas.remove();
                return;
            }
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = color;
            ctx.font = '15px monospace';
            
            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * 20, drops[i] * 20);
                
                if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            
            requestAnimationFrame(draw);
        };
        
        draw();
    }

    // Shockwave effect
    shockwave(x, y, color = '#3498db') {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const wave = document.createElement('div');
                wave.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    border: 4px solid ${color};
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    z-index: 10000;
                    animation: shockwaveExpand 1.5s ease-out;
                `;
                
                document.body.appendChild(wave);
                setTimeout(() => wave.remove(), 1500);
            }, i * 200);
        }
    }

    // Laser scan effect
    laserScan(element, color = '#00ff00') {
        const scanner = document.createElement('div');
        scanner.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, transparent, ${color}, transparent);
            box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
            animation: laserScan 2s ease-in-out;
        `;
        
        element.style.position = 'relative';
        element.appendChild(scanner);
        
        setTimeout(() => scanner.remove(), 2000);
    }

    // Typing effect
    typeText(element, text, speed = 50) {
        element.textContent = '';
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }

    // Glitch effect
    glitch(element, duration = 1000) {
        const original = element.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        const startTime = Date.now();
        
        const glitchFrame = () => {
            if (Date.now() - startTime > duration) {
                element.textContent = original;
                return;
            }
            
            let glitched = '';
            for (let i = 0; i < original.length; i++) {
                if (Math.random() < 0.3) {
                    glitched += chars[Math.floor(Math.random() * chars.length)];
                } else {
                    glitched += original[i];
                }
            }
            
            element.textContent = glitched;
            setTimeout(glitchFrame, 50);
        };
        
        glitchFrame();
    }
}

// Add CSS animations
const advancedEffectsStyle = document.createElement('style');
advancedEffectsStyle.textContent = `
    @keyframes beamPulse {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
    
    @keyframes shockwaveExpand {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 500px;
            height: 500px;
            opacity: 0;
        }
    }
    
    @keyframes laserScan {
        0% { top: 0; }
        100% { top: 100%; }
    }
    
    @keyframes rippleExpand {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
    
    @keyframes neonGlow {
        0%, 100% {
            text-shadow: 
                0 0 10px currentColor,
                0 0 20px currentColor,
                0 0 30px currentColor;
        }
        50% {
            text-shadow: 
                0 0 20px currentColor,
                0 0 40px currentColor,
                0 0 60px currentColor;
        }
    }
    
    .neon-text {
        animation: neonGlow 2s ease-in-out infinite;
    }
`;
document.head.appendChild(advancedEffectsStyle);

// Global instance
const advancedEffects = new AdvancedEffects();
