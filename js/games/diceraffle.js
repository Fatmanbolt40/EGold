// Dice Raffle Game (d16)
const diceraffleGame = {
    ticketCost: 15,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #FFB800; font-size: 1.5em; margin-bottom: 20px;">16-Sided Dice Raffle</h3>
                
                <div id="dice" style="font-size: 8em; margin: 30px 0;">🎲</div>
                <div id="diceNumber" style="font-size: 3em; color: #FFB800; min-height: 60px;"></div>
                
                <button onclick="diceraffleGame.roll()" style="padding: 15px 40px; font-size: 1.3em; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer; margin: 20px 0;">
                    Roll Dice (15 eGold)
                </button>
                
                <div id="diceResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; margin-bottom: 10px;">Prize Table</h3>
                    <div style="color: #cccccc; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; max-width: 400px; margin: 0 auto;">
                        <div>🎰 Roll 16: 500 eGold</div>
                        <div>💎 Roll 15: 250 eGold</div>
                        <div>⭐ Roll 14: 125 eGold</div>
                        <div>🎯 Roll 13: 60 eGold</div>
                        <div>🎁 Roll 12: 30 eGold</div>
                        <div>💰 Roll 11: 20 eGold</div>
                        <div>✨ Roll 10: 15 eGold</div>
                        <div style="grid-column: 1 / -1;">😢 Roll 1-9: No Prize</div>
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
        
        let rolls = 0;
        const rollInterval = setInterval(() => {
            diceNumber.textContent = Math.floor(Math.random() * 16) + 1;
            dice.style.transform = `rotate(${rolls * 90}deg)`;
            rolls++;
            
            if (rolls >= 15) {
                clearInterval(rollInterval);
                
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
                    document.getElementById('diceResult').innerHTML = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 You rolled ${result}! Prize: +${prize} eGold</span>`;
                } else {
                    diceNumber.style.color = '#e74c3c';
                    document.getElementById('diceResult').innerHTML = `<span style="color: #e74c3c;">You rolled ${result}. Try again!</span>`;
                }
            }
        }, 100);
    }
};

window.diceraffleGame = diceraffleGame;
