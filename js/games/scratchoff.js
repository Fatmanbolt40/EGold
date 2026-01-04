// Scratch Off Game - Clean Implementation
const scratchoffGame = {
    ticketPrice: 10,
    prizes: [0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 10, 10, 20, 50, 100, 200],
    
    init() {
        this.render();
    },
    
    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="scratchoff-game">
                <h2>🎫 Scratch Off Tickets</h2>
                <p>Scratch to reveal your prize!</p>
                
                <div class="ticket-price">
                    <h3>Ticket Price: ${this.ticketPrice} eGold</h3>
                </div>
                
                <div class="scratch-card" id="scratchCard">
                    <div class="scratch-overlay" id="scratchOverlay">
                        <div class="scratch-instruction">🖐️ Click to Scratch!</div>
                    </div>
                    <div class="prize-reveal" id="prizeReveal">
                        <div class="prize-amount">Loading...</div>
                    </div>
                </div>
                
                <button class="btn-buy" onclick="scratchoffGame.buyTicket()">Buy New Ticket (${this.ticketPrice} eGold)</button>
                
                <div class="prize-table">
                    <h4>Prize Distribution</h4>
                    <div>💰 500 eGold - Jackpot!</div>
                    <div>💵 100 eGold - Big Win!</div>
                    <div>💸 50 eGold - Nice!</div>
                    <div>💳 20 eGold - Winner!</div>
                    <div>💴 10 eGold - Small Win</div>
                    <div>❌ Better Luck Next Time</div>
                </div>
                
                <div id="scratchResult" class="result-message"></div>
            </div>
        `;
    },
    
    buyTicket() {
        const balance = parseFloat(document.getElementById('userBalance').textContent);
        if (balance < this.ticketPrice) {
            this.showResult('Insufficient balance!', false);
            return;
        }
        
        updateBalance(-this.ticketPrice);
        this.setupScratch();
    },
    
    setupScratch() {
        const prize = this.prizes[Math.floor(Math.random() * this.prizes.length)];
        const overlay = document.getElementById('scratchOverlay');
        const prizeReveal = document.getElementById('prizeReveal');
        
        overlay.style.display = 'flex';
        prizeReveal.innerHTML = `
            <div class="prize-amount">${prize > 0 ? `🎉 ${prize} eGold!` : '❌ Try Again'}</div>
        `;
        
        let scratched = false;
        overlay.addEventListener('click', () => {
            if (!scratched) {
                scratched = true;
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    if (prize > 0) {
                        updateBalance(prize);
                        this.showResult(`You won ${prize} eGold!`, true);
                        soundEffects.play('win');
                    } else {
                        this.showResult('Better luck next time!', false);
                        soundEffects.play('lose');
                    }
                }, 500);
            }
        });
    },
    
    showResult(message, isWin) {
        const resultEl = document.getElementById('scratchResult');
        resultEl.textContent = message;
        resultEl.className = `result-message ${isWin ? 'win' : 'lose'}`;
        setTimeout(() => resultEl.className = 'result-message', 3000);
    }
};
