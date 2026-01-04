// Comprehensive Sound Effects System for Casino Games

class SoundManager {
    constructor() {
        this.enabled = true;
        this.volume = 0.3;
        this.sounds = {};
        this.initSounds();
    }

    // Initialize all sound effects using Web Audio API
    initSounds() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Generate card dealing sound
    playCardDeal() {
        if (!this.enabled) return;
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    }

    // Generate chip stack sound
    playChipSound() {
        if (!this.enabled) return;
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.08);
    }

    // Generate slot machine spin sound
    playSlotSpin() {
        if (!this.enabled) return;
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(100, ctx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(50, ctx.currentTime + 1);
        
        gainNode.gain.setValueAtTime(this.volume * 0.15, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 1);
    }

    // Generate roulette wheel spin sound
    playRouletteWheel() {
        if (!this.enabled) return;
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 2);
        
        gainNode.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 2);
    }

    // Generate dice roll sound
    playDiceRoll() {
        if (!this.enabled) return;
        const ctx = this.audioContext;
        
        for (let i = 0; i < 5; i++) {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.type = 'square';
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            const time = ctx.currentTime + (i * 0.1);
            oscillator.frequency.setValueAtTime(Math.random() * 200 + 100, time);
            gainNode.gain.setValueAtTime(this.volume * 0.1, time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.08);
            
            oscillator.start(time);
            oscillator.stop(time + 0.08);
        }
    }

    // Generate coin flip sound
    playCoinFlip() {
        if (!this.enabled) return;
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(1000, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
    }

    // Generate button click sound
    playButtonClick() {
        if (!this.enabled) return;
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        
        gainNode.gain.setValueAtTime(this.volume * 0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    }

    // Generate win sound
    playWin(large = false) {
        if (!this.enabled) return;
        const ctx = this.audioContext;
        const notes = large ? [523, 659, 784, 1047] : [440, 554, 659];
        
        notes.forEach((freq, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            const time = ctx.currentTime + (i * 0.15);
            oscillator.frequency.setValueAtTime(freq, time);
            
            gainNode.gain.setValueAtTime(this.volume * 0.3, time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
            
            oscillator.start(time);
            oscillator.stop(time + 0.4);
        });
    }

    // Generate loss sound
    playLoss() {
        if (!this.enabled) return;
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(this.volume * 0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
    }

    // Generate jackpot sound
    playJackpot() {
        if (!this.enabled) return;
        this.playWin(true);
        
        // Add extra flourish
        setTimeout(() => {
            const ctx = this.audioContext;
            for (let i = 0; i < 20; i++) {
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                const time = ctx.currentTime + (i * 0.05);
                oscillator.frequency.setValueAtTime(Math.random() * 1000 + 500, time);
                
                gainNode.gain.setValueAtTime(this.volume * 0.15, time);
                gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
                
                oscillator.start(time);
                oscillator.stop(time + 0.3);
            }
        }, 400);
    }

    // Generate shuffle sound
    playShuffle() {
        if (!this.enabled) return;
        const ctx = this.audioContext;
        
        for (let i = 0; i < 8; i++) {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.type = 'square';
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            const time = ctx.currentTime + (i * 0.05);
            oscillator.frequency.setValueAtTime(Math.random() * 300 + 200, time);
            
            gainNode.gain.setValueAtTime(this.volume * 0.1, time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.04);
            
            oscillator.start(time);
            oscillator.stop(time + 0.04);
        }
    }

    // Toggle sound on/off
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Set volume (0 to 1)
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}

// Global sound manager instance
const soundManager = new SoundManager();
