// Texas Hold'em Poker (Simplified)
const texasholdemGame = {
    ante: 10,
    
    init() {
        // Show game mode selector
        PVPSystem.showGameModeSelector('texasholdem', 'Texas Hold\'em Poker');
    },
    
    initSolo() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #FFB800; font-size: 1.5em; margin-bottom: 20px;">Texas Hold'em Poker</h3>
                
                <div style="margin: 20px 0;">
                    <div style="background: rgba(255, 184, 0, 0.1); padding: 15px; border-radius: 10px; display: inline-block;">
                        <p style="color: #FFB800; font-size: 1.2em;">Ante: ${this.ante} eGold</p>
                    </div>
                </div>
                
                <!-- Poker Table -->
                <div style="background: linear-gradient(135deg, #1a5f1a 0%, #0d4a0d 100%); padding: 40px; border-radius: 20px; border: 5px solid #8B4513; box-shadow: 0 10px 40px rgba(0,0,0,0.5); max-width: 900px; margin: 30px auto;">
                    <div style="margin: 20px 0;">
                        <h4 style="color: #FFB800; margin-bottom: 10px;">Dealer's Hand</h4>
                        <div id="dealerHand">${VisualEnhancer.createCard('?', 'spades', true)}${VisualEnhancer.createCard('?', 'spades', true)}</div>
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
                        <div id="playerHand">${VisualEnhancer.createCard('?', 'spades', true)}${VisualEnhancer.createCard('?', 'spades', true)}</div>
                    </div>
                </div>
                
                <button onclick="texasholdemGame.play()" style="padding: 15px 40px; font-size: 1.3em; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer; margin: 20px 0;">
                    Play Hand (${this.ante} eGold)
                </button>
                
                <div id="pokerResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; margin-bottom: 10px;">Hand Rankings</h3>
                    <div style="color: #cccccc; font-size: 0.9em;">
                        <p>Royal Flush > Straight Flush > Four of a Kind > Full House</p>
                        <p>Flush > Straight > Three of a Kind > Two Pair > Pair > High Card</p>
                        <p style="margin-top: 10px; color: #e74c3c;">Note: Dealer has slight advantage</p>
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
                playerCards.map(c => `<div class="card-deal">${VisualEnhancer.createCard(c.value, suitMap[c.suit])}</div>`).join('');
        }, 300);
        
        setTimeout(() => {
            soundManager.playCardDeal();
            document.getElementById('communityCards').innerHTML = 
                community.map((c, i) => `<div class="card-deal" style="animation-delay: ${i * 0.1}s">${VisualEnhancer.createCard(c.value, suitMap[c.suit])}</div>`).join('');
        }, 600);
        
        setTimeout(() => {
            soundManager.playCardDeal();
            document.getElementById('dealerHand').innerHTML = 
                dealerCards.map(c => `<div class="card-flip">${VisualEnhancer.createCard(c.value, suitMap[c.suit])}</div>`).join('');
            
            // Evaluate hands (simplified)
            const playerScore = this.evaluateHand([...playerCards, ...community]);
            const dealerScore = this.evaluateHand([...dealerCards, ...community]) + 0.5; // House edge
            
            if (playerScore > dealerScore) {
                const payout = this.ante * 2;
                updateBalance(payout);
                soundManager.playWin();
                particleSystem.createChipStack(window.innerWidth / 2, window.innerHeight / 2, 10);
                const resultDiv = document.getElementById('pokerResult');
                resultDiv.className = 'win-effect';
                resultDiv.innerHTML = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 YOU WIN! +${payout} eGold <small style="color: #2ecc71;">($${(payout * 0.10).toFixed(2)})</small></span>`;
            } else if (playerScore === dealerScore) {
                soundManager.playLoss();
                document.getElementById('pokerResult').innerHTML = '<span style="color: #FFB800;">Push - Dealer wins ties (house rule)</span>';
            } else {
                soundManager.playLoss();
                document.getElementById('pokerResult').className = 'loss-effect';
                document.getElementById('pokerResult').innerHTML = '<span style="color: #e74c3c;">Dealer wins. Try again!</span>';
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
