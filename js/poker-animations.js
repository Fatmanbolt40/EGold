// Poker Table Chip Stack Animations
class ChipAnimation {
    constructor() {
        this.chipColors = {
            1: '#ffffff',      // White - 1
            5: '#ff0000',      // Red - 5
            25: '#00ff00',     // Green - 25
            100: '#000000',    // Black - 100
            500: '#9b59b6',    // Purple - 500
            1000: '#ffd700'    // Gold - 1000
        };
    }

    // Create chip stack element
    createChipStack(amount, x, y) {
        const chipValues = [1000, 500, 100, 25, 5, 1];
        let remaining = amount;
        const stacks = [];

        // Calculate chips needed
        for (let value of chipValues) {
            const count = Math.floor(remaining / value);
            if (count > 0) {
                stacks.push({ value, count: Math.min(count, 10) }); // Max 10 chips per stack
                remaining -= count * value;
            }
        }

        const stackContainer = document.createElement('div');
        stackContainer.className = 'chip-stack-container';
        stackContainer.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            display: flex;
            gap: 5px;
            pointer-events: none;
            z-index: 100;
        `;

        stacks.forEach(stack => {
            const stackDiv = document.createElement('div');
            stackDiv.className = 'chip-stack';
            stackDiv.style.cssText = `
                position: relative;
                width: 30px;
                height: ${stack.count * 3}px;
            `;

            for (let i = 0; i < stack.count; i++) {
                const chip = document.createElement('div');
                chip.className = 'poker-chip';
                chip.style.cssText = `
                    position: absolute;
                    bottom: ${i * 3}px;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: ${this.chipColors[stack.value]};
                    border: 2px solid #d4af37;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                    font-weight: bold;
                    color: ${stack.value === 100 || stack.value === 1000 ? '#ffffff' : '#000000'};
                `;
                chip.textContent = stack.value >= 100 ? stack.value : '';
                stackDiv.appendChild(chip);
            }

            stackContainer.appendChild(stackDiv);
        });

        return stackContainer;
    }

    // Animate chips moving to pot
    animateChipsToPot(fromX, fromY, toX, toY, amount) {
        const chips = this.createChipStack(amount, fromX, fromY);
        document.body.appendChild(chips);

        // Animate movement
        chips.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        setTimeout(() => {
            chips.style.left = toX + 'px';
            chips.style.top = toY + 'px';
            chips.style.opacity = '0';
            chips.style.transform = 'scale(0.5)';
        }, 50);

        setTimeout(() => {
            chips.remove();
            sound.chips(amount);
        }, 850);
    }

    // Animate chips from pot to winner
    animateWinnings(fromX, fromY, toX, toY, amount) {
        const chips = this.createChipStack(amount, fromX, fromY);
        document.body.appendChild(chips);

        chips.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
            chips.style.left = toX + 'px';
            chips.style.top = toY + 'px';
            chips.style.transform = 'scale(1.2)';
        }, 50);

        setTimeout(() => {
            chips.style.opacity = '0';
            chips.style.transform = 'scale(0)';
        }, 900);

        setTimeout(() => {
            chips.remove();
            sound.winSound(amount);
            effects.createBurst(toX, toY, '#ffd700', 20);
        }, 1100);
    }

    // Shuffle animation for dealing cards
    shuffleAnimation(containerElement) {
        const deck = document.createElement('div');
        deck.className = 'deck-shuffle';
        deck.style.cssText = `
            width: 80px;
            height: 100px;
            position: relative;
            margin: 20px auto;
        `;

        for (let i = 0; i < 5; i++) {
            const card = document.createElement('div');
            card.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #1a1a2e, #2d2d44);
                border: 2px solid #d4af37;
                border-radius: 8px;
                top: ${i * 2}px;
                left: ${i * 2}px;
                animation: cardShuffle 1s ease-in-out infinite;
                animation-delay: ${i * 0.1}s;
            `;
            deck.appendChild(card);
        }

        containerElement.appendChild(deck);
        
