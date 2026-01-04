// Texas Hold'em Poker Game

let holdemGame;

function initTexasHoldem(container) {
    holdemGame = new TexasHoldemGame();
    holdemGame.init(container);
}

class TexasHoldemGame {
    constructor() {
        this.deck = new Deck();
        this.players = [];
        this.communityCards = [];
        this.pot = 0;
        this.currentBet = 0;
        this.dealerPosition = 0;
        this.currentPlayerIndex = 0;
        this.gamePhase = 'setup'; // setup, preflop, flop, turn, river, showdown
        this.smallBlind = 5;
        this.bigBlind = 10;
        this.playerMoney = currentBalance;
    }

    init(container) {
        container.innerHTML = `
            <div class="game-info">
                <h3>Texas Hold'em Rules</h3>
                <p>Make the best 5-card hand using any combination of your 2 hole cards and 5 community cards.</p>
                <p>Small Blind: ${this.smallBlind} eGold | Big Blind: ${this.bigBlind} eGold</p>
            </div>

            <div class="betting-setup">
                <h3>Start New Hand</h3>
                <label for="buyIn">Buy-in Amount (eGold):</label>
                <input type="number" id="buyIn" min="${this.bigBlind}" max="${currentBalance}" value="100" step="10">
                <button onclick="holdemGame.startHand()" class="btn-play">Deal Cards</button>
            </div>

            <div id="pokerTable" style="display: none;">
                <div class="poker-table">
                    <div class="pot-display">
                        Pot: <span id="potAmount">0</span> eGold
                    </div>

                    <!-- AI Players -->
                    <div id="aiPlayers" class="ai-players-container"></div>

                    <!-- Community Cards -->
                    <div class="community-cards" id="communityCards"></div>

                    <!-- Current Bet Display -->
                    <div class="current-bet-display">
                        Current Bet: <span id="currentBetAmount">0</span> eGold
                    </div>

                    <!-- Player Hand -->
                    <div class="player-hand" id="playerHand">
                        <h4>Your Hand</h4>
                        <div class="cards-display" id="playerCards"></div>
                        <div class="player-info">
                            <span>Chips: <span id="playerChips">${this.playerMoney}</span> eGold</span>
                        </div>
                    </div>
                </div>

                <!-- Betting Controls -->
                <div class="betting-controls" id="bettingControls">
                    <button onclick="holdemGame.playerAction('fold')" class="bet-btn" id="foldBtn">Fold</button>
                    <button onclick="holdemGame.playerAction('check')" class="bet-btn" id="checkBtn">Check</button>
                    <button onclick="holdemGame.playerAction('call')" class="bet-btn" id="callBtn">Call <span id="callAmount">0</span></button>
                    <div class="raise-controls">
                        <input type="number" id="raiseAmount" min="${this.currentBet + this.bigBlind}" value="${this.bigBlind * 2}" step="${this.bigBlind}">
                        <button onclick="holdemGame.playerAction('raise')" class="bet-btn" id="raiseBtn">Raise</button>
                    </div>
                    <button onclick="holdemGame.playerAction('allin')" class="bet-btn" id="allinBtn">All-In</button>
                </div>

                <div id="gameMessages" class="game-message"></div>
            </div>
        `;

        this.container = container;
    }

    startHand() {
        const buyIn = parseFloat(document.getElementById('buyIn').value);
        
        if (buyIn > currentBalance) {
            alert('Insufficient balance!');
            return;
        }

        if (buyIn < this.bigBlind) {
            alert(`Minimum buy-in is ${this.bigBlind} eGold`);
            return;
        }

        this.playerMoney = buyIn;
        updateBalance(-buyIn);

        // Setup players
        this.players = [
            { name: 'You', chips: buyIn, hand: [], currentBet: 0, folded: false, isHuman: true },
            new AIPlayer('AI Player 1', 500, 'aggressive'),
            new AIPlayer('AI Player 2', 500, 'balanced'),
            new AIPlayer('AI Player 3', 500, 'passive')
        ];

        document.querySelector('.betting-setup').style.display = 'none';
        document.getElementById('pokerTable').style.display = 'block';

        this.dealNewHand();
    }

    dealNewHand() {
        this.deck.reset();
        this.communityCards = [];
        this.pot = 0;
        this.currentBet = 0;
        this.gamePhase = 'preflop';

        // Reset players
        this.players.forEach(player => {
            player.hand = [];
            player.currentBet = 0;
            player.folded = false;
        });

        // Post blinds
        this.postBlinds();

        // Deal 2 cards to each player
        for (let i = 0; i < 2; i++) {
            this.players.forEach(player => {
                player.hand.push(...this.deck.deal(1));
            });
        }

        this.currentPlayerIndex = (this.dealerPosition + 3) % this.players.length;
        this.updateDisplay();
        this.showMessage('Cards dealt! Make your move.');
        
        if (!this.players[this.currentPlayerIndex].isHuman) {
            setTimeout(() => this.aiTurn(), 1000);
        }
    }

