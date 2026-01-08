// Tonk (Tunk) - Professional Rummy-Style Card Game
const tonkGame = {
    ante: 15,
    gameState: null,
    selectedCard: null,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <style>
                .tonk-seat {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                }
                .tonk-card {
                    display: inline-block;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    font-size: 2em;
                    font-weight: bold;
                    margin: 0 3px;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .tonk-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 6px 12px rgba(255,184,0,0.5);
                }
                .tonk-card.selected {
                    transform: translateY(-10px);
                    box-shadow: 0 8px 16px rgba(255,184,0,0.8);
                    border: 3px solid #FFB800;
                }
                .tonk-card.red { color: #e74c3c; }
                .tonk-card.black { color: #2c3e50; }
            </style>
            
            <div style="text-align: center;">
                <div style="background: linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c); padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #FFD700;">
                    <h3 style="color: #FFD700; font-size: 2em; margin: 0;">🃏 TONK (TUNK) 🃏</h3>
                    <p style="color: #fff; margin: 10px 0 0 0;">Rummy-Style Card Game</p>
                </div>
                
                <div style="display: flex; justify-content: space-around; max-width: 800px; margin: 0 auto 20px;">
                    <div style="background: rgba(255,184,0,0.1); padding: 10px 20px; border-radius: 8px; border: 2px solid #FFB800;">
                        <div style="color: #888; font-size: 0.9em;">Deck</div>
                        <div id="tonkDeckCount" style="color: #FFB800; font-size: 1.3em; font-weight: bold;">52</div>
                    </div>
                    <div style="background: rgba(52,152,219,0.1); padding: 10px 20px; border-radius: 8px; border: 2px solid #3498db;">
                        <div style="color: #888; font-size: 0.9em;">Phase</div>
                        <div id="tonkPhase" style="color: #3498db; font-size: 1.3em; font-weight: bold;">-</div>
                    </div>
                    <div style="background: rgba(46,204,113,0.1); padding: 10px 20px; border-radius: 8px; border: 2px solid #2ecc71;">
                        <div style="color: #888; font-size: 0.9em;">Players</div>
                        <div id="tonkPlayerCount" style="color: #2ecc71; font-size: 1.3em; font-weight: bold;">0</div>
                    </div>
                </div>
                
                <!-- Game Table -->
                <div style="background: linear-gradient(135deg, #0f4d0f 0%, #0a3a0a 100%); padding: 40px; border-radius: 20px; border: 5px solid #8B4513; box-shadow: 0 10px 40px rgba(0,0,0,0.5); max-width: 900px; margin: 0 auto; position: relative; min-height: 500px;">
                    <div id="tonkSeats"></div>
                    
                    <!-- Discard Pile -->
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="color: #FFD700; font-size: 1.2em; font-weight: bold; margin-bottom: 10px;">🎴 Discard Pile 🎴</div>
                        <div id="tonkDiscardPile" style="min-height: 80px; display: flex; justify-content: center; align-items: center;"></div>
                    </div>
                    
                    <!-- Player Hand -->
                    <div style="margin-top: 30px;">
                        <div style="color: #FFD700; font-size: 1.2em; font-weight: bold; margin-bottom: 10px;">
                            Your Hand <span id="tonkHandInfo"></span>
                        </div>
                        <div id="tonkPlayerHand" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 5px; min-height: 100px;"></div>
                        <div id="tonkSpreadInfo" style="color: #2ecc71; margin-top: 10px; font-size: 0.9em;"></div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div id="tonkActionButtons" style="margin: 20px auto; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; max-width: 600px;">
                    <button onclick="tonkGame.startGame()" class="game-button" style="padding: 18px 50px; font-size: 1.4em;">
                        🎮 Start Game (${this.ante} eGold)
                    </button>
                </div>
                
                <div id="tonkResult" class="game-result" style="margin-top: 20px;"></div>
                
                <!-- Chat -->
                <div style="max-width: 800px; margin: 20px auto; background: rgba(0,0,0,0.3); border-radius: 10px; padding: 15px; border: 2px solid #FFD700;">
                    <div style="color: #FFD700; font-weight: bold; margin-bottom: 10px;">💬 Table Chat</div>
                    <div id="tonkChat" style="max-height: 150px; overflow-y: auto; color: #ccc; font-size: 0.9em;"></div>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 215, 0, 0.1); border-radius: 10px; border: 2px solid #FFD700; max-width: 800px; margin: 30px auto;">
                    <h3 style="color: #FFD700;">🃏 Tonk Rules 🃏</h3>
                    <ul style="text-align: left; color: #cccccc; line-height: 1.8;">
                        <li><b>Goal:</b> Get lowest "deadwood" (unmatched cards) value</li>
                        <li><b>Spreads:</b> 3+ cards of same rank (book) or consecutive same suit (run)</li>
                        <li><b>Draw & Discard:</b> Draw from deck or discard pile, then discard 1 card</li>
                        <li><b>Knock:</b> When you have 5 or less deadwood, you can knock to end round</li>
                        <li><b>Tonk:</b> If dealt 49-50 points initially, you win instantly!</li>
                        <li><b>Scoring:</b> Lowest deadwood wins | Getting "caught" with higher deadwood = bonus to winner</li>
                        <li>💰 Bet ${this.ante} eGold to play | Win up to 3x your bet!</li>
                    </ul>
                </div>
            </div>
        `;
    },
    
    startGame() {
        if (balance < this.ante) {
            document.getElementById('tonkResult').innerHTML = '<span style="color: #e74c3c;">❌ Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-this.ante);
        
        if (typeof vipSystem !== 'undefined') vipSystem.trackWager(this.ante);
        if (typeof achievementSystem !== 'undefined') achievementSystem.trackBet(this.ante, 'Tonk');
        if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWager(this.ante, 'Tonk');
        
        TonkEngine.initializeGame(balance);
        this.gameState = TonkEngine.startNewHand();
        this.selectedCard = null;
        this.updateUI();
        this.addChatMessage('Dealer', '5 cards dealt. Draw to start!');
        
        // Check for immediate tonks
        const player = this.gameState.players[0];
        const handValue = TonkEngine.getHandValue(player.cards);
        if (handValue === 49 || handValue === 50) {
            this.addChatMessage('Dealer', '🎉 TONK! You win instantly!');
            setTimeout(() => this.endGame(true), 2000);
        }
    },
    
    updateUI() {
        const state = this.gameState;
        
        document.getElementById('tonkDeckCount').textContent = state.deck.length;
        
        const phaseMap = {
            'waiting': 'Waiting',
            'playing': 'Playing',
            'knocked': 'Knocked!',
            'complete': 'Complete'
        };
        document.getElementById('tonkPhase').textContent = phaseMap[state.gamePhase] || state.gamePhase;
        
        const activePlayers = state.players.filter(p => !p.folded).length;
        document.getElementById('tonkPlayerCount').textContent = activePlayers;
        
        this.renderSeats();
        this.renderDiscardPile();
        this.renderPlayerHand();
        this.updateActionButtons();
    },
    
    renderSeats() {
        const container = document.getElementById('tonkSeats');
        const positions = [
            { top: '50%', left: '10%' },
            { top: '20%', left: '30%' },
            { top: '10%', left: '50%' },
            { top: '20%', left: '70%' }
        ];
        
        let html = '';
        this.gameState.players.forEach((player, index) => {
            if (player.id === 0) return;
            
            const pos = positions[index - 1] || positions[0];
            const isActive = this.gameState.currentPlayerIndex === index;
            const deadwood = TonkEngine.calculateDeadwood(player.cards);
            
            html += `
                <div class="tonk-seat" style="top: ${pos.top}; left: ${pos.left};">
                    <div style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid #FFD700; background: linear-gradient(135deg, #8B4513, #654321); display: flex; align-items: center; justify-content: center; font-size: 1.5em; ${isActive ? 'box-shadow: 0 0 20px rgba(255,215,0,0.8);' : ''}">
                        🃏
                    </div>
                    <div style="background: rgba(0,0,0,0.8); padding: 5px 10px; border-radius: 5px; border: 1px solid #FFD700; min-width: 80px; text-align: center; font-size: 0.9em;">
                        <div style="font-weight: bold; color: #FFD700;">${player.name}</div>
                        <div style="color: #2ecc71;">${player.chips} 💰</div>
                        <div style="color: #ccc; font-size: 0.8em;">${player.cards.length} cards</div>
                        ${player.knocked ? '<div style="color: #e74c3c; font-weight: bold;">KNOCKED!</div>' : ''}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    },
    
    renderDiscardPile() {
        const container = document.getElementById('tonkDiscardPile');
        if (this.gameState.discardPile.length === 0) {
            container.innerHTML = '<div style="color: #888;">Empty</div>';
            return;
        }
        
        const topCard = this.gameState.discardPile[this.gameState.discardPile.length - 1];
        const color = (topCard.suit === '♥' || topCard.suit === '♦') ? 'red' : 'black';
        
        container.innerHTML = `
            <div class="tonk-card ${color}" onclick="tonkGame.drawFromDiscard()">
                ${topCard.value}${topCard.suit}
            </div>
        `;
    },
    
    renderPlayerHand() {
        const container = document.getElementById('tonkPlayerHand');
        const player = this.gameState.players[0];
        
        if (!player.cards || player.cards.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = player.cards.map((card, index) => {
            const color = (card.suit === '♥' || card.suit === '♦') ? 'red' : 'black';
            const isSelected = this.selectedCard === index;
            return `
                <div class="tonk-card ${color} ${isSelected ? 'selected' : ''}" onclick="tonkGame.selectCard(${index})">
                    ${card.value}${card.suit}
                </div>
            `;
        }).join('');
        
        const deadwood = TonkEngine.calculateDeadwood(player.cards);
        const spreads = TonkEngine.findSpreads(player.cards);
        
        document.getElementById('tonkHandInfo').textContent = `(Deadwood: ${deadwood})`;
        
        if (spreads.length > 0) {
            document.getElementById('tonkSpreadInfo').textContent = 
                `✨ ${spreads.length} spread(s) found: ${spreads.map(s => s.type).join(', ')}`;
        } else {
            document.getElementById('tonkSpreadInfo').textContent = '';
        }
    },
    
    selectCard(cardIndex) {
        const player = this.gameState.players[0];
        
        if (!player.hasDrawn) {
            this.addChatMessage('System', 'Draw a card first!');
            return;
        }
        
        if (this.selectedCard === cardIndex) {
            this.selectedCard = null;
        } else {
            this.selectedCard = cardIndex;
        }
        
        this.renderPlayerHand();
    },
    
    drawFromDeck() {
        const player = this.gameState.players[0];
        
        if (this.gameState.currentPlayerIndex !== 0) {
            this.addChatMessage('System', 'Not your turn!');
            return;
        }
        
        if (player.hasDrawn) {
            this.addChatMessage('System', 'Already drew! Discard a card.');
            return;
        }
        
        TonkEngine.playerDrawFromDeck(0);
        this.gameState = TonkEngine.getGameState();
        this.addChatMessage('You', 'Draw from deck');
        this.updateUI();
    },
    
    drawFromDiscard() {
        const player = this.gameState.players[0];
        
        if (this.gameState.currentPlayerIndex !== 0) {
            this.addChatMessage('System', 'Not your turn!');
            return;
        }
        
        if (player.hasDrawn) {
            this.addChatMessage('System', 'Already drew! Discard a card.');
            return;
        }
        
        TonkEngine.playerDrawFromDiscard(0);
        this.gameState = TonkEngine.getGameState();
        this.addChatMessage('You', 'Draw from discard');
        this.updateUI();
    },
    
    discardSelected() {
        if (this.selectedCard === null) {
            this.addChatMessage('System', 'Select a card to discard!');
            return;
        }
        
        TonkEngine.playerDiscard(0, this.selectedCard);
        this.gameState = TonkEngine.getGameState();
        this.selectedCard = null;
        this.addChatMessage('You', 'Discard card');
        this.updateUI();
        
        setTimeout(() => this.processAITurns(), 500);
    },
    
    knock() {
        const player = this.gameState.players[0];
        const deadwood = TonkEngine.calculateDeadwood(player.cards);
        
        if (deadwood > 5) {
            this.addChatMessage('System', `Can't knock with ${deadwood} deadwood! Need 5 or less.`);
            return;
        }
        
        TonkEngine.playerKnock(0);
        this.gameState = TonkEngine.getGameState();
        this.addChatMessage('You', `🔔 KNOCK with ${deadwood} deadwood!`);
        this.updateUI();
        
        setTimeout(() => this.endGame(), 2000);
    },
    
    processAITurns() {
        if (this.gameState.gamePhase !== 'playing') return;
        if (this.gameState.currentPlayerIndex === 0) return;
        
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        
        setTimeout(() => {
            // AI Draw
            const aiAction = TonkEngine.getAIAction(currentPlayer);
            if (aiAction.fromDiscard) {
                TonkEngine.playerDrawFromDiscard(currentPlayer.id);
                this.addChatMessage(currentPlayer.name, 'Draw from discard');
            } else {
                TonkEngine.playerDrawFromDeck(currentPlayer.id);
                this.addChatMessage(currentPlayer.name, 'Draw from deck');
            }
            this.gameState = TonkEngine.getGameState();
            this.updateUI();
            
            setTimeout(() => {
                // AI Discard
                const discardIndex = TonkEngine.getAIDiscard(currentPlayer);
                TonkEngine.playerDiscard(currentPlayer.id, discardIndex);
                this.gameState = TonkEngine.getGameState();
                this.addChatMessage(currentPlayer.name, 'Discard card');
                this.updateUI();
                
                // Check if AI should knock
                const deadwood = TonkEngine.calculateDeadwood(currentPlayer.cards);
                if (TonkEngine.shouldAIKnock(currentPlayer)) {
                    setTimeout(() => {
                        TonkEngine.playerKnock(currentPlayer.id);
                        this.gameState = TonkEngine.getGameState();
                        this.addChatMessage(currentPlayer.name, `🔔 KNOCK with ${deadwood} deadwood!`);
                        this.updateUI();
                        setTimeout(() => this.endGame(), 2000);
                    }, 800);
                } else {
                    setTimeout(() => this.processAITurns(), 500);
                }
            }, 1000);
        }, 800);
    },
    
    updateActionButtons() {
        const container = document.getElementById('tonkActionButtons');
        const player = this.gameState.players[0];
        const isYourTurn = this.gameState.currentPlayerIndex === 0;
        const deadwood = TonkEngine.calculateDeadwood(player.cards);
        
        if (!isYourTurn || this.gameState.gamePhase !== 'playing') {
            container.innerHTML = '<div style="color: #888; padding: 20px;">Waiting...</div>';
            return;
        }
        
        let buttons = [];
        
        if (!player.hasDrawn) {
            buttons.push(`
                <button class="game-button" onclick="tonkGame.drawFromDeck()">📚 Draw from Deck</button>
            `);
            if (this.gameState.discardPile.length > 0) {
                buttons.push(`
                    <button class="game-button secondary" onclick="tonkGame.drawFromDiscard()">🎴 Draw from Discard</button>
                `);
            }
        } else {
            buttons.push(`
                <button class="game-button" onclick="tonkGame.discardSelected()" ${this.selectedCard === null ? 'disabled' : ''}>
                    🗑️ Discard Selected
                </button>
            `);
            if (deadwood <= 5) {
                buttons.push(`
                    <button class="game-button" onclick="tonkGame.knock()" style="background: linear-gradient(135deg, #e74c3c, #c0392b);">
                        🔔 KNOCK (${deadwood} deadwood)
                    </button>
                `);
            }
        }
        
        container.innerHTML = buttons.join('');
    },
    
    endGame(instantTonk = false) {
        let winAmount = 0;
        let resultMsg = '';
        
        if (instantTonk) {
            winAmount = this.ante * 4;
            resultMsg = `<div style="color: #2ecc71; font-size: 1.5em;">🎉 INSTANT TONK! Won ${winAmount} eGold!</div>`;
        } else {
            const winner = this.gameState.winner;
            if (winner.id === 0) {
                winAmount = this.ante * 3;
                const bonus = winner.bonus ? ` (Caught knocker!)` : '';
                resultMsg = `<div style="color: #2ecc71; font-size: 1.5em;">🏆 You Win${bonus}! +${winAmount} eGold</div>`;
            } else {
                resultMsg = `<div style="color: #e74c3c; font-size: 1.3em;">${winner.name} wins with ${winner.deadwood} deadwood</div>`;
            }
        }
        
        if (winAmount > 0) {
            updateBalance(winAmount);
            if (typeof achievementSystem !== 'undefined') achievementSystem.trackWin(winAmount, 'Tonk');
            if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWin(winAmount);
        }
        
        document.getElementById('tonkResult').innerHTML = resultMsg;
        document.getElementById('tonkActionButtons').innerHTML = `
            <button onclick="tonkGame.startGame()" class="game-button" style="padding: 18px 50px; font-size: 1.4em;">
                🎮 Play Again (${this.ante} eGold)
            </button>
        `;
    },
    
    addChatMessage(player, message) {
        const chat = document.getElementById('tonkChat');
        const msg = document.createElement('div');
        msg.style.marginBottom = '5px';
        msg.innerHTML = `<span style="color: #FFD700; font-weight: bold;">${player}:</span> ${message}`;
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
        
        while (chat.children.length > 15) {
            chat.removeChild(chat.firstChild);
        }
    }
};

window.tonkGame = tonkGame;
