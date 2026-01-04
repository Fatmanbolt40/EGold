// Tonk Card Game

let tonkGame;

function initTonk(container) {
    tonkGame = new TonkGame();
    tonkGame.init(container);
}

class TonkGame {
    constructor() {
        this.deck = new Deck();
        this.player = { hand: [], score: 0, money: currentBalance };
        this.dealer = { hand: [], score: 0 };
        this.discardPile = [];
        this.betAmount = 10;
        this.gameActive = false;
    }

    init(container) {
        container.innerHTML = `
            <div class="game-info">
                <h3>Tonk Rules</h3>
                <p>Get spreads (3+ cards of same rank or sequential same suit). Lowest hand value wins!</p>
                <p>Face cards = 10, Aces = 1, others = face value. Tonk = win on deal if total = 49 or 50.</p>
            </div>

            <div class="betting-setup" id="tonkSetup">
                <h3>Place Your Bet</h3>
                <label for="tonkBet">Bet Amount (eGold):</label>
                <input type="number" id="tonkBet" min="5" max="${currentBalance}" value="10" step="5">
                <button onclick="tonkGame.startGame()" class="btn-play">Deal Cards</button>
            </div>

            <div id="tonkTable" style="display: none;">
                <div class="game-info">
                    <p>Bet: <span id="tonkBetAmount">0</span> eGold | Your Money: <span id="tonkPlayerMoney">${currentBalance}</span> eGold</p>
                </div>

                <div class="tonk-board">
                    <div class="dealer-hand">
                        <h4>Dealer Hand</h4>
                        <div id="dealerCards" class="cards-display"></div>
                        <p>Score: <span id="dealerScore">0</span></p>
                    </div>

                    <div class="discard-pile" style="text-align: center; margin: 20px 0;">
                        <h4>Discard Pile</h4>
                        <div id="discardCard" class="cards-display" style="justify-content: center;"></div>
                    </div>

                    <div class="player-hand">
                        <h4>Your Hand (Click to discard)</h4>
                        <div id="playerCards" class="cards-display"></div>
                        <p>Score: <span id="playerScore">0</span></p>
                    </div>
                </div>

                <div class="betting-controls">
                    <button onclick="tonkGame.drawFromDeck()" class="bet-btn" id="drawDeckBtn">Draw from Deck</button>
                    <button onclick="tonkGame.drawFromDiscard()" class="bet-btn" id="drawDiscardBtn">Draw from Discard</button>
                    <button onclick="tonkGame.dropHand()" class="bet-btn" id="dropBtn">Drop (End Game)</button>
                </div>

                <div id="tonkMessages" class="game-message"></div>
            </div>
        `;

        this.container = container;
    }

    startGame() {
        const bet = parseFloat(document.getElementById('tonkBet').value);
        
        if (bet > currentBalance) {
            alert('Insufficient balance!');
            return;
        }

        this.betAmount = bet;
        updateBalance(-bet);
        
        document.getElementById('tonkSetup').style.display = 'none';
        document.getElementById('tonkTable').style.display = 'block';
        
        this.dealCards();
    }

    dealCards() {
        this.deck.reset();
        this.player.hand = this.deck.deal(5);
        this.dealer.hand = this.deck.deal(5);
        this.discardPile = this.deck.deal(1);
        this.gameActive = true;

        this.calculateScores();
        this.updateDisplay();

        // Check for immediate tonk
        if (this.player.score === 49 || this.player.score === 50) {
            this.showMessage('TONK! You win double!');
            updateBalance(this.betAmount * 3);
            setTimeout(() => this.resetGame(), 2000);
            return;
        }

        if (this.dealer.score === 49 || this.dealer.score === 50) {
            this.showMessage('Dealer has TONK! You lose.');
            setTimeout(() => this.resetGame(), 2000);
            return;
        }

        this.showMessage('Your turn! Draw a card or drop.');
    }

    calculateScores() {
        this.player.score = this.calculateHandValue(this.player.hand);
        this.dealer.score = this.calculateHandValue(this.dealer.hand);
    }

    calculateHandValue(hand) {
        let total = 0;
        for (let card of hand) {
            if (card.rank === 'A') {
                total += 1;
            } else if (['J', 'Q', 'K'].includes(card.rank)) {
                total += 10;
            } else {
                total += parseInt(card.rank);
            }
        }
        return total;
    }