    postBlinds() {
        const sbIndex = (this.dealerPosition + 1) % this.players.length;
        const bbIndex = (this.dealerPosition + 2) % this.players.length;

        this.makeBet(this.players[sbIndex], this.smallBlind);
        this.makeBet(this.players[bbIndex], this.bigBlind);
        this.currentBet = this.bigBlind;
    }

    makeBet(player, amount) {
        const betAmount = Math.min(amount, player.chips);
        player.chips -= betAmount;
        player.currentBet += betAmount;
        this.pot += betAmount;
    }

    playerAction(action) {
        const player = this.players[0];
        
        if (player.folded) return;

        switch(action) {
            case 'fold':
                player.folded = true;
                this.showMessage('You folded.');
                break;
            
            case 'check':
                if (this.currentBet > player.currentBet) {
                    this.showMessage('Cannot check - you must call or fold');
                    return;
                }
                this.showMessage('You checked.');
                break;
            
            case 'call':
                const callAmount = this.currentBet - player.currentBet;
                if (callAmount > player.chips) {
                    this.showMessage('Insufficient chips to call');
                    return;
                }
                this.makeBet(player, callAmount);
                this.showMessage(`You called ${callAmount} eGold`);
                break;
            
            case 'raise':
                const raiseAmount = parseInt(document.getElementById('raiseAmount').value);
                const totalRaise = raiseAmount - player.currentBet;
                
                if (totalRaise > player.chips) {
                    this.showMessage('Insufficient chips to raise');
                    return;
                }
                
                if (raiseAmount <= this.currentBet) {
                    this.showMessage('Raise must be higher than current bet');
                    return;
                }
                
                this.makeBet(player, totalRaise);
                this.currentBet = raiseAmount;
                this.showMessage(`You raised to ${raiseAmount} eGold`);
                break;
            
            case 'allin':
                this.makeBet(player, player.chips);
                this.currentBet = Math.max(this.currentBet, player.currentBet);
                this.showMessage('You went all-in!');
                break;
        }

        this.updateDisplay();
        this.nextPlayer();
    }

    aiTurn() {
        const player = this.players[this.currentPlayerIndex];
        
        if (player.folded || player.chips === 0) {
            this.nextPlayer();
            return;
        }

        const decision = player.makeDecision({
            currentBet: this.currentBet,
            pot: this.pot,
            communityCards: this.communityCards
        });

        switch(decision) {
            case 'fold':
                player.folded = true;
                this.showMessage(`${player.name} folded.`);
                break;
            
            case 'check':
                this.showMessage(`${player.name} checked.`);
                break;
            
            case 'call':
                const callAmount = this.currentBet - player.currentBet;
                this.makeBet(player, callAmount);
                this.showMessage(`${player.name} called ${callAmount} eGold.`);
                break;
            
            case 'raise':
                const raiseAmount = player.getRaiseAmount(
                    this.currentBet + this.bigBlind,
                    Math.min(this.currentBet * 3, player.chips + player.currentBet)
                );
                const totalRaise = raiseAmount - player.currentBet;
                this.makeBet(player, totalRaise);
                this.currentBet = raiseAmount;
                this.showMessage(`${player.name} raised to ${raiseAmount} eGold.`);
                break;
        }

        this.updateDisplay();
        setTimeout(() => this.nextPlayer(), 1500);
    }

    nextPlayer() {
        // Check if betting round is complete
        const activePlayers = this.players.filter(p => !p.folded && p.chips > 0);
        const allMatched = activePlayers.every(p => p.currentBet === this.currentBet || p.chips === 0);

        if (allMatched) {
            this.nextPhase();
            return;
        }

        // Move to next player
        do {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        } while (this.players[this.currentPlayerIndex].folded || this.players[this.currentPlayerIndex].chips === 0);

        if (!this.players[this.currentPlayerIndex].isHuman) {
            setTimeout(() => this.aiTurn(), 1000);
        }
    }

