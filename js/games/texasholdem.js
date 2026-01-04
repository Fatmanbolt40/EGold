// Texas Hold'em Poker - Clean Implementation
const texasholdemGame = {
    deck: [],
    playerHand: [],
    dealerHand: [],
    communityCards: [],
    pot: 0,
    playerBet: 0,
    currentBet: 10,
    gamePhase: 'betting', // betting, flop, turn, river, showdown
    
    init() {
        this.newRound();
        this.render();
    },
    
    newRound() {
        this.deck = this.createDeck();
        this.shuffleDeck();
        this.playerHand = [this.drawCard(), this.drawCard()];
        this.dealerHand = [this.drawCard(), this.drawCard()];
        this.communityCards = [];
        this.pot = 0;
        this.playerBet = 0;
        this.gamePhase = 'betting';
    },
    
    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
        const deck = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                deck.push({ rank, suit, value: this.getCardValue(rank) });
            }
        }
        return deck;
    },
    
    getCardValue(rank) {
        if (rank === 'A') return 14;
        if (rank === 'K') return 13;
        if (rank === 'Q') return 12;
        if (rank === 'J') return 11;
        return parseInt(rank);
    },
    
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    },
    
    drawCard() {
        return this.deck.pop();
    },
    
    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="poker-table">
                <h2>🃏 Texas Hold'em Poker</h2>
                
                <div class="dealer-area">
                    <h3>Dealer</h3>
                    <div class="hand" id="dealerHand">
                        ${this.renderCards(this.dealerHand, this.gamePhase !== 'showdown')}
                    </div>
                </div>
                
                <div class="community-cards">
                    <h3>Community Cards</h3>
                    <div class="cards" id="communityCards">
                        ${this.renderCommunityCards()}
                    </div>
                </div>
                
                <div class="pot-display">
                    <h3>Pot: <span id="potAmount">${this.pot}</span> eGold</h3>
                </div>
                
                <div class="player-area">
                    <h3>Your Hand</h3>
                    <div class="hand" id="playerHand">
                        ${this.renderCards(this.playerHand)}
                    </div>
                    <div id="handRank"></div>
                </div>
                
                <div class="betting-controls">
                    <div class="chip-selector">
                        ${[10, 25, 50, 100].map(amt => 
                            `<button class="chip" onclick="texasholdemGame.currentBet = ${amt}">${amt}</button>`
                        ).join('')}
                    </div>
                    <div class="action-buttons" id="actionButtons">
                        ${this.renderActionButtons()}
                    </div>
                </div>
                
                <div id="pokerResult" class="result-message"></div>
            </div>
        `;
        this.updateHandRank();
    },
    
    renderCards(cards, hidden = false) {
        return cards.map(card => `
            <div class="card ${card.suit === '♥' || card.suit === '♦' ? 'red' : ''}">
                ${hidden ? '🂠' : `${card.rank}${card.suit}`}
            </div>
        `).join('');
    },
    
    renderCommunityCards() {
        if (this.communityCards.length === 0) {
            return '<div class="card back">🂠</div>'.repeat(5);
        }
        return this.communityCards.map(card => `
            <div class="card ${card.suit === '♥' || card.suit === '♦' ? 'red' : ''}">${card.rank}${card.suit}</div>
        `).join('') + '<div class="card back">🂠</div>'.repeat(5 - this.communityCards.length);
    },
    
    renderActionButtons() {
        if (this.gamePhase === 'showdown') {
            return '<button class="btn-action" onclick="texasholdemGame.newGame()">New Round</button>';
        }
        
        return `
            <button class="btn-action" onclick="texasholdemGame.bet()">Bet ${this.currentBet}</button>
            <button class="btn-action" onclick="texasholdemGame.check()">Check</button>
            <button class="btn-action" onclick="texasholdemGame.fold()">Fold</button>
        `;
    },
    
    bet() {
        const balance = parseFloat(document.getElementById('userBalance').textContent);
        if (balance < this.currentBet) {
            this.showResult('Insufficient balance!', false);
            return;
        }
        
        updateBalance(-this.currentBet);
        this.pot += this.currentBet;
        this.playerBet += this.currentBet;
        
        // Dealer matches
        this.pot += this.currentBet;
        
        document.getElementById('potAmount').textContent = this.pot;
        this.nextPhase();
    },
    
    check() {
        this.nextPhase();
    },
    
    fold() {
        this.showResult('You folded. Dealer wins!', false);
        soundEffects.play('lose');
        this.gamePhase = 'showdown';
        this.render();
    },
    
    nextPhase() {
        if (this.gamePhase === 'betting') {
            this.communityCards = [this.drawCard(), this.drawCard(), this.drawCard()];
            this.gamePhase = 'flop';
        } else if (this.gamePhase === 'flop') {
            this.communityCards.push(this.drawCard());
            this.gamePhase = 'turn';
        } else if (this.gamePhase === 'turn') {
            this.communityCards.push(this.drawCard());
            this.gamePhase = 'river';
        } else if (this.gamePhase === 'river') {
            this.showdown();
            return;
        }
        this.render();
    },
    
    showdown() {
        this.gamePhase = 'showdown';
        const playerScore = this.evaluateHand([...this.playerHand, ...this.communityCards]);
        // Dealer gets slight edge in close calls
        const dealerScore = this.evaluateHand([...this.dealerHand, ...this.communityCards]) + 0.5;
        
        this.render();
        
        if (playerScore > dealerScore) {
            updateBalance(this.pot);
            this.showResult(`🎉 You win ${this.pot} eGold!`, true);
            soundEffects.play('win');
        } else if (dealerScore > playerScore) {
            this.showResult('Dealer wins!', false);
            soundEffects.play('lose');
        } else {
            updateBalance(this.pot / 2);
            this.showResult(`Push! You get ${this.pot / 2} eGold back`, true);
        }
    },
    
    evaluateHand(cards) {
        // Simple high card evaluation for now
        return Math.max(...cards.map(c => c.value));
    },
    
    updateHandRank() {
        if (this.communityCards.length > 0) {
            const allCards = [...this.playerHand, ...this.communityCards];
            const score = this.evaluateHand(allCards);
            document.getElementById('handRank').textContent = `High Card: ${Math.max(...this.playerHand.map(c => c.value))}`;
        }
    },
    
    newGame() {
        this.newRound();
        this.render();
    },
    
    showResult(message, isWin) {
        const resultEl = document.getElementById('pokerResult');
        resultEl.textContent = message;
        resultEl.className = `result-message ${isWin ? 'win' : 'lose'}`;
    }
};
