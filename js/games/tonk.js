// Royal Tonk Card Game - Enhanced Professional Version
const tonkGame = {
    ante: 10,
    gameActive: false,
    playerCards: [],
    dealerCards: [],
    
    init() {
        // Show game mode selector
        if (typeof PVPSystem !== 'undefined') {
            PVPSystem.showGameModeSelector('tonk', 'Royal Tonk');
        } else {
            this.initSolo();
        }
    },
    
    initSolo() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div class="game-container" style="max-width: 1000px; margin: 0 auto; padding: 20px;">
                <!-- Game Header -->
                <div class="game-header" style="
                    background: linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c);
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 30px;
                    text-align: center;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                    border: 2px solid #FFD700;
                ">
                    <h1 style="color: #FFD700; font-size: 2.5em; margin-bottom: 10px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                        🃏 Royal Tonk
                    </h1>
                    <p style="color: #fff; font-size: 1.2em;">Classic Rummy-Style Card Game</p>
                </div>
                
                <!-- Game Status -->
                <div class="game-status" style="
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: 10px;
                    padding: 15px;
                    margin-bottom: 25px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid #4A90A4;
                ">
                    <div style="color: #FFD700; font-size: 1.3em;">
                        💰 Balance: <span id="tonkBalance">${balance.toFixed(2)}</span> eGold
                    </div>
                    <div style="color: #2ecc71; font-size: 1.2em;">
                        🎯 Ante: ${this.ante} eGold
                    </div>
                </div>
                
                <!-- Game Area -->
                <div class="game-area" style="display: flex; justify-content: space-between; gap: 30px;">
                    <!-- Dealer Section -->
                    <div class="dealer-section" style="
                        background: rgba(25, 25, 112, 0.8);
                        border-radius: 15px;
                        padding: 25px;
                        flex: 1;
                        text-align: center;
                        box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
                        border: 2px solid #4A90A4;
                    ">
                        <h3 style="color: #FFB800; margin-bottom: 15px;">🤖 Dealer</h3>
                        <div id="dealerHand" style="
                            display: flex;
                            justify-content: center;
                            gap: 10px;
                            min-height: 120px;
                            align-items: center;
                            margin-bottom: 15px;
                            flex-wrap: wrap;
                        ">
                            <div style="font-size: 3em;">🂠</div>
                            <div style="font-size: 3em;">🂠</div>
                            <div style="font-size: 3em;">🂠</div>
                        </div>
                        <p id="dealerScore" style="color: #fff; font-size: 1.3em;">Hidden</p>
                    </div>
                    
                    <!-- Player Section -->
                    <div class="player-section" style="
                        background: rgba(46, 204, 113, 0.8);
                        border-radius: 15px;
                        padding: 25px;
                        flex: 1;
                        text-align: center;
                        box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
                        border: 2px solid #2ecc71;
                    ">
                        <h3 style="color: #fff; margin-bottom: 15px;">😊 You</h3>
                        <div id="playerHand" style="
                            display: flex;
                            justify-content: center;
                            gap: 10px;
                            min-height: 120px;
                            align-items: center;
                            margin-bottom: 15px;
                            flex-wrap: wrap;
                        ">
                            <div style="font-size: 3em;">🂠</div>
                            <div style="font-size: 3em;">🂠</div>
                            <div style="font-size: 3em;">🂠</div>
                        </div>
                        <p id="playerScore" style="color: #fff; font-size: 1.3em;">Score: ???</p>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="action-buttons" style="
                    text-align: center;
                    margin-top: 30px;
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.6);
                    border-radius: 15px;
                    border: 1px solid #FFD700;
                ">
                    <button id="playButton" onclick="tonkGame.play()" 
                        class="game-button"
                        style="
                            padding: 15px 40px;
                            font-size: 1.3em;
                            background: linear-gradient(135deg, #FFB800, #FF8C00);
                            border: none;
                            border-radius: 25px;
                            color: #1a2332;
                            font-weight: bold;
                            cursor: pointer;
                            margin: 10px;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 15px rgba(255,184,0,0.4);
                        ">
                        🎮 Play Hand (${this.ante} eGold)
                    </button>
                    
                    <div id="gameActions" style="margin-top: 20px; display: none;">
                        <button onclick="tonkGame.hit()" 
                            class="game-button"
                            style="
                                padding: 12px 30px;
                                font-size: 1.1em;
                                background: linear-gradient(135deg, #e74c3c, #c0392b);
                                border: none;
                                border-radius: 8px;
                                color: white;
                                cursor: pointer;
                                margin: 5px;
                                transition: all 0.2s ease;
                            ">
                            🎴 Hit (Draw Card)
                        </button>
                        <button onclick="tonkGame.stand()" 
                            class="game-button"
                            style="
                                padding: 12px 30px;
                                font-size: 1.1em;
                                background: linear-gradient(135deg, #f39c12, #e67e22);
                                border: none;
                                border-radius: 8px;
                                color: white;
                                cursor: pointer;
                                margin: 5px;
                                transition: all 0.2s ease;
                            ">
                            ✋ Stand (Hold)
                        </button>
                    </div>
                </div>
                
                <!-- Result Display -->
                <div id="tonkResult" class="game-result" style="
                    margin-top: 30px;
                    padding: 20px;
                    border-radius: 15px;
                    text-align: center;
                    min-height: 60px;
                    font-size: 1.3em;
                    background: rgba(44, 62, 80, 0.7);
                    border: 1px solid #3498db;
                "></div>
                
                <!-- Game Rules -->
                <div class="game-rules" style="
                    margin-top: 30px;
                    padding: 25px;
                    background: rgba(44, 62, 80, 0.7);
                    border-radius: 15px;
                    border: 2px solid #FFD700;
                ">
                    <h3 style="color: #FFB800; text-align: center; margin-bottom: 20px;">📜 Game Rules</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                        <div style="color: #fff;">
                            <h4 style="color: #2ecc71; margin-bottom: 10px;">🎯 Objective</h4>
                            <p>Get as close to 49 points without going over!</p>
                        </div>
                        
                        <div style="color: #fff;">
                            <h4 style="color: #f39c12; margin-bottom: 10px;">🃏 Card Values</h4>
                            <ul style="text-align: left; padding-left: 20px; line-height: 1.8;">
                                <li>Face cards (J, Q, K): 10 points</li>
                                <li>Aces: 1 point</li>
                                <li>Number cards: Face value</li>
                            </ul>
                        </div>
                        
                        <div style="color: #fff;">
                            <h4 style="color: #e74c3c; margin-bottom: 10px;">⚡ Rules</h4>
                            <ul style="text-align: left; padding-left: 20px; line-height: 1.8;">
                                <li>Ante: <b>${this.ante} eGold</b></li>
                                <li>Start with 3 cards</li>
                                <li>Hit or Stand each turn</li>
                                <li>Bust over 49 = loss</li>
                                <li>Dealer draws to 40+</li>
                                <li>Dealer wins ties</li>
                                <li>Win pays 2x ante!</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.updateBalance(balance);
    },
    
    updateBalance(newBalance) {
        const balanceEl = document.getElementById('tonkBalance');
        if (balanceEl) {
            balanceEl.textContent = newBalance.toFixed(2);
        }
    },
    
    getCard() {
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const suits = ['♠', '♥', '♦', '♣'];
        
        return {
            value: values[Math.floor(Math.random() * values.length)],
            suit: suits[Math.floor(Math.random() * suits.length)]
        };
    },
    
    getScore(cards) {
        return cards.reduce((sum, card) => {
            if (card.value === 'A') return sum + 1;
            if (['J', 'Q', 'K'].includes(card.value)) return sum + 10;
            return sum + parseInt(card.value);
        }, 0);
    },
    
    getCardColor(suit) {
        return (suit === '♥' || suit === '♦') ? '#e74c3c' : '#2c3e50';
    },
    
    updateDisplay() {
        const playerScore = this.getScore(this.playerCards || []);
        document.getElementById('playerHand').innerHTML = 
            (this.playerCards || []).map(c => 
                `<div style="
                    font-size: 2.5em; 
                    display: inline-block;
                    background: white;
                    padding: 10px 15px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    color: ${this.getCardColor(c.suit)};
                    font-weight: bold;
                ">${c.value}${c.suit}</div>`
            ).join('');
        
        const playerScoreElement = document.getElementById('playerScore');
        playerScoreElement.textContent = `Score: ${playerScore}`;
        if (playerScore > 49) {
            playerScoreElement.style.color = '#e74c3c';
        } else {
            playerScoreElement.style.color = '#2ecc71';
        }
        
        if (!this.gameActive) {
            // Show dealer cards
            if (this.dealerCards && this.dealerCards.length > 0) {
                const dealerScore = this.getScore(this.dealerCards);
                document.getElementById('dealerHand').innerHTML = 
                    (this.dealerCards || []).map(c => 
                        `<div style="
                            font-size: 2.5em; 
                            display: inline-block;
                            background: white;
                            padding: 10px 15px;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                            color: ${this.getCardColor(c.suit)};
                            font-weight: bold;
                        ">${c.value}${c.suit}</div>`
                    ).join('');
                
                const dealerScoreElement = document.getElementById('dealerScore');
                dealerScoreElement.textContent = `Score: ${dealerScore}`;
                if (dealerScore > 49) {
                    dealerScoreElement.style.color = '#e74c3c';
                } else {
                    dealerScoreElement.style.color = '#2ecc71';
                }
            }
        } else {
            // Hide dealer cards during active game
            document.getElementById('dealerHand').innerHTML = 
                '<div style="font-size: 3em;">🂠</div>'.repeat(this.dealerCards.length);
            document.getElementById('dealerScore').textContent = 'Hidden';
        }
    },
    
    play() {
        // Check balance
        if (balance < this.ante) {
            document.getElementById('tonkResult').innerHTML = 
                '<span style="color: #e74c3c; font-size: 1.5em;">❌ Insufficient balance!</span>';
            if (typeof soundManager !== 'undefined') soundManager.playButtonClick();
            return;
        }
        
        // Play sound
        if (typeof soundManager !== 'undefined') soundManager.playChipSound();
        
        // Deduct ante
        updateBalance(-this.ante);
        this.updateBalance(balance);
        
        // Track for systems
        if (typeof vipSystem !== 'undefined') vipSystem.trackWager(this.ante);
        if (typeof achievementSystem !== 'undefined') achievementSystem.trackBet(this.ante, 'Royal Tonk');
        if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWager(this.ante, 'Royal Tonk');
        
        // Set game state
        this.gameActive = true;
        
        // Deal cards
        this.playerCards = [this.getCard(), this.getCard(), this.getCard()];
        this.dealerCards = [this.getCard(), this.getCard(), this.getCard()];
        
        // Update display
        this.updateDisplay();
        
        // Show/hide buttons
        document.getElementById('gameActions').style.display = 'block';
        document.getElementById('playButton').disabled = true;
        document.getElementById('playButton').style.opacity = '0.5';
        
        // Clear result
        document.getElementById('tonkResult').innerHTML = '<span style="color: #FFB800;">Choose your move: Hit or Stand</span>';
    },
    
    hit() {
        if (!this.gameActive) return;
        
        // Play sound
        if (typeof soundManager !== 'undefined') soundManager.playCardDeal();
        
        // Draw card
        this.playerCards.push(this.getCard());
        this.updateDisplay();
        
        const playerScore = this.getScore(this.playerCards);
        if (playerScore > 49) {
            // Auto-stand if bust
            document.getElementById('tonkResult').innerHTML = '<span style="color: #e74c3c; font-size: 1.3em;">💥 BUST! You went over 49!</span>';
            setTimeout(() => this.stand(), 1500);
        }
    },
    
    stand() {
        if (!this.gameActive) return;
        
        this.gameActive = false;
        
        // Hide buttons
        document.getElementById('gameActions').style.display = 'none';
        document.getElementById('playButton').disabled = false;
        document.getElementById('playButton').style.opacity = '1';
        
        // Dealer plays
        let dealerScore = this.getScore(this.dealerCards);
        while (dealerScore < 40 && dealerScore <= 49) {
            this.dealerCards.push(this.getCard());
            dealerScore = this.getScore(this.dealerCards);
        }
        
        // Update display
        this.updateDisplay();
        
        const playerScore = this.getScore(this.playerCards);
        const playerBust = playerScore > 49;
        const dealerBust = dealerScore > 49;
        
        let result = '';
        let payout = 0;
        
        if (playerBust && dealerBust) {
            if (typeof soundManager !== 'undefined') soundManager.playLoss();
            result = '<span style="color: #FFB800; font-size: 1.5em;">Both bust - Dealer wins (house rule)</span>';
        } else if (playerBust) {
            if (typeof soundManager !== 'undefined') soundManager.playLoss();
            result = '<span style="color: #e74c3c; font-size: 1.5em;">💔 You bust! Dealer wins.</span>';
        } else if (dealerBust) {
            payout = this.ante * 2;
            updateBalance(payout);
            this.updateBalance(balance);
            
            if (typeof soundManager !== 'undefined') soundManager.playWin();
            if (typeof particleSystem !== 'undefined') particleSystem.createCoinBurst(window.innerWidth / 2, window.innerHeight / 2, payout);
            
            result = `<span style="color: #2ecc71; font-size: 1.8em;">🎉 Dealer busts! YOU WIN!<br>+${payout.toFixed(2)} eGold <small style="color: #2ecc71;">($${(payout * 0.10).toFixed(2)})</small></span>`;
        } else {
            const diff = Math.abs(49 - playerScore);
            const dealerDiff = Math.abs(49 - dealerScore);
            
            if (diff < dealerDiff) {
                payout = this.ante * 2;
                updateBalance(payout);
                this.updateBalance(balance);
                
                if (typeof soundManager !== 'undefined') soundManager.playWin();
                if (typeof particleSystem !== 'undefined') particleSystem.createCoinBurst(window.innerWidth / 2, window.innerHeight / 2, payout);
                
                result = `<span style="color: #2ecc71; font-size: 1.8em;">🎉 YOU WIN!<br>+${payout.toFixed(2)} eGold <small style="color: #2ecc71;">($${(payout * 0.10).toFixed(2)})</small></span>`;
            } else if (diff === dealerDiff) {
                if (typeof soundManager !== 'undefined') soundManager.playLoss();
                result = '<span style="color: #FFB800; font-size: 1.5em;">🤝 Tie - Dealer wins (house rule)</span>';
            } else {
                if (typeof soundManager !== 'undefined') soundManager.playLoss();
                result = '<span style="color: #e74c3c; font-size: 1.5em;">💔 Dealer wins. Try again!</span>';
            }
        }
        
        document.getElementById('tonkResult').innerHTML = result;
        
        // Track wins
        if (payout > 0 && typeof achievementSystem !== 'undefined') {
            achievementSystem.trackWin(payout, 'Royal Tonk');
        }
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
