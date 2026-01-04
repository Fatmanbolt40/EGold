// Coin Flip Game - Clean Implementation
const coinflipGame = {
    betAmount: 10,
    
    init() {
        this.render();
    },
    
    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="coinflip-game">
                <h2>🪙 Coin Flip - 50/50 Instant Win</h2>
                
                <div class="coin-display" id="coin">
                    <div class="coin-face">🪙</div>
                </div>
                
                <div class="bet-controls">
                    <div class="bet-amount-selector">
                        <button onclick="coinflipGame.changeBet(-10)">-10</button>
                        <span>Bet: <span id="betAmount">${this.betAmount}</span> eGold</span>
                        <button onclick="coinflipGame.changeBet(10)">+10</button>
                    </div>
                </div>
                
                <div class="choice-buttons">
                    <button class="choice-btn heads" onclick="coinflipGame.flip('heads')">
                        <div class="coin-icon">👑</div>
                        <div>HEADS</div>
                        <div class="payout">Win 1.95x</div>
                    </button>
                    <button class="choice-btn tails" onclick="coinflipGame.flip('tails')">
                        <div class="coin-icon">🦅</div>
                        <div>TAILS</div>
                        <div class="payout">Win 1.95x</div>
                    </button>
                </div>
                
                <div id="coinResult" class="result-message"></div>
                
                <div class="game-stats">
                    <div class="stat">
                        <span>Heads Count:</span>
                        <span id="headsCount">0</span>
                    </div>
                    <div class="stat">
                        <span>Tails Count:</span>
                        <span id="tailsCount">0</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    changeBet(amount) {
        this.betAmount = Math.max(5, Math.min(1000, this.betAmount + amount));
        document.getElementById('betAmount').textContent = this.betAmount;
    },
    
    async flip(choice) {
        const balance = parseFloat(document.getElementById('userBalance').textContent);
        if (balance < this.betAmount) {
            this.showResult('Insufficient balance!', false);
            return;
        }
        
        // Disable buttons
        document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = true);
        
        // Deduct bet
        updateBalance(-this.betAmount);
        
        // Animate flip
        await this.animateFlip();
        
        // Determine result (48% win rate for house edge)
        const result = Math.random() < 0.48 ? choice : (choice === 'heads' ? 'tails' : 'heads');
        const won = result === choice;
        
        // Display result
        document.querySelector('.coin-face').textContent = result === 'heads' ? '👑' : '🦅';
        
        // Update stats
        const countEl = document.getElementById(`${result}Count`);
        countEl.textContent = parseInt(countEl.textContent) + 1;
        
        // Handle win/loss (1.95x payout for house edge)
        if (won) {
            const winAmount = this.betAmount * 1.95;
            updateBalance(winAmount);
            this.showResult(`🎉 ${result.toUpperCase()}! You won ${winAmount.toFixed(2)} eGold!`, true);
            soundEffects.play('win');
        } else {
            this.showResult(`❌ ${result.toUpperCase()}! Better luck next time!`, false);
            soundEffects.play('lose');
        }
        
        // Re-enable buttons
        setTimeout(() => {
            document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = false);
        }, 1000);
    },
    
    async animateFlip() {
        const coin = document.querySelector('.coin-display');
        for (let i = 0; i < 10; i++) {
            coin.style.transform = `rotateY(${i * 180}deg)`;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        coin.style.transform = 'rotateY(0deg)';
    },
    
    showResult(message, isWin) {
        const resultEl = document.getElementById('coinResult');
        resultEl.textContent = message;
        resultEl.className = `result-message ${isWin ? 'win' : 'lose'}`;
        setTimeout(() => resultEl.className = 'result-message', 3000);
    }
};
