// Tonk Card Game
const tonkGame = {
    ante: 10,
    
    init() {
        // Show game mode selector
        PVPSystem.showGameModeSelector('tonk', 'Tonk');
    },
    
    initSolo() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #FFB800; font-size: 1.5em; margin-bottom: 20px;">Tonk</h3>
                <p style="color: #cccccc; margin-bottom: 20px;">Get closest to 49 without going over</p>
                
                <div style="margin: 20px 0;">
                    <div style="background: rgba(255, 184, 0, 0.1); padding: 15px; border-radius: 10px; display: inline-block;">
                        <p style="color: #FFB800; font-size: 1.2em;">Ante: ${this.ante} eGold</p>
                    </div>
                </div>
                
                <!-- Card Table -->
                <div style="background: linear-gradient(135deg, #1a5f1a 0%, #0d4a0d 100%); padding: 40px; border-radius: 20px; border: 5px solid #8B4513; box-shadow: 0 10px 40px rgba(0,0,0,0.5); max-width: 900px; margin: 30px auto;">
                    <div style="margin: 20px 0;">
                        <h4 style="color: #FFB800; margin-bottom: 10px;">Dealer's Hand</h4>
                        <div id="dealerHand">
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                        </div>
                        <div id="dealerScore" style="font-size: 1.5em; color: #FFB800; margin-top: 10px;">Score: ???</div>
                    </div>
                    
                    <div style="margin: 30px 0; padding: 20px; background: rgba(255, 184, 0, 0.15); border-radius: 12px;">
                        <h4 style="color: #FFB800;">Target: Get closest to 49 without going over!</h4>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <h4 style="color: #FFB800; margin-bottom: 10px;">Your Hand</h4>
                        <div id="playerHand">
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                        </div>
                        <div id="playerScore" style="font-size: 1.5em; color: #FFB800; margin-top: 10px;">Score: ???</div>
                    </div>
                </div>
                
                <button onclick="tonkGame.play()" style="padding: 15px 40px; font-size: 1.3em; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer; margin: 20px 0;">
                    Play Hand (${this.ante} eGold)
                </button>
                
                <div id="tonkResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; margin-bottom: 15px;">👑 Tonk Royale</h3>
                    <p style="font-size: 1.1em; color: #cccccc; margin-bottom: 15px;">Classic rummy-style card game - get closest to 49 without busting</p>
                    <h4 style="color: #FFB800; margin-bottom: 10px;">🎴 Card Values</h4>
                    <div style="color: #cccccc; line-height: 1.8; margin-bottom: 15px;">
                        <p><b>Face cards (J, Q, K):</b> 10 points each</p>
                        <p><b>Aces:</b> 1 point</p>
                        <p><b>Number cards:</b> Face value (2-10)</p>
                    </div>
                    <div style="margin-top: 15px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 2px solid #2ecc71;">
                        <h4 style="color: #2ecc71; margin-bottom: 10px;">📜 Game Rules</h4>
                        <ul style="text-align: left; max-width: 450px; margin: 0 auto; color: #cccccc; line-height: 1.8;">
                            <li>Pay ante (<b>${this.ante} eGold</b>)</li>
                            <li>Both players dealt <b>3 cards</b></li>
                            <li>Goal: Get closest to <b style="color: #FFB800;">49 points</b></li>
                            <li><b>Don't bust!</b> Over 49 = automatic loss</li>
                            <li>Beat dealer's score to win</li>
                            <li><b>Dealer wins ties</b> (house advantage)</li>
                            <li>Win pays <b style="color: #FFB800;">2x ante!</b></li>
                            <li>Strategic card values like Blackjack</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },
    
    play() {
        if (balance < this.ante) {
            document.getElementById('tonkResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-this.ante);
        
        // Deal cards
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const suits = ['♠', '♥', '♦', '♣'];
        
        const getCard = () => ({
            value: values[Math.floor(Math.random() * values.length)],
            suit: suits[Math.floor(Math.random() * suits.length)]
        });
        
        const getScore = (cards) => {
            return cards.reduce((sum, card) => {
                if (card.value === 'A') return sum + 1;
                if (['J', 'Q', 'K'].includes(card.value)) return sum + 10;
                return sum + parseInt(card.value);
            }, 0);
        };
        
        const playerCards = [getCard(), getCard(), getCard()];
        const dealerCards = [getCard(), getCard(), getCard()];
        
        const playerScore = getScore(playerCards);
        const dealerScore = getScore(dealerCards);
        
        // Display
        document.getElementById('playerHand').textContent = 
            playerCards.map(c => `${c.value}${c.suit}`).join(' ');
        document.getElementById('playerScore').textContent = `Score: ${playerScore}`;
        
        document.getElementById('dealerHand').textContent = 
            dealerCards.map(c => `${c.value}${c.suit}`).join(' ');
        document.getElementById('dealerScore').textContent = `Score: ${dealerScore}`;
        
        // Determine winner
        const playerBust = playerScore > 49;
        const dealerBust = dealerScore > 49;
        
        let result = '';
        if (playerBust && dealerBust) {
            result = '<span style="color: #FFB800;">Both bust - Dealer wins (house rule)</span>';
        } else if (playerBust) {
            result = '<span style="color: #e74c3c;">You bust! Dealer wins.</span>';
        } else if (dealerBust) {
            const payout = this.ante * 2;
            updateBalance(payout);
            result = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 Dealer busts! YOU WIN! +${payout} eGold</span>`;
        } else {
            const diff = Math.abs(49 - playerScore);
            const dealerDiff = Math.abs(49 - dealerScore);
            
            if (diff < dealerDiff) {
                const payout = this.ante * 2;
                updateBalance(payout);
                result = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 YOU WIN! +${payout} eGold</span>`;
            } else if (diff === dealerDiff) {
                result = '<span style="color: #FFB800;">Tie - Dealer wins (house rule)</span>';
            } else {
                result = '<span style="color: #e74c3c;">Dealer wins. Try again!</span>';
            }
        }
        
        document.getElementById('tonkResult').innerHTML = result;
    },
    
    initPVP(room) {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #7B68EE; font-size: 1.8em;">👥 PVP Tonk</h3>
                    <p style="color: #FFB800; font-size: 1.2em;">Pot: ${room.bet * 2} eGold</p>
                </div>
                
                <div style="margin: 30px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 600px; margin: 30px auto;">
                    <div style="padding: 20px; background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c; border-radius: 10px;">
                        <h4 style="color: #e74c3c;">🤖 Opponent</h4>
                        <div style="font-size: 2.5em; margin: 10px 0;">🂠 🂠 🂠 🂠 🂠</div>
                        <p id="pvpOppScore" style="color: #cccccc; margin-top: 10px;">Score: ?</p>
                    </div>
                    <div style="padding: 20px; background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71; border-radius: 10px;">
                        <h4 style="color: #2ecc71;">😊 You</h4>
                        <div id="pvpPlayerHandTonk" style="font-size: 2.5em; margin: 10px 0;">🂠 🂠 🂠 🂠 🂠</div>
                        <p id="pvpYourScore" style="color: #cccccc; margin-top: 10px;">Score: ?</p>
                    </div>
                </div>
                
                <button onclick="tonkGame.playPVP(${room.bet})" class="game-button">🎮 Play Hand</button>
                <div id="pvpResultTonk" style="margin-top: 20px; font-size: 1.3em;"></div>
            </div>
        `;
    },
    
    playPVP(bet) {
        // Random scores near 49
        const playerScore = 30 + Math.floor(Math.random() * 25);
        const opponentScore = 30 + Math.floor(Math.random() * 25);
        
        const playerDiff = Math.abs(49 - playerScore);
        const opponentDiff = Math.abs(49 - opponentScore);
        
        document.getElementById('pvpPlayerHandTonk').innerText = '10♠ 9♠ 8♠ 7♥ 6♦';
        document.getElementById('pvpYourScore').innerText = `Score: ${playerScore}`;
        
        const resultDiv = document.getElementById('pvpResultTonk');
        setTimeout(() => {
            const opponentDiv = document.querySelector('[style*="rgba(231, 76, 60"]').querySelector('div[style*="font-size: 2.5em"]');
            opponentDiv.innerText = 'K♥ Q♥ J♣ 10♣ 9♥';
            document.getElementById('pvpOppScore').innerText = `Score: ${opponentScore}`;
            
            if (playerDiff < opponentDiff) {
                updateBalance(bet * 2);
                resultDiv.innerHTML = `<div class="game-result win"><h3>🎉 YOU WIN!</h3><p>+${bet * 2} eGold</p><p style="font-size: 0.9em;">Closer to 49!</p></div>`;
            } else if (playerDiff === opponentDiff) {
                updateBalance(bet);
                resultDiv.innerHTML = `<div class="game-result" style="background: rgba(255, 184, 0, 0.2); border-color: #FFB800;"><h3 style="color: #FFB800;">🤝 TIE!</h3><p>Bet returned</p></div>`;
            } else {
                resultDiv.innerHTML = `<div class="game-result lose"><h3>😔 YOU LOSE</h3><p>-${bet} eGold</p><p style="font-size: 0.9em;">Opponent was closer!</p></div>`;
            }
        }, 1000);
    }
};

window.tonkGame = tonkGame;
