// Scratch Off Game
const scratchoffGame = {
    ticketCost: 10,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #FFB800; font-size: 1.5em; margin-bottom: 20px;">Scratch Off Ticket</h3>
                
                <div id="scratchCard" style="background: #FFB800; border-radius: 15px; padding: 40px; max-width: 400px; margin: 20px auto; position: relative;">
                    <div style="color: #1A2332; font-size: 2em; font-weight: bold; margin-bottom: 20px;">🎟️ eGold Lottery</div>
                    <div id="scratchArea" style="background: #cccccc; border-radius: 10px; padding: 30px; cursor: pointer; user-select: none;">
                        <div style="color: #666; font-size: 1.5em;">Click to Scratch!</div>
                    </div>
                </div>
                
                <button onclick="scratchoffGame.buy()" style="padding: 15px 40px; font-size: 1.3em; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer; margin: 20px 0;">
                    Buy Ticket (10 eGold)
                </button>
                
                <div id="scratchResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; margin-bottom: 10px;">Possible Prizes</h3>
                    <div style="color: #cccccc;">
                        <p>💎 Jackpot: 500 eGold</p>
                        <p>⭐ Big Win: 100 eGold</p>
                        <p>🎯 Good Win: 50 eGold</p>
                        <p>🎁 Nice: 25 eGold</p>
                        <p>💰 Win: 15 eGold</p>
                        <p>😢 Better Luck Next Time</p>
                    </div>
                </div>
            </div>
        `;
    },
    
    buy() {
        if (balance < this.ticketCost) {
            document.getElementById('scratchResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
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
        scratchArea.style.background = result.prize > 0 ? '#2ecc71' : '#e74c3c';
        scratchArea.innerHTML = `
            <div style="font-size: 3em; margin: 10px 0;">${result.symbol}</div>
            <div style="color: white; font-size: 1.5em; font-weight: bold;">
                ${result.prize > 0 ? result.prize + ' eGold!' : 'Try Again!'}
            </div>
        `;
        
        if (result.prize > 0) {
            updateBalance(result.prize);
            document.getElementById('scratchResult').innerHTML = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 You won ${result.prize} eGold!</span>`;
        } else {
            document.getElementById('scratchResult').innerHTML = '<span style="color: #e74c3c;">Better luck next time!</span>';
        }
        
        // Reset after 3 seconds
        setTimeout(() => {
            this.init();
            document.getElementById('scratchResult').innerHTML = '';
        }, 3000);
    }
};

window.scratchoffGame = scratchoffGame;
