// Omaha Poker Game (4-card variant)

let omahaGame;

function initOmaha(container) {
    omahaGame = new OmahaGame();
    omahaGame.init(container);
}

class OmahaGame {
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
    }

    init(container) {
        container.innerHTML = `
            <div class="game-info">
                <h3>Omaha Poker Rules</h3>
                <p>Each player receives 4 hole cards. You MUST use exactly 2 cards from your hand and 3 from the board.</p>
                <p>Small Blind: ${this.smallBlind} eGold | Big Blind: ${this.bigBlind} eGold</p>
            </div>

            <div class="betting-setup">
                <h3>Start New Hand</h3>
                <label for="buyInOmaha">Buy-in Amount (eGold):</label>
                <input type="number" id="buyInOmaha" min="${this.bigBlind}" max="${currentBalance}" value="100" step="10">
                <button onclick="omahaGame.startHand()" class="btn-play">Deal Cards</button>
            </div>

            <div id="omahaTable" style="display: none;">
                <div class="poker-table">
                    <div class="pot-display">
                        Pot: <span id="omahaPot">0</span> eGold
                    </div>

                    <div id="omahaAiPlayers" class="ai-players-container"></div>

                    <div class="community-cards" id="omahaCommunity"></div>

                    <div class="current-bet-display">
                        Current Bet: <span id="omahaCurrentBet">0</span> eGold
                    </div>

                    <div class="player-hand" id="omahaPlayerHand">
                        <h4>Your Hand (Select 2 cards for final hand)</h4>
                        <div class="cards-display" id="omahaPlayerCards"></div>
                        <div class="player-info">
                            <span>Chips: <span id="omahaPlayerChips">0</span> eGold</span>
                        </div>
                    </div>
                </div>

                <div class="betting-controls" id="omahaBettingControls">
                    <button onclick="omahaGame.playerAction('fold')" class="bet-btn" id="omahaFoldBtn">Fold</button>
                    <button onclick="omahaGame.playerAction('check')" class="bet-btn" id="omahaCheckBtn">Check</button>
                    <button onclick="omahaGame.playerAction('call')" class="bet-btn" id="omahaCallBtn">Call <span id="omahaCallAmount">0</span></button>
                    <div class="raise-controls">
                        <input type="number" id="omahaRaiseAmount" min="${this.bigBlind * 2}" value="${this.bigBlind * 2}" step="${this.bigBlind}">
                        <button onclick="omahaGame.playerAction('raise')" class="bet-btn" id="omahaRaiseBtn">Raise</button>
                    </div>
                    <button onclick="omahaGame.playerAction('allin')" class="bet-btn" id="omahaAllinBtn">All-In</button>
                </div>

                <div id="omahaMessages" class="game-message"></div>
            </div>
        `;

        this.container = container;
    }

    startHand() {
        const buyIn = parseFloat(document.getElementById('buyInOmaha').value);
        
        if (buyIn > currentBalance) {
            alert('Insufficient balance!');
            return;
        }

        this.playerMoney = buyIn;
        updateBalance(-buyIn);

        this.players = [
            { name: 'You', chips: buyIn, hand: [], currentBet: 0, folded: false, isHuman: true },
            new AIPlayer('AI Player 1', 500, 'aggressive'),
            new AIPlayer('AI Player 2', 500, 'balanced'),
            new AIPlayer('AI Player 3', 500, 'passive')
        ];

        document.querySelector('.betting-setup').style.display = 'none';
        document.getElementById('omahaTable').style.display = 'block';

        this.dealNewHand();
    }

    dealNewHand() {
        this.deck.reset();
        this.communityCards = [];
        this.pot = 0;
        this.currentBet = 0;
        this.gamePhase = 'preflop';

        this.players.forEach(player => {
            player.hand = [];
            player.currentBet = 0;
            player.folded = false;
        });

        this.postBlinds();

        // Deal 4 cards to each player (Omaha rule)
        for (let i = 0; i < 4; i++) {
            this.players.forEach(player => {
                player.hand.push(...this.deck.deal(1));
            });
        }

        this.currentPlayerIndex = (this.dealerPosition + 3) % this.players.length;
        this.updateDisplay();
        this.showMessage('Cards dealt! Remember: use exactly 2 from your hand and 3 from the board.');
        
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
                const raiseAmount = parseInt(document.getElementById('omahaRaiseAmount').value);
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
        this.deck.deal(1);
        this.communityCards.push(...this.deck.deal(3));
        this.gamePhase = 'flop';
        this.showMessage('Flop dealt!');
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

    evaluateOmahaHand(playerHand, communityCards) {
        // Must use exactly 2 from hand and 3 from board
        const handCombos = this.getCombinations(playerHand, 2);
        const boardCombos = this.getCombinations(communityCards, 3);
        
        let bestHand = { rank: 0, name: 'High Card', value: 0 };
        
        for (let handCombo of handCombos) {
            for (let boardCombo of boardCombos) {
                const fiveCards = [...handCombo, ...boardCombo];
                const evaluation = HandEvaluator.evaluateFiveCards(fiveCards);
                
                if (evaluation.rank > bestHand.rank || 
                    (evaluation.rank === bestHand.rank && evaluation.value > bestHand.value)) {
                    bestHand = evaluation;
                }
            }
        }
        
        return bestHand;
    }

    getCombinations(array, size) {
        if (size > array.length) return [];
        if (size === array.length) return [array];
        if (size === 1) return array.map(item => [item]);

        const combinations = [];
        for (let i = 0; i <= array.length - size; i++) {
            const head = array[i];
            const tailCombinations = this.getCombinations(array.slice(i + 1), size - 1);
            for (let tail of tailCombinations) {
                combinations.push([head, ...tail]);
            }
        }
        return combinations;
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
                hand: this.evaluateOmahaHand(player.hand, this.communityCards)
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
                    document.getElementById('omahaTable').style.display = 'none';
                } else {
                    this.dealNewHand();
                }
            } else {
                updateBalance(this.players[0].chips);
                document.querySelector('.betting-setup').style.display = 'block';
                document.getElementById('omahaTable').style.display = 'none';
            }
        }, 3000);
    }

    updateDisplay() {
        document.getElementById('omahaPot').textContent = this.pot;
        document.getElementById('omahaCurrentBet').textContent = this.currentBet;

        const playerCardsDiv = document.getElementById('omahaPlayerCards');
        playerCardsDiv.innerHTML = this.players[0].hand.map(card => 
            `<div class="card ${card.getColor()}">${card.getDisplayValue()}</div>`
        ).join('');

        document.getElementById('omahaPlayerChips').textContent = this.players[0].chips.toFixed(2);

        const communityDiv = document.getElementById('omahaCommunity');
        communityDiv.innerHTML = this.communityCards.map(card => 
            `<div class="card ${card.getColor()}">${card.getDisplayValue()}</div>`
        ).join('');

        const aiDiv = document.getElementById('omahaAiPlayers');
        aiDiv.innerHTML = this.players.slice(1).map((player, idx) => `
            <div class="player-position" style="top: ${20 + idx * 100}px; right: 20px;">
                <strong>${player.name}</strong>
                <div>${player.folded ? 'FOLDED' : '🂠🂠🂠🂠'}</div>
                <div>Chips: ${player.chips} eGold</div>
                <div>Bet: ${player.currentBet} eGold</div>
            </div>
        `).join('');

        const player = this.players[0];
        const canCheck = this.currentBet === player.currentBet;
        const callAmount = this.currentBet - player.currentBet;
        
        document.getElementById('omahaCheckBtn').disabled = !canCheck || player.folded;
        document.getElementById('omahaCallBtn').disabled = canCheck || player.folded;
        document.getElementById('omahaCallAmount').textContent = callAmount;
        document.getElementById('omahaFoldBtn').disabled = player.folded;
        document.getElementById('omahaRaiseBtn').disabled = player.folded;
        document.getElementById('omahaAllinBtn').disabled = player.folded;
    }

    showMessage(msg) {
        document.getElementById('omahaMessages').textContent = msg;
    }
}
