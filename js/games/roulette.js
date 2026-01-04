// Roulette Game - Clean Implementation
const rouletteGame = {
    numbers: [
        { num: 0, color: 'green' },
        ...Array.from({length: 36}, (_, i) => ({
            num: i + 1,
            color: [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(i + 1) ? 'red' : 'black'
        }))
    ],
    bets: [],
    totalBet: 0,
    
    init() {
        this.bets = [];
        this.totalBet = 0;
        this.render();
    },
    
    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="roulette-game">
                <h2>🎡 European Roulette</h2>
                
                <div class="roulette-wheel" id="wheel">
                    <div class="wheel-ball">⚪</div>
                    <div class="wheel-number">0</div>
                </div>
                
                <div class="betting-area">
                    <h3>Place Your Bets</h3>
                    <div class="bet-chips">
                        ${[5, 10, 25, 50, 100].map(amt => 
                            `<button class="chip" data-value="${amt}" onclick="rouletteGame.selectChip(${amt})">${amt}</button>`
                        ).join('')}
                    </div>
                    <div class="selected-chip">Selected: <span id="selectedChip">10</span> eGold</div>
                </div>
                
                <div class="roulette-board">
                    ${this.renderBoard()}
                </div>
                
                <div class="bet-summary">
                    <div>Total Bet: <span id="totalBet">0</span> eGold</div>
                    <div id="betsList"></div>
                </div>
                
                <div class="game-controls">
                    <button class="btn-spin" onclick="rouletteGame.spin()">🎰 SPIN</button>
                    <button class="btn-clear" onclick="rouletteGame.clearBets()">Clear Bets</button>
                </div>
                
                <div id="rouletteResult" class="result-message"></div>
            </div>
        `;
        this.selectedChip = 10;
    },
    
    renderBoard() {
        let html = '<div class="special-bets">';
        html += `<button class="bet-btn color-bet red" onclick="rouletteGame.placeBet('red', 1.9)">RED (1.9x)</button>`;
        html += `<button class="bet-btn color-bet black" onclick="rouletteGame.placeBet('black', 1.9)">BLACK (1.9x)</button>`;
        html += `<button class="bet-btn" onclick="rouletteGame.placeBet('even', 1.9)">EVEN (1.9x)</button>`;
        html += `<button class="bet-btn" onclick="rouletteGame.placeBet('odd', 1.9)">ODD (1.9x)</button>`;
        html += '</div><div class="numbers-grid">';
        
        this.numbers.forEach(({num, color}) => {
            html += `<button class="number-btn ${color}" onclick="rouletteGame.placeBet(${num}, 30)">${num}</button>`;
        });
        html += '</div>';
        return html;
    },
    
    selectChip(value) {
        this.selectedChip = value;
        document.getElementById('selectedChip').textContent = value;
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        event.target.classList.add('active');
    },
    
    placeBet(type, payout) {
        const balance = parseFloat(document.getElementById('userBalance').textContent);
        if (balance < this.selectedChip) {
            this.showResult('Insufficient balance!', false);
            return;
        }
        
        this.bets.push({ type, amount: this.selectedChip, payout });
        this.totalBet += this.selectedChip;
        updateBalance(-this.selectedChip);
        
        document.getElementById('totalBet').textContent = this.totalBet.toFixed(2);
        document.getElementById('betsList').innerHTML = this.bets.map((b, i) => 
            `<div>Bet ${i+1}: ${b.type} - ${b.amount} eGold (${b.payout}x)</div>`
        ).join('');
    },
    
    clearBets() {
        updateBalance(this.totalBet);
        this.bets = [];
        this.totalBet = 0;
        document.getElementById('totalBet').textContent = '0';
        document.getElementById('betsList').innerHTML = '';
    },
    
    async spin() {
        if (this.bets.length === 0) {
            this.showResult('Place at least one bet!', false);
            return;
        }
        
        // Animate wheel
        await this.animateWheel();
        
        // Get result
        const resultNum = this.numbers[Math.floor(Math.random() * this.numbers.length)];
        document.getElementById('wheel').querySelector('.wheel-number').textContent = resultNum.num;
        
        // Check wins
        let totalWin = 0;
        this.bets.forEach(bet => {
            let won = false;
            if (typeof bet.type === 'number' && bet.type === resultNum.num) won = true;
            else if (bet.type === 'red' && resultNum.color === 'red') won = true;
            else if (bet.type === 'black' && resultNum.color === 'black') won = true;
            else if (bet.type === 'even' && resultNum.num % 2 === 0 && resultNum.num !== 0) won = true;
            else if (bet.type === 'odd' && resultNum.num % 2 === 1) won = true;
            
            if (won) totalWin += bet.amount * bet.payout;
        });
        
        if (totalWin > 0) {
            updateBalance(totalWin);
            this.showResult(`🎉 Number ${resultNum.num} (${resultNum.color})! Won ${totalWin.toFixed(2)} eGold!`, true);
            soundEffects.play('win');
        } else {
            this.showResult(`Number ${resultNum.num} (${resultNum.color}). Try again!`, false);
            soundEffects.play('lose');
        }
        
        // Clear bets
        this.bets = [];
        this.totalBet = 0;
        document.getElementById('totalBet').textContent = '0';
        document.getElementById('betsList').innerHTML = '';
    },
    
    async animateWheel() {
        const wheel = document.getElementById('wheel');
        for (let i = 0; i < 30; i++) {
            const randomNum = this.numbers[Math.floor(Math.random() * this.numbers.length)];
            wheel.querySelector('.wheel-number').textContent = randomNum.num;
            wheel.style.transform = `rotate(${i * 36}deg)`;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        wheel.style.transform = 'rotate(0deg)';
    },
    
    showResult(message, isWin) {
        const resultEl = document.getElementById('rouletteResult');
        resultEl.textContent = message;
        resultEl.className = `result-message ${isWin ? 'win' : 'lose'}`;
        setTimeout(() => resultEl.className = 'result-message', 3000);
    }
};
