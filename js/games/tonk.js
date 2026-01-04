// Tonk Card Game - Clean Implementation with House Edge
const tonkGame = {
    deck: [],
    playerHand: [],
    dealerHand: [],
    discardPile: [],
    currentBet: 20,
    gamePhase: 'playing',
    
    init() {
        try {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.info('TONK_INIT', {});
            }
            this.newRound();
            this.render();
        } catch (error) {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.error('TONK_INIT_ERROR', { error: error.message, stack: error.stack });
            }
            console.error('Tonk init error:', error);
        }
    },
    
    newRound() {
        this.deck = texasholdemGame.createDeck();
        texasholdemGame.shuffleDeck.call(this);
        this.playerHand = Array(5).fill(null).map(() => this.drawCard());
        this.dealerHand = Array(5).fill(null).map(() => this.drawCard());
        this.discardPile = [this.drawCard()];
        this.gamePhase = 'playing';
    },
    
    drawCard() {
        return this.deck.pop();
    },
    
    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="tonk-table">
                <h2>🎴 Tonk</h2>
                <p>Get closest to 49 points without going over! Lower score wins.</p>
                
                <div class="game-info">
                    <div>Bet: ${this.currentBet} eGold</div>
                    <div>Deck: ${this.deck.length} cards</div>
                </div>
                
                <div class="dealer-area">
                    <h3>Dealer's Hand (${this.gamePhase === 'showdown' ? this.calculateScore(this.dealerHand) : '?'} points)</h3>
                    <div class="hand">
                        ${texasholdemGame.renderCards(this.dealerHand, this.gamePhase !== 'showdown')}
                    </div>
                </div>
                
                <div class="discard-pile">
                    <h3>Discard Pile</h3>
                    <div class="card ${this.discardPile[0].suit === '♥' || this.discardPile[0].suit === '♦' ? 'red' : ''}">
                        ${this.discardPile[0].rank}${this.discardPile[0].suit}
                    </div>
                </div>
                
                <div class="player-area">
                    <h3>Your Hand (${this.calculateScore(this.playerHand)} points)</h3>
                    <div class="hand">
                        ${texasholdemGame.renderCards(this.playerHand)}
                    </div>
                </div>
                
                <div class="action-buttons">
                    ${this.gamePhase === 'playing' ? `
                        <button class="btn-action" onclick="tonkGame.drawFromDeck()">Draw from Deck</button>
                        <button class="btn-action" onclick="tonkGame.drawFromDiscard()">Draw from Discard</button>
                        <button class="btn-action" onclick="tonkGame.tonk()">Tonk (Knock)</button>
                    ` : `
                        <button class="btn-action" onclick="tonkGame.newGame()">New Round</button>
                    `}
                </div>
                
                <div id="tonkResult" class="result-message"></div>
            </div>
        `;
    },
    
    calculateScore(hand) {
        return hand.reduce((sum, card) => {
            if (card.rank === 'A') return sum + 1;
            if (['K', 'Q', 'J'].includes(card.rank)) return sum + 10;
            return sum + parseInt(card.rank);
        }, 0);
    },
    
    drawFromDeck() {
        if (this.deck.length === 0) {
            this.showResult('Deck is empty!', false);
            return;
        }
        this.playerHand.push(this.drawCard());
        this.playerTurn();
    },
    
    drawFromDiscard() {
        this.playerHand.push(this.discardPile.pop());
        this.playerTurn();
    },
    
    playerTurn() {
        const score = this.calculateScore(this.playerHand);
        if (score > 49) {
            this.bust();
        } else {
            this.dealerPlay();
        }
    },
    
    dealerPlay() {
        // Dealer plays optimally with slight advantage
        const dealerScore = this.calculateScore(this.dealerHand);
        if (dealerScore < 40 && this.deck.length > 0) {
            this.dealerHand.push(this.drawCard());
        }
        this.render();
    },
    
    tonk() {
        const balance = parseFloat(document.getElementById('userBalance').textContent);
        if (balance < this.currentBet) {
            this.showResult('Insufficient balance!', false);
            return;
        }
        
        updateBalance(-this.currentBet);
        this.gamePhase = 'showdown';
        
        // Dealer plays to finish
        while (this.calculateScore(this.dealerHand) < 42 && this.deck.length > 0) {
            this.dealerHand.push(this.drawCard());
        }
        
        const playerScore = this.calculateScore(this.playerHand);
        const dealerScore = this.calculateScore(this.dealerHand);
        
        this.render();
        
        if (playerScore > 49) {
            this.showResult('Bust! You went over 49.', false);
            soundEffects.play('lose');
        } else if (dealerScore > 49) {
            updateBalance(this.currentBet * 2);
            this.showResult(`Dealer busts! You win ${this.currentBet * 2} eGold!`, true);
            soundEffects.play('win');
        } else if (playerScore < dealerScore) {
            updateBalance(this.currentBet * 2);
            this.showResult(`You win with ${playerScore} vs ${dealerScore}! +${this.currentBet * 2} eGold`, true);
            soundEffects.play('win');
        } else if (dealerScore < playerScore) {
            this.showResult(`Dealer wins with ${dealerScore} vs ${playerScore}`, false);
            soundEffects.play('lose');
        } else {
            // Dealer wins ties (house edge)
            this.showResult(`Push at ${playerScore}, but dealer wins ties!`, false);
            soundEffects.play('lose');
        }
    },
    
    bust() {
        this.gamePhase = 'showdown';
        this.showResult('Bust! You went over 49.', false);
        soundEffects.play('lose');
        this.render();
    },
    
    newGame() {
        this.newRound();
        this.render();
    },
    
    showResult(message, isWin) {
        const resultEl = document.getElementById('tonkResult');
        resultEl.textContent = message;
        resultEl.className = `result-message ${isWin ? 'win' : 'lose'}`;
    }
};