    nextPhase() {
        // Reset current bets
        this.players.forEach(p => p.currentBet = 0);
        this.currentBet = 0;

        switch(this.gamePhase) {
            case 'preflop':
                this.dealFlop();
                break;
            case 'flop':
                this.dealTurn();
                break;
            case 'turn':
                this.dealRiver();
                break;
            case 'river':
                this.showdown();
                return;
        }

        this.currentPlayerIndex = (this.dealerPosition + 1) % this.players.length;
        while (this.players[this.currentPlayerIndex].folded || this.players[this.currentPlayerIndex].chips === 0) {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        }

        this.updateDisplay();
        
        if (!this.players[this.currentPlayerIndex].isHuman) {
            setTimeout(() => this.aiTurn(), 1000);
        }
    }

    dealFlop() {
        this.deck.deal(1); // Burn card
        this.communityCards.push(...this.deck.deal(3));
        this.gamePhase = 'flop';
        this.showMessage('Flop dealt!');
    }

    dealTurn() {
        this.deck.deal(1); // Burn card
        this.communityCards.push(...this.deck.deal(1));
        this.gamePhase = 'turn';
        this.showMessage('Turn dealt!');
    }

    dealRiver() {
        this.deck.deal(1); // Burn card
        this.communityCards.push(...this.deck.deal(1));
        this.gamePhase = 'river';
        this.showMessage('River dealt!');
    }

    showdown() {
        this.gamePhase = 'showdown';
        const activePlayers = this.players.filter(p => !p.folded);
        
        if (activePlayers.length === 1) {
            const winner = activePlayers[0];
            winner.chips += this.pot;
            
            if (winner.isHuman) {
                updateBalance(winner.chips);
            }
            
            this.showMessage(`${winner.name} wins ${this.pot} eGold!`);
        } else {
            const evaluations = activePlayers.map(player => ({
                player: player,
                hand: HandEvaluator.evaluateHand([...player.hand, ...this.communityCards])
            }));

            evaluations.sort((a, b) => HandEvaluator.compareHands(b.hand, a.hand));
            const winner = evaluations[0].player;
            
            winner.chips += this.pot;
            
            if (winner.isHuman) {
                updateBalance(winner.chips);
            }

            this.showMessage(`${winner.name} wins with ${evaluations[0].hand.name}! Won ${this.pot} eGold`);
        }

        this.updateDisplay();

        setTimeout(() => {
            if (confirm('Play another hand?')) {
                if (this.players[0].chips < this.bigBlind) {
                    alert('You don\'t have enough chips. Please buy-in again.');
                    document.querySelector('.betting-setup').style.display = 'block';
                    document.getElementById('pokerTable').style.display = 'none';
                } else {
                    this.dealNewHand();
                }
            } else {
                updateBalance(this.players[0].chips);
                document.querySelector('.betting-setup').style.display = 'block';
                document.getElementById('pokerTable').style.display = 'none';
            }
        }, 3000);
    }

    updateDisplay() {
        // Update pot
        document.getElementById('potAmount').textContent = this.pot;
        document.getElementById('currentBetAmount').textContent = this.currentBet;

        // Update player cards
        const playerCardsDiv = document.getElementById('playerCards');
        playerCardsDiv.innerHTML = this.players[0].hand.map(card => 
            `<div class="card ${card.getColor()}">${card.getDisplayValue()}</div>`
        ).join('');

        // Update player chips
        document.getElementById('playerChips').textContent = this.players[0].chips.toFixed(2);

        // Update community cards
        const communityDiv = document.getElementById('communityCards');
        communityDiv.innerHTML = this.communityCards.map(card => 
            `<div class="card ${card.getColor()}">${card.getDisplayValue()}</div>`
        ).join('');

        // Update AI players
        const aiDiv = document.getElementById('aiPlayers');
        aiDiv.innerHTML = this.players.slice(1).map((player, idx) => `
            <div class="player-position" style="top: ${20 + idx * 100}px; right: 20px;">
                <strong>${player.name}</strong>
                <div>${player.folded ? 'FOLDED' : '🂠🂠'}</div>
                <div>Chips: ${player.chips} eGold</div>
                <div>Bet: ${player.currentBet} eGold</div>
            </div>
        `).join('');

        // Update buttons
        const player = this.players[0];
        const canCheck = this.currentBet === player.currentBet;
        const callAmount = this.currentBet - player.currentBet;
        
        document.getElementById('checkBtn').disabled = !canCheck || player.folded;
        document.getElementById('callBtn').disabled = canCheck || player.folded;
        document.getElementById('callAmount').textContent = callAmount;
        document.getElementById('foldBtn').disabled = player.folded;
        document.getElementById('raiseBtn').disabled = player.folded;
        document.getElementById('allinBtn').disabled = player.folded;
    }

    showMessage(msg) {
        document.getElementById('gameMessages').textContent = msg;
    }
}
