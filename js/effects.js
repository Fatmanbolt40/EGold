// Visual and Audio Effects System

class EffectsManager {
    constructor() {
        this.particles = [];
    }

    // Create confetti effect for big wins
    createConfetti(container, duration = 3000) {
        try {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.debug('EFFECTS_CONFETTI', { duration });
            }
            const colors = ['#d4af37', '#ffd700', '#ffed4e', '#ff6b6b', '#4ecdc4', '#45b7d1'];
            const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.left = Math.random() * window.innerWidth + 'px';
                particle.style.top = '-20px';
                particle.style.width = (Math.random() * 10 + 5) + 'px';
                particle.style.height = (Math.random() * 10 + 5) + 'px';
                particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '10000';
                particle.style.opacity = '1';
                
                document.body.appendChild(particle);
                
                const animation = particle.animate([
                    { 
                        transform: `translate(0, 0) rotate(0deg)`,
                        opacity: 1
                    },
                    { 
                        transform: `translate(${(Math.random() - 0.5) * 400}px, ${window.innerHeight}px) rotate(${Math.random() * 720}deg)`,
                        opacity: 0
                    }
                ], {
                    duration: duration,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });
                
                animation.onfinish = () => particle.remove();
            }, i * 10);
        }
        } catch (error) {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.error('EFFECTS_CONFETTI_ERROR', { error: error.message, stack: error.stack });
            }
            console.error('Confetti error:', error);
        }
    }

    // Create particle burst effect
    createBurst(x, y, color = '#d4af37', count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.backgroundColor = color;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 100 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            const animation = particle.animate([
                { 
                    transform: `translate(0, 0) scale(1)`,
                    opacity: 1
                },
                { 
                    transform: `translate(${tx}px, ${ty}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            animation.onfinish = () => particle.remove();
        }
    }

    // Flash effect for important events
    flash(element, color = '#d4af37', duration = 300) {
        const originalBg = element.style.background;
        element.style.transition = `background ${duration}ms`;
        element.style.background = color;
        
        setTimeout(() => {
            element.style.background = originalBg;
        }, duration);
    }

    // Shake animation for losses or errors
    shake(element, intensity = 5) {
        const animation = element.animate([
            { transform: 'translateX(0)' },
            { transform: `translateX(-${intensity}px)` },
            { transform: `translateX(${intensity}px)` },
            { transform: `translateX(-${intensity}px)` },
            { transform: `translateX(${intensity}px)` },
            { transform: 'translateX(0)' }
        ], {
            duration: 400,
            easing: 'ease-in-out'
        });
    }

    // Floating text animation
    floatingText(x, y, text, color = '#2ecc71', fontSize = '2rem') {
        const textEl = document.createElement('div');
        textEl.textContent = text;
        textEl.style.position = 'fixed';
        textEl.style.left = x + 'px';
        textEl.style.top = y + 'px';
        textEl.style.fontSize = fontSize;
        textEl.style.fontWeight = 'bold';
        textEl.style.color = color;
        textEl.style.pointerEvents = 'none';
        textEl.style.zIndex = '10000';
        textEl.style.textShadow = '0 0 10px rgba(0,0,0,0.8)';
        
        document.body.appendChild(textEl);
        
        const animation = textEl.animate([
            { 
                transform: 'translateY(0) scale(0.5)',
                opacity: 0
            },
            { 
                transform: 'translateY(-20px) scale(1.2)',
                opacity: 1,
                offset: 0.3
            },
            { 
                transform: 'translateY(-100px) scale(1)',
                opacity: 0
            }
        ], {
            duration: 2000,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => textEl.remove();
    }

    // Glow pulse effect
    glowPulse(element, color = '#d4af37', duration = 1000) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = `glowPulse ${duration}ms ease-in-out`;
        }, 10);
    }

    // Create coin rain effect
    coinRain(duration = 2000) {
        const interval = setInterval(() => {
            const coin = document.createElement('div');
            coin.textContent = '🪙';
            coin.style.position = 'fixed';
            coin.style.left = Math.random() * window.innerWidth + 'px';
            coin.style.top = '-50px';
            coin.style.fontSize = (Math.random() * 20 + 20) + 'px';
            coin.style.pointerEvents = 'none';
            coin.style.zIndex = '9999';
            
            document.body.appendChild(coin);
            
            const animation = coin.animate([
                { 
                    transform: 'translateY(0) rotate(0deg)',
                    opacity: 1
                },
                { 
                    transform: `translateY(${window.innerHeight}px) rotate(${360 + Math.random() * 360}deg)`,
                    opacity: 0.5
                }
            ], {
                duration: 2000 + Math.random() * 1000,
                easing: 'linear'
            });
            
            animation.onfinish = () => coin.remove();
        }, 100);
        
        setTimeout(() => clearInterval(interval), duration);
    }

    // Card flip animation
    flipCard(cardElement) {
        cardElement.animate([
            { transform: 'rotateY(0deg)' },
            { transform: 'rotateY(90deg)' },
            { transform: 'rotateY(0deg)' }
        ], {
            duration: 600,
            easing: 'ease-in-out'
        });
    }

    // Slot machine style number roll
    rollNumber(element, finalNumber, duration = 1000) {
        const startTime = Date.now();
        const startNumber = parseInt(element.textContent) || 0;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (progress < 1) {
                element.textContent = Math.floor(Math.random() * 100);
                requestAnimationFrame(animate);
            } else {
                element.textContent = finalNumber;
            }
        };
        
        animate();
    }
}

// Create global effects manager
const effects = new EffectsManager();

// Add CSS for glow pulse animation
const style = document.createElement('style');
style.textContent = `
@keyframes glowPulse {
    0%, 100% { 
        box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        filter: brightness(1);
    }
    50% { 
        box-shadow: 0 0 30px rgba(212, 175, 55, 1), 0 0 60px rgba(212, 175, 55, 0.5);
        filter: brightness(1.3);
    }
}
`;
document.head.appendChild(style);
