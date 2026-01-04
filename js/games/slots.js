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
                <div style="display: flex; justify-content: center; gap: 20px; margin: 30px 0;">
                    <div id="reel1" style="font-size: 5em; background: #2A3544; padding: 20px; border-radius: 10px; border: 3px solid #FFB800;">🍒</div>
                    <div id="reel2" style="font-size: 5em; background: #2A3544; padding: 20px; border-radius: 10px; border: 3px solid #FFB800;">🍒</div>
                    <div id="reel3" style="font-size: 5em; background: #2A3544; padding: 20px; border-radius: 10px; border: 3px solid #FFB800;">🍒</div>
                </div>
                <div style="margin: 20px 0;">
                    <label style="font-size: 1.2em;">Bet Amount: </label>
                    <input type="number" id="slotsBet" value="5" min="5" max="100" style="padding: 10px; font-size: 1.1em; border-radius: 5px; border: 2px solid #FFB800; background: #2A3544; color: #FFB800; width: 100px;">
                    <span style="color: #FFB800;"> eGold</span>
                </div>
                <button onclick="slotsGame.spin()" style="padding: 15px 40px; font-size: 1.3em; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer; margin-top: 10px;">
                    SPIN
                </button>
                <div id="slotsResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; margin-bottom: 10px;">Payouts</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 300px; margin: 0 auto;">
                        <div>🍒 Cherry: 1.5x</div>
                        <div>🍋 Lemon: 2x</div>
                        <div>🍊 Orange: 3x</div>
                        <div>🍇 Grape: 4x</div>
                        <div>💎 Diamond: 8x</div>
                        <div>7️⃣ Seven: 15x</div>
                        <div style="grid-column: 1 / -1;">⭐ Star: 30x (JACKPOT!)</div>
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
        
        if (bet < 5) {
            document.getElementById('slotsResult').innerHTML = '<span style="color: #e74c3c;">Minimum bet is 5 eGold!</span>';
            return;
        }
        
        if (bet > balance) {
            document.getElementById('slotsResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        // Deduct bet
        updateBalance(-bet);
        
        // Spin animation
        const reel1 = document.getElementById('reel1');
        const reel2 = document.getElementById('reel2');
        const reel3 = document.getElementById('reel3');
        
        let spins = 0;
        const spinInterval = setInterval(() => {
            reel1.textContent = this.symbols[Math.floor(Math.random() * this.symbols.length)];
            reel2.textContent = this.symbols[Math.floor(Math.random() * this.symbols.length)];
            reel3.textContent = this.symbols[Math.floor(Math.random() * this.symbols.length)];
            spins++;
            
            if (spins >= 15) {
                clearInterval(spinInterval);
                
                // Final weighted result
                const result1 = this.getWeightedSymbol();
                const result2 = this.getWeightedSymbol();
                const result3 = this.getWeightedSymbol();
                
                reel1.textContent = result1;
                reel2.textContent = result2;
                reel3.textContent = result3;
                
                // Check win
                if (result1 === result2 && result2 === result3) {
                    const payout = bet * this.payouts[result1];
                    updateBalance(payout);
                    document.getElementById('slotsResult').innerHTML = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 WIN! +${payout.toFixed(2)} eGold</span>`;
                } else {
                    document.getElementById('slotsResult').innerHTML = '<span style="color: #e74c3c;">Try again!</span>';
                }
            }
        }, 100);
    }
};

window.slotsGame = slotsGame;
