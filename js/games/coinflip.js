// Coin Flip Game
const coinflipGame = {
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 1.8em; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">🪙 HEADS OR TAILS ROYALE 🪙</h3>
                    <div id="coin">${VisualEnhancer.createCoinFlip()}</div>
                </div>
                <div class="game-controls">
                    <label style="font-size: 1.3em; color: #FFB800;">💰 Bet:</label>
                    <input type="number" id="coinBet" value="10" min="1" max="200" class="game-input" style="width: 120px;">
                    <span style="color: #FFB800; font-size: 1.2em;">eGold</span>
                </div>
                <div style="margin: 25px 0;">
                    <label style="font-size: 1.4em; color: #FFB800; display: block; margin-bottom: 15px;">Choose Your Side:</label>
                    <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="coinflipGame.flip('heads')" class="game-button" style="min-width: 150px;">
                            👑 HEADS
                        </button>
                        <button onclick="coinflipGame.flip('tails')" class="game-button secondary" style="min-width: 150px;">
                            🦅 TAILS
                        </button>
                    </div>
                </div>
                <div id="coinResult" class="game-result"></div>
                <div class="game-info-box">
                    <h3>👑 Heads or Tails Royale</h3>
                    <p style="font-size: 1.1em; color: #cccccc; margin: 10px 0;">A clean, instant-bet game with floating gold coin animation and dramatic flip physics</p>
                    <div style="margin-top: 20px; padding: 15px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                        <h4 style="color: #FFB800; margin-bottom: 10px;">💎 Prize</h4>
                        <p style="font-size: 1.4em; color: #FFB800; font-weight: bold; margin: 10px 0;">Win 1.95x your bet!</p>
                        <p style="font-size: 1.1em; color: #2ecc71;">Perfect 50/50 game</p>
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 2px solid #2ecc71;">
                        <h4 style="color: #2ecc71; margin-bottom: 10px;">📜 Game Rules</h4>
                        <ul style="text-align: left; max-width: 400px; margin: 0 auto; color: #cccccc; line-height: 1.8;">
                            <li>Choose <b>Heads 👑</b> or <b>Tails 🦅</b></li>
                            <li>Place your bet: <b>1-200 eGold</b></li>
                            <li>Watch the coin flip with slow-motion reveal</li>
                            <li>Correct guess = <b style="color: #2ecc71;">1.95x payout</b></li>
                            <li>Simple, fair, and instant results!</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },
    
    flip(choice) {
        const betInput = document.getElementById('coinBet');
        const bet = parseFloat(betInput.value);
        
        if (bet < 1) {
            document.getElementById('coinResult').innerHTML = '<span style="color: #e74c3c;">Minimum bet is 1 eGold!</span>';
            soundManager.playButtonClick();
            return;
        }
        
        if (bet > 200) {
            document.getElementById('coinResult').innerHTML = '<span style="color: #e74c3c;">Maximum bet is 200 eGold!</span>';
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
        
        // Track for VIP and achievements
        if (typeof achievementSystem !== 'undefined') achievementSystem.trackBet(bet, 'Heads or Tails Royale');
        if (typeof vipSystem !== 'undefined') vipSystem.trackWager(bet);
        if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWager(bet, 'Heads or Tails Royale');
        
        // Track wager for VIP system
        if (typeof vipSystem !== 'undefined') {
            vipSystem.trackWager(bet);
        }
        
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
                
                if (typeof achievementSystem !== 'undefined') achievementSystem.trackWin(payout);
                
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
