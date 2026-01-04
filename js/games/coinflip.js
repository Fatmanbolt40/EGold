// Coin Flip Game
const coinflipGame = {
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 1.8em; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">🪙 COIN FLIP 🪙</h3>
                    <div id="coin">${VisualEnhancer.createCoinFlip()}</div>
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
            soundManager.playButtonClick();
            return;
        }
        
        if (bet > balance) {
            document.getElementById('coinResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            soundManager.playButtonClick();
            return;
        }
        
        // Play coin flip sound
        soundManager.playCoinFlip();
        
        // Deduct bet
        updateBalance(-bet);
        
        // Flip animation
        const coin = document.getElementById('coin');
        coin.innerHTML = VisualEnhancer.createCoinFlip(null, true);
        
        setTimeout(() => {
            // House edge: 48% player win rate instead of 50%
            const playerWins = Math.random() < 0.48;
            const result = playerWins ? choice : (choice === 'heads' ? 'tails' : 'heads');
            
            coin.innerHTML = VisualEnhancer.createCoinFlip(result, false);
            coin.className = 'animate-bounce';
            
            if (result === choice) {
                const payout = bet * 1.95;
                updateBalance(payout);
                
                soundManager.playWin();
                particleSystem.createCoinBurst(window.innerWidth / 2, 300, payout);
                
                const resultDiv = document.getElementById('coinResult');
                resultDiv.className = 'game-result win-effect';
                resultDiv.innerHTML = `<span style="font-size: 1.8em;">🎉 WINNER! 🎉</span><br><span style="font-size: 1.4em;">It's ${result.toUpperCase()}!</span><br><span style="font-size: 1.5em; color: #FFB800;">+${payout.toFixed(2)} eGold <small style="color: #2ecc71;">($${(payout * 0.10).toFixed(2)})</small></span>`;
            } else {
                soundManager.playLoss();
                
                const resultDiv = document.getElementById('coinResult');
                resultDiv.className = 'game-result loss-effect';
                resultDiv.innerHTML = `<span style="font-size: 1.4em;">It's ${result.toUpperCase()}</span><br><span style="font-size: 1.2em;">💔 Better luck next time!</span>`;
            }
        }, 1500);
    }
};

window.coinflipGame = coinflipGame;
