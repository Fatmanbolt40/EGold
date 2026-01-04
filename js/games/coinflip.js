// Coin Flip Game
const coinflipGame = {
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 1.8em; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">🪙 COIN FLIP 🪙</h3>
                    <div id="coin" style="font-size: 10em; margin: 30px 0; filter: drop-shadow(0 8px 16px rgba(255, 184, 0, 0.4)); transition: all 0.3s ease;">🪙</div>
                </div>
                <div class="game-controls">
                    <label style="font-size: 1.3em; color: #FFB800;">💰 Bet:</label>
                    <input type="number" id="coinBet" value="5" min="5" max="500" class="game-input" style="width: 120px;">
                    <span style="color: #FFB800; font-size: 1.2em;">eGold</span>
                </div>
                <div style="margin: 25px 0;">
                    <label style="font-size: 1.4em; color: #FFB800; display: block; margin-bottom: 15px;">Choose Your Side:</label>
                    <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="coinflipGame.flip('heads')" class="game-button" style="min-width: 150px;">
                            👑 HEADS
                        </button>
                        <button onclick="coinflipGame.flip('tails')" class="game-button secondary" style="min-width: 150px;">
                            🎯 TAILS
                        </button>
                    </div>
                </div>
                <div id="coinResult" class="game-result"></div>
                <div class="game-info-box">
                    <h3>💎 Prize</h3>
                    <p style="font-size: 1.3em; color: #FFB800; font-weight: bold;">Win 1.95x your bet!</p>
                    <p style="margin-top: 10px;">Simple 50/50 game - pick your side!</p>
                </div>
            </div>
        `;
    },
    
    flip(choice) {
        const betInput = document.getElementById('coinBet');
        const bet = parseFloat(betInput.value);
        
        if (bet < 5) {
            document.getElementById('coinResult').innerHTML = '<span style="color: #e74c3c;">Minimum bet is 5 eGold!</span>';
            return;
        }
        
        if (bet > balance) {
            document.getElementById('coinResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        // Deduct bet
        updateBalance(-bet);
        
        // Flip animation
        const coin = document.getElementById('coin');
        let flips = 0;
        const flipInterval = setInterval(() => {
            coin.textContent = flips % 2 === 0 ? '🟡' : '⚪';
            flips++;
            
            if (flips >= 10) {
                clearInterval(flipInterval);
                
                // House edge: 48% player win rate instead of 50%
                const playerWins = Math.random() < 0.48;
                const result = playerWins ? choice : (choice === 'heads' ? 'tails' : 'heads');
                
                coin.textContent = result === 'heads' ? '🟡' : '⚪';
                
                if (result === choice) {
                    const payout = bet * 1.95;
                    updateBalance(payout);
                    const resultDiv = document.getElementById('coinResult');
                    resultDiv.className = 'game-result win';
                    resultDiv.innerHTML = `<span style="font-size: 1.8em;">🎉 WINNER! 🎉</span><br><span style="font-size: 1.4em;">It's ${result.toUpperCase()}!</span><br><span style="font-size: 1.5em; color: #FFB800;">+${payout.toFixed(2)} eGold</span>`;
                } else {
                    const resultDiv = document.getElementById('coinResult');
                    resultDiv.className = 'game-result lose';
                    resultDiv.innerHTML = `<span style="font-size: 1.4em;">It's ${result.toUpperCase()}</span><br><span style="font-size: 1.2em;">💔 Better luck next time!</span>`;
                }
            }
        }, 150);
    }
};

window.coinflipGame = coinflipGame;
