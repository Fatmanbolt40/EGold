// Checkers Betting Game
const checkersGame = {
    bet: 15,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 1.8em; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">🔴 CHECKERS BETTING 🔴</h3>
                    <p style="font-size: 1.2em; color: #cccccc; margin-bottom: 20px;">Bet on a simulated checkers match</p>
                </div>
                
                <div class="game-board">
                    <div id="checkersBoard">${VisualEnhancer.createCheckersBoard()}</div>
                </div>
                
                <div style="margin: 25px 0; padding: 15px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <p style="color: #FFB800; font-size: 1.4em; font-weight: bold;">💰 Bet: ${this.bet} eGold</p>
                </div>
                
                <button onclick="checkersGame.play()" class="game-button" style="font-size: 1.4em; padding: 18px 50px;">
                    🏁 Play Match (${this.bet} eGold)
                </button>
                
                <div id="checkersResult" class="game-result"></div>
                
                <div class="game-info-box">
                    <h3>📊 Outcomes</h3>
                    <div style="display: grid; gap: 10px; margin-top: 15px;">
                        <div style="padding: 12px; background: linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.2)); border-radius: 8px; border: 2px solid #2ecc71;">
                            <span style="font-size: 1.3em;">👑</span> Win: <b style="color: #2ecc71; font-size: 1.3em;">45 eGold</b> <small style="color: #cccccc;">(15% chance)</small>
                        </div>
                        <div style="padding: 10px; background: rgba(255, 184, 0, 0.1); border-radius: 8px;">
                            ⚖️ Draw: <b style="color: #FFB800;">15 eGold</b> <small style="color: #cccccc;">(10% chance)</small>
                        </div>
                        <div style="padding: 10px; background: rgba(231, 76, 60, 0.1); border-radius: 8px;">
                            💔 Lose: <b style="color: #e74c3c;">0 eGold</b> <small style="color: #cccccc;">(75% chance)</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    play() {
        if (balance < this.bet) {
            document.getElementById('checkersResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-this.bet);
        
        // Simulate match with house edge (75% loss, 15% win, 10% draw)
        const board = document.getElementById('checkersBoard');
        const pieces = ['🔴', '⚫', '👑'];
        
        let moves = 0;
        const matchInterval = setInterval(() => {
            board.textContent = pieces[Math.floor(Math.random() * pieces.length)];
            moves++;
            
            if (moves >= 10) {
                clearInterval(matchInterval);
                
                const random = Math.random() * 100;
                let result;
                
                if (random < 15) {
                    // Win (15%)
                    const payout = this.bet * 3;
                    updateBalance(payout);
                    board.textContent = '👑';
                    const resultDiv = document.getElementById('checkersResult');
                    resultDiv.className = 'game-result win';
                    resultDiv.innerHTML = `<span style="font-size: 1.8em;">🎉 KING ME! 🎉</span><br><span style="font-size: 1.4em;">YOU WIN!</span><br><span style="font-size: 1.5em; color: #FFB800;">+${payout} eGold</span>`;
                } else if (random < 25) {
                    // Draw (10%)
                    updateBalance(this.bet);
                    board.textContent = '🔴';
                    const resultDiv = document.getElementById('checkersResult');
                    resultDiv.className = 'game-result';
                    resultDiv.style.background = 'linear-gradient(135deg, rgba(255, 184, 0, 0.2), rgba(212, 175, 55, 0.2))';
                    resultDiv.style.borderColor = '#FFB800';
                    resultDiv.style.color = '#FFB800';
                    resultDiv.innerHTML = '<span style="font-size: 1.5em;">⚖️ DRAW</span><br><span style="font-size: 1.2em;">Bet returned</span>';
                } else {
                    // Lose (75%)
                    board.textContent = '⚫';
                    const resultDiv = document.getElementById('checkersResult');
                    resultDiv.className = 'game-result lose';
                    resultDiv.innerHTML = '<span style="font-size: 1.5em;">⚫ Captured!</span><br><span style="font-size: 1.2em;">💔 You lose!</span>';
                }
                
                document.getElementById('checkersResult').innerHTML = result;
            }
        }, 200);
    }
};

window.checkersGame = checkersGame;
