// Pineapple Poker (3 cards, discard 1)
const pineappleGame = {
    ante: 10,
    
    init() {
        // Show game mode selector
        PVPSystem.showGameModeSelector('pineapple', 'Pineapple Poker');
    },
    
    initSolo() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #FFB800; font-size: 1.5em; margin-bottom: 20px;">Pineapple Poker</h3>
                <p style="color: #cccccc; margin-bottom: 20px;">Start with 3 cards - Discard 1 after flop</p>
                
                <div style="margin: 20px 0;">
                    <div style="background: rgba(255, 184, 0, 0.1); padding: 15px; border-radius: 10px; display: inline-block;">
                        <p style="color: #FFB800; font-size: 1.2em;">Ante: ${this.ante} eGold</p>
                    </div>
                </div>
                
                <!-- Poker Table -->
                <div style="background: linear-gradient(135deg, #1a5f1a 0%, #0d4a0d 100%); padding: 40px; border-radius: 20px; border: 5px solid #8B4513; box-shadow: 0 10px 40px rgba(0,0,0,0.5); max-width: 900px; margin: 30px auto;">
                    <div style="margin: 20px 0;">
                        <h4 style="color: #FFB800; margin-bottom: 10px;">Dealer's Hand</h4>
                        <div id="dealerHand">
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                        </div>
                    </div>
                    
                    <div style="margin: 30px 0;">
                        <h4 style="color: #FFB800; margin-bottom: 10px;">Community Cards</h4>
                        <div id="communityCards">
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                        </div>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h4 style="color: #FFB800; margin-bottom: 10px;">Your Hand</h4>
                        <div id="playerHand">
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                        </div>
                    </div>
                </div>
                
                <button onclick="pineappleGame.play()" style="padding: 15px 40px; font-size: 1.3em; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer; margin: 20px 0;">
                    Play Hand (${this.ante} eGold)
                </button>
                
                <div id="pineappleResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
            </div>
        `;
    },
    
    play() {
        if (balance < this.ante) {
            document.getElementById('pineappleResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-this.ante);
        
        // Simplified - dealer has advantage
        const playerScore = Math.random() * 100;
        const dealerScore = Math.random() * 100 + 5; // House edge
        
        // Show actual cards
        document.getElementById('playerHand').innerHTML = 
            VisualEnhancer.createCard('A', 'spades') + 
            VisualEnhancer.createCard('K', 'spades');
        document.getElementById('dealerHand').innerHTML = 
            VisualEnhancer.createCard('Q', 'hearts') + 
            VisualEnhancer.createCard('J', 'hearts');
        document.getElementById('communityCards').innerHTML = 
            VisualEnhancer.createCard('10', 'spades') + 
            VisualEnhancer.createCard('9', 'spades') + 
            VisualEnhancer.createCard('8', 'spades') + 
            VisualEnhancer.createCard('7', 'hearts') + 
            VisualEnhancer.createCard('6', 'diamonds');
        
        if (playerScore > dealerScore) {
            const payout = this.ante * 2;
            updateBalance(payout);
            document.getElementById('pineappleResult').innerHTML = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 YOU WIN! +${payout} eGold</span>`;
        } else {
            document.getElementById('pineappleResult').innerHTML = '<span style="color: #e74c3c;">Dealer wins. Try again!</span>';
        }
    },
    
    initPVP(room) {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #7B68EE; font-size: 1.8em;">👥 PVP Pineapple Poker</h3>
                    <p style="color: #FFB800; font-size: 1.2em;">Pot: ${room.bet * 2} eGold</p>
                </div>
                
                <div style="margin: 30px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 600px; margin: 30px auto;">
                    <div style="padding: 20px; background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c; border-radius: 10px;">
                        <h4 style="color: #e74c3c;">🤖 Opponent</h4>
                        <div style="font-size: 2em; margin: 10px 0;">🂠 🂠</div>
                    </div>
                    <div style="padding: 20px; background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71; border-radius: 10px;">
                        <h4 style="color: #2ecc71;">😊 You</h4>
                        <div id="pvpPlayerHandPine" style="font-size: 2em; margin: 10px 0;">🂠 🂠</div>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4 style="color: #FFB800;">Community Cards</h4>
                    <div id="pvpCommunityPine" style="font-size: 2.5em;">🂠 🂠 🂠 🂠 🂠</div>
                </div>
                
                <button onclick="pineappleGame.playPVP(${room.bet})" class="game-button">🎮 Play Hand</button>
                <div id="pvpResultPine" style="margin-top: 20px; font-size: 1.3em;"></div>
            </div>
        `;
    },
    
    playPVP(bet) {
        const playerScore = Math.random() * 1000;
        const opponentScore = Math.random() * 1000;
        
        document.getElementById('pvpPlayerHandPine').innerText = 'A♠ K♠';
        document.getElementById('pvpCommunityPine').innerText = '10♠ 9♠ 8♠ 7♥ 6♦';
        
        const resultDiv = document.getElementById('pvpResultPine');
        setTimeout(() => {
            const opponentDiv = document.querySelector('[style*="rgba(231, 76, 60"]').querySelector('div[style*="font-size: 2em"]');
            opponentDiv.innerText = 'Q♥ J♥';
            
            if (playerScore > opponentScore) {
                updateBalance(bet * 2);
                resultDiv.innerHTML = `<div class="game-result win"><h3>🎉 YOU WIN!</h3><p>+${bet * 2} eGold</p></div>`;
            } else if (playerScore === opponentScore) {
                updateBalance(bet);
                resultDiv.innerHTML = `<div class="game-result" style="background: rgba(255, 184, 0, 0.2); border-color: #FFB800;"><h3 style="color: #FFB800;">🤝 TIE!</h3><p>Bet returned</p></div>`;
            } else {
                resultDiv.innerHTML = `<div class="game-result lose"><h3>😔 YOU LOSE</h3><p>-${bet} eGold</p></div>`;
            }
        }, 1000);
    }
};

window.pineappleGame = pineappleGame;
