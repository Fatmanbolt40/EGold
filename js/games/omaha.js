// Omaha Poker (4 hole cards)
const omahaGame = {
    ante: 10,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #FFB800; font-size: 1.5em; margin-bottom: 20px;">Omaha Poker</h3>
                <p style="color: #cccccc; margin-bottom: 20px;">4 hole cards - Use exactly 2 from hand + 3 from board</p>
                
                <div style="margin: 20px 0;">
                    <div style="background: rgba(255, 184, 0, 0.1); padding: 15px; border-radius: 10px; display: inline-block;">
                        <p style="color: #FFB800; font-size: 1.2em;">Ante: ${this.ante} eGold</p>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4 style="color: #FFB800;">Dealer's Hand (4 cards)</h4>
                    <div id="dealerHand" style="font-size: 2em; margin: 10px 0;">🂠 🂠 🂠 🂠</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4 style="color: #FFB800;">Community Cards</h4>
                    <div id="communityCards" style="font-size: 2.5em; margin: 10px 0;">🂠 🂠 🂠 🂠 🂠</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4 style="color: #FFB800;">Your Hand (4 cards)</h4>
                    <div id="playerHand" style="font-size: 2em; margin: 10px 0;">🂠 🂠 🂠 🂠</div>
                </div>
                
                <button onclick="omahaGame.play()" style="padding: 15px 40px; font-size: 1.3em; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer; margin: 20px 0;">
                    Play Hand (${this.ante} eGold)
                </button>
                
                <div id="omahaResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
            </div>
        `;
    },
    
    play() {
        if (balance < this.ante) {
            document.getElementById('omahaResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-this.ante);
        
        // Simplified - dealer has advantage
        const playerScore = Math.random() * 100;
        const dealerScore = Math.random() * 100 + 5; // House edge
        
        // Show placeholder cards
        document.getElementById('playerHand').textContent = 'A♠ K♠ Q♦ J♦';
        document.getElementById('dealerHand').textContent = 'K♥ Q♥ J♣ 10♣';
        document.getElementById('communityCards').textContent = '10♠ 9♠ 8♠ 7♥ 6♦';
        
        if (playerScore > dealerScore) {
            const payout = this.ante * 2;
            updateBalance(payout);
            document.getElementById('omahaResult').innerHTML = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 YOU WIN! +${payout} eGold</span>`;
        } else {
            document.getElementById('omahaResult').innerHTML = '<span style="color: #e74c3c;">Dealer wins. Try again!</span>';
        }
    }
};

window.omahaGame = omahaGame;
