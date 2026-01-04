// 16-Sided Dice Raffle Game - Clean Implementation
const diceraffleGame = {
    ticketPrice: 15,
    
    init() {
        this.render();
    },
    
    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="diceraffle-game">
                <h2>🎲 16-Sided Dice Raffle</h2>
                <p>Roll the dice for a chance at massive prizes!</p>
                
                <div class="dice-display" id="diceDisplay">
                    <div class="dice-large">🎲</div>
                    <div class="dice-result" id="diceResult">?</div>
                </div>
                
                <div class="prize-chart">
                    <h3>Prize Chart</h3>
                    <div class="prize-row jackpot">16 = 500 eGold (JACKPOT!) - 2% chance</div>
                    <div class="prize-row">15 = 250 eGold - 3% chance</div>
                    <div class="prize-row">14 = 125 eGold - 5% chance</div>
                    <div class="prize-row">13 = 60 eGold - 7% chance</div>
                    <div class="prize-row">12 = 30 eGold - 10% chance</div>
                    <div class="prize-row">11 = 20 eGold - 13% chance</div>
                    <div class="prize-row">10 = 15 eGold</div>
                    <div class="prize-row">1-9 = Try Again - 60% chance</div>
                </div>
                
                <button class="btn-roll" onclick="diceraffleGame.roll()">
                    🎲 Roll Dice (${this.ticketPrice} eGold)
                </button>
                
                <div id="raffleResult" class="result-message"></div>
                
                <div class="raffle-stats">
                    <h4>Statistics</h4>
                    <div>Total Rolls: <span id="totalRolls">0</span></div>
                    <div>Highest Roll: <span id="highestRoll">0</span></div>
                </div>
            </div>
        `;
    },
    
    async roll() {
        const balance = parseFloat(document.getElementById('userBalance').textContent);
        if (balance < this.ticketPrice) {
            this.showResult('Insufficient balance!', false);
            return;
        }
        
        updateBalance(-this.ticketPrice);
        
        // Animate rolling
        const diceResultEl = document.getElementById('diceResult');
        const diceDisplay = document.getElementById('diceDisplay');
        
        for (let i = 0; i < 20; i++) {
            diceResultEl.textContent = Math.floor(Math.random() * 16) + 1;
            diceDisplay.style.transform = `rotate(${i * 36}deg)`;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Final result (weighted toward lower numbers for house edge)
        let result;
        const roll = Math.random();
        if (roll < 0.02) result = 16;       // 2% chance
        else if (roll < 0.05) result = 15;  // 3% chance
        else if (roll < 0.10) result = 14;  // 5% chance
        else if (roll < 0.17) result = 13;  // 7% chance
        else if (roll < 0.27) result = 12;  // 10% chance
        else if (roll < 0.40) result = 11;  // 13% chance
        else result = Math.floor(Math.random() * 10) + 1;  // 60% chance for 1-10
        diceResultEl.textContent = result;
        diceDisplay.style.transform = 'rotate(0deg)';
        
        // Calculate prize (reduced for house edge)
        const prizes = {
            16: 500,
            15: 250,
            14: 125,
            13: 60,
            12: 30,
            11: 20,
            10: 15,
            9: 0
        };
        
        const prize = prizes[result] || 0;
        
        // Update stats
        const totalRolls = parseInt(document.getElementById('totalRolls').textContent) + 1;
        const highestRoll = Math.max(result, parseInt(document.getElementById('highestRoll').textContent));
        document.getElementById('totalRolls').textContent = totalRolls;
        document.getElementById('highestRoll').textContent = highestRoll;
        
        // Show result
        if (prize > 0) {
            updateBalance(prize);
            this.showResult(`🎉 You rolled ${result}! Won ${prize} eGold!${result === 16 ? ' JACKPOT!' : ''}`, true);
            soundEffects.play('win');
        } else {
            this.showResult(`You rolled ${result}. Try again!`, false);
            soundEffects.play('lose');
        }
    },
    
    showResult(message, isWin) {
        const resultEl = document.getElementById('raffleResult');
        resultEl.textContent = message;
        resultEl.className = `result-message ${isWin ? 'win' : 'lose'}`;
        setTimeout(() => resultEl.className = 'result-message', 3000);
    }
};
