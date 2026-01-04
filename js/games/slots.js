// Slots Game
const slotsGame = {
    symbols: ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '⭐'],
    payouts: {
        '🍒': 1.5,
        '🍋': 2,
        '🍊': 3,
        '🍇': 4,
        '💎': 8,
        '7️⃣': 15,
        '⭐': 30
    },
    // Weighted symbol distribution (house edge)
    symbolWeights: [30, 25, 20, 15, 7, 2, 1],
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                ${VisualEnhancer.createSlotMachine(['🍒', '🍒', '🍒'])}
                <div id="slotDisplay" style="margin: 20px 0;"></div>
                <div class="game-controls">
                    <label style="font-size: 1.3em; color: #FFB800;">💰 Bet:</label>
                    <input type="number" id="slotsBet" value="5" min="1" max="50" class="game-input" style="width: 120px;">
                    <span style="color: #FFB800; font-size: 1.2em;">eGold</span>
                </div>
                <button onclick="slotsGame.spin()" class="game-button" style="font-size: 1.4em; padding: 18px 50px;">
                    🎲 SPIN NOW 🎲
                </button>
                <div id="slotsResult" class="game-result"></div>
                <div class="game-info-box">
                    <h3>👑 Royal Triple Spin</h3>
                    <p style="font-size: 1.1em; color: #cccccc; margin: 10px 0;">A fast-paced 3-reel slot machine with crisp animations and themed symbols</p>
                    <h4 style="color: #FFB800; margin-top: 20px;">💎 Payout Table</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; max-width: 400px; margin: 15px auto; font-size: 1.1em;">
                        <div style="grid-column: 1 / -1; padding: 12px; background: linear-gradient(135deg, rgba(255, 184, 0, 0.2), rgba(212, 175, 55, 0.2)); border-radius: 8px; border: 2px solid #FFB800;">⭐ Star: <b style="font-size: 1.3em; color: #FFB800;">30x JACKPOT!</b></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.15); border-radius: 8px;">7️⃣ Seven: <b>15x</b></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.15); border-radius: 8px;">💎 Diamond: <b>8x</b></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 8px;">🍇 Grape: <b>4x</b></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 8px;">🍊 Orange: <b>3x</b></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 8px;">🍋 Lemon: <b>2x</b></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 8px;">🍒 Cherry: <b>1.5x</b></div>
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 2px solid #2ecc71;">
                        <h4 style="color: #2ecc71; margin-bottom: 10px;">📜 Game Rules</h4>
                        <ul style="text-align: left; max-width: 400px; margin: 0 auto; color: #cccccc; line-height: 1.8;">
                            <li>Choose your bet: <b>1-50 eGold</b></li>
                            <li>Spin the 3 reels</li>
                            <li>Match 3 symbols for BIG payouts</li>
                            <li>Higher value symbols = Higher rewards</li>
                            <li>⭐ Triple Stars = Mega Jackpot!</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },
    
    getWeightedSymbol() {
        const totalWeight = this.symbolWeights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < this.symbols.length; i++) {
            random -= this.symbolWeights[i];
            if (random <= 0) {
                return this.symbols[i];
            }
        }
        return this.symbols[0];
    },
    
    spin() {
        const betInput = document.getElementById('slotsBet');
        const bet = parseFloat(betInput.value);
        
        if (bet < 1) {
            document.getElementById('slotsResult').innerHTML = '<span style="color: #e74c3c;">Minimum bet is 1 eGold!</span>';
            soundManager.playButtonClick();
            return;
        }
        
        if (bet > 50) {
            document.getElementById('slotsResult').innerHTML = '<span style="color: #e74c3c;">Maximum bet is 50 eGold!</span>';
            soundManager.playButtonClick();
            return;
        }
        
        if (bet > balance) {
            document.getElementById('slotsResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            soundManager.playButtonClick();
            return;
        }
        
        // Play spin sound
        soundManager.playSlotSpin();
        
        // Deduct bet
        updateBalance(-bet);
        
        // Spin animation
        document.getElementById('slotDisplay').innerHTML = '<div style="color: #FFB800; font-size: 1.5em; animation: pulse 0.5s infinite;">🎰 SPINNING... 🎰</div>';
        
        // Add spinning animation to reels
        const reels = document.querySelectorAll('.reel');
        reels.forEach(reel => reel.classList.add('reel-spinning'));
        
        setTimeout(() => {
            // Stop spinning
            reels.forEach(reel => reel.classList.remove('reel-spinning'));
            
            // Final weighted result
            const result1 = this.getWeightedSymbol();
            const result2 = this.getWeightedSymbol();
            const result3 = this.getWeightedSymbol();
            
            document.getElementById('slotDisplay').innerHTML = VisualEnhancer.createSlotMachine([result1, result2, result3]);
                
                // Check win
                if (result1 === result2 && result2 === result3) {
                    const payout = bet * this.payouts[result1];
                    updateBalance(payout);
                    const resultDiv = document.getElementById('slotsResult');
                    resultDiv.className = 'game-result win-effect';
                    
                    // Big win effects
                    if (this.payouts[result1] >= 15) {
                        soundManager.playJackpot();
                        particleSystem.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 150);
                        resultDiv.classList.add('jackpot-effect');
                        resultDiv.innerHTML = `<span style="font-size: 2em;">💫 MEGA JACKPOT! 💫</span><br><span style="font-size: 1.8em;">+${payout.toFixed(2)} eGold <small style="color: #2ecc71;">($${(payout * 0.10).toFixed(2)})</small></span>`;
                    } else {
                        soundManager.playWin(true);
                        particleSystem.createCoinBurst(window.innerWidth / 2, window.innerHeight / 2, payout);
                        resultDiv.innerHTML = `<span style="font-size: 1.8em;">🎉 WINNER! 🎉</span><br><span style="font-size: 1.5em;">+${payout.toFixed(2)} eGold <small style="color: #2ecc71;">($${(payout * 0.10).toFixed(2)})</small></span>`;
                    }
                    
                    document.querySelectorAll('.reel').forEach(r => r.classList.add('animate-glow'));
                } else {
                    soundManager.playLoss();
                    const resultDiv = document.getElementById('slotsResult');
                    resultDiv.className = 'game-result loss-effect';
                    resultDiv.innerHTML = '<span style="font-size: 1.3em;">💔 Try again!</span>';
                }
            }, 1500);
        }, 1500);
    }
};

window.slotsGame = slotsGame;
