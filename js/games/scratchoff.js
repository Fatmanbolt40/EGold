// Scratch Off Game
const scratchoffGame = {
    ticketCost: 10,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 1.8em; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">🎫 INSTANT WIN SCRATCHERS 🎫</h3>
                    
                    <div id="scratchCard" style="background: linear-gradient(135deg, #FFB800 0%, #d4af37 100%); border-radius: 20px; padding: 40px; max-width: 450px; margin: 20px auto; box-shadow: 0 8px 32px rgba(255, 184, 0, 0.4); position: relative;">
                        <div style="color: #1A2332; font-size: 2.2em; font-weight: bold; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">🎟️ eGold Lottery</div>
                        <div id="scratchArea" style="background: linear-gradient(135deg, #cccccc 0%, #999999 100%); border-radius: 15px; padding: 40px; cursor: pointer; user-select: none; box-shadow: inset 0 4px 8px rgba(0,0,0,0.3); transition: all 0.3s ease;">
                            <div style="color: #666; font-size: 1.8em; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">👆 Click to Scratch!</div>
                        </div>
                    </div>
                </div>
                
                <button onclick="scratchoffGame.buy()" class="game-button" style="font-size: 1.4em; padding: 18px 50px;">
                    🎫 Buy Ticket (10 eGold)
                </button>
                
                <div id="scratchResult" class="game-result"></div>
                
                <div class="game-info-box">
                    <h3>👑 Instant Win Scratchers</h3>
                    <p style="font-size: 1.1em; color: #cccccc; margin: 10px 0;">Click-to-reveal scratch cards with animated prizes and instant wins</p>
                    <h4 style="color: #FFB800; margin-top: 20px;">💎 Possible Prizes</h4>
                    <div style="display: grid; gap: 10px; margin-top: 15px;">
                        <div style="padding: 12px; background: linear-gradient(135deg, rgba(255, 184, 0, 0.2), rgba(212, 175, 55, 0.2)); border-radius: 8px; border: 2px solid #FFB800;">
                            💎 Jackpot: <b style="color: #FFB800; font-size: 1.3em;">500 eGold</b> <small style="color: #2ecc71;">($50 USD)</small> - <span style="color: #888;">1% chance</span>
                        </div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 5px;">⭐ Big Win: <b>100 eGold</b> <small style="color: #2ecc71;">($10 USD)</small> - <span style="color: #888;">2% chance</span></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 5px;">🎯 Good Win: <b>50 eGold</b> <small style="color: #2ecc71;">($5 USD)</small> - <span style="color: #888;">5% chance</span></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 5px;">🎁 Nice: <b>25 eGold</b> <small style="color: #2ecc71;">($2.50 USD)</small> - <span style="color: #888;">8% chance</span></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 5px;">💰 Win: <b>15 eGold</b> <small style="color: #2ecc71;">($1.50 USD)</small> - <span style="color: #888;">14% chance</span></div>
                        <div style="padding: 8px; background: rgba(231, 76, 60, 0.1); border-radius: 5px; color: #e74c3c;">😢 Better Luck Next Time - <span style="color: #888;">70% chance</span></div>
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 2px solid #2ecc71;">
                        <h4 style="color: #2ecc71; margin-bottom: 10px;">📜 Game Rules</h4>
                        <ul style="text-align: left; max-width: 450px; margin: 0 auto; color: #cccccc; line-height: 1.8;">
                            <li>Purchase a scratch card for <b>10 eGold</b></li>
                            <li><b>Click</b> the silver area to scratch and reveal</li>
                            <li>Prize revealed with animations</li>
                            <li>Win up to <b style="color: #FFB800;">500 eGold!</b></li>
                            <li>30% overall win rate</li>
                            <li>Instant payout on wins</li>
                            <li>Buy another card to play again</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },
    
    buy() {
        if (balance < this.ticketCost) {
            document.getElementById('scratchResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            soundManager.playButtonClick();
            return;
        }
        
        // Play chip sound
        soundManager.playChipSound();
        
        updateBalance(-this.ticketCost);
        
        // House edge: 50% more losing tickets
        const outcomes = [
            { symbol: '💎', prize: 500, chance: 0.01 },
            { symbol: '⭐', prize: 100, chance: 0.02 },
            { symbol: '🎯', prize: 50, chance: 0.05 },
            { symbol: '🎁', prize: 25, chance: 0.08 },
            { symbol: '💰', prize: 15, chance: 0.14 },
            { symbol: '😢', prize: 0, chance: 0.70 }  // 70% chance of losing
        ];
        
        const random = Math.random();
        let cumulative = 0;
        let result = outcomes[outcomes.length - 1];
        
        for (const outcome of outcomes) {
            cumulative += outcome.chance;
            if (random <= cumulative) {
                result = outcome;
                break;
            }
        }
        
        const scratchArea = document.getElementById('scratchArea');
        
        // Animate scratching
        scratchArea.style.transition = 'all 1s ease';
        scratchArea.style.background = result.prize > 0 ? 'linear-gradient(135deg, #2ecc71, #27ae60)' : 'linear-gradient(135deg, #e74c3c, #c0392b)';
        scratchArea.innerHTML = `
            <div class="animate-zoom" style="font-size: 4em; margin: 10px 0; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));">${result.symbol}</div>
            <div class="animate-bounce" style="color: white; font-size: 1.8em; font-weight: bold; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">
                ${result.prize > 0 ? result.prize + ' eGold!' : 'Try Again!'}
            </div>
        `;
        
        if (result.prize > 0) {
            updateBalance(result.prize);
            const resultDiv = document.getElementById('scratchResult');
            resultDiv.className = 'game-result win-effect';
            
            if (result.prize >= 100) {
                soundManager.playJackpot();
                particleSystem.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 120);
                resultDiv.classList.add('jackpot-effect');
                resultDiv.innerHTML = `<span style="font-size: 2em;">💫 JACKPOT! 💫</span><br><span style="font-size: 1.6em;">You won ${result.prize} eGold! <small style="color: #2ecc71;">($${(result.prize * 0.10).toFixed(2)})</small></span>`;
            } else {
                soundManager.playWin();
                particleSystem.createCoinBurst(window.innerWidth / 2, window.innerHeight / 2, result.prize);
                resultDiv.innerHTML = `<span style="font-size: 1.8em;">🎉 You won ${result.prize} eGold! <small style="color: #2ecc71;">($${(result.prize * 0.10).toFixed(2)})</small></span>`;
            }
        } else {
            soundManager.playLoss();
            const resultDiv = document.getElementById('scratchResult');
            resultDiv.className = 'game-result loss-effect';
            resultDiv.innerHTML = '<span style="font-size: 1.3em;">💔 Better luck next time!</span>';
        }
        
        // Reset after 3 seconds
        setTimeout(() => {
            this.init();
            document.getElementById('scratchResult').innerHTML = '';
        }, 3000);
    }
};

window.scratchoffGame = scratchoffGame;
