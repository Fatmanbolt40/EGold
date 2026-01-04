// Pineapple Poker - Clean Implementation (discard 1 card after flop)
const pineappleGame = {
    ...omahaGame,
    
    init() {
        try {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.info('PINEAPPLE_INIT', {});
            }
            this.newRound();
            this.render();
        } catch (error) {
            if (typeof errorLogger !== 'undefined') {
                errorLogger.error('PINEAPPLE_INIT_ERROR', { error: error.message, stack: error.stack });
            }
            console.error('Pineapple init error:', error);
        }
    },
    
    newRound() {
        this.deck = texasholdemGame.createDeck();
        texasholdemGame.shuffleDeck.call(this);
        this.playerHand = [this.drawCard(), this.drawCard(), this.drawCard()];
        this.dealerHand = [this.drawCard(), this.drawCard(), this.drawCard()];
        this.communityCards = [];
        this.pot = 0;
        this.gamePhase = 'betting';
        this.discarded = false;
    },
    
    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="poker-table">
                <h2>🍍 Pineapple Poker (3-Card)</h2>
                <p style="text-align: center; color: #FFB800;">Discard 1 card after the flop!</p>
                
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
                    <h3>Your Hand ${this.gamePhase === 'flop' && !this.discarded ? '(Click to discard)' : ''}</h3>
                    <div class="hand">
                        ${this.renderPlayerHand()}
                    </div>
                </div>
                
                <div class="betting-controls">
                    <div class="action-buttons">
                        ${this.renderActionButtons()}
                    </div>
                </div>
                
                <div id="pineappleResult" class="result-message"></div>
            </div>
        `;
    },
    
    renderPlayerHand() {
        return this.playerHand.map((card, i) => `
            <div class="card ${card.suit === '♥' || card.suit === '♦' ? 'red' : ''}"
                 onclick="${this.gamePhase === 'flop' && !this.discarded ? `pineappleGame.discardCard(${i})` : ''}"
                 style="${this.gamePhase === 'flop' && !this.discarded ? 'cursor: pointer;' : ''}">
                ${card.rank}${card.suit}
            </div>
        `).join('');
    },
    
    discardCard(index) {
        if (this.gamePhase === 'flop' && !this.discarded) {
            this.playerHand.splice(index, 1);
            // Dealer discards randomly
            this.dealerHand.splice(Math.floor(Math.random() * this.dealerHand.length), 1);
            this.discarded = true;
            this.render();
        }
    },
    
    nextPhase() {
        if (this.gamePhase === 'betting') {
            this.communityCards = [this.drawCard(), this.drawCard(), this.drawCard()];
            this.gamePhase = 'flop';
        } else if (this.gamePhase === 'flop' && !this.discarded) {
            this.showResult('Please discard a card first!', false);
            return;
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
    
    renderActionButtons() {
        if (this.gamePhase === 'showdown') {
            return '<button class="btn-action" onclick="pineappleGame.newGame()">New Round</button>';
        }
        return `
            <button class="btn-action" onclick="pineappleGame.bet()">Bet ${this.currentBet}</button>
            <button class="btn-action" onclick="pineappleGame.check()">Check</button>
            <button class="btn-action" onclick="pineappleGame.fold()">Fold</button>
        `;
    },
    
    showdown() {
        this.gamePhase = 'showdown';
        const playerScore = texasholdemGame.evaluateHand([...this.playerHand, ...this.communityCards]);
        // Dealer gets edge in evaluation
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
        const resultEl = document.getElementById('pineappleResult');
        resultEl.textContent = message;
        resultEl.className = `result-message ${isWin ? 'win' : 'lose'}`;
    }
};