    drawFromDeck() {
        if (!this.gameActive) return;
        
        if (this.deck.cards.length === 0) {
            this.showMessage('Deck empty! Ending game...');
            this.dropHand();
            return;
        }

        const newCard = this.deck.deal(1)[0];
        this.player.hand.push(newCard);
        this.showMessage('Drew from deck. Click a card to discard.');
        this.updateDisplay();
        document.getElementById('drawDeckBtn').disabled = true;
        document.getElementById('drawDiscardBtn').disabled = true;
    }

    drawFromDiscard() {
        if (!this.gameActive || this.discardPile.length === 0) return;
        
        const newCard = this.discardPile.pop();
        this.player.hand.push(newCard);
        this.showMessage('Drew from discard. Click a card to discard.');
        this.updateDisplay();
        document.getElementById('drawDeckBtn').disabled = true;
        document.getElementById('drawDiscardBtn').disabled = true;
    }

    discardCard(index) {
        if (this.player.hand.length <= 5) return;
        
        const discarded = this.player.hand.splice(index, 1)[0];
        this.discardPile.push(discarded);
        
        this.calculateScores();
        this.updateDisplay();
        
        document.getElementById('drawDeckBtn').disabled = false;
        document.getElementById('drawDiscardBtn').disabled = false;
        
        // Dealer's turn
        this.dealerTurn();
    }

    dealerTurn() {
        setTimeout(() => {
            // Simple AI: draw from deck, discard highest card
            if (this.deck.cards.length > 0) {
                const newCard = this.deck.deal(1)[0];
                this.dealer.hand.push(newCard);
                
                // Discard highest value card
                const values = this.dealer.hand.map(card => {
                    if (card.rank === 'A') return 1;
                    if (['J', 'Q', 'K'].includes(card.rank)) return 10;
                    return parseInt(card.rank);
                });
                
                const maxIndex = values.indexOf(Math.max(...values));
                this.dealer.hand.splice(maxIndex, 1);
                
                this.calculateScores();
                this.updateDisplay();
                this.showMessage('Dealer drew and discarded. Your turn!');
                
                // Check if dealer wants to drop
                if (this.dealer.score <= 5) {
                    setTimeout(() => {
                        this.showMessage('Dealer drops!');
                        this.dropHand();
                    }, 1500);
                }
            }
        }, 1000);
    }

    dropHand() {
        this.gameActive = false;
        this.calculateScores();
        
        let result = '';
        if (this.player.score < this.dealer.score) {
            result = `You win! Your score: ${this.player.score} vs Dealer: ${this.dealer.score}`;
            updateBalance(this.betAmount * 2);
        } else if (this.player.score > this.dealer.score) {
            result = `You lose! Your score: ${this.player.score} vs Dealer: ${this.dealer.score}`;
        } else {
            result = `Push! Both have ${this.player.score}`;
            updateBalance(this.betAmount);
        }
        
        this.showMessage(result);
        this.updateDisplay();
        
        setTimeout(() => this.resetGame(), 3000);
    }

    resetGame() {
        if (confirm('Play another hand?')) {
            document.getElementById('tonkSetup').style.display = 'block';
            document.getElementById('tonkTable').style.display = 'none';
        }
    }

    updateDisplay() {
        document.getElementById('tonkBetAmount').textContent = this.betAmount;
        document.getElementById('tonkPlayerMoney').textContent = currentBalance.toFixed(2);
        
        const playerCardsDiv = document.getElementById('playerCards');
        const canDiscard = this.player.hand.length > 5;
        playerCardsDiv.innerHTML = this.player.hand.map((card, idx) => 
            `<div class="card ${card.getColor()}" ${canDiscard ? `onclick="tonkGame.discardCard(${idx})" style="cursor:pointer;"` : ''}>${card.getDisplayValue()}</div>`
        ).join('');
        
        const dealerCardsDiv = document.getElementById('dealerCards');
        dealerCardsDiv.innerHTML = this.dealer.hand.map(card => 
            `<div class="card ${card.getColor()}">${card.getDisplayValue()}</div>`
        ).join('');
        
        const discardDiv = document.getElementById('discardCard');
        if (this.discardPile.length > 0) {
            const topCard = this.discardPile[this.discardPile.length - 1];
            discardDiv.innerHTML = `<div class="card ${topCard.getColor()}">${topCard.getDisplayValue()}</div>`;
        }
        
        document.getElementById('playerScore').textContent = this.player.score;
        document.getElementById('dealerScore').textContent = this.dealer.score;
    }

    showMessage(msg) {
        document.getElementById('tonkMessages').textContent = msg;
    }
}
