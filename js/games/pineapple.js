// Pineapple Poker - Discard one card after the flop

let pineappleGame;

function initPineapple(container) {
    pineappleGame = new PineappleGame();
    pineappleGame.init(container);
}

class PineappleGame {
    constructor() {
        this.deck = new Deck();
        this.players = [];
        this.communityCards = [];
        this.pot = 0;
        this.currentBet = 0;
        this.dealerPosition = 0;
        this.currentPlayerIndex = 0;
        this.gamePhase = 'setup';
        this.smallBlind = 5;
        this.bigBlind = 10;
        this.playerMoney = currentBalance;
        this.discardedCards = [];
        this.hasDiscarded = false;
    }

    init(container) {
        container.innerHTML = `
            <div class="game-info">
                <h3>Pineapple Poker Rules</h3>
                <p>Start with 3 hole cards. After the flop, discard one card and play with the remaining 2 cards.</p>
                <p>Small Blind: ${this.smallBlind} eGold | Big Blind: ${this.bigBlind} eGold</p>
            </div>

            <div class="betting-setup">
                <h3>Start New Hand</h3>
                <label for="buyInPineapple">Buy-in Amount (eGold):</label>
                <input type="number" id="buyInPineapple" min="${this.bigBlind}" max="${currentBalance}" value="100" step="10">
                <button onclick="pineappleGame.startHand()" class="btn-play">Deal Cards</button>
            </div>

            <div id="pineappleTable" style="display: none;">
                <div class="poker-table">
                    <div class="pot-display">
                        Pot: <span id="pineapplePot">0</span> eGold
                    </div>

                    <div id="pineappleAiPlayers" class="ai-players-container"></div>

                    <div class="community-cards" id="pineappleCommunity"></div>

                    <div class="current-bet-display">
                        Current Bet: <span id="pineappleCurrentBet">0</span> eGold
                    </div>

                    <div class="player-hand">
                        <h4>Your Hand <span id="discardPrompt"></span></h4>
                        <div class="cards-display" id="pineapplePlayerCards"></div>
                        <div class="player-info">
                            <span>Chips: <span id="pineapplePlayerChips">0</span> eGold</span>
                        </div>
                    </div>
                </div>

                <div class="betting-controls" id="pineappleBettingControls">
                    <button onclick="pineappleGame.playerAction('fold')" class="bet-btn">Fold</button>
                    <button onclick="pineappleGame.playerAction('check')" class="bet-btn" id="pineappleCheckBtn">Check</button>
                    <button onclick="pineappleGame.playerAction('call')" class="bet-btn" id="pineappleCallBtn">Call <span id="pineappleCallAmount">0</span></button>
                    <div class="raise-controls">
                        <input type="number" id="pineappleRaiseAmount" min="${this.bigBlind * 2}" value="${this.bigBlind * 2}" step="${this.bigBlind}">
                        <button onclick="pineappleGame.playerAction('raise')" class="bet-btn">Raise</button>
                    </div>
                    <button onclick="pineappleGame.playerAction('allin')" class="bet-btn">All-In</button>
                </div>

                <div id="pineappleMessages" class="game-message"></div>
            </div>
        `;

        this.container = container;
    }

    startHand() {
        const buyIn = parseFloat(document.getElementById('buyInPineapple').value);
        
        if (buyIn > currentBalance) {
            alert('Insufficient balance!');
            return;
        }

        this.playerMoney = buyIn;
        updateBalance(-buyIn);

        this.players = [
            { name: 'You', chips: buyIn, hand: [], currentBet: 0, folded: false, isHuman: true },
            new AIPlayer('AI Player 1', 500, 'aggressive'),
            new AIPlayer('AI Player 2', 500, 'balanced')
        ];

        document.querySelector('.betting-setup').style.display = 'none';
        document.getElementById('pineappleTable').style.display = 'block';

        this.dealNewHand();
    }

