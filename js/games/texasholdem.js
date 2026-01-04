// Texas Hold'em Poker (Simplified)
const texasholdemGame = {
    ante: 10,
    gameState: null,
    aiInterval: null,
    currentTournament: null,
    
    init() {
        // Show tournament lobby instead of solo mode
        TournamentLobby.showLobby();
    },
    
    initTournamentTable(tournament) {
        this.currentTournament = tournament;
        const content = document.getElementById('gameContent');
        
        content.innerHTML = `
            <style>
                .poker-seat {
                    position: absolute;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 5px;
                }
                .player-avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: 3px solid #4A90A4;
                    background: linear-gradient(135deg, #2C5F6F, #1a1a2e);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.8em;
                    position: relative;
                }
                .player-info {
                    background: rgba(0,0,0,0.85);
                    padding: 8px 15px;
                    border-radius: 8px;
                    border: 1px solid #4A90A4;
                    min-width: 100px;
                    text-align: center;
                }
                .dealer-button {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    width: 28px;
                    height: 28px;
                    background: linear-gradient(135deg, #fff, #ddd);
                    border-radius: 50%;
                    border: 3px solid #1a1a2e;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 0.9em;
                    color: #000;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                }
                .action-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }
                .poker-btn {
                    padding: 12px 30px;
                    font-size: 1.1em;
                    font-weight: bold;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                }
                .fold-btn { background: linear-gradient(135deg, #e74c3c, #c0392b); color: #fff; }
                .call-btn { background: linear-gradient(135deg, #f39c12, #e67e22); color: #fff; }
                .raise-btn { background: linear-gradient(135deg, #2ecc71, #27ae60); color: #fff; }
                .check-btn { background: linear-gradient(135deg, #3498db, #2980b9); color: #fff; }
                .poker-btn:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
                .poker-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
            </style>
            
            <!-- Tournament Header -->
            <div style="background: linear-gradient(135deg, #2C5F6F, #4A90A4); padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #5AA4B8;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="color: #fff; font-weight: bold; font-size: 1.1em;">🏆 ${tournament.name}</div>
                    <div style="display: flex; gap: 30px; color: #fff;">
                        <div>Position: <span id="playerPosition" style="color: #FFB800; font-weight: bold;">-</span></div>
                        <div>Players: <span id="playersRemaining" style="color: #2ecc71; font-weight: bold;">${tournament.players}</span></div>
                        <div>Blinds: <span id="blindLevel" style="color: #f39c12; font-weight: bold;">5/10</span></div>
                    </div>
                </div>
            </div>
            
            <!-- Main Poker Table -->
            <div style="position: relative; margin: 0 auto; max-width: 1000px;">
                <!-- Oval Table -->
                <div style="
                    position: relative;
                    background: radial-gradient(ellipse at center, #1a5f8f 0%, #0d3a5f 100%);
                    border-radius: 300px / 200px;
                    padding: 80px 120px;
                    border: 12px solid #8B4513;
                    box-shadow: 
                        inset 0 0 80px rgba(0,0,0,0.6),
                        0 20px 60px rgba(0,0,0,0.7);
                    min-height: 500px;
                ">
                    <!-- Table felt texture -->
                    <div style="
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background-image: 
                            repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px),
                            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px);
                        border-radius: 300px / 200px;
                        pointer-events: none;
                    "></div>
                    
                    <!-- Inner rail -->
                    <div style="
                        position: absolute;
                        top: 15px; left: 15px; right: 15px; bottom: 15px;
                        border: 2px solid rgba(255,255,255,0.1);
                        border-radius: 285px / 185px;
                        pointer-events: none;
                    "></div>
                    
                    <!-- Center branding -->
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        text-align: center;
                        pointer-events: none;
                        z-index: 1;
                    ">
                        <div style="color: rgba(255,184,0,0.3); font-size: 2.5em; font-weight: bold; text-shadow: 0 2px 10px rgba(0,0,0,0.5);">♠ Royal eGold ♥</div>
                        <div id="potAmount" style="color: #FFB800; font-size: 2em; font-weight: bold; margin-top: 10px; text-shadow: 0 2px 10px rgba(0,0,0,0.8);">Pot: 0</div>
                        <div id="gamePhaseDisplay" style="color: #fff; font-size: 1.2em; margin-top: 10px; text-transform: uppercase; opacity: 0.7;"></div>
                    </div>
                    
                    <!-- Player seats (8 positions) -->
                    <div id="playerSeats"></div>
                    
                    <!-- Community cards -->
                    <div id="communityCards" style="
                        position: absolute;
                        top: 40%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        display: flex;
                        gap: 8px;
                        z-index: 2;
                    "></div>
                </div>
                
                <!-- Player action area -->
                <div id="playerActions" style="text-align: center; margin-top: 30px;">
                    <!-- Your cards display -->
                    <div style="margin-bottom: 20px;">
                        <div style="color: #FFB800; font-weight: bold; margin-bottom: 10px; font-size: 1.2em;">Your Hand</div>
                        <div id="playerCards" style="display: flex; justify-content: center; gap: 10px;"></div>
                    </div>
                    
                    <!-- Action buttons -->
                    <div class="action-buttons" id="actionButtons" style="justify-content: center;"></div>
                    
                    <!-- Raise slider -->
                    <div id="raiseControls" style="margin-top: 15px; display: none;">
                        <input type="range" id="raiseSlider" min="10" max="100" value="20" style="width: 300px;">
                        <div style="color: #FFB800; font-weight: bold; margin-top: 5px;">
                            Raise: <span id="raiseAmount">20</span> eGold
                        </div>
                    </div>
                </div>
                
                <!-- Chat/Stats Panel -->
                <div style="position: fixed; left: 20px; bottom: 20px; width: 300px; background: rgba(0,0,0,0.9); border-radius: 10px; border: 2px solid #4A90A4; padding: 15px; max-height: 400px; overflow-y: auto;">
                    <div style="color: #4A90A4; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #4A90A4; padding-bottom: 5px;">💬 TABLE CHAT</div>
                    <div id="tableChat" style="color: #ccc; font-size: 0.9em; line-height: 1.6;"></div>
                </div>
            </div>
        `;
        
        // Start the game
        this.startGame();
    },
        const content = document.getElementById('gameContent');
        const vipLevel = typeof vipSystem !== 'undefined' ? vipSystem.getCurrentLevel().level : 0;
        
        content.innerHTML = `
            <div style="text-align: center;">
                <!-- WPT-Style Header -->
                <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #FFB800; box-shadow: 0 4px 20px rgba(255,184,0,0.3);">
                    <h3 style="color: #FFB800; font-size: 2em; margin: 0; text-shadow: 0 0 20px rgba(255,184,0,0.6);">♠️ ROYAL TEXAS HOLD'EM ♥️</h3>
                    <p style="color: #888; margin: 10px 0 0 0;">WPT Professional Style</p>
                </div>
                
                <!-- Quick Actions -->
                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap;">
                    <button onclick="pokerEnhancer.showHandHistory()" style="background: linear-gradient(135deg, #3498db, #2980b9); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(52,152,219,0.3);">
                        📜 Hand History
                    </button>
                    <button onclick="pokerEnhancer.showQuickChat()" style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(155,89,182,0.3);">
                        💬 Quick Chat
                    </button>
                </div>
                
                <!-- Premium Poker Table -->
                ${pokerEnhancer.createPremiumTable('holdem')}
                
                <script>
                    // Add table content with player seats
                    document.getElementById('tableContent').innerHTML = \`
                        ${pokerEnhancer.createPlayerSeat('dealer', 'Dealer', 1000, false, 0)}
                        ${pokerEnhancer.createPlayerSeat('player', 'You', balance, true, ${vipLevel})}
                        
                        <div style="position: relative; z-index: 2; margin-top: 20px;">
                            <div style="margin: 20px 0;">
                                <div style="color: #888; font-size: 0.9em; margin-bottom: 10px;">Dealer</div>
                                <div id="dealerHand">${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}</div>
                            </div>
                            
                            <div style="margin: 30px 0;">
                                <div style="color: #FFB800; font-size: 1.2em; font-weight: bold; margin-bottom: 15px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">🎴 Community Cards 🎴</div>
                                <div id="communityCards" style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 12px; display: inline-block;">
                                    ${pokerEnhancer.createEnhancedCard('?', '♠', true)}
                                    ${pokerEnhancer.createEnhancedCard('?', '♠', true)}
                                    ${pokerEnhancer.createEnhancedCard('?', '♠', true)}
                                    ${pokerEnhancer.createEnhancedCard('?', '♠', true)}
                                    ${pokerEnhancer.createEnhancedCard('?', '♠', true)}
                                </div>
                            </div>
                            
                            <div style="margin: 20px 0;">
                                <div style="color: #FFB800; font-size: 1.1em; font-weight: bold; margin-bottom: 10px;">Your Hand</div>
                                <div id="playerHand">${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}</div>
                            </div>
                            
                            <!-- Pot Display -->
                            <div id="potDisplay" style="
                                position: absolute;
                                top: 50%;
                                right: -100px;
                                transform: translateY(-50%);
                                background: rgba(0,0,0,0.7);
                                padding: 15px;
                                border-radius: 10px;
                                border: 2px solid #FFB800;
                                min-width: 120px;
                            ">
                                <div style="color: #888; font-size: 0.9em;">Pot</div>
                                <div style="color: #FFB800; font-size: 1.5em; font-weight: bold;">${this.ante}</div>
                                ${pokerEnhancer.createChipStack(this.ante)}
                            </div>
                        </div>
                    \`;
                </script>
                
                <button onclick="texasholdemGame.play()" class="game-button" style="
                    padding: 18px 50px; 
                    font-size: 1.4em; 
                    background: linear-gradient(135deg, #FFB800, #d4af37); 
                    border: none; 
                    border-radius: 12px; 
                    color: #1A2332; 
                    font-weight: bold; 
                    cursor: pointer; 
                    margin: 30px 0;
                    box-shadow: 0 6px 20px rgba(255,184,0,0.4);
                    transition: all 0.3s ease;
                ">
                    🎰 Deal Hand (${this.ante} eGold)
                </button>
                
                <div id="pokerResult" class="game-result" style="margin-top: 20px; font-size: 1.4em; min-height: 40px; font-weight: bold;"></div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; margin-bottom: 15px;">👑 Royal Hold'em</h3>
                    <p style="font-size: 1.1em; color: #cccccc; margin-bottom: 15px;">Classic Texas Hold'em with 5 community cards and dealer showdown</p>
                    <h4 style="color: #FFB800; margin-bottom: 10px;">🎴 Hand Rankings</h4>
                    <div style="color: #cccccc; font-size: 0.95em; line-height: 1.6; text-align: left; max-width: 500px; margin: 0 auto;">
                        <p><b style="color: #FFB800;">Royal Flush:</b> A-K-Q-J-10 same suit (Unbeatable!)</p>
                        <p><b>Straight Flush:</b> 5 cards in sequence, same suit</p>
                        <p><b>Four of a Kind:</b> Four cards of same rank</p>
                        <p><b>Full House:</b> Three of a kind + a pair</p>
                        <p><b>Flush:</b> 5 cards of same suit</p>
                        <p><b>Straight:</b> 5 cards in sequence</p>
                        <p><b>Three of a Kind:</b> Three cards of same rank</p>
                        <p><b>Two Pair:</b> Two different pairs</p>
                        <p><b>Pair:</b> Two cards of same rank</p>
                        <p><b>High Card:</b> Highest single card</p>
                    </div>
                    <div style="margin-top: 15px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 2px solid #2ecc71;">
                        <h4 style="color: #2ecc71; margin-bottom: 10px;">📜 Game Rules</h4>
                        <ul style="text-align: left; max-width: 450px; margin: 0 auto; color: #cccccc; line-height: 1.8;">
                            <li>Pay ante (<b>${this.ante} eGold</b>)</li>
                            <li>Receive <b>2 hole cards</b></li>
                            <li><b>5 community cards</b> dealt</li>
                            <li>Make best 5-card hand from 7 total</li>
                            <li>Dealer reveals their hand</li>
                            <li><b>Beat dealer to win!</b></li>
                            <li>Payout: <b style="color: #FFB800;">2x ante</b></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },
    
    startGame() {
        // Initialize poker engine
        PokerEngine.init();
        PokerEngine.initializeTable(balance);
        
        // Start first hand
        this.startNewHand();
    },
    
    startNewHand() {
        this.gameState = PokerEngine.startNewHand();
        this.updateUI();
        this.addChatMessage('Dealer', 'New hand dealt. Good luck!');
        
        // Start AI loop
        this.processAIActions();
    },
    
    updateUI() {
        const state = this.gameState;
        
        // Update pot
        document.getElementById('potAmount').textContent = `Pot: ${state.pot} eGold`;
        document.getElementById('gamePhaseDisplay').textContent = state.gamePhase;
        document.getElementById('blindLevel').textContent = `${state.smallBlind}/${state.bigBlind}`;
        
        // Update player position
        const activePlayers = state.players.filter(p => !p.folded && !p.sittingOut).length;
        const playerPos = state.players.filter(p => !p.folded && p.position <= 0).length;
        document.getElementById('playerPosition').textContent = `${playerPos} of ${activePlayers}`;
        document.getElementById('playersRemaining').textContent = activePlayers;
        
        // Render seats
        this.renderSeats();
        
        // Render community cards
        this.renderCommunityCards();
        
        // Render player cards
        this.renderPlayerCards();
        
        // Update action buttons
        this.updateActionButtons();
    },
    
    renderSeats() {
        const seatsContainer = document.getElementById('playerSeats');
        seatsContainer.innerHTML = '';
        
        // 8 seat positions around oval table
        const positions = [
            { left: '50%', bottom: '-40px', transform: 'translateX(-50%)' }, // Seat 0 - You (bottom)
            { left: '15%', bottom: '20%', transform: 'none' }, // Seat 1 - left-bottom
            { left: '5%', top: '40%', transform: 'none' }, // Seat 2 - left-mid
            { left: '15%', top: '15%', transform: 'none' }, // Seat 3 - left-top
            { left: '50%', top: '-40px', transform: 'translateX(-50%)' }, // Seat 4 - top
            { right: '15%', top: '15%', transform: 'none' }, // Seat 5 - right-top
            { right: '5%', top: '40%', transform: 'none' }, // Seat 6 - right-mid
            { right: '15%', bottom: '20%', transform: 'none' } // Seat 7 - right-bottom
        ];
        
        this.gameState.players.forEach((player, index) => {
            const pos = positions[index];
            const seat = document.createElement('div');
            seat.className = 'poker-seat';
            seat.style.cssText = `
                ${pos.left ? `left: ${pos.left};` : ''}
                ${pos.right ? `right: ${pos.right};` : ''}
                ${pos.top ? `top: ${pos.top};` : ''}
                ${pos.bottom ? `bottom: ${pos.bottom};` : ''}
                ${pos.transform ? `transform: ${pos.transform};` : ''}
            `;
            
            const isActive = index === this.gameState.activePosition;
            const isDealer = index === this.gameState.dealerPosition;
            
            seat.innerHTML = `
                <div class="player-avatar" style="${isActive ? 'border-color: #2ecc71; box-shadow: 0 0 20px #2ecc71;' : ''}">
                    ${isDealer ? '<div class="dealer-button">D</div>' : ''}
                    ${player.sittingOut ? '💤' : '🎰'}
                </div>
                <div class="player-info">
                    <div style="color: ${player.isPlayer ? '#FFB800' : '#fff'}; font-weight: bold; font-size: 0.9em;">
                        ${player.name}
                    </div>
                    <div style="color: #2ecc71; font-weight: bold; font-size: 1em;">
                        ${player.chips} 💰
                    </div>
                    ${player.bet > 0 ? `<div style="color: #f39c12; font-size: 0.85em;">Bet: ${player.bet}</div>` : ''}
                    ${player.lastAction ? `<div style="color: #888; font-size: 0.75em; text-transform: uppercase;">${player.lastAction}</div>` : ''}
                </div>
                ${!player.folded && player.cards.length > 0 && !player.sittingOut ? `
                    <div style="display: flex; gap: 3px; margin-top: 5px;">
                        ${player.isPlayer ? '' : 
                            player.cards.map(() => pokerEnhancer.createEnhancedCard('?', '♠', true).replace('70px', '35px').replace('100px', '50px')).join('')
                        }
                    </div>
                ` : ''}
            `;
            
            seatsContainer.appendChild(seat);
        });
    },
    
    renderCommunityCards() {
        const container = document.getElementById('communityCards');
        if (this.gameState.communityCards.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = this.gameState.communityCards
            .map(card => pokerEnhancer.createEnhancedCard(card.value, card.suit))
            .join('');
    },
    
    renderPlayerCards() {
        const container = document.getElementById('playerCards');
        const player = this.gameState.players[0]; // You are always position 0
        
        if (!player.cards || player.cards.length === 0 || player.folded) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = player.cards
            .map(card => pokerEnhancer.createEnhancedCard(card.value, card.suit))
            .join('');
    },
    
    updateActionButtons() {
        const container = document.getElementById('actionButtons');
        const player = this.gameState.players[0];
        const isYourTurn = this.gameState.activePosition === 0;
        const callAmount = this.gameState.currentBet - player.bet;
        
        if (!isYourTurn || player.folded || this.gameState.gamePhase === 'complete') {
            container.innerHTML = '<div style="color: #888; padding: 20px;">Waiting for other players...</div>';
            document.getElementById('raiseControls').style.display = 'none';
            return;
        }
        
        let buttons = [];
        
        // Fold button
        buttons.push(`
            <button class="poker-btn fold-btn" onclick="texasholdemGame.playerAction('fold')">
                ✕ Fold
            </button>
        `);
        
        // Check or Call button
        if (callAmount === 0) {
            buttons.push(`
                <button class="poker-btn check-btn" onclick="texasholdemGame.playerAction('check')">
                    ✓ Check
                </button>
            `);
        } else {
            buttons.push(`
                <button class="poker-btn call-btn" onclick="texasholdemGame.playerAction('call')">
                    Call ${callAmount}
                </button>
            `);
        }
        
        // Raise button
        if (player.chips > callAmount) {
            buttons.push(`
                <button class="poker-btn raise-btn" onclick="texasholdemGame.playerAction('raise')">
                    ↑ Raise
                </button>
            `);
        }
        
        container.innerHTML = buttons.join('');
        
        // Setup raise slider
        const raiseSlider = document.getElementById('raiseSlider');
        const raiseAmount = document.getElementById('raiseAmount');
        raiseSlider.min = this.gameState.bigBlind;
        raiseSlider.max = Math.min(player.chips - callAmount, 100);
        raiseSlider.value = this.gameState.bigBlind * 2;
        raiseAmount.textContent = raiseSlider.value;
        
        raiseSlider.oninput = () => {
            raiseAmount.textContent = raiseSlider.value;
        };
    },
    
    playerAction(action) {
        const player = this.gameState.players[0];
        
        if (action === 'fold') {
            PokerEngine.playerFold(0);
            this.addChatMessage('You', 'Fold');
            if (typeof soundManager !== 'undefined') soundManager.playButtonClick();
        } else if (action === 'call') {
            PokerEngine.playerCall(0);
            this.addChatMessage('You', `Call ${this.gameState.currentBet - player.bet}`);
            if (typeof soundManager !== 'undefined') soundManager.playChipSound();
        } else if (action === 'check') {
            PokerEngine.playerCheck(0);
            this.addChatMessage('You', 'Check');
            if (typeof soundManager !== 'undefined') soundManager.playButtonClick();
        } else if (action === 'raise') {
            const raiseControls = document.getElementById('raiseControls');
            if (raiseControls.style.display === 'none') {
                raiseControls.style.display = 'block';
                return;
            }
            const raiseAmount = parseInt(document.getElementById('raiseSlider').value);
            PokerEngine.playerRaise(0, raiseAmount);
            this.addChatMessage('You', `Raise ${raiseAmount}`);
            if (typeof soundManager !== 'undefined') soundManager.playChipSound();
            raiseControls.style.display = 'none';
        }
        
        this.gameState = PokerEngine.getGameState();
        this.updateUI();
        
        // Continue with AI
        setTimeout(() => this.processAIActions(), 500);
    },
    
    processAIActions() {
        if (this.gameState.gamePhase === 'complete') {
            setTimeout(() => this.startNewHand(), 3000);
            return;
        }
        
        const activePlayer = this.gameState.players[this.gameState.activePosition];
        
        if (activePlayer.isPlayer) {
            // Player's turn - wait for action
            return;
        }
        
        // AI action
        setTimeout(() => {
            const aiAction = PokerEngine.getAIAction(activePlayer);
            
            if (aiAction.action === 'fold') {
                PokerEngine.playerFold(activePlayer.id);
                this.addChatMessage(activePlayer.name, 'Fold');
            } else if (aiAction.action === 'call') {
                PokerEngine.playerCall(activePlayer.id);
                this.addChatMessage(activePlayer.name, `Call ${this.gameState.currentBet - activePlayer.bet}`);
            } else if (aiAction.action === 'check') {
                PokerEngine.playerCheck(activePlayer.id);
                this.addChatMessage(activePlayer.name, 'Check');
            } else if (aiAction.action === 'raise') {
                PokerEngine.playerRaise(activePlayer.id, aiAction.amount);
                this.addChatMessage(activePlayer.name, `Raise ${aiAction.amount}`);
            }
            
            this.gameState = PokerEngine.getGameState();
            this.updateUI();
            
            // Continue AI loop
            this.processAIActions();
        }, 800 + Math.random() * 1200); // Random delay for realism
    },
    
    addChatMessage(player, message) {
        const chat = document.getElementById('tableChat');
        const msg = document.createElement('div');
        msg.style.marginBottom = '8px';
        msg.innerHTML = `<span style="color: #4A90A4; font-weight: bold;">${player}:</span> ${message}`;
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
        
        // Keep last 20 messages
        while (chat.children.length > 20) {
            chat.removeChild(chat.firstChild);
        }
    },
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];
        
        for (const suit of suits) {
            for (const value of values) {
                deck.push({ value, suit, numValue: values.indexOf(value) + 2 });
            }
        }
        return deck;
    },
    
    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    },
    
    play() {
        if (balance < this.ante) {
            document.getElementById('pokerResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            soundManager.playButtonClick();
            return;
        }
        
        // Play chip sound
        soundManager.playChipSound();
        
        updateBalance(-this.ante);
        
        // Track for VIP, achievements, and leaderboard
        if (typeof vipSystem !== 'undefined') vipSystem.trackWager(this.ante);
        if (typeof achievementSystem !== 'undefined') achievementSystem.trackBet(this.ante, 'Royal Texas Hold\'em');
        if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWager(this.ante, 'Royal Texas Hold\'em');
        
        // Create deck and shuffle
        const deck = this.createDeck();
        this.shuffleDeck(deck);
        
        // Deal cards with animation
        soundManager.playShuffle();
        
        // Deal cards
        const playerCards = [deck.pop(), deck.pop()];
        const dealerCards = [deck.pop(), deck.pop()];
        const community = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()];
        
        // Display cards with actual visuals and animation
        const suitMap = {'♠': 'spades', '♥': 'hearts', '♦': 'diamonds', '♣': 'clubs'};
        
        setTimeout(() => {
            soundManager.playCardDeal();
            document.getElementById('playerHand').innerHTML = 
                playerCards.map(c => pokerEnhancer.createEnhancedCard(c.value, c.suit)).join('');
        }, 300);
        
        setTimeout(() => {
            soundManager.playCardDeal();
            document.getElementById('communityCards').innerHTML = 
                community.map((c, i) => `<div style="display: inline-block; animation: cardFlip 0.6s ease ${i * 0.1}s;">${pokerEnhancer.createEnhancedCard(c.value, c.suit)}</div>`).join('');
        }, 600);
        
        setTimeout(() => {
            soundManager.playCardDeal();
            document.getElementById('dealerHand').innerHTML = 
                dealerCards.map(c => pokerEnhancer.createEnhancedCard(c.value, c.suit)).join('');
            
            // Evaluate hands (simplified)
            const playerScore = this.evaluateHand([...playerCards, ...community]);
            const dealerScore = this.evaluateHand([...dealerCards, ...community]) + 0.5; // House edge
            
            let result, payout = 0;
            
            if (playerScore > dealerScore) {
                result = 'win';
                payout = this.ante * 2;
                updateBalance(payout);
                
                // Track win for achievements and leaderboard
                if (typeof achievementSystem !== 'undefined') achievementSystem.trackWin(payout);
                if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWin(payout);
                
                soundManager.playWin();
                particleSystem.createChipStack(window.innerWidth / 2, window.innerHeight / 2, 10);
                const resultDiv = document.getElementById('pokerResult');
                resultDiv.className = 'win-effect';
                resultDiv.innerHTML = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 YOU WIN! +${payout} eGold <small style="color: #2ecc71;">($${(payout * 0.10).toFixed(2)})</small></span>`;
            } else if (playerScore === dealerScore) {
                result = 'draw';
                soundManager.playLoss();
                
                // Track loss for achievements
                if (typeof achievementSystem !== 'undefined') achievementSystem.trackLoss();
                if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackLoss();
                
                document.getElementById('pokerResult').innerHTML = '<span style="color: #FFB800;">Push - Dealer wins ties (house rule)</span>';
            } else {
                result = 'loss';
                soundManager.playLoss();
                
                // Track loss for achievements
                if (typeof achievementSystem !== 'undefined') achievementSystem.trackLoss();
                if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackLoss();
                
                document.getElementById('pokerResult').className = 'loss-effect';
                document.getElementById('pokerResult').innerHTML = '<span style="color: #e74c3c;">Dealer wins. Try again!</span>';
            }
            
            // Record hand in history
            if (typeof pokerEnhancer !== 'undefined') {
                pokerEnhancer.recordHand(
                    'Royal Texas Hold\'em',
                    playerCards,
                    dealerCards,
                    community,
                    result,
                    this.ante,
                    payout
                );
            }
        }, 900);
    },
    
    evaluateHand(cards) {
        // Simplified hand evaluation - returns a score
        const values = cards.map(c => c.numValue).sort((a, b) => b - a);
        const suits = cards.map(c => c.suit);
        
        // Check for flush
        const isFlush = suits.every(s => s === suits[0]);
        
        // Check for pairs, three of a kind, etc.
        const valueCounts = {};
        for (const v of values) {
            valueCounts[v] = (valueCounts[v] || 0) + 1;
        }
        
        const counts = Object.values(valueCounts).sort((a, b) => b - a);
        
        // Scoring (simplified)
        let score = Math.max(...values); // High card
        
        if (counts[0] === 4) score = 800; // Four of a kind
        else if (counts[0] === 3 && counts[1] === 2) score = 700; // Full house
        else if (isFlush) score = 600; // Flush
        else if (counts[0] === 3) score = 400; // Three of a kind
        else if (counts[0] === 2 && counts[1] === 2) score = 300; // Two pair
        else if (counts[0] === 2) score = 200; // Pair
        
        return score;
    },
    
    initPVP(room) {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #7B68EE; font-size: 1.8em; margin-bottom: 15px;">
                        👥 PVP Texas Hold'em
                    </h3>
                    <p style="color: #FFB800; font-size: 1.2em;">Pot: ${room.bet * 2} eGold</p>
                </div>
                
                <div style="margin: 30px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 600px; margin: 30px auto;">
                    <div style="padding: 20px; background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c; border-radius: 10px;">
                        <h4 style="color: #e74c3c; margin-bottom: 10px;">🤖 Opponent</h4>
                        <p style="color: #cccccc; font-size: 0.9em;">${room.host === PVPSystem.playerName ? 'AI Player' : room.host}</p>
                        <div style="font-size: 2em; margin: 10px 0;">🂠 🂠</div>
                    </div>
                    
                    <div style="padding: 20px; background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71; border-radius: 10px;">
                        <h4 style="color: #2ecc71; margin-bottom: 10px;">😊 You</h4>
                        <p style="color: #cccccc; font-size: 0.9em;">${PVPSystem.playerName}</p>
                        <div id="pvpPlayerHand" style="font-size: 2em; margin: 10px 0;">🂠 🂠</div>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4 style="color: #FFB800; margin-bottom: 10px;">Community Cards</h4>
                    <div id="pvpCommunityCards" style="font-size: 2.5em;">🂠 🂠 🂠 🂠 🂠</div>
                </div>
                
                <button onclick="texasholdemGame.playPVP(${room.bet})" class="game-button" style="margin: 20px 0;">
                    🎮 Play Hand
                </button>
                
                <div id="pvpResult" style="margin-top: 20px; font-size: 1.3em;"></div>
            </div>
        `;
    },
    
    playPVP(bet) {
        // Deal hands
        const deck = this.createDeck();
        this.shuffleDeck(deck);
        
        const playerCards = [deck.pop(), deck.pop()];
        const opponentCards = [deck.pop(), deck.pop()];
        const communityCards = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()];
        
        // Show cards
        document.getElementById('pvpPlayerHand').innerText = playerCards.map(c => c.symbol).join(' ');
        document.getElementById('pvpCommunityCards').innerText = communityCards.map(c => c.symbol).join(' ');
        
        // Evaluate hands
        const playerHand = [...playerCards, ...communityCards];
        const opponentHand = [...opponentCards, ...communityCards];
        
        const playerScore = this.evaluateHand(playerHand);
        const opponentScore = this.evaluateHand(opponentHand);
        
        // Determine winner
        const resultDiv = document.getElementById('pvpResult');
        setTimeout(() => {
            // Reveal opponent cards
            const opponentDiv = document.querySelector('[style*="rgba(231, 76, 60"]').querySelector('div[style*="font-size: 2em"]');
            opponentDiv.innerText = opponentCards.map(c => c.symbol).join(' ');
            
            if (playerScore > opponentScore) {
                updateBalance(bet * 2);
                resultDiv.innerHTML = `
                    <div class="game-result win">
                        <h3>🎉 YOU WIN!</h3>
                        <p>+${bet * 2} eGold</p>
                        <p style="font-size: 0.9em; margin-top: 10px;">Your hand was stronger!</p>
                    </div>
                `;
            } else if (playerScore === opponentScore) {
                updateBalance(bet);
                resultDiv.innerHTML = `
                    <div class="game-result" style="background: rgba(255, 184, 0, 0.2); border-color: #FFB800;">
                        <h3 style="color: #FFB800;">🤝 TIE!</h3>
                        <p>Bet returned: ${bet} eGold</p>
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `
                    <div class="game-result lose">
                        <h3>😔 YOU LOSE</h3>
                        <p>-${bet} eGold</p>
                        <p style="font-size: 0.9em; margin-top: 10px;">Opponent had better hand</p>
                    </div>
                `;
            }
        }, 1000);
    }

};

window.texasholdemGame = texasholdemGame;
