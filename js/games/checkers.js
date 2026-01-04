// Checkers Betting Game
const checkersGame = {
    bet: 15,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #FFB800; font-size: 1.5em; margin-bottom: 20px;">Checkers Betting</h3>
                <p style="color: #cccccc; margin-bottom: 20px;">Bet on a simulated checkers match</p>
                
                <div style="margin: 30px auto; max-width: 400px; aspect-ratio: 1; background: repeating-conic-gradient(#e74c3c 0% 25%, #2c3e50 0% 50%) 50% / 50px 50px; border: 3px solid #FFB800; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <div id="checkersBoard" style="font-size: 8em;">🔴</div>
                </div>
                
                <div style="margin: 20px 0;">
                    <div style="background: rgba(255, 184, 0, 0.1); padding: 15px; border-radius: 10px; display: inline-block;">
                        <p style="color: #FFB800; font-size: 1.2em;">Bet: ${this.bet} eGold</p>
                    </div>
                </div>
                
                <button onclick="checkersGame.play()" style="padding: 15px 40px; font-size: 1.3em; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer; margin: 20px 0;">
                    Play Match (${this.bet} eGold)
                </button>
                
                <div id="checkersResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; margin-bottom: 10px;">Outcomes</h3>
                    <div style="color: #cccccc;">
                        <p style="color: #2ecc71;">Win: 45 eGold (15% chance)</p>
                        <p style="color: #FFB800;">Draw: 15 eGold (10% chance)</p>
                        <p style="color: #e74c3c;">Lose: 0 eGold (75% chance)</p>
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
                    result = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 KING ME! YOU WIN! +${payout} eGold</span>`;
                } else if (random < 25) {
                    // Draw (10%)
                    updateBalance(this.bet);
                    board.textContent = '🔴';
                    result = '<span style="color: #FFB800;">DRAW - Bet returned</span>';
                } else {
                    // Lose (75%)
                    board.textContent = '⚫';
                    result = '<span style="color: #e74c3c;">You lose! Try again.</span>';
                }
                
                document.getElementById('checkersResult').innerHTML = result;
            }
        }, 200);
    }
};

window.checkersGame = checkersGame;