    dealNewHand() {
        this.deck.reset();
        this.communityCards = [];
        this.pot = 0;
        this.currentBet = 0;
        this.gamePhase = 'preflop';
        this.hasDiscarded = false;

        this.players.forEach(player => {
            player.hand = [];
            player.currentBet = 0;
            player.folded = false;
        });

        this.postBlinds();

        // Deal 3 cards to each player
        for (let i = 0; i < 3; i++) {
            this.players.forEach(player => {
                player.hand.push(...this.deck.deal(1));
            });
        }

        this.currentPlayerIndex = (this.dealerPosition + 3) % this.players.length;
        this.updateDisplay();
        this.showMessage('Cards dealt! You have 3 cards. After the flop, you\'ll discard one.');
        
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

    discardCard(cardIndex) {
        if (!this.hasDiscarded && this.gamePhase === 'flop') {
            const player = this.players[0];
            this.discardedCards.push(player.hand.splice(cardIndex, 1)[0]);
            this.hasDiscarded = true;
            this.showMessage('Card discarded! Continue playing.');
            this.updateDisplay();
            
            if (!this.players[this.currentPlayerIndex].isHuman) {
                setTimeout(() => this.aiTurn(), 1000);
            }
        }
    }

    playerAction(action) {
        const player = this.players[0];
        
        if (player.folded) return;

        // Check if player needs to discard first
        if (this.gamePhase === 'flop' && !this.hasDiscarded && this.currentPlayerIndex === 0) {
            this.showMessage('Please discard one card first!');
            return;
        }

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
                this.makeBet(player, callAmount);
                this.showMessage(`You called ${callAmount} eGold`);
                break;
            
            case 'raise':
                const raiseAmount = parseInt(document.getElementById('pineappleRaiseAmount').value);
                const totalRaise = raiseAmount - player.currentBet;
                
                if (totalRaise > player.chips) {
                    this.showMessage('Insufficient chips');
                    return;
                }
                
                this.makeBet(player, totalRaise);
                this.currentBet = raiseAmount;
                this.showMessage(`You raised to ${raiseAmount} eGold`);
                break;
            
            case 'allin':
                this.makeBet(player, player.chips);
                this.currentBet = Math.max(this.currentBet, player.currentBet);
                this.showMessage('All-in!');
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

        // AI discards weakest card after flop
        if (this.gamePhase === 'flop' && player.hand.length === 3) {
            const values = player.hand.map(card => HandEvaluator.getRankValue(card.rank));
            const minIndex = values.indexOf(Math.min(...values));
            player.hand.splice(minIndex, 1);
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
                this.showMessage(`${player.name} called.`);
                break;
            case 'raise':
                const raiseAmount = player.getRaiseAmount(this.currentBet + this.bigBlind, player.chips);
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
        const activePlayers = this.players.filter(p => !p.folded && p.chips > 0);
        const allMatched = activePlayers.every(p => p.currentBet === this.currentBet || p.chips === 0);

        if (allMatched) {
            this.nextPhase();
            return;
        }

        do {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        } while (this.players[this.currentPlayerIndex].folded || this.players[this.currentPlayerIndex].chips === 0);

        if (!this.players[this.currentPlayerIndex].isHuman) {
            setTimeout(() => this.aiTurn(), 1000);
        }
    }

    nextPhase() {
        this.players.forEach(p => p.currentBet = 0);
        this.currentBet = 0;

        switch(this.gamePhase) {
            case 'preflop':
                this.dealFlop();
                return; // Don't continue - wait for discard
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

        this.currentPlayerIndex = 0;
        this.updateDisplay();
        
        if (!this.players[this.currentPlayerIndex].isHuman) {
            setTimeout(() => this.aiTurn(), 1000);
        }
    }

    dealFlop() {
        this.deck.deal(1);
        this.communityCards.push(...this.deck.deal(3));
        this.gamePhase = 'flop';
        this.showMessage('Flop dealt! Click a card to discard it.');
        this.updateDisplay();
    }

    dealTurn() {
        this.deck.deal(1);
        this.communityCards.push(...this.deck.deal(1));
        this.gamePhase = 'turn';
        this.showMessage('Turn dealt!');
    }

    dealRiver() {
        this.deck.deal(1);
        this.communityCards.push(...this.deck.deal(1));
        this.gamePhase = 'river';
        this.showMessage('River dealt!');
    }

    showdown() {
        const activePlayers = this.players.filter(p => !p.folded);
        
        if (activePlayers.length === 1) {
            const winner = activePlayers[0];
            winner.chips += this.pot;
            if (winner.isHuman) updateBalance(winner.chips);
            this.showMessage(`${winner.name} wins ${this.pot} eGold!`);
        } else {
            const evaluations = activePlayers.map(player => ({
                player: player,
                hand: HandEvaluator.evaluateHand([...player.hand, ...this.communityCards])
            }));

            evaluations.sort((a, b) => HandEvaluator.compareHands(b.hand, a.hand));
            const winner = evaluations[0].player;
            
            winner.chips += this.pot;
            if (winner.isHuman) updateBalance(winner.chips);

            this.showMessage(`${winner.name} wins with ${evaluations[0].hand.name}! ${this.pot} eGold`);
        }

        setTimeout(() => {
            if (confirm('Play again?')) {
                this.dealNewHand();
            } else {
                updateBalance(this.players[0].chips);
                location.reload();
            }
        }, 3000);
    }

    updateDisplay() {
        document.getElementById('pineapplePot').textContent = this.pot;
        document.getElementById('pineappleCurrentBet').textContent = this.currentBet;

        const playerCardsDiv = document.getElementById('pineapplePlayerCards');
        const needsDiscard = this.gamePhase === 'flop' && !this.hasDiscarded;
        
        playerCardsDiv.innerHTML = this.players[0].hand.map((card, idx) => 
            `<div class="card ${card.getColor()}" ${needsDiscard ? `onclick="pineappleGame.discardCard(${idx})" style="cursor:pointer;border:2px solid #f39c12;"` : ''}>${card.getDisplayValue()}</div>`
        ).join('');

        document.getElementById('discardPrompt').textContent = needsDiscard ? '(Click to discard)' : '';
        document.getElementById('pineapplePlayerChips').textContent = this.players[0].chips.toFixed(2);

        const communityDiv = document.getElementById('pineappleCommunity');
        communityDiv.innerHTML = this.communityCards.map(card => 
            `<div class="card ${card.getColor()}">${card.getDisplayValue()}</div>`
        ).join('');

        const aiDiv = document.getElementById('pineappleAiPlayers');
        aiDiv.innerHTML = this.players.slice(1).map((player, idx) => `
            <div class="player-position" style="top: ${20 + idx * 120}px; right: 20px;">
                <strong>${player.name}</strong>
                <div>${player.folded ? 'FOLDED' : (player.hand.length === 3 ? '🂠🂠🂠' : '🂠🂠')}</div>
                <div>Chips: ${player.chips} eGold</div>
            </div>
        `).join('');
    }

    showMessage(msg) {
        document.getElementById('pineappleMessages').textContent = msg;
    }
}
