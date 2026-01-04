// Dice Raffle Game (d16)
const diceraffleGame = {
    ticketCost: 15,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 1.8em; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">🎲 16-SIDED DICE RAFFLE 🎲</h3>
                    
                    <div id="dice" style="margin: 30px 0;">${VisualEnhancer.create3DDice(1)}</div>
                    <div id="diceNumber" style="font-size: 3.5em; color: #FFB800; min-height: 80px; font-weight: bold; text-shadow: 0 0 20px rgba(255, 184, 0, 0.8);"></div>
                </div>
                
                <button onclick="diceraffleGame.roll()" class="game-button" style="font-size: 1.4em; padding: 18px 50px;">
                    🎯 Roll Dice (15 eGold)
                </button>
                
                <div id="diceResult" class="game-result"></div>
                
                <div class="game-info-box">
                    <h3>💎 Prize Table</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 500px; margin: 15px auto; font-size: 1.1em;">
                        <div style="padding: 12px; background: linear-gradient(135deg, rgba(255, 184, 0, 0.2), rgba(212, 175, 55, 0.2)); border-radius: 8px; border: 2px solid #FFB800; grid-column: 1 / -1;">
                            <span style="font-size: 1.5em;">🎰</span> Roll 16: <b style="color: #FFB800; font-size: 1.4em;">500 eGold</b> <small style="color: #2ecc71;">($50)</small>
                        </div>
                        <div style="padding: 10px; background: rgba(255, 184, 0, 0.15); border-radius: 8px;">💎 Roll 15: <b>250 eGold</b> <small style="color: #2ecc71;">($25)</small></div>
                        <div style="padding: 10px; background: rgba(255, 184, 0, 0.15); border-radius: 8px;">⭐ Roll 14: <b>125 eGold</b> <small style="color: #2ecc71;">($12.50)</small></div>
                        <div style="padding: 10px; background: rgba(255, 184, 0, 0.1); border-radius: 8px;">🎯 Roll 13: <b>60 eGold</b> <small style="color: #2ecc71;">($6)</small></div>
                        <div style="padding: 10px; background: rgba(255, 184, 0, 0.1); border-radius: 8px;">🎁 Roll 12: <b>30 eGold</b> <small style="color: #2ecc71;">($3)</small></div>
                        <div style="padding: 10px; background: rgba(255, 184, 0, 0.1); border-radius: 8px;">💰 Roll 11: <b>20 eGold</b> <small style="color: #2ecc71;">($2)</small></div>
                        <div style="padding: 10px; background: rgba(255, 184, 0, 0.1); border-radius: 8px;">✨ Roll 10: <b>15 eGold</b> <small style="color: #2ecc71;">($1.50)</small></div>
                        <div style="grid-column: 1 / -1; padding: 10px; background: rgba(231, 76, 60, 0.1); border-radius: 8px; color: #e74c3c;">😢 Roll 1-9: <b>No Prize</b></div>
                    </div>
                </div>
            </div>
        `;
    },
    
    roll() {
        if (balance < this.ticketCost) {
            document.getElementById('diceResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-this.ticketCost);
        
        const dice = document.getElementById('dice');
        const diceNumber = document.getElementById('diceNumber');
        
        diceNumber.textContent = 'Rolling...';
        
        setTimeout(() => {
            // House edge: Weighted toward low numbers
            const weights = [
                10, 10, 10, 10, 10, 10, 10, 10, 10,  // 1-9: 60% total
                13,  // 10: 13%
                13,  // 11: 13%
                10,  // 12: 10%
                7,   // 13: 7%
                5,   // 14: 5%
                3,   // 15: 3%
                2    // 16: 2%
            ];
            
            const totalWeight = weights.reduce((a, b) => a + b, 0);
            let random = Math.random() * totalWeight;
            let result = 1;
            
            for (let i = 0; i < weights.length; i++) {
                random -= weights[i];
                if (random <= 0) {
                    result = i + 1;
                        break;
                    }
                }
                
                diceNumber.textContent = result;
            }
            
            // Show result with dice visual  
            const displayNum = result <= 6 ? result : Math.floor(Math.random() * 6) + 1;
            dice.innerHTML = VisualEnhancer.create3DDice(displayNum);
            diceNumber.textContent = result;
            
            const prizes = {
                16: 500,
                15: 250,
                14: 125,
                13: 60,
                12: 30,
                11: 20,
                10: 15
            };
            
            const prize = prizes[result] || 0;
            
            if (prize > 0) {
                updateBalance(prize);
                diceNumber.style.color = '#2ecc71';
                const resultDiv = document.getElementById('diceResult');
                resultDiv.className = 'game-result win';
                resultDiv.innerHTML = `<span style="font-size: 1.8em;">🎉 You rolled ${result}! 🎉</span><br><span style="font-size: 1.5em; color: #FFB800;">Prize: +${prize} eGold</span>`;
            } else {
                diceNumber.style.color = '#e74c3c';
                const resultDiv = document.getElementById('diceResult');
                resultDiv.className = 'game-result lose';
                resultDiv.innerHTML = `<span style="font-size: 1.4em;">You rolled ${result}</span><br><span style="font-size: 1.2em;">💔 Try again!</span>`;
            }
        }, 1500);
    }
};

window.diceraffleGame = diceraffleGame;
