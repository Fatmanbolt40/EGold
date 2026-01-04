// Standard Lottery Game - Clean Implementation
const lotteryGame = {
    ticketPrice: 20,
    selectedNumbers: [],
    maxNumbers: 6,
    numberRange: 49,
    
    init() {
        try {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.info('LOTTERY_INIT', {});
            }
            this.selectedNumbers = [];
            this.render();
        } catch (error) {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.error('LOTTERY_INIT_ERROR', { error: error.message, stack: error.stack });
            }
            console.error('Lottery init error:', error);
        }
    },
    
    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="lottery-game">
                <h2>🎱 Standard Lottery</h2>
                <p>Pick ${this.maxNumbers} numbers from 1-${this.numberRange}</p>
                
                <div class="lottery-info">
                    <div>Ticket Price: ${this.ticketPrice} eGold</div>
                    <div>Jackpot: <span id="lotteryJackpot">${document.getElementById('progressiveJackpot').textContent}</span> eGold</div>
                </div>
                
                <div class="selected-numbers">
                    <h3>Your Numbers:</h3>
                    <div id="selectedNumbers">
                        ${this.selectedNumbers.map(n => `<span class="lottery-ball">${n}</span>`).join('') || 
                         '<span class="placeholder">Select numbers below...</span>'}
                    </div>
                    <button class="btn-clear" onclick="lotteryGame.clearSelection()">Clear</button>
                </div>
                
                <div class="number-grid">
                    ${Array.from({length: this.numberRange}, (_, i) => i + 1).map(num => `
                        <button class="number-btn ${this.selectedNumbers.includes(num) ? 'selected' : ''}" 
                                onclick="lotteryGame.toggleNumber(${num})"
                                ${this.selectedNumbers.length >= this.maxNumbers && !this.selectedNumbers.includes(num) ? 'disabled' : ''}>
                            ${num}
                        </button>
                    `).join('')}
                </div>
                
                <div class="lottery-controls">
                    <button class="btn-quick" onclick="lotteryGame.quickPick()">Quick Pick</button>
                    <button class="btn-play" onclick="lotteryGame.playLottery()">Buy Ticket (${this.ticketPrice} eGold)</button>
                </div>
                
                <div id="lotteryResult" class="result-message"></div>
            </div>
        `;
    },
    
    toggleNumber(num) {
        const index = this.selectedNumbers.indexOf(num);
        if (index > -1) {
            this.selectedNumbers.splice(index, 1);
        } else if (this.selectedNumbers.length < this.maxNumbers) {
            this.selectedNumbers.push(num);
        }
        this.render();
    },
    
    quickPick() {
        this.selectedNumbers = [];
        while (this.selectedNumbers.length < this.maxNumbers) {
            const num = Math.floor(Math.random() * this.numberRange) + 1;
            if (!this.selectedNumbers.includes(num)) {
                this.selectedNumbers.push(num);
            }
        }
        this.selectedNumbers.sort((a, b) => a - b);
        this.render();
    },
    
    clearSelection() {
        this.selectedNumbers = [];
        this.render();
    },
    
    playLottery() {
        if (this.selectedNumbers.length < this.maxNumbers) {
            this.showResult(`Please select ${this.maxNumbers} numbers!`, false);
            return;
        }
        
        const balance = parseFloat(document.getElementById('userBalance').textContent);
        if (balance < this.ticketPrice) {
            this.showResult('Insufficient balance!', false);
            return;
        }
        
        updateBalance(-this.ticketPrice);
        
        // Generate winning numbers
        const winningNumbers = [];
        while (winningNumbers.length < this.maxNumbers) {
            const num = Math.floor(Math.random() * this.numberRange) + 1;
            if (!winningNumbers.includes(num)) {
                winningNumbers.push(num);
            }
        }
        winningNumbers.sort((a, b) => a - b);
        
        // Count matches
        const matches = this.selectedNumbers.filter(n => winningNumbers.includes(n)).length;
        
        // Calculate prize (reduced for house edge)
        const prizes = {
            6: 2000,  // Jackpot
            5: 200,
            4: 40,
            3: 10,
            2: 0  // No payout for 2 matches
        };
        
        const prize = prizes[matches] || 0;
        
        // Show results
        const resultMsg = `
            Winning Numbers: ${winningNumbers.map(n => `<span class="lottery-ball">${n}</span>`).join('')}<br>
            Your Numbers: ${this.selectedNumbers.map(n => `<span class="lottery-ball ${winningNumbers.includes(n) ? 'match' : ''}">${n}</span>`).join('')}<br>
            Matches: ${matches}/6<br>
            ${prize > 0 ? `🎉 You won ${prize} eGold!` : '❌ Better luck next time!'}
        `;
        
        if (prize > 0) {
            updateBalance(prize);
            soundEffects.play('win');
        } else {
            soundEffects.play('lose');
        }
        
        this.showResult(resultMsg, prize > 0);
        this.selectedNumbers = [];
        setTimeout(() => this.render(), 5000);
    },
    
    showResult(message, isWin) {
        const resultEl = document.getElementById('lotteryResult');
        resultEl.innerHTML = message;
        resultEl.className = `result-message ${isWin ? 'win' : 'lose'}`;
    }
};
