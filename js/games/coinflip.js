// Coin Flip Game

let coinFlipGame;

function initCoinFlip(container) {
    coinFlipGame = new CoinFlipGame();
    coinFlipGame.init(container);
}

class CoinFlipGame {
    constructor() {
        this.isFlipping = false;
        this.liveGameId = null;
        this.selectedSide = null;
    }

    init(container) {
        // Create live game entry
        const initialBet = 10;
        this.liveGameId = liveGamesManager.createGame(
            'coinflip',
            leaderboard.playerName || 'Player',
            initialBet,
            { side: 'none' }
        ).id;

        container.innerHTML = `
            <div class="coin-flip-container">
                <div class="game-info">
                    <h3>Coin Flip</h3>
                    <p>Choose Heads or Tails and flip to double your bet!</p>
                    <p>Win Chance: 50% | Payout: 2x</p>
                    <div style="color: #3498db; margin-top: 10px;">
                        <span id="spectatorCount">0</span> spectators watching 👁️
                    </div>
                </div>

                <div class="coin" id="coin" style="
                    width: 200px;
                    height: 200px;
                    margin: 40px auto;
                    position: relative;
                    transform-style: preserve-3d;
                    transition: transform 2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                ">
                    <div class="coin-face" style="
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #ffd700, #ffed4e, #ffd700);
                        border-radius: 50%;
                        box-shadow: 0 10px 40px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3);
                        border: 5px solid #b8860b;
                    ">
                        <span id="coinSymbol" style="font-size: 6rem;">🪙</span>
                    </div>
                </div>

                <div class="betting-setup" style="max-width: 500px; margin: 30px auto;">
                    <div class="form-group">
                        <label>Choose Side:</label>
                        <div style="display: flex; gap: 20px; justify-content: center; margin: 15px 0;">
                            <button onclick="coinFlipGame.selectSide('heads')" class="bet-btn" id="headsBtn" style="flex: 1;">
                                👑 Heads
                            </button>
                            <button onclick="coinFlipGame.selectSide('tails')" class="bet-btn" id="tailsBtn" style="flex: 1;">
                                🦅 Tails
                            </button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="flipBet">Bet Amount (eGold):</label>
                        <input type="number" id="flipBet" min="1" max="${currentBalance}" value="10" step="1">
                    </div>

                    <button onclick="coinFlipGame.flip()" class="btn-play" id="flipBtn" disabled>Flip Coin</button>
                </div>

                <div id="flipResult" class="game-message"></div>
            </div>
        `;

        this.selectedSide = null;
        this.container = container;
    }

    selectSide(side) {
        this.selectedSide = side;
        document.getElementById('headsBtn').style.background = side === 'heads' ? '#d4af37' : 'rgba(212, 175, 55, 0.1)';
        document.getElementById('tailsBtn').style.background = side === 'tails' ? '#d4af37' : 'rgba(212, 175, 55, 0.1)';
        document.getElementById('flipBtn').disabled = false;
    }

    async flip() {
        if (this.isFlipping || !this.selectedSide) return;

        const betAmount = parseFloat(document.getElementById('flipBet').value);
        
        if (betAmount > currentBalance) {
            this.showResult('Insufficient balance!', false);
            return;
        }

        if (betAmount <= 0) {
            this.showResult('Invalid bet amount!', false);
            return;
        }

        this.isFlipping = true;
        updateBalance(-betAmount);
        document.getElementById('flipBtn').disabled = true;

        // Update live game
        liveGamesManager.updateGameState(this.liveGameId, { side: this.selectedSide, bet: betAmount });

        // Advanced 3D coin flip animation
        const coin = document.getElementById('coin');
        const coinSymbol = document.getElementById('coinSymbol');
        
        // Add energy effect before flip
        const coinRect = coin.getBoundingClientRect();
        advancedEffects.shockwave(coinRect.left + coinRect.width / 2, coinRect.top + coinRect.height / 2, '#ffd700');
        
        // Spin the coin with 3D rotation
        const spins = 10 + Math.floor(Math.random() * 5);
        coin.style.transform = `rotateY(${spins * 360}deg) rotateX(${Math.random() * 360}deg)`;
        coinSymbol.textContent = '🌟';

        // Determine result
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        
        await new Promise(resolve => setTimeout(resolve, 2200));
        
        // Reset and show result
        coin.style.transition = 'transform 500ms ease-out';
        coin.style.transform = 'rotateY(0deg) rotateX(0deg)';
        
        // Update coin appearance based on result
        setTimeout(() => {
            coinSymbol.textContent = result === 'heads' ? '👑' : '🦅';
            coin.querySelector('.coin-face').style.background = result === 'heads'
                ? 'linear-gradient(135deg, #ffd700, #ffed4e, #ffd700)'
                : 'linear-gradient(135deg, #c0c0c0, #e8e8e8, #c0c0c0)';
        }, 250);
        
        // Show result
        const won = result === this.selectedSide;
        
        if (won) {
            updateBalance(betAmount * 2);
            this.showResult(`${result.toUpperCase()}! You won ${betAmount * 2} eGold!`, true);
            
            // Epic win effects
            setTimeout(() => {
                const coinRect = coin.getBoundingClientRect();
                advancedEffects.explosion(coinRect.left + coinRect.width / 2, coinRect.top + coinRect.height / 2, 60, ['#ffd700', '#ffed4e', '#ff6b6b']);
                advancedEffects.holographicGlow(coin, 3000);
                effects.createConfetti(document.body);
                effects.floatingText(window.innerWidth / 2, window.innerHeight / 2, `+${betAmount * 2} eGold!`, '#2ecc71', '3rem');
                effects.coinRain(1500);
            }, 300);
            
            await bettingSystem.placeBet('coinflip', betAmount, { choice: this.selectedSide, result: result, won: true });
            
            // Resolve side bets
            sideBetSystem.resolveCoinflipBets(this.liveGameId, result);
        } else {
            this.showResult(`${result.toUpperCase()}! You lost ${betAmount} eGold.`, false);
            effects.shake(coin);
            
            // Loss effect
            const coinRect = coin.getBoundingClientRect();
            advancedEffects.shockwave(coinRect.left + coinRect.width / 2, coinRect.top + coinRect.height / 2, '#e74c3c');
            
            await bettingSystem.placeBet('coinflip', betAmount, { choice: this.selectedSide, result: result, won: false });
            
            // Resolve side bets
            sideBetSystem.resolveCoinflipBets(this.liveGameId, result);
        }

        this.isFlipping = false;
        document.getElementById('flipBtn').disabled = false;
    }

    showResult(message, won) {
        const resultDiv = document.getElementById('flipResult');
        resultDiv.textContent = message;
        resultDiv.style.color = won ? '#2ecc71' : '#e74c3c';
    }
}
