// Game-Specific Visual Enhancements

class GameEnhancements {
    constructor() {
        this.particlePool = [];
    }

    // Enhanced poker table visuals
    enhancePokerTable() {
        const pokerTables = document.querySelectorAll('.poker-table');
        pokerTables.forEach(table => {
            // Add felt texture animation
            table.style.background = `
                radial-gradient(ellipse at center, 
                    rgba(0, 100, 0, 0.9) 0%, 
                    rgba(0, 70, 0, 0.95) 50%, 
                    rgba(0, 50, 0, 1) 100%
                )
            `;
            table.style.boxShadow = `
                inset 0 0 50px rgba(0, 0, 0, 0.5),
                0 10px 50px rgba(0, 0, 0, 0.8)
            `;
        });
    }

    // Card dealing animation with 3D effect
    dealCardWithEffect(card, targetElement, delay = 0) {
        setTimeout(() => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card-3d';
            cardEl.innerHTML = card;
            cardEl.style.cssText = `
                position: absolute;
                top: -100px;
                left: 50%;
                transform: translateX(-50%) rotateY(180deg);
                transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                perspective: 1000px;
            `;
            
            document.body.appendChild(cardEl);
            
            const targetRect = targetElement.getBoundingClientRect();
            
            setTimeout(() => {
                cardEl.style.top = targetRect.top + 'px';
                cardEl.style.left = targetRect.left + 'px';
                cardEl.style.transform = 'translateX(0) rotateY(0deg)';
            }, 50);
            
            setTimeout(() => {
                targetElement.appendChild(cardEl);
                cardEl.style.position = 'relative';
                cardEl.style.top = '0';
                cardEl.style.left = '0';
            }, 650);
        }, delay);
    }

    // Chip toss animation to pot
    tossChipsToPot(amount, startElement) {
        const pot = document.querySelector('.pot-display') || document.querySelector('[id*="pot"]');
        if (!pot || !startElement) return;

        const startRect = startElement.getBoundingClientRect();
        const potRect = pot.getBoundingClientRect();

        const numChips = Math.min(Math.ceil(amount / 10), 20); // Max 20 chips

        for (let i = 0; i < numChips; i++) {
            setTimeout(() => {
                const chip = document.createElement('div');
                chip.className = 'poker-chip-flying';
                
                // Chip color based on value
                let chipColor = '#ffffff'; // white for smallest
                if (amount >= 100) chipColor = '#000000'; // black
                else if (amount >= 50) chipColor = '#2ecc71'; // green
                else if (amount >= 25) chipColor = '#3498db'; // blue
                else if (amount >= 10) chipColor = '#e74c3c'; // red
                
                chip.style.cssText = `
                    position: fixed;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: radial-gradient(circle at 30% 30%, ${chipColor}, ${this.darkenColor(chipColor, 30)});
                    border: 3px solid #ffd700;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
                    left: ${startRect.left + startRect.width / 2}px;
                    top: ${startRect.top + startRect.height / 2}px;
                    z-index: 1000;
                    pointer-events: none;
                    font-size: 0.7rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                `;
                
                chip.textContent = '💰';
                document.body.appendChild(chip);

                // Animate to pot with arc
                const duration = 800 + Math.random() * 400;
                const startX = startRect.left + startRect.width / 2;
                const startY = startRect.top + startRect.height / 2;
                const endX = potRect.left + potRect.width / 2;
                const endY = potRect.top + potRect.height / 2;
                const arcHeight = 100 + Math.random() * 50;

                let progress = 0;
                const animate = () => {
                    progress += 16 / duration;
                    if (progress >= 1) {
                        chip.remove();
                        if (i === numChips - 1) {
                            // Last chip - add glow effect to pot
                            advancedEffects.shockwave(endX, endY, '#ffd700');
                        }
                        return;
                    }

                    const currentX = startX + (endX - startX) * progress;
                    const arc = Math.sin(progress * Math.PI) * arcHeight;
                    const currentY = startY + (endY - startY) * progress - arc;

                    chip.style.left = currentX + 'px';
                    chip.style.top = currentY + 'px';
                    chip.style.transform = `rotate(${progress * 720}deg) scale(${1 - progress * 0.3})`;

                    requestAnimationFrame(animate);
                };

                requestAnimationFrame(animate);
            }, i * 100);
        }
    }

    // Win celebration for poker hands
    celebratePokerWin(handRank, amount) {
        const celebrations = {
            'Royal Flush': {
                particles: 200,
                colors: ['#ffd700', '#ff6b6b', '#00ffff', '#ff00ff'],
                text: '👑 ROYAL FLUSH! 👑',
                duration: 8000
            },
            'Straight Flush': {
                particles: 150,
                colors: ['#ffd700', '#2ecc71', '#3498db'],
                text: '✨ STRAIGHT FLUSH! ✨',
                duration: 6000
            },
            'Four of a Kind': {
                particles: 100,
                colors: ['#e74c3c', '#ffd700'],
                text: '💥 FOUR OF A KIND! 💥',
                duration: 5000
            },
            'Full House': {
                particles: 80,
                colors: ['#9b59b6', '#ffd700'],
                text: '🏠 FULL HOUSE! 🏠',
                duration: 4000
            },
            'Flush': {
                particles: 60,
                colors: ['#3498db', '#00ffff'],
                text: '💧 FLUSH! 💧',
                duration: 3000
            },
            'Straight': {
                particles: 50,
                colors: ['#2ecc71', '#ffd700'],
                text: '📊 STRAIGHT! 📊',
                duration: 3000
            }
        };

        const celebration = celebrations[handRank] || {
            particles: 40,
            colors: ['#ffd700'],
            text: `🎉 ${handRank}! 🎉`,
            duration: 2000
        };

        // Show hand rank with animated text
        const message = document.createElement('div');
        message.className = 'poker-celebration';
        message.textContent = celebration.text;
        message.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 3rem;
            font-weight: bold;
            color: #ffd700;
            text-shadow: 
                0 0 10px #ffd700,
                0 0 20px #ffd700,
                0 0 30px #ffd700,
                0 0 40px #ff6b6b,
                0 0 70px #ff6b6b,
                0 0 80px #ff6b6b;
            z-index: 10001;
            pointer-events: none;
            animation: celebrationPop 1s ease-out forwards;
        `;
        document.body.appendChild(message);

        setTimeout(() => {
            advancedEffects.explosion(window.innerWidth / 2, window.innerHeight / 3, celebration.particles, celebration.colors);
            effects.createConfetti(document.body, celebration.duration);
            effects.floatingText(window.innerWidth / 2, window.innerHeight / 2, `+${amount} eGold`, '#2ecc71', '3rem');
        }, 500);

        setTimeout(() => message.remove(), celebration.duration);
    }

    // Roulette wheel spin effect
    spinRouletteWheel(targetNumber, duration = 5000) {
        const wheel = document.getElementById('rouletteWheel') || document.querySelector('.wheel');
        if (!wheel) return;

        const rotations = 10 + Math.floor(Math.random() * 5);
        const finalAngle = (targetNumber * (360 / 37)) + (rotations * 360);

        wheel.style.transition = `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
        wheel.style.transform = `rotate(${finalAngle}deg)`;

        // Add ball animation
        const ball = document.createElement('div');
        ball.className = 'roulette-ball';
        ball.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, #ffffff, #cccccc);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        `;
        wheel.appendChild(ball);

        // Ball spiral animation
        let progress = 0;
        const animate = () => {
            if (progress >= 1) return;
            progress += 16 / duration;
            const radius = 100 - (progress * 80);
            const angle = progress * rotations * 360 * Math.PI / 180;
            ball.style.transform = `
                translate(-50%, -50%) 
                translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)
            `;
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        setTimeout(() => ball.remove(), duration);
    }

    // Dice shake animation before roll
    shakeDice(diceElement, duration = 1000) {
        let shakeCount = 0;
        const maxShakes = 15;
        const shakeInterval = duration / maxShakes;

        const shake = setInterval(() => {
            if (shakeCount >= maxShakes) {
                clearInterval(shake);
                diceElement.style.transform = 'rotate(0deg)';
                return;
            }
            const angle = (Math.random() - 0.5) * 30;
            const x = (Math.random() - 0.5) * 10;
            const y = (Math.random() - 0.5) * 10;
            diceElement.style.transform = `rotate(${angle}deg) translate(${x}px, ${y}px)`;
            shakeCount++;
        }, shakeInterval);
    }

    // Slot machine lever pull animation
    pullSlotLever() {
        const lever = document.getElementById('slotLever');
        if (!lever) return;

        lever.style.transition = 'transform 0.3s ease-in';
        lever.style.transform = 'rotate(45deg)';

        setTimeout(() => {
            lever.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            lever.style.transform = 'rotate(0deg)';
        }, 300);
    }

    // Card shuffle animation
    shuffleCards(deckElement) {
        const cards = deckElement.querySelectorAll('.card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'transform 0.3s ease-out';
                card.style.transform = `translateY(${-20 + Math.random() * 40}px) rotate(${Math.random() * 20 - 10}deg)`;
                setTimeout(() => {
                    card.style.transform = 'translateY(0) rotate(0deg)';
                }, 150);
            }, index * 50);
        });
    }

    // Helper function to darken colors
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }
}

// Add celebration animation
const gameEnhancementsStyle = document.createElement('style');
gameEnhancementsStyle.textContent = `
    @keyframes celebrationPop {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2) rotate(5deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
        }
    }

    .card-3d {
        transform-style: preserve-3d;
        backface-visibility: hidden;
    }

    .poker-chip-flying {
        animation: chipSpin 0.8s linear infinite;
    }

    @keyframes chipSpin {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(360deg); }
    }
`;
document.head.appendChild(gameEnhancementsStyle);

// Global instance
const gameEnhancements = new GameEnhancements();
