// Sound Effects Manager (Visual feedback for now, can be expanded with Web Audio API)
class SoundEffects {
    constructor() {
        this.enabled = true;
        this.volume = 0.5;
    }

    // Play sound effect (visual feedback for now)
    play(type, intensity = 1) {
        if (!this.enabled) return;

        const soundFeedback = document.createElement('div');
        soundFeedback.className = 'sound-feedback';
        
        let icon = '';
        let color = '';
        
        switch(type) {
            case 'win':
                icon = intensity > 0.8 ? '\ud83c\udf89' : '\u2728';
                color = '#2ecc71';
                break;
            case 'lose':
                icon = '\ud83d\ude2b';
                color = '#e74c3c';
                break;
            case 'bet':
                icon = '\ud83d\udcb0';
                color = '#3498db';
                break;
            case 'deal':
                icon = '\ud83c\udccf';
                color = '#9b59b6';
                break;
            case 'jackpot':
                icon = '\ud83d\udcb8';
                color = '#ffd700';
                break;
            case 'click':
                icon = '\ud83d\udc46';
                color = '#95a5a6';
                break;
            case 'achievement':
                icon = '\ud83c\udfc6';
                color = '#d4af37';
                break;
            default:
                icon = '\ud83d\udd14';
                color = '#34495e';
        }
        
        soundFeedback.textContent = icon;
        soundFeedback.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: ${3 + intensity * 2}rem;
            color: ${color};
            z-index: 10000;
            pointer-events: none;
            animation: soundPop 0.6s ease-out;
            text-shadow: 0 0 20px ${color};
        `;
        
        document.body.appendChild(soundFeedback);
        
        setTimeout(() => soundFeedback.remove(), 600);
    }

    // Card shuffle sound (visual)
    shuffle() {
        this.play('deal', 0.5);
    }

    // Chip sound (visual)
    chips(amount) {
        const intensity = Math.min(amount / 1000, 1);
        this.play('bet', intensity);
    }

    // Win sound (visual)
    winSound(amount) {
        const intensity = Math.min(amount / 500, 1);
        this.play('win', intensity);
    }

    // Jackpot sound (visual)
    jackpotSound() {
        this.play('jackpot', 1);
        
        // Create multiple burst effects
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.play('jackpot', 0.8), i * 200);
        }
    }

    // Toggle sound on/off
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Set volume
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}

// Add CSS for sound feedback animation
const soundStyle = document.createElement('style');
soundStyle.textContent = `
    @keyframes soundPop {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0) rotate(360deg);
            opacity: 0;
        }
    }
    
    .sound-feedback {
        filter: drop-shadow(0 0 10px currentColor);
    }
`;
document.head.appendChild(soundStyle);

// Create global sound effects instance
const sound = new SoundEffects();
