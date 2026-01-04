// Slots Game - Clean Implementation
const slotsGame = {
    symbols: ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '⭐'],
    // Weighted symbols - lower values appear more often
    weightedSymbols: ['🍒','🍒','🍒','🍒','🍒','🍋','🍋','🍋','🍋','🍊','🍊','🍊','🍇','🍇','💎','7️⃣','⭐'],
    payouts: {
        '🍒': 1.5,
        '🍋': 2,
        '🍊': 3,
        '🍇': 4,
        '💎': 8,
        '7️⃣': 15,
        '⭐': 30
    },
    
    init(betAmount) {
        try {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.info('SLOTS_INIT', { betAmount });
            }
            this.betAmount = betAmount || 10;
            this.render();
        } catch (error) {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.error('SLOTS_INIT_ERROR', { error: error.message, stack: error.stack });
            }
            console.error('Slots init error:', error);
        }
    },
    
    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="slot-machine">
                <div class="jackpot-display">
                    <h3>💰 Jackpot: <span id="slotJackpot">${document.getElementById('progressiveJackpot').textContent}</span> eGold</h3>
                </div>
                
                <div class="reels" id="reels">
                    <div class="reel" id="reel1">🍒</div>
                    <div class="reel" id="reel2">🍋</div>
                    <div class="reel" id="reel3">🍊</div>
                </div>
                
                <div class="bet-controls">
                    <div class="bet-amount-selector">
                        <button onclick="slotsGame.changeBet(-5)">-</button>
                        <span>Bet: <span id="currentBet">${this.betAmount}</span> eGold</span>
                        <button onclick="slotsGame.changeBet(5)">+</button>
                    </div>
                    <button class="btn-spin" id="spinBtn" onclick="slotsGame.spin()">🎰 SPIN</button>
                </div>
                
                <div class="payout-table">
                    <h4>Payouts (3 matching symbols)</h4>
                    <div class="payout-grid">
                        ${Object.entries(this.payouts).map(([symbol, mult]) => 
                            `<div>${symbol} ${symbol} ${symbol} = ${mult}x</div>`
                        ).join('')}
                    </div>
                </div>
                
                <div id="slotResult" class="result-message"></div>
            </div>
        `;
    },
    
    changeBet(amount) {
        this.betAmount = Math.max(5, Math.min(1000, this.betAmount + amount));
        document.getElementById('currentBet').textContent = this.betAmount;
    },
    
    async spin() {
        try {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.info('SLOTS_SPIN', { bet: this.betAmount });
            }
            const balance = parseFloat(document.getElementById('userBalance').textContent);
        if (balance < this.betAmount) {
            this.showResult('Insufficient balance!', false);
            return;
        }
        
        // Disable spin button
        const spinBtn = document.getElementById('spinBtn');
        spinBtn.disabled = true;
        
        // Deduct bet
        updateBalance(-this.betAmount);
        
        // Animate reels
        await this.animateReels();
        
        // Get results (weighted for house edge)
        const results = [
            this.weightedSymbols[Math.floor(Math.random() * this.weightedSymbols.length)],
            this.weightedSymbols[Math.floor(Math.random() * this.weightedSymbols.length)],
            this.weightedSymbols[Math.floor(Math.random() * this.weightedSymbols.length)]
        ];
        
        // Display results
        document.getElementById('reel1').textContent = results[0];
        document.getElementById('reel2').textContent = results[1];
        document.getElementById('reel3').textContent = results[2];
        
        // Check win
        if (results[0] === results[1] && results[1] === results[2]) {
            const winMultiplier = this.payouts[results[0]];
            const winAmount = this.betAmount * winMultiplier;
            updateBalance(winAmount);
            this.showResult(`🎉 WIN! ${results[0]} ${results[0]} ${results[0]} - ${winAmount.toFixed(2)} eGold!`, true);
            soundEffects.play('win');
        } else {
            this.showResult('Try again!', false);
            soundEffects.play('lose');
        }
        
        spinBtn.disabled = false;
        } catch (error) {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.error('SLOTS_SPIN_ERROR', {
                    error: error.message,
                    stack: error.stack
                });
            }
            console.error('Slots error:', error);
        }
    },
    
    async animateReels() {
        for (let i = 0; i < 15; i++) {
            document.getElementById('reel1').textContent = this.weightedSymbols[Math.floor(Math.random() * this.weightedSymbols.length)];
            document.getElementById('reel2').textContent = this.weightedSymbols[Math.floor(Math.random() * this.weightedSymbols.length)];
            document.getElementById('reel3').textContent = this.weightedSymbols[Math.floor(Math.random() * this.weightedSymbols.length)];
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    },
    
    showResult(message, isWin) {
        const resultEl = document.getElementById('slotResult');
        resultEl.textContent = message;
        resultEl.className = `result-message ${isWin ? 'win' : 'lose'}`;
        setTimeout(() => resultEl.className = 'result-message', 3000);
    }
};
