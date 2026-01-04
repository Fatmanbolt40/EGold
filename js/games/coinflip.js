// Coin Flip Game
const coinflipGame = {
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div id="coin" style="font-size: 8em; margin: 30px 0;">🪙</div>
                <div style="margin: 20px 0;">
                    <label style="font-size: 1.2em;">Bet Amount: </label>
                    <input type="number" id="coinBet" value="5" min="5" max="500" style="padding: 10px; font-size: 1.1em; border-radius: 5px; border: 2px solid #FFB800; background: #2A3544; color: #FFB800; width: 100px;">
                    <span style="color: #FFB800;"> eGold</span>
                </div>
                <div style="margin: 20px 0;">
                    <label style="font-size: 1.2em; display: block; margin-bottom: 10px;">Choose Side:</label>
                    <div style="display: flex; gap: 20px; justify-content: center;">
                        <button onclick="coinflipGame.flip('heads')" style="padding: 15px 40px; font-size: 1.2em; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer;">
                            HEADS
                        </button>
                        <button onclick="coinflipGame.flip('tails')" style="padding: 15px 40px; font-size: 1.2em; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer;">
                            TAILS
                        </button>
                    </div>
                </div>
                <div id="coinResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <p style="color: #FFB800;">Win 1.95x your bet!</p>
                    <p style="color: #cccccc; font-size: 0.9em; margin-top: 10px;">Simple 50/50 game - pick your side!</p>
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
                    const payout = bet * 1.95; // House edge: 1.95x instead of 2x
                    updateBalance(payout);
                    document.getElementById('coinResult').innerHTML = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 WIN! It's ${result}! +${payout.toFixed(2)} eGold</span>`;
                } else {
                    document.getElementById('coinResult').innerHTML = `<span style="color: #e74c3c;">It's ${result}. Try again!</span>`;
                }
            }
        }, 150);
    }
};

window.coinflipGame = coinflipGame;
