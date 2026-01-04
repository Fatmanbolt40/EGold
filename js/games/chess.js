// Chess Betting Game - Simplified with AI advantage
const chessGame = {
    bet: 50,
    difficulty: 'hard',
    
    init() {
        this.render();
    },
    
    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="chess-game">
                <h2>♔ Chess Betting</h2>
                <p>Win: 3x bet | Draw: 1.5x bet | Lose: -${this.bet} eGold</p>
                
                <div class="chess-board" id="chessBoard">
                    ${this.renderBoard()}
                </div>
                
                <div class="game-controls">
                    <button class="btn-action" onclick="chessGame.startGame()">Start Game (${this.bet} eGold)</button>
                    <button class="btn-action" onclick="chessGame.resign()">Resign</button>
                </div>
                
                <div id="chessResult" class="result-message"></div>
                
                <div class="game-info">
                    <p style="color: #FFB800;">⚠️ AI plays at master level - very difficult!</p>
                </div>
            </div>
        `;
    },
    
    renderBoard() {
        const pieces = ['♜','♞','♝','♛','♚','♝','♞','♜'];
        const pawns = '♟'.repeat(8);
        let html = '<div class="board-grid">';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isLight = (row + col) % 2 === 0;
                let piece = '';
                if (row === 0) piece = pieces[col];
                else if (row === 1) piece = '♟';
                else if (row === 6) piece = '♙';
                else if (row === 7) piece = pieces[col].replace(/♜/g,'♖').replace(/♞/g,'♘').replace(/♝/g,'♗').replace(/♛/g,'♕').replace(/♚/g,'♔');
                
                html += `<div class="chess-square ${isLight ? 'light' : 'dark'}">${piece}</div>`;
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
        
        // Simulate game with heavy house advantage
        setTimeout(() => {
            const outcome = Math.random();
            if (outcome < 0.10) {  // 10% win
                const winAmount = this.bet * 3;
                updateBalance(winAmount);
                this.showResult(`♔ Checkmate! You win ${winAmount} eGold!`, true);
                soundEffects.play('win');
            } else if (outcome < 0.20) {  // 10% draw
                const drawAmount = this.bet * 1.5;
                updateBalance(drawAmount);
                this.showResult(`Draw! You get ${drawAmount} eGold back`, true);
            } else {  // 80% lose
                this.showResult('Checkmate! AI wins. Better luck next time!', false);
                soundEffects.play('lose');
            }
        }, 2000);
        
        this.showResult('Game in progress...', false);
    },
    
    resign() {
        this.showResult('You resigned!', false);
    },
    
    showResult(message, isWin) {
        const resultEl = document.getElementById('chessResult');
        resultEl.textContent = message;
        resultEl.className = `result-message ${isWin ? 'win' : 'lose'}`;
    }
};
