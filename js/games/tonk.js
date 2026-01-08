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
                    <div style="color: #2ecc71; font-size: 1.2em;">
                        🎯 Ante: ${this.ante} eGold
                    </div>
                </div>
                
                <!-- Game Area -->
                <div class="game-area" style="display: flex; justify-content: space-between; gap: 30px;">
                    <!-- Dealer Section -->
                    <div class="dealer-section" style="
                        background: rgba(25, 25, 112, 0.8);
                        border-radius: 15px;
                        padding: 25px;
                        flex: 1;
                        text-align: center;
                        box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
                        border: 2px solid #4A90A4;
                    ">
                        <h3 style="color: #FFB800; margin-bottom: 15px;">🤖 Dealer</h3>
                        <div id="dealerHand" style="
                            display: flex;
                            justify-content: center;
                            gap: 10px;
                            min-height: 120px;
                            align-items: center;
                            margin-bottom: 15px;
                            flex-wrap: wrap;
                        ">
                            <div style="font-size: 3em;">🂠</div>
                            <div style="font-size: 3em;">🂠</div>
                            <div style="font-size: 3em;">🂠</div>
                        </div>
                        <p id="dealerScore" style="color: #fff; font-size: 1.3em;">Hidden</p>
                    </div>
                    
                    <!-- Player Section -->
                    <div class="player-section" style="
                        background: rgba(46, 204, 113, 0.8);
                        border-radius: 15px;
                        padding: 25px;
                        flex: 1;
                        text-align: center;
                        box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
                        border: 2px solid #2ecc71;
                    ">
                        <h3 style="color: #fff; margin-bottom: 15px;">😊 You</h3>
                        <div id="playerHand" style="
                            display: flex;
                            justify-content: center;
                            gap: 10px;
                            min-height: 120px;
                            align-items: center;
                            margin-bottom: 15px;
                            flex-wrap: wrap;
                        ">
                            <div style="font-size: 3em;">🂠</div>
                            <div style="font-size: 3em;">🂠</div>
                            <div style="font-size: 3em;">🂠</div>
                        </div>
                        <p id="playerScore" style="color: #fff; font-size: 1.3em;">Score: ???</p>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="action-buttons" style="
                    text-align: center;
                    margin-top: 30px;
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.6);
                    border-radius: 15px;
                    border: 1px solid #FFD700;
                ">
                    <button id="playButton" onclick="tonkGame.play()" 
                        class="game-button"
                        style="
                            padding: 15px 40px;
                            font-size: 1.3em;
                            background: linear-gradient(135deg, #FFB800, #FF8C00);
                            border: none;
                            border-radius: 25px;
                            color: #1a2332;
                            font-weight: bold;
                            cursor: pointer;
                            margin: 10px;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 15px rgba(255,184,0,0.4);
                        ">
                        🎮 Play Hand (${this.ante} eGold)
                    </button>
                    
                    <div id="gameActions" style="margin-top: 20px; display: none;">
                        <button onclick="tonkGame.hit()" 
                            class="game-button"
                            style="
                                padding: 12px 30px;
                                font-size: 1.1em;
                                background: linear-gradient(135deg, #e74c3c, #c0392b);
                                border: none;
                                border-radius: 8px;
                                color: white;
                                cursor: pointer;
                                margin: 5px;
                                transition: all 0.2s ease;
                            ">
                            🎴 Hit (Draw Card)
                        </button>
                        <button onclick="tonkGame.stand()" 
                            class="game-button"
                            style="
                                padding: 12px 30px;
                                font-size: 1.1em;
                                background: linear-gradient(135deg, #f39c12, #e67e22);
                                border: none;
                                border-radius: 8px;
                                color: white;
                                cursor: pointer;
                                margin: 5px;
                                transition: all 0.2s ease;
                            ">
                            ✋ Stand (Hold)
                        </button>
                    </div>
                </div>
                
                <!-- Result Display -->
                <div id="tonkResult" class="game-result" style="
                    margin-top: 30px;
                    padding: 20px;
                    border-radius: 15px;
                    text-align: center;
                    min-height: 60px;
                    font-size: 1.3em;
                    background: rgba(44, 62, 80, 0.7);
                    border: 1px solid #3498db;
                "></div>
                
                <!-- Game Rules -->
                <div class="game-rules" style="
                    margin-top: 30px;
                    padding: 25px;
                    background: rgba(44, 62, 80, 0.7);
                    border-radius: 15px;
                    border: 2px solid #FFD700;
                ">
                    <h3 style="color: #FFB800; text-align: center; margin-bottom: 20px;">📜 Game Rules</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                        <div style="color: #fff;">
                            <h4 style="color: #2ecc71; margin-bottom: 10px;">🎯 Objective</h4>
                            <p>Get as close to 49 points without going over!</p>
                        </div>
                        
                        <div style="color: #fff;">
                            <h4 style="color: #f39c12; margin-bottom: 10px;">🃏 Card Values</h4>
                            <ul style="text-align: left; padding-left: 20px; line-height: 1.8;">
                                <li>Face cards (J, Q, K): 10 points</li>
                                <li>Aces: 1 point</li>
                                <li>Number cards: Face value</li>
                            </ul>
                        </div>
                        
                        <div style="color: #fff;">
                            <h4 style="color: #e74c3c; margin-bottom: 10px;">⚡ Rules</h4>
                            <ul style="text-align: left; padding-left: 20px; line-height: 1.8;">
                                <li>Ante: <b>${this.ante} eGold</b></li>
                                <li>Start with 3 cards</li>
                                <li>Hit or Stand each turn</li>
                                <li>Bust over 49 = loss</li>
                                <li>Dealer draws to 40+</li>
                                <li>Dealer wins ties</li>
                                <li>Win pays 2x ante!</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.updateBalance(balance);
    },
    
    updateBalance(newBalance) {
        const balanceEl = document.getElementById('tonkBalance');
        if (balanceEl) {
            balanceEl.textContent = newBalance.toFixed(2);
        }
    },
    
    getCard() {
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const suits = ['♠', '♥', '♦', '♣'];
        
        return {
            value: values[Math.floor(Math.random() * values.length)],
            suit: suits[Math.floor(Math.random() * suits.length)]
        };
    },
    
    getScore(cards) {
        return cards.reduce((sum, card) => {
            if (card.value === 'A') return sum + 1;
            if (['J', 'Q', 'K'].includes(card.value)) return sum + 10;
            return sum + parseInt(card.value);
        }, 0);
    },
    
    getCardColor(suit) {
        return (suit === '♥' || suit === '♦') ? '#e74c3c' : '#2c3e50';
    },
    
    updateDisplay() {
        const playerScore = this.getScore(this.playerCards || []);
        document.getElementById('playerHand').innerHTML = 
            (this.playerCards || []).map(c => 
                `<div style="
                    font-size: 2.5em; 
                    display: inline-block;
                    background: white;
                    padding: 10px 15px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                    color: ${this.getCardColor(c.suit)};
                    font-weight: bold;
                ">${c.value}${c.suit}</div>`
            ).join('');
        
        const playerScoreElement = document.getElementById('playerScore');
        playerScoreElement.textContent = `Score: ${playerScore}`;
        if (playerScore > 49) {
            playerScoreElement.style.color = '#e74c3c';
        } else {
            playerScoreElement.style.color = '#2ecc71';
        }
        
        if (!this.gameActive) {
            // Show dealer cards
            if (this.dealerCards && this.dealerCards.length > 0) {
                const dealerScore = this.getScore(this.dealerCards);
                document.getElementById('dealerHand').innerHTML = 
                    (this.dealerCards || []).map(c => 
                        `<div style="
                            font-size: 2.5em; 
                            display: inline-block;
                            background: white;
                            padding: 10px 15px;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                            color: ${this.getCardColor(c.suit)};
                            font-weight: bold;
                        ">${c.value}${c.suit}</div>`
                    ).join('');
                
                const dealerScoreElement = document.getElementById('dealerScore');
                dealerScoreElement.textContent = `Score: ${dealerScore}`;
                if (dealerScore > 49) {
                    dealerScoreElement.style.color = '#e74c3c';
                } else {
                    dealerScoreElement.style.color = '#2ecc71';
                }
            }
        } else {
            // Hide dealer cards during active game
            document.getElementById('dealerHand').innerHTML = 
                '<div style="font-size: 3em;">🂠</div>'.repeat(this.dealerCards.length);
            document.getElementById('dealerScore').textContent = 'Hidden';
        }
    },
    
    play() {
        // Check balance
        if (balance < this.ante) {
            document.getElementById('tonkResult').innerHTML = 
                '<span style="color: #e74c3c; font-size: 1.5em;">❌ Insufficient balance!</span>';
            if (typeof soundManager !== 'undefined') soundManager.playButtonClick();
            return;
        }
        
        // Play sound
        if (typeof soundManager !== 'undefined') soundManager.playChipSound();
        
        // Deduct ante
        updateBalance(-this.ante);
        this.updateBalance(balance);
        
        // Track for systems
        if (typeof vipSystem !== 'undefined') vipSystem.trackWager(this.ante);
        if (typeof achievementSystem !== 'undefined') achievementSystem.trackBet(this.ante, 'Royal Tonk');
        if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWager(this.ante, 'Royal Tonk');
        
        // Set game state
        this.gameActive = true;
        
        // Deal cards
        this.playerCards = [this.getCard(), this.getCard(), this.getCard()];
        this.dealerCards = [this.getCard(), this.getCard(), this.getCard()];
        
        // Update display
        this.updateDisplay();
        
        // Show/hide buttons
        document.getElementById('gameActions').style.display = 'block';
        document.getElementById('playButton').disabled = true;
        document.getElementById('playButton').style.opacity = '0.5';
        
        // Clear result
        document.getElementById('tonkResult').innerHTML = '<span style="color: #FFB800;">Choose your move: Hit or Stand</span>';
    },
    
    hit() {
        if (!this.gameActive) return;
        
        // Play sound
        if (typeof soundManager !== 'undefined') soundManager.playCardDeal();
        
        // Draw card
        this.playerCards.push(this.getCard());
        this.updateDisplay();
        
        const playerScore = this.getScore(this.playerCards);
        if (playerScore > 49) {
            // Auto-stand if bust
            document.getElementById('tonkResult').innerHTML = '<span style="color: #e74c3c; font-size: 1.3em;">💥 BUST! You went over 49!</span>';
            setTimeout(() => this.stand(), 1500);
        }
    },
    
    stand() {
        if (!this.gameActive) return;
        
        this.gameActive = false;
        
        // Hide buttons
        document.getElementById('gameActions').style.display = 'none';
        document.getElementById('playButton').disabled = false;
        document.getElementById('playButton').style.opacity = '1';
        
        // Dealer plays
        let dealerScore = this.getScore(this.dealerCards);
        while (dealerScore < 40 && dealerScore <= 49) {
            this.dealerCards.push(this.getCard());
            dealerScore = this.getScore(this.dealerCards);
        }
        
        // Update display
        this.updateDisplay();
        
        const playerScore = this.getScore(this.playerCards);
        const playerBust = playerScore > 49;
        const dealerBust = dealerScore > 49;
        
        let result = '';
        let payout = 0;
        
        if (playerBust && dealerBust) {
            if (typeof soundManager !== 'undefined') soundManager.playLoss();
            result = '<span style="color: #FFB800; font-size: 1.5em;">Both bust - Dealer wins (house rule)</span>';
        } else if (playerBust) {
            if (typeof soundManager !== 'undefined') soundManager.playLoss();
            result = '<span style="color: #e74c3c; font-size: 1.5em;">💔 You bust! Dealer wins.</span>';
        } else if (dealerBust) {
            payout = this.ante * 2;
            updateBalance(payout);
            this.updateBalance(balance);
            
            if (typeof soundManager !== 'undefined') soundManager.playWin();
            if (typeof particleSystem !== 'undefined') particleSystem.createCoinBurst(window.innerWidth / 2, window.innerHeight / 2, payout);
            
            result = `<span style="color: #2ecc71; font-size: 1.8em;">🎉 Dealer busts! YOU WIN!<br>+${payout.toFixed(2)} eGold <small style="color: #2ecc71;">($${(payout * 0.10).toFixed(2)})</small></span>`;
        } else {
            const diff = Math.abs(49 - playerScore);
            const dealerDiff = Math.abs(49 - dealerScore);
            
            if (diff < dealerDiff) {
                payout = this.ante * 2;
                updateBalance(payout);
                this.updateBalance(balance);
                
                if (typeof soundManager !== 'undefined') soundManager.playWin();
                if (typeof particleSystem !== 'undefined') particleSystem.createCoinBurst(window.innerWidth / 2, window.innerHeight / 2, payout);
                
                result = `<span style="color: #2ecc71; font-size: 1.8em;">🎉 YOU WIN!<br>+${payout.toFixed(2)} eGold <small style="color: #2ecc71;">($${(payout * 0.10).toFixed(2)})</small></span>`;
            } else if (diff === dealerDiff) {
                if (typeof soundManager !== 'undefined') soundManager.playLoss();
                result = '<span style="color: #FFB800; font-size: 1.5em;">🤝 Tie - Dealer wins (house rule)</span>';
            } else {
                if (typeof soundManager !== 'undefined') soundManager.playLoss();
                result = '<span style="color: #e74c3c; font-size: 1.5em;">💔 Dealer wins. Try again!</span>';
            }
        }
        
        document.getElementById('tonkResult').innerHTML = result;
        
        // Track wins
        if (payout > 0 && typeof achievementSystem !== 'undefined') {
            achievementSystem.trackWin(payout, 'Royal Tonk');
        }
    },
    
    initPVP(room) {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #7B68EE; font-size: 1.8em;">👥 PVP Tonk</h3>
                    <p style="color: #FFB800; font-size: 1.2em;">Pot: ${room.bet * 2} eGold</p>
                </div>
                
                <div style="margin: 30px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 600px; margin: 30px auto;">
                    <div style="padding: 20px; background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c; border-radius: 10px;">
                        <h4 style="color: #e74c3c;">🤖 Opponent</h4>
                        <div style="font-size: 2.5em; margin: 10px 0;">🂠 🂠 🂠 🂠 🂠</div>
                        <p id="pvpOppScore" style="color: #cccccc; margin-top: 10px;">Score: ?</p>
                    </div>
                    <div style="padding: 20px; background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71; border-radius: 10px;">
                        <h4 style="color: #2ecc71;">😊 You</h4>
                        <div id="pvpPlayerHandTonk" style="font-size: 2.5em; margin: 10px 0;">🂠 🂠 🂠 🂠 🂠</div>
                        <p id="pvpYourScore" style="color: #cccccc; margin-top: 10px;">Score: ?</p>
                    </div>
                </div>
                
                <button onclick="tonkGame.playPVP(${room.bet})" class="game-button">🎮 Play Hand</button>
                <div id="pvpResultTonk" style="margin-top: 20px; font-size: 1.3em;"></div>
            </div>
        `;
    },
    
    playPVP(bet) {
        // Random scores near 49
        const playerScore = 30 + Math.floor(Math.random() * 25);
        const opponentScore = 30 + Math.floor(Math.random() * 25);
        
        const playerDiff = Math.abs(49 - playerScore);
        const opponentDiff = Math.abs(49 - opponentScore);
        
        document.getElementById('pvpPlayerHandTonk').innerText = '10♠ 9♠ 8♠ 7♥ 6♦';
        document.getElementById('pvpYourScore').innerText = `Score: ${playerScore}`;
        
        const resultDiv = document.getElementById('pvpResultTonk');
        setTimeout(() => {
            const opponentDiv = document.querySelector('[style*="rgba(231, 76, 60"]').querySelector('div[style*="font-size: 2.5em"]');
            opponentDiv.innerText = 'K♥ Q♥ J♣ 10♣ 9♥';
            document.getElementById('pvpOppScore').innerText = `Score: ${opponentScore}`;
            
            if (playerDiff < opponentDiff) {
                updateBalance(bet * 2);
                resultDiv.innerHTML = `<div class="game-result win"><h3>🎉 YOU WIN!</h3><p>+${bet * 2} eGold</p><p style="font-size: 0.9em;">Closer to 49!</p></div>`;
            } else if (playerDiff === opponentDiff) {
                updateBalance(bet);
                resultDiv.innerHTML = `<div class="game-result" style="background: rgba(255, 184, 0, 0.2); border-color: #FFB800;"><h3 style="color: #FFB800;">🤝 TIE!</h3><p>Bet returned</p></div>`;
            } else {
                resultDiv.innerHTML = `<div class="game-result lose"><h3>😔 YOU LOSE</h3><p>-${bet} eGold</p><p style="font-size: 0.9em;">Opponent was closer!</p></div>`;
            }
        }, 1000);
    }
};

window.tonkGame = tonkGame;