        setTimeout(() => {
            deck.remove();
        }, 2000);
    }
}

// Card dealing animation
class CardDealer {
    constructor() {
        this.dealSpeed = 300; // ms per card
    }

    dealCard(toX, toY, cardElement, callback) {
        // Start from center/dealer position
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;

        cardElement.style.cssText = `
            position: fixed;
            left: ${startX}px;
            top: ${startY}px;
            transform: translate(-50%, -50%);
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            z-index: 200;
        `;

        document.body.appendChild(cardElement);

        setTimeout(() => {
            cardElement.style.left = toX + 'px';
            cardElement.style.top = toY + 'px';
            sound.play('deal', 0.3);
        }, 50);

        setTimeout(() => {
            if (callback) callback();
        }, 550);
    }

    dealMultipleCards(positions, cards, callback) {
        let dealtCount = 0;
        
        positions.forEach((pos, index) => {
            setTimeout(() => {
                this.dealCard(pos.x, pos.y, cards[index], () => {
                    dealtCount++;
                    if (dealtCount === positions.length && callback) {
                        callback();
                    }
                });
            }, index * this.dealSpeed);
        });
    }
}

// Pot animation manager
class PotAnimator {
    constructor() {
        this.currentPotValue = 0;
    }

    updatePotDisplay(potElement, newValue) {
        const increment = (newValue - this.currentPotValue) / 20;
        let current = this.currentPotValue;
        let count = 0;

        const interval = setInterval(() => {
            current += increment;
            count++;
            
            potElement.textContent = Math.round(current);
            
            if (count >= 20) {
                clearInterval(interval);
                potElement.textContent = newValue;
                this.currentPotValue = newValue;
            }
        }, 25);

        // Pulse effect
        effects.glowPulse(potElement, '#ffd700', 500);
    }

    showWinnerEffect(potElement, amount) {
        // Exploding coins effect
        const rect = potElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const angle = (Math.PI * 2 * i) / 20;
                const distance = 100;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                
                const coin = document.createElement('div');
                coin.textContent = '🪙';
                coin.style.cssText = `
                    position: fixed;
                    left: ${centerX}px;
                    top: ${centerY}px;
                    font-size: 2rem;
                    pointer-events: none;
                    z-index: 1000;
                    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                `;
                
                document.body.appendChild(coin);
                
                setTimeout(() => {
                    coin.style.left = x + 'px';
                    coin.style.top = y + 'px';
                    coin.style.opacity = '0';
                    coin.style.transform = 'scale(2) rotate(720deg)';
                }, 50);
                
                setTimeout(() => coin.remove(), 900);
            }, i * 30);
        }

        sound.winSound(amount);
        effects.createConfetti(centerX, centerY, 50);
    }
}

// Add CSS animations for chips and cards
const pokerAnimationStyle = document.createElement('style');
pokerAnimationStyle.textContent = `
    @keyframes cardShuffle {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        25% {
            transform: translateY(-10px) rotate(5deg);
        }
        75% {
            transform: translateY(-10px) rotate(-5deg);
        }
    }
    
    @keyframes chipGlint {
        0%, 100% {
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
        }
        50% {
            box-shadow: 0 2px 15px rgba(212, 175, 55, 0.8), 
                        inset 0 0 10px rgba(255, 255, 255, 0.3);
        }
    }
    
    .poker-chip {
        animation: chipGlint 2s ease-in-out infinite;
    }
    
    .chip-stack-container {
        filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.5));
    }
    
    @keyframes cardFlip {
        0% {
            transform: rotateY(0deg);
        }
        50% {
            transform: rotateY(90deg);
        }
        100% {
            transform: rotateY(0deg);
        }
    }
    
    .card-flip {
        animation: cardFlip 0.6s ease-in-out;
    }
`;
document.head.appendChild(pokerAnimationStyle);

// Global instances
const chipAnimator = new ChipAnimation();
const cardDealer = new CardDealer();
const potAnimator = new PotAnimator();
