// Texas Hold'em Poker (Simplified)
const texasholdemGame = {
    ante: 10,
    
    init() {
        // Show game mode selector
        PVPSystem.showGameModeSelector('texasholdem', 'Texas Hold\'em Poker');
    },
    
    initSolo() {
        const content = document.getElementById('gameContent');
        const vipLevel = typeof vipSystem !== 'undefined' ? vipSystem.getCurrentLevel().level : 0;
        
        content.innerHTML = `
            <div style="text-align: center;">
                <!-- WPT-Style Header -->
                <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #FFB800; box-shadow: 0 4px 20px rgba(255,184,0,0.3);">
                    <h3 style="color: #FFB800; font-size: 2em; margin: 0; text-shadow: 0 0 20px rgba(255,184,0,0.6);">♠️ ROYAL TEXAS HOLD'EM ♥️</h3>
                    <p style="color: #888; margin: 10px 0 0 0;">WPT Professional Style</p>
                </div>
                
                <!-- Quick Actions -->
                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap;">
                    <button onclick="pokerEnhancer.showHandHistory()" style="background: linear-gradient(135deg, #3498db, #2980b9); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(52,152,219,0.3);">
                        📜 Hand History
                    </button>
                    <button onclick="pokerEnhancer.showQuickChat()" style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(155,89,182,0.3);">
                        💬 Quick Chat
                    </button>
                </div>
                
                <!-- Premium Poker Table -->
                ${pokerEnhancer.createPremiumTable('holdem')}
                
                <script>
                    // Add table content with player seats
                    document.getElementById('tableContent').innerHTML = \`
                        ${pokerEnhancer.createPlayerSeat('dealer', 'Dealer', 1000, false, 0)}
                        ${pokerEnhancer.createPlayerSeat('player', 'You', balance, true, ${vipLevel})}
                        
                        <div style="position: relative; z-index: 2; margin-top: 20px;">
                            <div style="margin: 20px 0;">
                                <div style="color: #888; font-size: 0.9em; margin-bottom: 10px;">Dealer</div>
                                <div id="dealerHand">${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}</div>
                            </div>
                            
                            <div style="margin: 30px 0;">
                                <div style="color: #FFB800; font-size: 1.2em; font-weight: bold; margin-bottom: 15px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">🎴 Community Cards 🎴</div>
                                <div id="communityCards" style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 12px; display: inline-block;">
                                    ${pokerEnhancer.createEnhancedCard('?', '♠', true)}
                                    ${pokerEnhancer.createEnhancedCard('?', '♠', true)}
                                    ${pokerEnhancer.createEnhancedCard('?', '♠', true)}
                                    ${pokerEnhancer.createEnhancedCard('?', '♠', true)}
                                    ${pokerEnhancer.createEnhancedCard('?', '♠', true)}
                                </div>
                            </div>
                            
                            <div style="margin: 20px 0;">
                                <div style="color: #FFB800; font-size: 1.1em; font-weight: bold; margin-bottom: 10px;">Your Hand</div>
                                <div id="playerHand">${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}</div>
                            </div>
                            
                            <!-- Pot Display -->
                            <div id="potDisplay" style="
                                position: absolute;
                                top: 50%;
                                right: -100px;
                                transform: translateY(-50%);
                                background: rgba(0,0,0,0.7);
                                padding: 15px;
                                border-radius: 10px;
                                border: 2px solid #FFB800;
                                min-width: 120px;
                            ">
                                <div style="color: #888; font-size: 0.9em;">Pot</div>
                                <div style="color: #FFB800; font-size: 1.5em; font-weight: bold;">${this.ante}</div>
                                ${pokerEnhancer.createChipStack(this.ante)}
                            </div>
                        </div>
                    \`;
                </script>
                
                <button onclick="texasholdemGame.play()" class="game-button" style="
                    padding: 18px 50px; 
                    font-size: 1.4em; 
                    background: linear-gradient(135deg, #FFB800, #d4af37); 
                    border: none; 
                    border-radius: 12px; 
                    color: #1A2332; 
                    font-weight: bold; 
                    cursor: pointer; 
                    margin: 30px 0;
                    box-shadow: 0 6px 20px rgba(255,184,0,0.4);
                    transition: all 0.3s ease;
                ">
                    🎰 Deal Hand (${this.ante} eGold)
                </button>
                
                <div id="pokerResult" class="game-result" style="margin-top: 20px; font-size: 1.4em; min-height: 40px; font-weight: bold;"></div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; margin-bottom: 15px;">👑 Royal Hold'em</h3>
                    <p style="font-size: 1.1em; color: #cccccc; margin-bottom: 15px;">Classic Texas Hold'em with 5 community cards and dealer showdown</p>
                    <h4 style="color: #FFB800; margin-bottom: 10px;">🎴 Hand Rankings</h4>
                    <div style="color: #cccccc; font-size: 0.95em; line-height: 1.6; text-align: left; max-width: 500px; margin: 0 auto;">
                        <p><b style="color: #FFB800;">Royal Flush:</b> A-K-Q-J-10 same suit (Unbeatable!)</p>
                        <p><b>Straight Flush:</b> 5 cards in sequence, same suit</p>
                        <p><b>Four of a Kind:</b> Four cards of same rank</p>
                        <p><b>Full House:</b> Three of a kind + a pair</p>
                        <p><b>Flush:</b> 5 cards of same suit</p>
                        <p><b>Straight:</b> 5 cards in sequence</p>
                        <p><b>Three of a Kind:</b> Three cards of same rank</p>
                        <p><b>Two Pair:</b> Two different pairs</p>
                        <p><b>Pair:</b> Two cards of same rank</p>
                        <p><b>High Card:</b> Highest single card</p>
                    </div>
                    <div style="margin-top: 15px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 2px solid #2ecc71;">
                        <h4 style="color: #2ecc71; margin-bottom: 10px;">📜 Game Rules</h4>
                        <ul style="text-align: left; max-width: 450px; margin: 0 auto; color: #cccccc; line-height: 1.8;">
                            <li>Pay ante (<b>${this.ante} eGold</b>)</li>
                            <li>Receive <b>2 hole cards</b></li>
                            <li><b>5 community cards</b> dealt</li>
                            <li>Make best 5-card hand from 7 total</li>
                            <li>Dealer reveals their hand</li>
                            <li><b>Beat dealer to win!</b></li>
                            <li>Payout: <b style="color: #FFB800;">2x ante</b></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },
    
    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];
        
        for (const suit of suits) {
            for (const value of values) {
                deck.push({ value, suit, numValue: values.indexOf(value) + 2 });
            }
        }
        return deck;
    },
    
    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    },
    
    play() {
        if (balance < this.ante) {
            document.getElementById('pokerResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            soundManager.playButtonClick();
            return;
        }
        
        // Play chip sound
        soundManager.playChipSound();
        
        updateBalance(-this.ante);
        
        // Track for VIP, achievements, and leaderboard
        if (typeof vipSystem !== 'undefined') vipSystem.trackWager(this.ante);
        if (typeof achievementSystem !== 'undefined') achievementSystem.trackBet(this.ante, 'Royal Texas Hold\'em');
        if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWager(this.ante, 'Royal Texas Hold\'em');
        
        // Create deck and shuffle
        const deck = this.createDeck();
        this.shuffleDeck(deck);
        
        // Deal cards with animation
        soundManager.playShuffle();
        
        // Deal cards
        const playerCards = [deck.pop(), deck.pop()];
        const dealerCards = [deck.pop(), deck.pop()];
        const community = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()];
        
        // Display cards with actual visuals and animation
        const suitMap = {'♠': 'spades', '♥': 'hearts', '♦': 'diamonds', '♣': 'clubs'};
        
        setTimeout(() => {
            soundManager.playCardDeal();
            document.getElementById('playerHand').innerHTML = 
                playerCards.map(c => pokerEnhancer.createEnhancedCard(c.value, c.suit)).join('');
        }, 300);
        
        setTimeout(() => {
            soundManager.playCardDeal();
            document.getElementById('communityCards').innerHTML = 
                community.map((c, i) => `<div style="display: inline-block; animation: cardFlip 0.6s ease ${i * 0.1}s;">${pokerEnhancer.createEnhancedCard(c.value, c.suit)}</div>`).join('');
        }, 600);
        
        setTimeout(() => {
            soundManager.playCardDeal();
            document.getElementById('dealerHand').innerHTML = 
                dealerCards.map(c => pokerEnhancer.createEnhancedCard(c.value, c.suit)).join('');
            
            // Evaluate hands (simplified)
            const playerScore = this.evaluateHand([...playerCards, ...community]);
            const dealerScore = this.evaluateHand([...dealerCards, ...community]) + 0.5; // House edge
            
            let result, payout = 0;
            
            if (playerScore > dealerScore) {
                result = 'win';
                payout = this.ante * 2;
                updateBalance(payout);
                
                // Track win for achievements and leaderboard
                if (typeof achievementSystem !== 'undefined') achievementSystem.trackWin(payout);
                if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWin(payout);
                
                soundManager.playWin();
                particleSystem.createChipStack(window.innerWidth / 2, window.innerHeight / 2, 10);
                const resultDiv = document.getElementById('pokerResult');
                resultDiv.className = 'win-effect';
                resultDiv.innerHTML = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 YOU WIN! +${payout} eGold <small style="color: #2ecc71;">($${(payout * 0.10).toFixed(2)})</small></span>`;
            } else if (playerScore === dealerScore) {
                result = 'draw';
                soundManager.playLoss();
                
                // Track loss for achievements
                if (typeof achievementSystem !== 'undefined') achievementSystem.trackLoss();
                if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackLoss();
                
                document.getElementById('pokerResult').innerHTML = '<span style="color: #FFB800;">Push - Dealer wins ties (house rule)</span>';
            } else {
                result = 'loss';
                soundManager.playLoss();
                
                // Track loss for achievements
                if (typeof achievementSystem !== 'undefined') achievementSystem.trackLoss();
                if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackLoss();
                
                document.getElementById('pokerResult').className = 'loss-effect';
                document.getElementById('pokerResult').innerHTML = '<span style="color: #e74c3c;">Dealer wins. Try again!</span>';
            }
            
            // Record hand in history
            if (typeof pokerEnhancer !== 'undefined') {
                pokerEnhancer.recordHand(
                    'Royal Texas Hold\'em',
                    playerCards,
                    dealerCards,
                    community,
                    result,
                    this.ante,
                    payout
                );
            }
        }, 900);
    },
    
    evaluateHand(cards) {
        // Simplified hand evaluation - returns a score
        const values = cards.map(c => c.numValue).sort((a, b) => b - a);
        const suits = cards.map(c => c.suit);
        
        // Check for flush
        const isFlush = suits.every(s => s === suits[0]);
        
        // Check for pairs, three of a kind, etc.
        const valueCounts = {};
        for (const v of values) {
            valueCounts[v] = (valueCounts[v] || 0) + 1;
        }
        
        const counts = Object.values(valueCounts).sort((a, b) => b - a);
        
        // Scoring (simplified)
        let score = Math.max(...values); // High card
        
        if (counts[0] === 4) score = 800; // Four of a kind
        else if (counts[0] === 3 && counts[1] === 2) score = 700; // Full house
        else if (isFlush) score = 600; // Flush
        else if (counts[0] === 3) score = 400; // Three of a kind
        else if (counts[0] === 2 && counts[1] === 2) score = 300; // Two pair
        else if (counts[0] === 2) score = 200; // Pair
        
        return score;
    },
    
    initPVP(room) {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #7B68EE; font-size: 1.8em; margin-bottom: 15px;">
                        👥 PVP Texas Hold'em
                    </h3>
                    <p style="color: #FFB800; font-size: 1.2em;">Pot: ${room.bet * 2} eGold</p>
                </div>
                
                <div style="margin: 30px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 600px; margin: 30px auto;">
                    <div style="padding: 20px; background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c; border-radius: 10px;">
                        <h4 style="color: #e74c3c; margin-bottom: 10px;">🤖 Opponent</h4>
                        <p style="color: #cccccc; font-size: 0.9em;">${room.host === PVPSystem.playerName ? 'AI Player' : room.host}</p>
                        <div style="font-size: 2em; margin: 10px 0;">🂠 🂠</div>
                    </div>
                    
                    <div style="padding: 20px; background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71; border-radius: 10px;">
                        <h4 style="color: #2ecc71; margin-bottom: 10px;">😊 You</h4>
                        <p style="color: #cccccc; font-size: 0.9em;">${PVPSystem.playerName}</p>
                        <div id="pvpPlayerHand" style="font-size: 2em; margin: 10px 0;">🂠 🂠</div>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4 style="color: #FFB800; margin-bottom: 10px;">Community Cards</h4>
                    <div id="pvpCommunityCards" style="font-size: 2.5em;">🂠 🂠 🂠 🂠 🂠</div>
                </div>
                
                <button onclick="texasholdemGame.playPVP(${room.bet})" class="game-button" style="margin: 20px 0;">
                    🎮 Play Hand
                </button>
                
                <div id="pvpResult" style="margin-top: 20px; font-size: 1.3em;"></div>
            </div>
        `;
    },
    
    playPVP(bet) {
        // Deal hands
        const deck = this.createDeck();
        this.shuffleDeck(deck);
        
        const playerCards = [deck.pop(), deck.pop()];
        const opponentCards = [deck.pop(), deck.pop()];
        const communityCards = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()];
        
        // Show cards
        document.getElementById('pvpPlayerHand').innerText = playerCards.map(c => c.symbol).join(' ');
        document.getElementById('pvpCommunityCards').innerText = communityCards.map(c => c.symbol).join(' ');
        
        // Evaluate hands
        const playerHand = [...playerCards, ...communityCards];
        const opponentHand = [...opponentCards, ...communityCards];
        
        const playerScore = this.evaluateHand(playerHand);
        const opponentScore = this.evaluateHand(opponentHand);
        
        // Determine winner
        const resultDiv = document.getElementById('pvpResult');
        setTimeout(() => {
            // Reveal opponent cards
            const opponentDiv = document.querySelector('[style*="rgba(231, 76, 60"]').querySelector('div[style*="font-size: 2em"]');
            opponentDiv.innerText = opponentCards.map(c => c.symbol).join(' ');
            
            if (playerScore > opponentScore) {
                updateBalance(bet * 2);
                resultDiv.innerHTML = `
                    <div class="game-result win">
                        <h3>🎉 YOU WIN!</h3>
                        <p>+${bet * 2} eGold</p>
                        <p style="font-size: 0.9em; margin-top: 10px;">Your hand was stronger!</p>
                    </div>
                `;
            } else if (playerScore === opponentScore) {
                updateBalance(bet);
                resultDiv.innerHTML = `
                    <div class="game-result" style="background: rgba(255, 184, 0, 0.2); border-color: #FFB800;">
                        <h3 style="color: #FFB800;">🤝 TIE!</h3>
                        <p>Bet returned: ${bet} eGold</p>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `
                    <div class="game-result lose">
                        <h3>😔 YOU LOSE</h3>
                        <p>-${bet} eGold</p>
                        <p style="font-size: 0.9em; margin-top: 10px;">Opponent had better hand</p>
                    </div>
                `;
            }
        }, 1000);
    }

};

window.texasholdemGame = texasholdemGame;
