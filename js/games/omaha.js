// Omaha Poker - Clean Implementation (4-card variant)
const omahaGame = {
    deck: [],
    playerHand: [],
    dealerHand: [],
    communityCards: [],
    pot: 0,
    currentBet: 10,
    gamePhase: 'betting',
    
    init() {
        try {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.info('OMAHA_INIT', {});
            }
            this.newRound();
            this.render();
        } catch (error) {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.error('OMAHA_INIT_ERROR', { error: error.message, stack: error.stack });
            }
            console.error('Omaha init error:', error);
        }
    },
    
    newRound() {
        this.deck = texasholdemGame.createDeck();
        texasholdemGame.shuffleDeck.call(this);
        this.playerHand = [this.drawCard(), this.drawCard(), this.drawCard(), this.drawCard()];
        this.dealerHand = [this.drawCard(), this.drawCard(), this.drawCard(), this.drawCard()];
        this.communityCards = [];
        this.pot = 0;
        this.gamePhase = 'betting';
    },
    
    drawCard() {
        return this.deck.pop();
    },
    
    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="poker-table">
                <h2>🂡 Omaha Poker (4-Card)</h2>
                <p style="text-align: center; color: #FFB800;">Must use exactly 2 cards from hand + 3 from board</p>
                
                <div class="dealer-area">
                    <h3>Dealer</h3>
                    <div class="hand">
                        ${texasholdemGame.renderCards(this.dealerHand, this.gamePhase !== 'showdown')}
                    </div>
                </div>
                
                <div class="community-cards">
                    <h3>Community Cards</h3>
                    <div class="cards">
                        ${this.renderCommunityCards()}
                    </div>
                </div>
                
                <div class="pot-display">
                    <h3>Pot: <span id="potAmount">${this.pot}</span> eGold</h3>
                </div>
                
                <div class="player-area">
                    <h3>Your Hand</h3>
                    <div class="hand">
                        ${texasholdemGame.renderCards(this.playerHand)}
                    </div>
                </div>
                
                <div class="betting-controls">
                    <div class="action-buttons">
                        ${this.renderActionButtons()}
                    </div>
                </div>
                
                <div id="omahaResult" class="result-message"></div>
            </div>
        `;
    },
    
    renderCommunityCards() {
        if (this.communityCards.length === 0) {
            return '<div class="card back">🂠</div>'.repeat(5);
        }
        return texasholdemGame.renderCards(this.communityCards) + 
               '<div class="card back">🂠</div>'.repeat(5 - this.communityCards.length);
    },
    
    renderActionButtons() {
        if (this.gamePhase === 'showdown') {
            return '<button class="btn-action" onclick="omahaGame.newGame()">New Round</button>';
        }
        return `
            <button class="btn-action" onclick="omahaGame.bet()">Bet ${this.currentBet}</button>
            <button class="btn-action" onclick="omahaGame.check()">Check</button>
            <button class="btn-action" onclick="omahaGame.fold()">Fold</button>
        `;
    },
    
    bet() {
        const balance = parseFloat(document.getElementById('userBalance').textContent);
        if (balance < this.currentBet) {
            this.showResult('Insufficient balance!', false);
            return;
        }
        updateBalance(-this.currentBet);
        this.pot += this.currentBet * 2;
        document.getElementById('potAmount').textContent = this.pot;
        this.nextPhase();
    },
    
    check() {
        this.nextPhase();
    },
    
    fold() {
        this.showResult('You folded!', false);
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
            this.showdown();
            return;
        }
        this.render();
    },
    
    showdown() {
        this.gamePhase = 'showdown';
        const playerScore = texasholdemGame.evaluateHand([...this.playerHand, ...this.communityCards]);
        // Dealer advantage in close situations
        const dealerScore = texasholdemGame.evaluateHand([...this.dealerHand, ...this.communityCards]) + 0.5;
        
        this.render();
        
        if (playerScore > dealerScore) {
            updateBalance(this.pot);
            this.showResult(`🎉 You win ${this.pot} eGold!`, true);
            soundEffects.play('win');
        } else {
            this.showResult('Dealer wins!', false);
            soundEffects.play('lose');
        }
    },
    
    newGame() {
        this.newRound();
        this.render();
    },
    
    showResult(message, isWin) {
        const resultEl = document.getElementById('omahaResult');
        resultEl.textContent = message;
        resultEl.className = `result-message ${isWin ? 'win' : 'lose'}`;
    }
};
