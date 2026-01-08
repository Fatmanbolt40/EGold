// Pineapple Poker (3 cards, discard 1) - Professional Engine
const pineappleGame = {
    ante: 10,
    gameState: null,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <style>
                .pineapple-seat {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                }
                .pineapple-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 2px solid #9b59b6;
                    background: linear-gradient(135deg, #8e44ad, #6c3483);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5em;
                }
                .pineapple-info {
                    background: rgba(0,0,0,0.8);
                    padding: 5px 10px;
                    border-radius: 5px;
                    border: 1px solid #9b59b6;
                    min-width: 80px;
                    text-align: center;
                    font-size: 0.9em;
                }
                .discard-card {
                    position: relative;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .discard-card:hover {
                    transform: translateY(-10px);
                }
                .discard-card.selected {
                    opacity: 0.5;
                    transform: translateY(10px);
                }
            </style>
            
            <div style="text-align: center;">
                <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; font-size: 2em; margin: 0;">🍍 PINEAPPLE POKER 🍍</h3>
                    <p style="color: #888; margin: 10px 0 0 0;">3-Card Crazy Pineapple</p>
                </div>
                
                <div style="display: flex; justify-content: space-around; max-width: 800px; margin: 0 auto 20px;">
                    <div style="background: rgba(255,184,0,0.1); padding: 10px 20px; border-radius: 8px; border: 2px solid #FFB800;">
                        <div style="color: #888; font-size: 0.9em;">Pot</div>
                        <div id="pineapplePot" style="color: #FFB800; font-size: 1.3em; font-weight: bold;">0</div>
                    </div>
                    <div style="background: rgba(52,152,219,0.1); padding: 10px 20px; border-radius: 8px; border: 2px solid #3498db;">
                        <div style="color: #888; font-size: 0.9em;">Phase</div>
                        <div id="pineapplePhase" style="color: #3498db; font-size: 1.3em; font-weight: bold;">-</div>
                    </div>
                    <div style="background: rgba(46,204,113,0.1); padding: 10px 20px; border-radius: 8px; border: 2px solid #2ecc71;">
                        <div style="color: #888; font-size: 0.9em;">Players</div>
                        <div id="pineapplePlayers" style="color: #2ecc71; font-size: 1.3em; font-weight: bold;">0</div>
                    </div>
                </div>
                
                <!-- Poker Table -->
                <div style="background: linear-gradient(135deg, #1a5f1a 0%, #0d4a0d 100%); padding: 40px; border-radius: 20px; border: 5px solid #8B4513; box-shadow: 0 10px 40px rgba(0,0,0,0.5); max-width: 900px; margin: 0 auto; position: relative; min-height: 500px;">
                    <div id="pineappleSeats"></div>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="color: #FFB800; font-size: 1.2em; font-weight: bold; margin-bottom: 15px;">🎴 Community Cards 🎴</div>
                        <div id="pineappleCommunityCards" style="display: inline-block; min-height: 100px;"></div>
                    </div>
                    
                    <div style="margin-top: 30px;">
                        <div style="color: #FFB800; font-size: 1.1em; font-weight: bold; margin-bottom: 10px;">
                            <span id="pineappleHandTitle">Your Hand (3 Cards)</span>
                        </div>
                        <div id="pineapplePlayerCards" style="display: flex; justify-content: center; gap: 5px; min-height: 100px;"></div>
                        <div id="pineappleDiscardHint" style="color: #e74c3c; font-size: 0.9em; margin-top: 10px; font-weight: bold; display: none;">
                            ⚠️ Click a card to discard it!
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div id="pineappleActionButtons" class="action-buttons" style="margin: 20px auto; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; max-width: 600px;">
                    <button onclick="pineappleGame.startGame()" class="game-button" style="padding: 18px 50px; font-size: 1.4em;">
                        🎮 Start Game (${this.ante} eGold)
                    </button>
                </div>
                
                <!-- Raise Controls -->
                <div id="pineappleRaiseControls" style="margin-top: 15px; display: none; padding: 15px; background: rgba(255,184,0,0.1); border-radius: 10px; border: 2px solid #FFB800; max-width: 500px; margin: 15px auto;">
                    <div style="color: #FFB800; font-weight: bold; margin-bottom: 10px; font-size: 1.1em;">Select Raise Amount</div>
                    <input type="range" id="pineappleRaiseSlider" min="10" max="100" value="20" style="width: 100%; height: 8px; cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; margin-top: 10px; color: #ccc; font-size: 0.9em;">
                        <span id="pineappleMinRaise">Min</span>
                        <span style="color: #FFB800; font-weight: bold; font-size: 1.3em;"><span id="pineappleRaiseAmount">20</span> eGold</span>
                        <span id="pineappleMaxRaise">Max</span>
                    </div>
                    <button class="poker-btn raise-btn" onclick="pineappleGame.playerAction('confirmRaise')" style="margin-top: 10px; width: 100%; padding: 12px;">
                        Confirm Raise
                    </button>
                </div>
                
                <div id="pineappleResult" class="game-result" style="margin-top: 20px;"></div>
                
                <!-- Chat -->
                <div style="max-width: 800px; margin: 20px auto; background: rgba(0,0,0,0.3); border-radius: 10px; padding: 15px; border: 2px solid #9b59b6;">
                    <div style="color: #9b59b6; font-weight: bold; margin-bottom: 10px;">💬 Table Chat</div>
                    <div id="pineappleChat" style="max-height: 150px; overflow-y: auto; color: #ccc; font-size: 0.9em;"></div>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800; max-width: 800px; margin: 30px auto;">
                    <h3 style="color: #FFB800;">🍍 Pineapple Poker Rules 🍍</h3>
                    <ul style="text-align: left; color: #cccccc; line-height: 1.8;">
                        <li><b>3 Hole Cards:</b> Each player starts with 3 private cards</li>
                        <li><b>Discard After Flop:</b> Must discard 1 card after flop betting</li>
                        <li><b>Play with 2 Cards:</b> Continue like Hold'em with remaining 2 cards</li>
                        <li><b>Betting Rounds:</b> Pre-flop, Flop (then discard), Turn, River</li>
                        <li><b>Strategic Decisions:</b> Which card to discard matters!</li>
                        <li><b>More Variance:</b> Extra starting card adds complexity</li>
                        <li>💰 Bet ${this.ante} eGold to play | Win up to 3x your bet!</li>
                    </ul>
                </div>
            </div>
        `;
    },
    
    startGame() {
        if (balance < this.ante) {
            document.getElementById('pineappleResult').innerHTML = '<span style="color: #e74c3c;">❌ Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-this.ante);
        
        if (typeof vipSystem !== 'undefined') vipSystem.trackWager(this.ante);
        if (typeof achievementSystem !== 'undefined') achievementSystem.trackBet(this.ante, 'Pineapple');
        if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWager(this.ante, 'Pineapple');
        
        PineappleEngine.init();
        PineappleEngine.initializeTable(balance);
        this.gameState = PineappleEngine.startNewHand();
        this.updateUI();
        this.addChatMessage('Dealer', 'Crazy Pineapple! 3 cards dealt.');
        
        setTimeout(() => this.processAIActions(), 500);
    },
    
    updateUI() {
        const state = this.gameState;
        
        document.getElementById('pineapplePot').textContent = `${state.pot} eGold`;
        
        const phaseMap = {
            'waiting': 'Waiting',
            'preflop': 'Pre-Flop',
            'flop': 'Flop',
            'discard': 'Discard Card!',
            'turn': 'Turn',
            'river': 'River',
            'showdown': 'Showdown',
            'complete': 'Complete'
        };
        document.getElementById('pineapplePhase').textContent = phaseMap[state.gamePhase] || state.gamePhase;
        
        const activePlayers = state.players.filter(p => !p.folded && !p.sittingOut).length;
        document.getElementById('pineapplePlayers').textContent = activePlayers;
        
        this.renderSeats();
        this.renderCommunityCards();
        this.renderPlayerCards();
        
        if (state.discardPhase && state.activePosition === 0) {
            this.showDiscardUI();
        } else {
            this.updateActionButtons();
        }
    },
    
    showDiscardUI() {
        document.getElementById('pineappleActionButtons').innerHTML = `
            <div style="color: #FFB800; font-size: 1.3em; padding: 20px;">
                Click a card above to discard it!
            </div>
        `;
        document.getElementById('pineappleDiscardHint').style.display = 'block';
        document.getElementById('pineappleHandTitle').textContent = 'Choose 1 Card to Discard';
    },
    
    renderSeats() {
        const container = document.getElementById('pineappleSeats');
        const positions = [
            { top: '50%', left: '10%' },
            { top: '20%', left: '20%' },
            { top: '5%', left: '40%' },
            { top: '5%', left: '60%' },
            { top: '20%', left: '80%' },
            { top: '50%', left: '90%' }
        ];
        
        let html = '';
        this.gameState.players.forEach((player, index) => {
            if (player.id === 0) return;
            
            const pos = positions[index] || positions[0];
            const isActive = this.gameState.activePosition === player.id;
            const isDealer = this.gameState.dealerPosition === player.id;
            
            html += `
                <div class="pineapple-seat" style="top: ${pos.top}; left: ${pos.left};">
                    <div class="pineapple-avatar" style="${isActive ? 'border-color: #FFB800; box-shadow: 0 0 20px rgba(255,184,0,0.6);' : ''}">
                        ${player.folded ? '💤' : '🍍'}
                        ${isDealer ? '<div class="dealer-button">D</div>' : ''}
                    </div>
                    <div class="pineapple-info">
                        <div style="font-weight: bold; color: ${player.folded ? '#e74c3c' : '#FFB800'};">${player.name}</div>
                        <div style="color: #2ecc71;">${player.chips} 💰</div>
                        ${player.bet > 0 ? `<div style="color: #3498db;">Bet: ${player.bet}</div>` : ''}
                        ${player.lastAction ? `<div style="color: #888; font-size: 0.8em;">${player.lastAction}</div>` : ''}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    },
    
    renderCommunityCards() {
        const container = document.getElementById('pineappleCommunityCards');
        if (this.gameState.communityCards.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = this.gameState.communityCards
            .map(card => typeof pokerEnhancer !== 'undefined' ? 
                pokerEnhancer.createEnhancedCard(card.value, card.suit) :
                `<span style="font-size: 2em;">${card.value}${card.suit}</span>`)
            .join('');
    },
    
    renderPlayerCards() {
        const container = document.getElementById('pineapplePlayerCards');
        const player = this.gameState.players[0];
        
        if (!player.cards || player.cards.length === 0 || player.folded) {
            container.innerHTML = '';
            return;
        }
        
        if (this.gameState.discardPhase && player.cards.length === 3) {
            // Show clickable cards for discarding
            container.innerHTML = player.cards
                .map((card, index) => `
                    <div class="discard-card" onclick="pineappleGame.discardCard(${index})">
                        ${typeof pokerEnhancer !== 'undefined' ? 
                            pokerEnhancer.createEnhancedCard(card.value, card.suit) :
                            `<span style="font-size: 2em;">${card.value}${card.suit}</span>`}
                    </div>
                `)
                .join('');
        } else {
            container.innerHTML = player.cards
                .map(card => typeof pokerEnhancer !== 'undefined' ? 
                    pokerEnhancer.createEnhancedCard(card.value, card.suit) :
                    `<span style="font-size: 2em;">${card.value}${card.suit}</span>`)
                .join('');
            
            document.getElementById('pineappleDiscardHint').style.display = 'none';
            document.getElementById('pineappleHandTitle').textContent = `Your Hand (${player.cards.length} Cards)`;
        }
    },
    
    discardCard(cardIndex) {
        PineappleEngine.playerDiscard(0, cardIndex);
        this.gameState = PineappleEngine.getGameState();
        this.addChatMessage('You', `Discard card ${cardIndex + 1}`);
        
        // Process AI discards
        this.gameState.players.forEach(player => {
            if (!player.isPlayer && !player.folded && !player.hasDiscarded) {
                PineappleEngine.aiDiscard(player.id);
            }
        });
        
        this.gameState = PineappleEngine.getGameState();
        this.updateUI();
        
        // Continue to turn
        setTimeout(() => this.processAIActions(), 500);
    },
    
    updateActionButtons() {
        const container = document.getElementById('pineappleActionButtons');
        const player = this.gameState.players[0];
        const isYourTurn = this.gameState.activePosition === 0;
        const callAmount = this.gameState.currentBet - player.bet;
        
        if (!isYourTurn || player.folded || this.gameState.gamePhase === 'complete') {
            container.innerHTML = '<div style="color: #888; padding: 20px;">Waiting for other players...</div>';
            document.getElementById('pineappleRaiseControls').style.display = 'none';
            return;
        }
        
        let buttons = [];
        
        buttons.push(`
            <button class="poker-btn fold-btn" onclick="pineappleGame.playerAction('fold')">✕ Fold</button>
        `);
        
        if (callAmount === 0) {
            buttons.push(`
                <button class="poker-btn check-btn" onclick="pineappleGame.playerAction('check')">✓ Check</button>
            `);
        } else {
            buttons.push(`
                <button class="poker-btn call-btn" onclick="pineappleGame.playerAction('call')">Call ${callAmount}</button>
            `);
        }
        
        if (player.chips > callAmount) {
            buttons.push(`
                <button class="poker-btn raise-btn" onclick="pineappleGame.playerAction('raise')">↑ Raise</button>
            `);
        }
        
        container.innerHTML = buttons.join('');
        
        // Setup raise slider
        const raiseSlider = document.getElementById('pineappleRaiseSlider');
        const raiseAmount = document.getElementById('pineappleRaiseAmount');
        const minRaise = Math.max(this.gameState.bigBlind, this.gameState.currentBet * 2);
        const maxRaise = player.chips - callAmount;
        raiseSlider.min = minRaise;
        raiseSlider.max = Math.max(minRaise, maxRaise);
        raiseSlider.value = Math.min(minRaise * 2, maxRaise);
        raiseAmount.textContent = raiseSlider.value;
        
        raiseSlider.oninput = () => {
            raiseAmount.textContent = raiseSlider.value;
        };
        
        raiseSlider.step = this.gameState.bigBlind;
    },
    
    playerAction(action) {
        const player = this.gameState.players[0];
        const raiseControls = document.getElementById('pineappleRaiseControls');
        
        if (action === 'fold') {
            PineappleEngine.playerFold(0);
            this.addChatMessage('You', 'Fold');
            if (raiseControls) raiseControls.style.display = 'none';
        } else if (action === 'call') {
            PineappleEngine.playerCall(0);
            this.addChatMessage('You', `Call ${this.gameState.currentBet - player.bet}`);
            if (raiseControls) raiseControls.style.display = 'none';
        } else if (action === 'check') {
            PineappleEngine.playerCheck(0);
            this.addChatMessage('You', 'Check');
            if (raiseControls) raiseControls.style.display = 'none';
        } else if (action === 'raise') {
            if (raiseControls.style.display === 'none' || raiseControls.style.display === '') {
                raiseControls.style.display = 'block';
                const raiseSlider = document.getElementById('pineappleRaiseSlider');
                document.getElementById('pineappleMinRaise').textContent = raiseSlider.min;
                document.getElementById('pineappleMaxRaise').textContent = raiseSlider.max;
                return;
            }
        } else if (action === 'confirmRaise') {
            const raiseAmount = parseInt(document.getElementById('pineappleRaiseSlider').value);
            PineappleEngine.playerRaise(0, raiseAmount);
            this.addChatMessage('You', `Raise ${raiseAmount}`);
            raiseControls.style.display = 'none';
        }
        
        this.gameState = PineappleEngine.getGameState();
        this.updateUI();
        
        setTimeout(() => this.processAIActions(), 500);
    },
    
    processAIActions() {
        if (this.gameState.gamePhase === 'complete') {
            setTimeout(() => this.startNewHand(), 3000);
            return;
        }
        
        // Handle discard phase
        if (this.gameState.discardPhase) {
            // AI players auto-discard
            this.gameState.players.forEach(player => {
                if (!player.isPlayer && !player.folded && !player.hasDiscarded && player.cards.length === 3) {
                    PineappleEngine.aiDiscard(player.id);
                }
            });
            this.gameState = PineappleEngine.getGameState();
            
            // Check if discard phase is complete
            if (!this.gameState.discardPhase) {
                this.updateUI();
                setTimeout(() => this.processAIActions(), 500);
            }
            return;
        }
        
        const activePlayer = this.gameState.players[this.gameState.activePosition];
        
        if (activePlayer.isPlayer) {
            return;
        }
        
        setTimeout(() => {
            const aiAction = PineappleEngine.getAIAction(activePlayer);
            
            if (aiAction.action === 'fold') {
                PineappleEngine.playerFold(activePlayer.id);
                this.addChatMessage(activePlayer.name, 'Fold');
            } else if (aiAction.action === 'call') {
                PineappleEngine.playerCall(activePlayer.id);
                this.addChatMessage(activePlayer.name, `Call ${this.gameState.currentBet - activePlayer.bet}`);
            } else if (aiAction.action === 'check') {
                PineappleEngine.playerCheck(activePlayer.id);
                this.addChatMessage(activePlayer.name, 'Check');
            } else if (aiAction.action === 'raise') {
                PineappleEngine.playerRaise(activePlayer.id, aiAction.amount);
                this.addChatMessage(activePlayer.name, `Raise ${aiAction.amount}`);
            }
            
            this.gameState = PineappleEngine.getGameState();
            this.updateUI();
            
            this.processAIActions();
        }, 800 + Math.random() * 1200);
    },
    
    startNewHand() {
        this.gameState = PineappleEngine.startNewHand();
        this.updateUI();
        this.addChatMessage('Dealer', 'New hand! Remember to discard after flop.');
        this.processAIActions();
    },
    
    addChatMessage(player, message) {
        const chat = document.getElementById('pineappleChat');
        const msg = document.createElement('div');
        msg.style.marginBottom = '5px';
        msg.innerHTML = `<span style="color: #9b59b6; font-weight: bold;">${player}:</span> ${message}`;
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
        
        while (chat.children.length > 15) {
            chat.removeChild(chat.firstChild);
        }
    }
};
        const content = document.getElementById('gameContent');
        const vipLevel = typeof vipSystem !== 'undefined' ? vipSystem.getCurrentLevel().level : 0;
        
        content.innerHTML = `
            <div style="text-align: center;">
                <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #FFB800; box-shadow: 0 4px 20px rgba(255,184,0,0.3);">
                    <h3 style="color: #FFB800; font-size: 2em; margin: 0; text-shadow: 0 0 20px rgba(255,184,0,0.6);">🍍 ROYAL CRAZY PINEAPPLE 🍍</h3>
                    <p style="color: #888; margin: 10px 0 0 0;">3-Card Madness - WPT Style</p>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap;">
                    <button onclick="pokerEnhancer.showHandHistory()" style="background: linear-gradient(135deg, #3498db, #2980b9); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(52,152,219,0.3);">
                        📜 Hand History
                    </button>
                    <button onclick="pokerEnhancer.showQuickChat()" style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(155,89,182,0.3);">
                        💬 Quick Chat
                    </button>
                </div>
                
                ${pokerEnhancer.createPremiumTable('pineapple')}
                <p style="color: #cccccc; margin-bottom: 20px;">Start with 3 cards - Discard 1 after flop</p>
                
                <div style="margin: 20px 0;">
                    <div style="background: rgba(255, 184, 0, 0.1); padding: 15px; border-radius: 10px; display: inline-block;">
                        <p style="color: #FFB800; font-size: 1.2em;">Ante: ${this.ante} eGold</p>
                    </div>
                </div>
                
                <!-- Poker Table -->
                <div style="background: linear-gradient(135deg, #1a5f1a 0%, #0d4a0d 100%); padding: 40px; border-radius: 20px; border: 5px solid #8B4513; box-shadow: 0 10px 40px rgba(0,0,0,0.5); max-width: 900px; margin: 30px auto;">
                    <div style="margin: 20px 0;">
                        <h4 style="color: #FFB800; margin-bottom: 10px;">Dealer's Hand</h4>
                        <div id="dealerHand">
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                        </div>
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
                        <div id="playerHand">
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                            ${VisualEnhancer.createCard('?', 'spades', true)}
                        </div>
                    </div>
                </div>
                
                <button onclick="pineappleGame.play()" style="padding: 15px 40px; font-size: 1.3em; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer; margin: 20px 0;">
                    Play Hand (${this.ante} eGold)
                </button>
                
                <div id="pineappleResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; margin-bottom: 15px;">🍍 Pineapple Royale [Quick Simulation]</h3>
                    <p style="font-size: 1.1em; color: #cccccc; margin-bottom: 15px;">⚡ Quick simulation - 3 hole cards variant with instant random outcome</p>
                    <div style="margin-top: 15px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 2px solid #2ecc71;">
                        <h4 style="color: #2ecc71; margin-bottom: 10px;">📜 Game Rules</h4>
                        <ul style="text-align: left; max-width: 450px; margin: 0 auto; color: #cccccc; line-height: 1.8;">
                            <li>Pay ante (<b>${this.ante} eGold</b>)</li>
                            <li>Receive <b>3 hole cards</b> (not 2)</li>
                            <li>Flop: <b>3 community cards</b> revealed</li>
                            <li><b>Discard 1</b> hole card (strategic choice!)</li>
                            <li>Turn & River complete the board</li>
                            <li>Play with final <b>2 hole + 5 community</b></li>
                            <li>Beat dealer to win <b style="color: #FFB800;">2x ante!</b></li>
                            <li>Higher variance than standard Hold'em</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },
    
    play() {
        if (balance < this.ante) {
            document.getElementById('pineappleResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-this.ante);
        
        // Track for VIP, achievements, and leaderboard
        if (typeof vipSystem !== 'undefined') vipSystem.trackWager(this.ante);
        if (typeof achievementSystem !== 'undefined') achievementSystem.trackBet(this.ante, 'Royal Crazy Pineapple');
        if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWager(this.ante, 'Royal Crazy Pineapple');
        
        // Simplified - dealer has advantage
        const playerScore = Math.random() * 100;
        const dealerScore = Math.random() * 100 + 5; // House edge
        
        // Show actual cards
        document.getElementById('playerHand').innerHTML = 
            VisualEnhancer.createCard('A', 'spades') + 
            VisualEnhancer.createCard('K', 'spades');
        document.getElementById('dealerHand').innerHTML = 
            VisualEnhancer.createCard('Q', 'hearts') + 
            VisualEnhancer.createCard('J', 'hearts');
        document.getElementById('communityCards').innerHTML = 
            VisualEnhancer.createCard('10', 'spades') + 
            VisualEnhancer.createCard('9', 'spades') + 
            VisualEnhancer.createCard('8', 'spades') + 
            VisualEnhancer.createCard('7', 'hearts') + 
            VisualEnhancer.createCard('6', 'diamonds');
        
        if (playerScore > dealerScore) {
            const payout = this.ante * 2;
            updateBalance(payout);
            document.getElementById('pineappleResult').innerHTML = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 YOU WIN! +${payout} eGold</span>`;
        } else {
            document.getElementById('pineappleResult').innerHTML = '<span style="color: #e74c3c;">Dealer wins. Try again!</span>';
        }
    },
    
    initPVP(room) {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #7B68EE; font-size: 1.8em;">👥 PVP Pineapple Poker</h3>
                    <p style="color: #FFB800; font-size: 1.2em;">Pot: ${room.bet * 2} eGold</p>
                </div>
                
                <div style="margin: 30px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 600px; margin: 30px auto;">
                    <div style="padding: 20px; background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c; border-radius: 10px;">
                        <h4 style="color: #e74c3c;">🤖 Opponent</h4>
                        <div style="font-size: 2em; margin: 10px 0;">🂠 🂠</div>
                    </div>
                    <div style="padding: 20px; background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71; border-radius: 10px;">
                        <h4 style="color: #2ecc71;">😊 You</h4>
                        <div id="pvpPlayerHandPine" style="font-size: 2em; margin: 10px 0;">🂠 🂠</div>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4 style="color: #FFB800;">Community Cards</h4>
                    <div id="pvpCommunityPine" style="font-size: 2.5em;">🂠 🂠 🂠 🂠 🂠</div>
                </div>
                
                <button onclick="pineappleGame.playPVP(${room.bet})" class="game-button">🎮 Play Hand</button>
                <div id="pvpResultPine" style="margin-top: 20px; font-size: 1.3em;"></div>
            </div>
        `;
    },
    
    playPVP(bet) {
        const playerScore = Math.random() * 1000;
        const opponentScore = Math.random() * 1000;
        
        document.getElementById('pvpPlayerHandPine').innerText = 'A♠ K♠';
        document.getElementById('pvpCommunityPine').innerText = '10♠ 9♠ 8♠ 7♥ 6♦';
        
        const resultDiv = document.getElementById('pvpResultPine');
        setTimeout(() => {
            const opponentDiv = document.querySelector('[style*="rgba(231, 76, 60"]').querySelector('div[style*="font-size: 2em"]');
            opponentDiv.innerText = 'Q♥ J♥';
            
            if (playerScore > opponentScore) {
                updateBalance(bet * 2);
                resultDiv.innerHTML = `<div class="game-result win"><h3>🎉 YOU WIN!</h3><p>+${bet * 2} eGold</p></div>`;
            } else if (playerScore === opponentScore) {
                updateBalance(bet);
                resultDiv.innerHTML = `<div class="game-result" style="background: rgba(255, 184, 0, 0.2); border-color: #FFB800;"><h3 style="color: #FFB800;">🤝 TIE!</h3><p>Bet returned</p></div>`;
            } else {
                resultDiv.innerHTML = `<div class="game-result lose"><h3>😔 YOU LOSE</h3><p>-${bet} eGold</p></div>`;
            }
        }, 1000);
    }
};

window.pineappleGame = pineappleGame;
