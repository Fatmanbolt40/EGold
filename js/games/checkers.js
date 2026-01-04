// Checkers Betting Game - Simplified with AI advantage
const checkersGame = {
    bet: 30,
    
    init() {
        this.render();
    },
    
    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="checkers-game">
                <h2>⚫ Checkers Betting</h2>
                <p>Win: 2.5x bet | Draw: 1x bet | Lose: -${this.bet} eGold</p>
                
                <div class="checkers-board" id="checkersBoard">
                    ${this.renderBoard()}
                </div>
                
                <div class="game-controls">
                    <button class="btn-action" onclick="checkersGame.startGame()">Start Game (${this.bet} eGold)</button>
                    <button class="btn-action" onclick="checkersGame.resign()">Resign</button>
                </div>
                
                <div id="checkersResult" class="result-message"></div>
                
                <div class="game-info">
                    <p style="color: #FFB800;">⚠️ AI uses advanced strategy - challenging game!</p>
                </div>
            </div>
        `;
    },
    
    renderBoard() {
        let html = '<div class="board-grid">';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isLight = (row + col) % 2 === 0;
                let piece = '';
                
                if (!isLight) {
                    if (row < 3) piece = '⚫';  // Black pieces (AI)
                    else if (row > 4) piece = '🔴';  // Red pieces (Player)
                }
                
                html += `<div class="checkers-square ${isLight ? 'light' : 'dark'}">${piece}</div>`;
            }
        }
        html += '</div>';
        return html;
    },
    
    startGame() {
        const balance = parseFloat(document.getElementById('userBalance').textContent);
        if (balance < this.bet) {
            this.showResult('Insufficient balance!', false);
            return;
        }
        
        updateBalance(-this.bet);
        
        // Simulate game with house advantage
        setTimeout(() => {
            const outcome = Math.random();
            if (outcome < 0.15) {  // 15% win
                const winAmount = this.bet * 2.5;
                updateBalance(winAmount);
                this.showResult(`🔴 Victory! You win ${winAmount} eGold!`, true);
                soundEffects.play('win');
            } else if (outcome < 0.25) {  // 10% draw
                updateBalance(this.bet);
                this.showResult(`Draw! You get ${this.bet} eGold back`, true);
            } else {  // 75% lose
                this.showResult('⚫ AI captures all your pieces! You lose.', false);
                soundEffects.play('lose');
            }
        }, 2000);
        
        this.showResult('Game in progress...', false);
    },
    
    resign() {
        this.showResult('You resigned!', false);
    },
    
    showResult(message, isWin) {
        const resultEl = document.getElementById('checkersResult');
        resultEl.textContent = message;
        resultEl.className = `result-message ${isWin ? 'win' : 'lose'}`;
    }
};
