// Omaha Poker (4 hole cards) - Professional Engine
const omahaGame = {
    ante: 10,
    gameState: null,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <style>
                .omaha-seat {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                }
                .omaha-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 2px solid #4A90A4;
                    background: linear-gradient(135deg, #2C5F6F, #1a1a2e);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5em;
                }
                .omaha-info {
                    background: rgba(0,0,0,0.8);
                    padding: 5px 10px;
                    border-radius: 5px;
                    border: 1px solid #4A90A4;
                    min-width: 80px;
                    text-align: center;
                    font-size: 0.9em;
                }
            </style>
            
            <div style="text-align: center;">
                <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; font-size: 2em; margin: 0;">♦️ OMAHA POKER ♣️</h3>
                    <p style="color: #888; margin: 10px 0 0 0;">4-Card Professional Poker</p>
                </div>
                
                <div style="display: flex; justify-content: space-around; max-width: 800px; margin: 0 auto 20px;">
                    <div style="background: rgba(255,184,0,0.1); padding: 10px 20px; border-radius: 8px; border: 2px solid #FFB800;">
                        <div style="color: #888; font-size: 0.9em;">Pot</div>
                        <div id="omahaPot" style="color: #FFB800; font-size: 1.3em; font-weight: bold;">0</div>
                    </div>
                    <div style="background: rgba(52,152,219,0.1); padding: 10px 20px; border-radius: 8px; border: 2px solid #3498db;">
                        <div style="color: #888; font-size: 0.9em;">Phase</div>
                        <div id="omahaPhase" style="color: #3498db; font-size: 1.3em; font-weight: bold;">-</div>
                    </div>
                    <div style="background: rgba(46,204,113,0.1); padding: 10px 20px; border-radius: 8px; border: 2px solid #2ecc71;">
                        <div style="color: #888; font-size: 0.9em;">Players</div>
                        <div id="omahaPlayers" style="color: #2ecc71; font-size: 1.3em; font-weight: bold;">0</div>
                    </div>
                </div>
                
                <!-- Poker Table -->
                <div style="background: linear-gradient(135deg, #1a5f1a 0%, #0d4a0d 100%); padding: 40px; border-radius: 20px; border: 5px solid #8B4513; box-shadow: 0 10px 40px rgba(0,0,0,0.5); max-width: 900px; margin: 0 auto; position: relative; min-height: 500px;">
                    <div id="omahaSeats"></div>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="color: #FFB800; font-size: 1.2em; font-weight: bold; margin-bottom: 15px;">🎴 Community Cards 🎴</div>
                        <div id="omahaCommunityCards" style="display: inline-block; min-height: 100px;"></div>
                    </div>
                    
                    <div style="margin-top: 30px;">
                        <div style="color: #FFB800; font-size: 1.1em; font-weight: bold; margin-bottom: 10px;">Your Hand (4 Cards)</div>
                        <div id="omahaPlayerCards" style="display: flex; justify-content: center; gap: 5px; min-height: 100px;"></div>
                        <div style="color: #888; font-size: 0.85em; margin-top: 10px; font-style: italic;">Must use exactly 2 hole cards + 3 community cards</div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div id="omahaActionButtons" class="action-buttons" style="margin: 20px auto; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; max-width: 600px;">
                    <button onclick="omahaGame.startGame()" class="game-button" style="padding: 18px 50px; font-size: 1.4em;">
                        🎮 Start Game (${this.ante} eGold)
                    </button>
                </div>
                
                <!-- Raise Controls -->
                <div id="omahaRaiseControls" style="margin-top: 15px; display: none; padding: 15px; background: rgba(255,184,0,0.1); border-radius: 10px; border: 2px solid #FFB800; max-width: 500px; margin: 15px auto;">
                    <div style="color: #FFB800; font-weight: bold; margin-bottom: 10px; font-size: 1.1em;">Select Raise Amount</div>
                    <input type="range" id="omahaRaiseSlider" min="10" max="100" value="20" style="width: 100%; height: 8px; cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; margin-top: 10px; color: #ccc; font-size: 0.9em;">
                        <span id="omahaMinRaise">Min</span>
                        <span style="color: #FFB800; font-weight: bold; font-size: 1.3em;"><span id="omahaRaiseAmount">20</span> eGold</span>
                        <span id="omahaMaxRaise">Max</span>
                    </div>
                    <button class="poker-btn raise-btn" onclick="omahaGame.playerAction('confirmRaise')" style="margin-top: 10px; width: 100%; padding: 12px;">
                        Confirm Raise
                    </button>
                </div>
                
                <div id="omahaResult" class="game-result" style="margin-top: 20px;"></div>
                
                <!-- Chat -->
                <div style="max-width: 800px; margin: 20px auto; background: rgba(0,0,0,0.3); border-radius: 10px; padding: 15px; border: 2px solid #4A90A4;">
                    <div style="color: #4A90A4; font-weight: bold; margin-bottom: 10px;">💬 Table Chat</div>
                    <div id="omahaChat" style="max-height: 150px; overflow-y: auto; color: #ccc; font-size: 0.9em;"></div>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800; max-width: 800px; margin: 30px auto;">
                    <h3 style="color: #FFB800;">♦️ Omaha Poker Rules ♣️</h3>
                    <ul style="text-align: left; color: #cccccc; line-height: 1.8;">
                        <li><b>4 Hole Cards:</b> Each player receives 4 private cards</li>
                        <li><b>Must Use Exactly 2 + 3:</b> Use 2 from hand and 3 from board</li>
                        <li><b>More Action:</b> 4 cards create more drawing possibilities</li>
                        <li><b>Betting Rounds:</b> Pre-flop, Flop, Turn, River</li>
                        <li><b>Bigger Hands:</b> Flushes and straights more common</li>
                        <li><b>Win:</b> Best 5-card hand wins the pot</li>
                        <li>💰 Bet ${this.ante} eGold to play | Win up to 3x your bet!</li>
                    </ul>
                </div>
            </div>
        `;
    },
    
    startGame() {
        if (balance < this.ante) {
            document.getElementById('omahaResult').innerHTML = '<span style="color: #e74c3c;">❌ Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-this.ante);
        
        if (typeof vipSystem !== 'undefined') vipSystem.trackWager(this.ante);
        if (typeof achievementSystem !== 'undefined') achievementSystem.trackBet(this.ante, 'Omaha');
        if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWager(this.ante, 'Omaha');
        
        OmahaEngine.init();
        OmahaEngine.initializeTable(balance);
        this.gameState = OmahaEngine.startNewHand();
        this.updateUI();
        this.addChatMessage('Dealer', 'New Omaha hand dealt! 4 cards each.');
        
        setTimeout(() => this.processAIActions(), 500);
    },
    
    updateUI() {
        const state = this.gameState;
        
        document.getElementById('omahaPot').textContent = `${state.pot} eGold`;
        
        const phaseMap = {
            'waiting': 'Waiting',
            'preflop': 'Pre-Flop',
            'flop': 'Flop',
            'turn': 'Turn',
            'river': 'River',
            'showdown': 'Showdown',
            'complete': 'Complete'
        };
        document.getElementById('omahaPhase').textContent = phaseMap[state.gamePhase] || state.gamePhase;
        
        const activePlayers = state.players.filter(p => !p.folded && !p.sittingOut).length;
        document.getElementById('omahaPlayers').textContent = activePlayers;
        
        this.renderSeats();
        this.renderCommunityCards();
        this.renderPlayerCards();
        this.updateActionButtons();
    },
    
    renderSeats() {
        const container = document.getElementById('omahaSeats');
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
            if (player.id === 0) return; // Skip player (shown separately)
            
            const pos = positions[index] || positions[0];
            const isActive = this.gameState.activePosition === player.id;
            const isDealer = this.gameState.dealerPosition === player.id;
            
            html += `
                <div class="omaha-seat" style="top: ${pos.top}; left: ${pos.left};">
                    <div class="omaha-avatar" style="${isActive ? 'border-color: #FFB800; box-shadow: 0 0 20px rgba(255,184,0,0.6);' : ''}">
                        ${player.folded ? '💤' : '👤'}
                        ${isDealer ? '<div class="dealer-button">D</div>' : ''}
                    </div>
                    <div class="omaha-info">
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
        const container = document.getElementById('omahaCommunityCards');
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
        const container = document.getElementById('omahaPlayerCards');
        const player = this.gameState.players[0];
        
        if (!player.cards || player.cards.length === 0 || player.folded) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = player.cards
            .map(card => typeof pokerEnhancer !== 'undefined' ? 
                pokerEnhancer.createEnhancedCard(card.value, card.suit) :
                `<span style="font-size: 2em;">${card.value}${card.suit}</span>`)
            .join('');
    },
    
    updateActionButtons() {
        const container = document.getElementById('omahaActionButtons');
        const player = this.gameState.players[0];
        const isYourTurn = this.gameState.activePosition === 0;
        const callAmount = this.gameState.currentBet - player.bet;
        
        if (!isYourTurn || player.folded || this.gameState.gamePhase === 'complete') {
            container.innerHTML = '<div style="color: #888; padding: 20px;">Waiting for other players...</div>';
            document.getElementById('omahaRaiseControls').style.display = 'none';
            return;
        }
        
        let buttons = [];
        
        buttons.push(`
            <button class="poker-btn fold-btn" onclick="omahaGame.playerAction('fold')">✕ Fold</button>
        `);
        
        if (callAmount === 0) {
            buttons.push(`
                <button class="poker-btn check-btn" onclick="omahaGame.playerAction('check')">✓ Check</button>
            `);
        } else {
            buttons.push(`
                <button class="poker-btn call-btn" onclick="omahaGame.playerAction('call')">Call ${callAmount}</button>
            `);
        }
        
        if (player.chips > callAmount) {
            buttons.push(`
                <button class="poker-btn raise-btn" onclick="omahaGame.playerAction('raise')">↑ Raise</button>
            `);
        }
        
        container.innerHTML = buttons.join('');
        
        // Setup raise slider
        const raiseSlider = document.getElementById('omahaRaiseSlider');
        const raiseAmount = document.getElementById('omahaRaiseAmount');
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
        const raiseControls = document.getElementById('omahaRaiseControls');
        
        if (action === 'fold') {
            OmahaEngine.playerFold(0);
            this.addChatMessage('You', 'Fold');
            if (raiseControls) raiseControls.style.display = 'none';
        } else if (action === 'call') {
            OmahaEngine.playerCall(0);
            this.addChatMessage('You', `Call ${this.gameState.currentBet - player.bet}`);
            if (raiseControls) raiseControls.style.display = 'none';
        } else if (action === 'check') {
            OmahaEngine.playerCheck(0);
            this.addChatMessage('You', 'Check');
            if (raiseControls) raiseControls.style.display = 'none';
        } else if (action === 'raise') {
            if (raiseControls.style.display === 'none' || raiseControls.style.display === '') {
                raiseControls.style.display = 'block';
                const raiseSlider = document.getElementById('omahaRaiseSlider');
                document.getElementById('omahaMinRaise').textContent = raiseSlider.min;
                document.getElementById('omahaMaxRaise').textContent = raiseSlider.max;
                return;
            }
        } else if (action === 'confirmRaise') {
            const raiseAmount = parseInt(document.getElementById('omahaRaiseSlider').value);
            OmahaEngine.playerRaise(0, raiseAmount);
            this.addChatMessage('You', `Raise ${raiseAmount}`);
            raiseControls.style.display = 'none';
        }
        
        this.gameState = OmahaEngine.getGameState();
        this.updateUI();
        
        setTimeout(() => this.processAIActions(), 500);
    },
    
    processAIActions() {
        if (this.gameState.gamePhase === 'complete') {
            setTimeout(() => this.startNewHand(), 3000);
            return;
        }
        
        const activePlayer = this.gameState.players[this.gameState.activePosition];
        
        if (activePlayer.isPlayer) {
            return;
        }
        
        setTimeout(() => {
            const aiAction = OmahaEngine.getAIAction(activePlayer);
            
            if (aiAction.action === 'fold') {
                OmahaEngine.playerFold(activePlayer.id);
                this.addChatMessage(activePlayer.name, 'Fold');
            } else if (aiAction.action === 'call') {
                OmahaEngine.playerCall(activePlayer.id);
                this.addChatMessage(activePlayer.name, `Call ${this.gameState.currentBet - activePlayer.bet}`);
            } else if (aiAction.action === 'check') {
                OmahaEngine.playerCheck(activePlayer.id);
                this.addChatMessage(activePlayer.name, 'Check');
            } else if (aiAction.action === 'raise') {
                OmahaEngine.playerRaise(activePlayer.id, aiAction.amount);
                this.addChatMessage(activePlayer.name, `Raise ${aiAction.amount}`);
            }
            
            this.gameState = OmahaEngine.getGameState();
            this.updateUI();
            
            this.processAIActions();
        }, 800 + Math.random() * 1200);
    },
    
    startNewHand() {
        this.gameState = OmahaEngine.startNewHand();
        this.updateUI();
        this.addChatMessage('Dealer', 'New hand! Good luck.');
        this.processAIActions();
    },
    
    addChatMessage(player, message) {
        const chat = document.getElementById('omahaChat');
        const msg = document.createElement('div');
        msg.style.marginBottom = '5px';
        msg.innerHTML = `<span style="color: #4A90A4; font-weight: bold;">${player}:</span> ${message}`;
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
        
        while (chat.children.length > 15) {
            chat.removeChild(chat.firstChild);
        }
    }
};

window.omahaGame = omahaGame;
