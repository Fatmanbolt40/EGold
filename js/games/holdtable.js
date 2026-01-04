// Texas Hold'em Table Game
const holdemTableGame = {
    players: [],
    dealer: 0,
    smallBlind: 5,
    bigBlind: 10,
    pot: 0,
    communityCards: [],
    currentBet: 0,
    playerCount: 6,
    playerTurn: 0,
    gamePhase: 'setup', // setup, preflop, flop, turn, river, showdown
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 1.8em; margin-bottom: 20px;">🎰 Texas Hold'em Table</h3>
                    <p style="color: #cccccc;">Full multiplayer table game</p>
                </div>
                
                <div style="max-width: 800px; margin: 30px auto; padding: 30px; background: rgba(255, 184, 0, 0.1); border-radius: 15px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; margin-bottom: 20px;">⚙️ Table Setup</h3>
                    
                    <div style="margin: 20px 0;">
                        <label style="color: #FFB800; font-size: 1.2em; display: block; margin-bottom: 10px;">Number of Players (2-9):</label>
                        <input type="number" id="playerCount" value="6" min="2" max="9" class="game-input" style="width: 150px;">
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <label style="color: #FFB800; font-size: 1.2em; display: block; margin-bottom: 10px;">Small Blind:</label>
                        <input type="number" id="smallBlind" value="5" min="1" max="100" class="game-input" style="width: 150px;">
                        <span style="color: #cccccc; margin-left: 10px;">eGold (<span id="sbUSD">$0.50</span> USD)</span>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <label style="color: #FFB800; font-size: 1.2em; display: block; margin-bottom: 10px;">Big Blind:</label>
                        <input type="number" id="bigBlind" value="10" min="2" max="200" class="game-input" style="width: 150px;">
                        <span style="color: #cccccc; margin-left: 10px;">eGold (<span id="bbUSD">$1.00</span> USD)</span>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <label style="color: #FFB800; font-size: 1.2em; display: block; margin-bottom: 10px;">Buy-in (100x Big Blind recommended):</label>
                        <input type="number" id="buyin" value="1000" min="100" max="10000" class="game-input" style="width: 150px;">
                        <span style="color: #cccccc; margin-left: 10px;">eGold (<span id="buyinUSD">$100.00</span> USD)</span>
                    </div>
                    
                    <button onclick="holdemTableGame.startTable()" class="game-button" style="margin-top: 20px; font-size: 1.3em; padding: 18px 50px;">
                        🎯 Start Table
                    </button>
                </div>
                
                <div class="game-info-box">
                    <h3>🎲 How to Play</h3>
                    <p><b>Setup:</b> Choose number of players (AI opponents) and blind levels</p>
                    <p style="margin-top: 8px;"><b>Blinds:</b> Small blind and big blind rotate each hand</p>
                    <p style="margin-top: 8px;"><b>Actions:</b> Check, Call, Raise, or Fold each betting round</p>
                    <p style="margin-top: 8px;"><b>Goal:</b> Win the pot with the best 5-card hand!</p>
                </div>
            </div>
        `;
        
        // Update USD values on input change
        document.getElementById('smallBlind').addEventListener('input', (e) => {
            document.getElementById('sbUSD').textContent = `$${(e.target.value * 0.10).toFixed(2)}`;
            document.getElementById('bigBlind').value = e.target.value * 2;
            document.getElementById('bbUSD').textContent = `$${(e.target.value * 2 * 0.10).toFixed(2)}`;
        });
        
        document.getElementById('bigBlind').addEventListener('input', (e) => {
            document.getElementById('bbUSD').textContent = `$${(e.target.value * 0.10).toFixed(2)}`;
        });
        
        document.getElementById('buyin').addEventListener('input', (e) => {
            document.getElementById('buyinUSD').textContent = `$${(e.target.value * 0.10).toFixed(2)}`;
        });
    },
    
    startTable() {
        this.playerCount = parseInt(document.getElementById('playerCount').value);
        this.smallBlind = parseInt(document.getElementById('smallBlind').value);
        this.bigBlind = parseInt(document.getElementById('bigBlind').value);
        const buyin = parseInt(document.getElementById('buyin').value);
        
        if (buyin > balance) {
            alert(`Insufficient balance! You need ${buyin} eGold to join this table.`);
            return;
        }
        
        // Initialize players
        this.players = [];
        for (let i = 0; i < this.playerCount; i++) {
            this.players.push({
                id: i,
                name: i === 0 ? 'You' : `Player ${i + 1}`,
                chips: buyin,
                cards: [],
                bet: 0,
                folded: false,
                isHuman: i === 0
            });
        }
        
        updateBalance(-buyin);
        this.dealer = 0;
        this.renderTable();
        this.dealNewHand();
    },
    
    renderTable() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <!-- Poker Table -->
                <div style="background: linear-gradient(135deg, #1a5f1a 0%, #0d4a0d 100%); padding: 40px; border-radius: 30px; border: 8px solid #8B4513; box-shadow: 0 15px 50px rgba(0,0,0,0.6); max-width: 1100px; margin: 20px auto; position: relative;">
                    
                    <!-- Pot Display -->
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.7); padding: 20px 40px; border-radius: 15px; border: 3px solid #FFB800; z-index: 5;">
                        <div style="color: #FFB800; font-size: 1.5em; font-weight: bold;">POT</div>
                        <div id="potAmount" style="color: white; font-size: 2em; font-weight: bold;">${this.pot}</div>
                        <div style="color: #2ecc71; font-size: 0.9em;">$${(this.pot * 0.10).toFixed(2)} USD</div>
                    </div>
                    
                    <!-- Community Cards -->
                    <div style="margin: 30px 0;">
                        <h4 style="color: #FFB800; margin-bottom: 15px;">Community Cards</h4>
                        <div id="communityCards" style="min-height: 140px; display: flex; justify-content: center; gap: 10px;">
                            ${this.communityCards.length > 0 ? this.renderCommunityCards() : this.renderFaceDownCards(5)}
                        </div>
                    </div>
                    
                    <!-- Players -->
                    <div id="playersContainer" style="margin-top: 40px;">
                        ${this.renderPlayers()}
                    </div>
                </div>
                
                <!-- Player Actions -->
                <div id="playerActions" style="margin: 30px 0;">
                    ${this.renderPlayerActions()}
                </div>
                
                <div id="gameMessage" style="margin: 20px 0; font-size: 1.3em; color: #FFB800; min-height: 40px;"></div>
            </div>
        `;
    },
    
    renderPlayers() {
        return this.players.map((player, idx) => {
            const isDealer = idx === this.dealer;
            const isActive = idx === this.playerTurn && !player.folded;
            const border = isActive ? '4px solid #FFB800' : player.folded ? '2px solid #666' : '2px solid #2ecc71';
            const opacity = player.folded ? '0.5' : '1';
            
            return `
                <div style="display: inline-block; margin: 15px; padding: 20px; background: rgba(0,0,0,0.5); border: ${border}; border-radius: 12px; min-width: 200px; opacity: ${opacity};">
                    <div style="color: ${player.isHuman ? '#FFB800' : '#cccccc'}; font-size: 1.2em; font-weight: bold; margin-bottom: 10px;">
                        ${player.name} ${isDealer ? '🔘' : ''}
                        ${player.folded ? '(Folded)' : ''}
                    </div>
                    <div style="margin: 10px 0;">
                        ${player.isHuman || this.gamePhase === 'showdown' ? this.renderPlayerCards(player.cards) : this.renderFaceDownCards(2)}
                    </div>
                    <div style="color: #2ecc71; font-size: 1.1em; margin-top: 10px;">
                        💰 ${player.chips} <small style="color: #999;">($${(player.chips * 0.10).toFixed(2)})</small>
                    </div>
                    ${player.bet > 0 ? `<div style="color: #FFB800; margin-top: 5px;">Bet: ${player.bet}</div>` : ''}
                </div>
            `;
        }).join('');
    },
    
    renderCommunityCards() {
        const suitMap = {'♠': 'spades', '♥': 'hearts', '♦': 'diamonds', '♣': 'clubs'};
        return this.communityCards.map(card => 
            VisualEnhancer.createCard(card.value, suitMap[card.suit])
        ).join('');
    },
    
    renderPlayerCards(cards) {
        if (!cards || cards.length === 0) return this.renderFaceDownCards(2);
        const suitMap = {'♠': 'spades', '♥': 'hearts', '♦': 'diamonds', '♣': 'clubs'};
        return cards.map(card => 
            VisualEnhancer.createCard(card.value, suitMap[card.suit])
        ).join('');
    },
    
    renderFaceDownCards(count) {
        return Array(count).fill(0).map(() => 
            VisualEnhancer.createCard('?', 'spades', true)
        ).join('');
    },
    
    renderPlayerActions() {
        const player = this.players[0]; // Human player
        if (!player || player.folded || this.playerTurn !== 0) {
            return '<div style="color: #999; font-size: 1.2em;">Waiting for other players...</div>';
        }
        
        const canCheck = player.bet >= this.currentBet;
        const callAmount = this.currentBet - player.bet;
        
        return `
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                ${canCheck ? 
                    '<button onclick="holdemTableGame.playerCheck()" class="game-button secondary">✓ Check</button>' :
                    `<button onclick="holdemTableGame.playerCall()" class="game-button secondary">📞 Call ${callAmount}</button>`
                }
                <button onclick="holdemTableGame.playerRaise()" class="game-button">⬆ Raise</button>
                <button onclick="holdemTableGame.playerFold()" class="game-button" style="background: #e74c3c;">❌ Fold</button>
            </div>
        `;
    },
    
    dealNewHand() {
        // Reset for new hand
        this.pot = 0;
        this.currentBet = 0;
        this.communityCards = [];
        this.gamePhase = 'preflop';
        
        // Reset players
        this.players.forEach(p => {
            p.cards = [];
            p.bet = 0;
            p.folded = false;
        });
        
        // Create and shuffle deck
        const deck = this.createDeck();
        this.shuffleDeck(deck);
        
        // Deal cards to each player
        for (let i = 0; i < 2; i++) {
            this.players.forEach(player => {
                player.cards.push(deck.pop());
            });
        }
        
        this.deck = deck;
        
        // Post blinds
        const sbIdx = (this.dealer + 1) % this.playerCount;
        const bbIdx = (this.dealer + 2) % this.playerCount;
        
        this.players[sbIdx].chips -= this.smallBlind;
        this.players[sbIdx].bet = this.smallBlind;
        this.pot += this.smallBlind;
        
        this.players[bbIdx].chips -= this.bigBlind;
        this.players[bbIdx].bet = this.bigBlind;
        this.pot += this.bigBlind;
        
        this.currentBet = this.bigBlind;
        this.playerTurn = (this.dealer + 3) % this.playerCount;
        
        this.renderTable();
        document.getElementById('gameMessage').textContent = `Blinds posted: ${this.smallBlind}/${this.bigBlind} - Your turn!`;
        
        if (this.playerTurn !== 0) {
            setTimeout(() => this.aiTurn(), 1000);
        }
    },
    
    playerCheck() {
        document.getElementById('gameMessage').textContent = 'You checked.';
        this.nextPlayer();
    },
    
    playerCall() {
        const callAmount = this.currentBet - this.players[0].bet;
        this.players[0].chips -= callAmount;
        this.players[0].bet = this.currentBet;
        this.pot += callAmount;
        document.getElementById('gameMessage').textContent = `You called ${callAmount} eGold.`;
        this.nextPlayer();
    },
    
    playerRaise() {
        const raiseAmount = prompt(`Raise to (minimum ${this.currentBet + this.bigBlind}):`);
        if (!raiseAmount) return;
        
        const raise = parseInt(raiseAmount);
        if (raise <= this.currentBet) {
            alert('Raise must be higher than current bet!');
            return;
        }
        
        const totalBet = raise - this.players[0].bet;
        if (totalBet > this.players[0].chips) {
            alert('Not enough chips!');
            return;
        }
        
        this.players[0].chips -= totalBet;
        this.pot += totalBet;
        this.players[0].bet = raise;
        this.currentBet = raise;
        
        document.getElementById('gameMessage').textContent = `You raised to ${raise} eGold!`;
        this.nextPlayer();
    },
    
    playerFold() {
        this.players[0].folded = true;
        document.getElementById('gameMessage').textContent = 'You folded.';
        this.nextPlayer();
    },
    
    nextPlayer() {
        this.renderTable();
        
        // Check if betting round is complete
        const activePlayers = this.players.filter(p => !p.folded);
        if (activePlayers.length === 1) {
            this.endHand(activePlayers[0]);
            return;
        }
        
        const allBetsEqual = activePlayers.every(p => p.bet === this.currentBet);
        if (allBetsEqual) {
            this.nextPhase();
            return;
        }
        
        // Move to next player
        do {
            this.playerTurn = (this.playerTurn + 1) % this.playerCount;
        } while (this.players[this.playerTurn].folded);
        
        this.renderTable();
        
        if (this.playerTurn !== 0) {
            setTimeout(() => this.aiTurn(), 1000);
        }
    },
    
    aiTurn() {
        const player = this.players[this.playerTurn];
        const callAmount = this.currentBet - player.bet;
        
        // Simple AI logic
        const action = Math.random();
        if (callAmount === 0) {
            document.getElementById('gameMessage').textContent = `${player.name} checks.`;
        } else if (action < 0.3) {
            player.folded = true;
            document.getElementById('gameMessage').textContent = `${player.name} folds.`;
        } else if (action < 0.9) {
            player.chips -= callAmount;
            player.bet = this.currentBet;
            this.pot += callAmount;
            document.getElementById('gameMessage').textContent = `${player.name} calls ${callAmount}.`;
        } else {
            const raiseAmount = this.bigBlind * 2;
            player.chips -= (callAmount + raiseAmount);
            player.bet = this.currentBet + raiseAmount;
            this.pot += (callAmount + raiseAmount);
            this.currentBet = player.bet;
            document.getElementById('gameMessage').textContent = `${player.name} raises ${raiseAmount}!`;
        }
        
        setTimeout(() => this.nextPlayer(), 800);
    },
    
    nextPhase() {
        // Reset bets for next round
        this.players.forEach(p => p.bet = 0);
        this.currentBet = 0;
        
        if (this.gamePhase === 'preflop') {
            // Deal flop
            this.communityCards = [this.deck.pop(), this.deck.pop(), this.deck.pop()];
            this.gamePhase = 'flop';
            document.getElementById('gameMessage').textContent = 'Flop dealt!';
        } else if (this.gamePhase === 'flop') {
            // Deal turn
            this.communityCards.push(this.deck.pop());
            this.gamePhase = 'turn';
            document.getElementById('gameMessage').textContent = 'Turn dealt!';
        } else if (this.gamePhase === 'turn') {
            // Deal river
            this.communityCards.push(this.deck.pop());
            this.gamePhase = 'river';
            document.getElementById('gameMessage').textContent = 'River dealt!';
        } else {
            // Showdown
            this.showdown();
            return;
        }
        
        this.playerTurn = (this.dealer + 1) % this.playerCount;
        while (this.players[this.playerTurn].folded) {
            this.playerTurn = (this.playerTurn + 1) % this.playerCount;
        }
        
        this.renderTable();
        
        if (this.playerTurn !== 0) {
            setTimeout(() => this.aiTurn(), 1000);
        }
    },
    
    showdown() {
        this.gamePhase = 'showdown';
        const activePlayers = this.players.filter(p => !p.folded);
        
        // Evaluate hands
        let bestPlayer = activePlayers[0];
        let bestScore = this.evaluateHand([...bestPlayer.cards, ...this.communityCards]);
        
        activePlayers.forEach(player => {
            const score = this.evaluateHand([...player.cards, ...this.communityCards]);
            if (score > bestScore) {
                bestScore = score;
                bestPlayer = player;
            }
        });
        
        this.endHand(bestPlayer);
    },
    
    endHand(winner) {
        winner.chips += this.pot;
        
        if (winner.isHuman) {
            updateBalance(this.pot);
        }
        
        this.renderTable();
        document.getElementById('gameMessage').innerHTML = `
            <div style="font-size: 1.5em; color: #2ecc71; font-weight: bold;">
                ${winner.name} wins ${this.pot} eGold! ($${(this.pot * 0.10).toFixed(2)} USD)
            </div>
            <button onclick="holdemTableGame.nextHand()" class="game-button" style="margin-top: 20px;">
                Deal Next Hand
            </button>
        `;
    },
    
    nextHand() {
        this.dealer = (this.dealer + 1) % this.playerCount;
        this.dealNewHand();
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
    
    evaluateHand(cards) {
        const values = cards.map(c => c.numValue).sort((a, b) => b - a);
        const suits = cards.map(c => c.suit);
        const isFlush = suits.filter(s => s === suits[0]).length >= 5;
        
        const valueCounts = {};
        for (const v of values) {
            valueCounts[v] = (valueCounts[v] || 0) + 1;
        }
        
        const counts = Object.values(valueCounts).sort((a, b) => b - a);
        let score = Math.max(...values);
        
        if (counts[0] === 4) score = 800;
        else if (counts[0] === 3 && counts[1] === 2) score = 700;
        else if (isFlush) score = 600;
        else if (counts[0] === 3) score = 400;
        else if (counts[0] === 2 && counts[1] === 2) score = 300;
        else if (counts[0] === 2) score = 200;
        
        return score;
    }
};

window.holdemTableGame = holdemTableGame;
