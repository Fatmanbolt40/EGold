// Texas Hold'em Poker (Simplified)
const texasholdemGame = {
    ante: 10,
    gameState: null,
    aiInterval: null,
    currentTournament: null,
    
    init() {
        // Show game mode selector
        this.showGameModeSelector();
    },
    
    showGameModeSelector() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="max-width: 800px; margin: 50px auto; padding: 40px; background: linear-gradient(135deg, #1a2a6c, #b21f1f); border-radius: 20px; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
                <h1 style="color: #FFD700; font-size: 3em; margin-bottom: 20px;">🃏 Texas Hold'em Poker</h1>
                <p style="color: #fff; font-size: 1.3em; margin-bottom: 40px;">Choose Your Game Mode</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    <button onclick="texasholdemGame.startEnhancedMode()" style="
                        padding: 40px 30px;
                        background: linear-gradient(135deg, #FFB800, #FF8C00);
                        border: none;
                        border-radius: 15px;
                        color: #1a2332;
                        font-size: 1.5em;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 10px 30px rgba(255, 184, 0, 0.4);
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <div style="font-size: 3em; margin-bottom: 15px;">🎮</div>
                        <div>Practice Mode</div>
                        <div style="font-size: 0.6em; margin-top: 10px; opacity: 0.8;">Play against AI opponents</div>
                    </button>
                    
                    <button onclick="TournamentLobby.showLobby()" style="
                        padding: 40px 30px;
                        background: linear-gradient(135deg, #9b59b6, #8e44ad);
                        border: none;
                        border-radius: 15px;
                        color: #fff;
                        font-size: 1.5em;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 10px 30px rgba(155, 89, 182, 0.4);
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <div style="font-size: 3em; margin-bottom: 15px;">🏆</div>
                        <div>Tournament Mode</div>
                        <div style="font-size: 0.6em; margin-top: 10px; opacity: 0.8;">Join competitive tournaments</div>
                    </button>
                </div>
                
                <button onclick="window.location.reload()" style="
                    margin-top: 30px;
                    padding: 15px 40px;
                    background: rgba(231, 76, 60, 0.8);
                    border: none;
                    border-radius: 25px;
                    color: #fff;
                    font-size: 1.1em;
                    cursor: pointer;
                ">← Back to Lobby</button>
            </div>
        `;
    },
    
    startEnhancedMode() {
        enhancedPokerGame.init();
        const content = document.getElementById('gameContent');
        content.innerHTML = enhancedPokerGame.setupUI();
        enhancedPokerGame.setupEventListeners();
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
                    <div id="raiseControls" style="margin-top: 15px; display: none; padding: 15px; background: rgba(255,184,0,0.1); border-radius: 10px; border: 2px solid #FFB800;">
                        <div style="color: #FFB800; font-weight: bold; margin-bottom: 10px; font-size: 1.1em;">
                            Select Raise Amount
                        </div>
                        <input type="range" id="raiseSlider" min="10" max="100" value="20" style="width: 100%; max-width: 400px; height: 8px; cursor: pointer;">
                        <div style="display: flex; justify-content: space-between; margin-top: 10px; color: #ccc; font-size: 0.9em;">
                            <span id="minRaise">Min</span>
                            <span style="color: #FFB800; font-weight: bold; font-size: 1.3em;"><span id="raiseAmount">20</span> eGold</span>
                            <span id="maxRaise">Max</span>
                        </div>
                        <button class="poker-btn raise-btn" onclick="texasholdemGame.playerAction('confirmRaise')" style="margin-top: 10px; width: 100%; max-width: 400px;">
                            Confirm Raise
                        </button>
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
        
        // Update game phase display with proper capitalization
        const phaseMap = {
            'waiting': 'Waiting',
            'preflop': 'Pre-Flop',
            'flop': 'Flop',
            'turn': 'Turn',
            'river': 'River',
            'showdown': 'Showdown',
            'complete': 'Complete'
        };
        document.getElementById('gamePhaseDisplay').textContent = phaseMap[state.gamePhase] || state.gamePhase;
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
        const raiseControls = document.getElementById('raiseControls');
        
        if (action === 'fold') {
            PokerEngine.playerFold(0);
            this.addChatMessage('You', 'Fold');
            if (typeof soundManager !== 'undefined') soundManager.playButtonClick();
            if (raiseControls) raiseControls.style.display = 'none';
        } else if (action === 'call') {
            PokerEngine.playerCall(0);
            this.addChatMessage('You', `Call ${this.gameState.currentBet - player.bet}`);
            if (typeof soundManager !== 'undefined') soundManager.playChipSound();
            if (raiseControls) raiseControls.style.display = 'none';
        } else if (action === 'check') {
            PokerEngine.playerCheck(0);
            this.addChatMessage('You', 'Check');
            if (typeof soundManager !== 'undefined') soundManager.playButtonClick();
            if (raiseControls) raiseControls.style.display = 'none';
        } else if (action === 'raise') {
            if (raiseControls.style.display === 'none' || raiseControls.style.display === '') {
                raiseControls.style.display = 'block';
                // Update min/max labels
                const raiseSlider = document.getElementById('raiseSlider');
                document.getElementById('minRaise').textContent = raiseSlider.min;
                document.getElementById('maxRaise').textContent = raiseSlider.max;
                return;
            }
        } else if (action === 'confirmRaise') {
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
    
    createDeck() {
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

// Enhanced Texas Hold'em Poker Game - Professional Practice Mode
const enhancedPokerGame = {
    // Configuration constants for the poker game
    CONFIG: {
        MIN_BET: 10,
        MAX_PLAYERS: 6,
        HAND_SIZE: 2,
        BOARD_SIZE: 5,
        STARTING_CHIPS: 1000
    },
    
    // Game state management object
    gameState: {
        players: [],
        dealer: null,
        communityCards: [],
        pot: 0,
        currentBet: 0,
        currentPlayerIndex: 0,
        gamePhase: 'pre-flop', // pre-flop, flop, turn, river, showdown
        gameOver: false,
        deck: null
    },
    
    // Player class for better structure
    Player: class {
        constructor(name, chips = 1000) {
            this.name = name;
            this.chips = chips;
            this.hand = [];
            this.currentBet = 0;
            this.folded = false;
            this.allIn = false;
        }
        
        addCard(card) {
            this.hand.push(card);
        }
        
        clearHand() {
            this.hand = [];
        }
        
        getHandValue() {
            if (!this.hand || this.hand.length < 2) return 0;
            const values = this.hand.map(card => card.value);
            return values.reduce((sum, v) => sum + (parseInt(v) || 10), 0);
        }
    },
    
    // Card class for better structure
    Card: class {
        constructor(value, suit) {
            this.value = value;
            this.suit = suit;
        }
        
        toString() {
            const suitSymbols = { 'spades': '♠', 'hearts': '♥', 'diamonds': '♦', 'clubs': '♣' };
            return `${this.value}${suitSymbols[this.suit] || this.suit}`;
        }
        
        toHTML() {
            const color = (this.suit === 'hearts' || this.suit === 'diamonds') ? '#e74c3c' : '#2c3e50';
            return `<div style="
                background: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                color: ${color};
                font-size: 2em;
                font-weight: bold;
                min-width: 70px;
                text-align: center;
            ">${this.toString()}</div>`;
        }
    },
    
    // Deck class for card management
    Deck: class {
        constructor() {
            this.cards = [];
            this.createDeck();
            this.shuffle();
        }
        
        createDeck() {
            const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
            const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
            
            for (let suit of suits) {
                for (let value of values) {
                    this.cards.push(new enhancedPokerGame.Card(value, suit));
                }
            }
        }
        
        shuffle() {
            for (let i = this.cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
            }
        }
        
        dealCard() {
            return this.cards.pop();
        }
    },
    
    // Initialize the poker game
    init() {
        console.log('Initializing enhanced Texas Hold\'em Poker game...');
        this.gameState = {
            players: [],
            dealer: null,
            communityCards: [],
            pot: 0,
            currentBet: 0,
            currentPlayerIndex: 0,
            gamePhase: 'pre-flop',
            gameOver: false,
            deck: null
        };
    },
    
    // Setup the complete HTML structure for the poker game
    setupUI() {
        return `
            <div class="poker-game-container" style="
                max-width: 1200px; 
                margin: 0 auto; 
                padding: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            ">
                <!-- Game Header -->
                <div class="poker-header" style="
                    background: linear-gradient(135deg, #1a2a6c, #b21f1f);
                    border-radius: 15px;
                    padding: 20px;
                    margin-bottom: 30px;
                    text-align: center;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                ">
                    <h1 style="color: #FFD700; font-size: 2.5em; margin-bottom: 10px;">
                        🃏 Texas Hold'em - Practice Mode
                    </h1>
                    <p style="color: #fff; font-size: 1.2em;">Professional Online Poker</p>
                </div>
                
                <!-- Game Status Panel -->
                <div class="game-status" style="
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: 10px;
                    padding: 15px;
                    margin-bottom: 25px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid #4A90A4;
                    flex-wrap: wrap;
                    gap: 15px;
                ">
                    <div class="game-info" style="color: #FFD700; font-size: 1.3em;">
                        <span>Phase: <span id="gamePhase">Pre-Flop</span></span>
                        <span style="margin-left: 20px;">Pot: <span id="potAmount">0</span> chips</span>
                    </div>
                    <div class="current-player" style="color: #2ecc71; font-size: 1.2em;">
                        Current: <span id="currentPlayerName">-</span>
                    </div>
                </div>
                
                <!-- Community Cards -->
                <div class="community-cards" style="
                    background: rgba(30, 50, 30, 0.8);
                    border-radius: 15px;
                    padding: 25px;
                    margin-bottom: 30px;
                    text-align: center;
                    box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
                ">
                    <h3 style="color: #FFD700; margin-bottom: 15px;">Community Cards</h3>
                    <div id="communityCards" style="
                        font-size: 2.5em;
                        display: flex;
                        justify-content: center;
                        gap: 10px;
                        min-height: 100px;
                        align-items: center;
                        flex-wrap: wrap;
                    ">
                        🂠 🂠 🂠 🂠 🂠
                    </div>
                </div>
                
                <!-- Players Area -->
                <div class="players-area" id="playersArea" style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                "></div>
                
                <!-- Action Buttons -->
                <div class="action-buttons" style="
                    text-align: center;
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.6);
                    border-radius: 15px;
                    border: 1px solid #FFD700;
                ">
                    <button id="dealButton" onclick="enhancedPokerGame.dealHands()" 
                        style="
                            padding: 15px 30px;
                            font-size: 1.2em;
                            background: linear-gradient(135deg, #FFB800, #FF8C00);
                            border: none;
                            border-radius: 25px;
                            color: #1a2332;
                            font-weight: bold;
                            cursor: pointer;
                            margin: 10px;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 15px rgba(255,184,0,0.4);
                        "
                        onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(255,184,0,0.6)'"
                        onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(255,184,0,0.4)'">
                        🃏 Deal New Hand
                    </button>
                    
                    <div id="playerActions" style="margin-top: 20px; display: none;">
                        <button onclick="enhancedPokerGame.playerAction('fold')" 
                            style="
                                padding: 12px 25px;
                                font-size: 1.1em;
                                background: linear-gradient(135deg, #e74c3c, #c0392b);
                                border: none;
                                border-radius: 8px;
                                color: white;
                                cursor: pointer;
                                margin: 5px;
                                transition: all 0.2s ease;
                            "
                            onmouseover="this.style.transform='scale(1.05)'"
                            onmouseout="this.style.transform='scale(1)'">
                            🚫 Fold
                        </button>
                        <button onclick="enhancedPokerGame.playerAction('check')" 
                            style="
                                padding: 12px 25px;
                                font-size: 1.1em;
                                background: linear-gradient(135deg, #3498db, #2980b9);
                                border: none;
                                border-radius: 8px;
                                color: white;
                                cursor: pointer;
                                margin: 5px;
                                transition: all 0.2s ease;
                            "
                            onmouseover="this.style.transform='scale(1.05)'"
                            onmouseout="this.style.transform='scale(1)'">
                            🔍 Check
                        </button>
                        <button onclick="enhancedPokerGame.playerAction('call')" 
                            style="
                                padding: 12px 25px;
                                font-size: 1.1em;
                                background: linear-gradient(135deg, #f1c40f, #f39c12);
                                border: none;
                                border-radius: 8px;
                                color: #1a2332;
                                cursor: pointer;
                                margin: 5px;
                                font-weight: bold;
                                transition: all 0.2s ease;
                            "
                            onmouseover="this.style.transform='scale(1.05)'"
                            onmouseout="this.style.transform='scale(1)'">
                            💰 Call
                        </button>
                        <button onclick="enhancedPokerGame.playerAction('raise')" 
                            style="
                                padding: 12px 25px;
                                font-size: 1.1em;
                                background: linear-gradient(135deg, #9b59b6, #8e44ad);
                                border: none;
                                border-radius: 8px;
                                color: white;
                                cursor: pointer;
                                margin: 5px;
                                font-weight: bold;
                                transition: all 0.2s ease;
                            "
                            onmouseover="this.style.transform='scale(1.05)'"
                            onmouseout="this.style.transform='scale(1)'">
                            📈 Raise
                        </button>
                    </div>
                </div>
                
                <button onclick="texasholdemGame.showGameModeSelector()" style="
                    margin-top: 20px;
                    padding: 12px 30px;
                    background: rgba(231, 76, 60, 0.8);
                    border: none;
                    border-radius: 25px;
                    color: #fff;
                    font-size: 1.1em;
                    cursor: pointer;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                ">← Back to Mode Selection</button>
            </div>
        `;
    },
    
    // Setup event listeners
    setupEventListeners() {
        console.log('Enhanced poker event listeners initialized');
    },
    
    // Deal initial hands to players
    dealHands() {
        console.log('Dealing hands...');
        
        if (typeof soundManager !== 'undefined') soundManager.playCardDeal();
        
        this.gameState.deck = new this.Deck();
        this.gameState.communityCards = [];
        this.gameState.pot = 0;
        this.gameState.currentBet = 10;
        this.gameState.gamePhase = 'pre-flop';
        this.gameState.currentPlayerIndex = 0;
        
        this.gameState.players = [
            new this.Player('You', balance),
            new this.Player('AI Player 1', 1000),
            new this.Player('AI Player 2', 1000)
        ];
        
        // Deal two cards to each player
        for (let i = 0; i < this.CONFIG.HAND_SIZE; i++) {
            for (let player of this.gameState.players) {
                if (this.gameState.deck.cards.length > 0) {
                    player.addCard(this.gameState.deck.dealCard());
                }
            }
        }
        
        // Post blinds
        if (this.gameState.players[1].chips >= 5) {
            this.gameState.players[1].chips -= 5;
            this.gameState.players[1].currentBet = 5;
            this.gameState.pot += 5;
        }
        if (this.gameState.players[2].chips >= 10) {
            this.gameState.players[2].chips -= 10;
            this.gameState.players[2].currentBet = 10;
            this.gameState.pot += 10;
        }
        
        this.updateDisplay();
        this.showActionButtons();
    },
    
    // Update all displays
    updateDisplay() {
        document.getElementById('gamePhase').textContent = this.gameState.gamePhase.charAt(0).toUpperCase() + this.gameState.gamePhase.slice(1);
        document.getElementById('potAmount').textContent = this.gameState.pot;
        this.updatePlayerDisplay();
        this.updateCommunityDisplay();
        this.updateCurrentPlayerDisplay();
    },
    
    // Update player information in UI
    updatePlayerDisplay() {
        const playersArea = document.getElementById('playersArea');
        if (!playersArea) return;
        
        let html = '';
        
        for (let i = 0; i < this.gameState.players.length; i++) {
            const player = this.gameState.players[i];
            const isCurrentPlayer = i === this.gameState.currentPlayerIndex;
            
            html += `
                <div style="
                    background: ${isCurrentPlayer ? 'rgba(46, 204, 113, 0.3)' : 'rgba(50, 50, 70, 0.8)'};
                    border-radius: 15px;
                    padding: 20px;
                    text-align: center;
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.3);
                    border: 2px solid ${isCurrentPlayer ? '#2ecc71' : '#4A90A4'};
                    transition: all 0.3s ease;
                ">
                    <h4 style="color: #FFD700; margin-bottom: 10px; font-size: 1.3em;">${player.name}</h4>
                    <p style="color: #2ecc71; font-size: 1.2em; font-weight: bold;">💰 ${player.chips} chips</p>
                    <p style="color: #f39c12; font-size: 1em; margin-top: 5px;">Bet: ${player.currentBet}</p>
                    ${!player.folded && player.hand.length > 0 ? 
                        `<div style="display: flex; gap: 10px; justify-content: center; margin-top: 15px; flex-wrap: wrap;">
                            ${i === 0 ? 
                                player.hand.map(card => card.toHTML()).join('') : 
                                '🂠 🂠'
                            }
                        </div>` : 
                        player.folded ? '<p style="color: #e74c3c; font-weight: bold; margin-top: 10px;">FOLDED</p>' : ''
                    }
                </div>
            `;
        }
        
        playersArea.innerHTML = html;
    },
    
    // Update community cards display
    updateCommunityDisplay() {
        const communityCardsElement = document.getElementById('communityCards');
        if (!communityCardsElement) return;
        
        let html = '';
        
        for (let card of this.gameState.communityCards) {
            html += card.toHTML();
        }
        
        // Fill remaining slots with blank cards
        const neededSlots = this.CONFIG.BOARD_SIZE - this.gameState.communityCards.length;
        for (let i = 0; i < neededSlots; i++) {
            html += `<div style="font-size: 3em; opacity: 0.5;">🂠</div>`;
        }
        
        communityCardsElement.innerHTML = html;
    },
    
    // Show action buttons
    showActionButtons() {
        document.getElementById('dealButton').style.display = 'none';
        document.getElementById('playerActions').style.display = 'block';
        this.updateCurrentPlayerDisplay();
    },
    
    // Hide action buttons
    hideActionButtons() {
        document.getElementById('playerActions').style.display = 'none';
        document.getElementById('dealButton').style.display = 'inline-block';
    },
    
    // Update current player display
    updateCurrentPlayerDisplay() {
        if (this.gameState.players.length > 0) {
            const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
            document.getElementById('currentPlayerName').textContent = currentPlayer.name;
        }
    },
    
    // Handle player actions
    playerAction(action) {
        if (this.gameState.currentPlayerIndex !== 0) return;
        
        console.log(`Player action: ${action}`);
        if (typeof soundManager !== 'undefined') soundManager.playButtonClick();
        
        switch (action.toLowerCase()) {
            case 'fold':
                this.fold();
                break;
            case 'check':
                this.check();
                break;
            case 'call':
                this.call();
                break;
            case 'raise':
                this.raise();
                break;
        }
    },
    
    // Fold action
    fold() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        currentPlayer.folded = true;
        this.nextPlayer();
        this.updateDisplay();
    },
    
    // Check action
    check() {
        this.nextPlayer();
        this.updateDisplay();
    },
    
    // Call action
    call() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        const callAmount = this.gameState.currentBet - currentPlayer.currentBet;
        
        if (currentPlayer.chips >= callAmount) {
            currentPlayer.chips -= callAmount;
            currentPlayer.currentBet += callAmount;
            this.gameState.pot += callAmount;
            
            // Update global balance if it's the player
            if (this.gameState.currentPlayerIndex === 0) {
                updateBalance(-callAmount);
            }
        }
        
        this.nextPlayer();
        this.updateDisplay();
    },
    
    // Raise action
    raise() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        const raiseAmount = Math.min(currentPlayer.chips, 50);
        
        if (currentPlayer.chips >= raiseAmount) {
            currentPlayer.chips -= raiseAmount;
            currentPlayer.currentBet += raiseAmount;
            this.gameState.pot += raiseAmount;
            this.gameState.currentBet = Math.max(this.gameState.currentBet, currentPlayer.currentBet);
            
            // Update global balance if it's the player
            if (this.gameState.currentPlayerIndex === 0) {
                updateBalance(-raiseAmount);
            }
        }
        
        this.nextPlayer();
        this.updateDisplay();
    },
    
    // Move to next player
    nextPlayer() {
        let moved = false;
        let attempts = 0;
        
        while (!moved && attempts < 10) {
            this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
            
            if (!this.gameState.players[this.gameState.currentPlayerIndex].folded && 
                !this.gameState.players[this.gameState.currentPlayerIndex].allIn) {
                moved = true;
            }
            attempts++;
        }
        
        // Check if we should advance to next phase
        if (this.allPlayersActed()) {
            setTimeout(() => this.advancePhase(), 1000);
        } else if (this.gameState.currentPlayerIndex !== 0) {
            // AI player turn
            setTimeout(() => this.aiAction(), 800);
        }
    },
    
    // AI player action
    aiAction() {
        const currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
        const random = Math.random();
        
        if (random < 0.3) {
            this.fold();
        } else if (random < 0.6) {
            this.check();
        } else if (random < 0.9) {
            this.call();
        } else {
            this.raise();
        }
    },
    
    // Check if all active players have acted
    allPlayersActed() {
        const activePlayers = this.gameState.players.filter(p => !p.folded && !p.allIn);
        if (activePlayers.length <= 1) return true;
        
        return activePlayers.every(player => 
            player.currentBet >= this.gameState.currentBet || player.allIn
        );
    },
    
    // Advance to next game phase
    advancePhase() {
        const phases = ['pre-flop', 'flop', 'turn', 'river', 'showdown'];
        const currentIndex = phases.indexOf(this.gameState.gamePhase);
        
        if (currentIndex < phases.length - 1) {
            this.gameState.gamePhase = phases[currentIndex + 1];
            
            // Reset bets for new round
            this.gameState.players.forEach(p => p.currentBet = 0);
            this.gameState.currentBet = 0;
            this.gameState.currentPlayerIndex = 0;
            
            // Deal community cards
            if (this.gameState.gamePhase === 'flop') {
                this.dealCommunityCards(3);
            } else if (this.gameState.gamePhase === 'turn' || this.gameState.gamePhase === 'river') {
                this.dealCommunityCards(1);
            } else if (this.gameState.gamePhase === 'showdown') {
                this.showResults();
                return;
            }
            
            this.updateDisplay();
            
            if (this.gameState.currentPlayerIndex !== 0) {
                setTimeout(() => this.aiAction(), 800);
            }
        }
    },
    
    // Deal community cards
    dealCommunityCards(count) {
        if (typeof soundManager !== 'undefined') soundManager.playCardDeal();
        
        for (let i = 0; i < count; i++) {
            if (this.gameState.deck.cards.length > 0) {
                this.gameState.communityCards.push(this.gameState.deck.dealCard());
            }
        }
    },
    
    // Show results
    showResults() {
        console.log('Showing game results');
        
        const activePlayers = this.gameState.players.filter(p => !p.folded);
        
        if (activePlayers.length === 1) {
            const winner = activePlayers[0];
            this.awardPot(winner);
        } else if (activePlayers.length > 1) {
            // Simple hand comparison
            let winner = activePlayers[0];
            for (let player of activePlayers.slice(1)) {
                if (player.getHandValue() > winner.getHandValue()) {
                    winner = player;
                }
            }
            this.awardPot(winner);
        }
        
        this.hideActionButtons();
    },
    
    // Award pot to winner
    awardPot(winner) {
        winner.chips += this.gameState.pot;
        
        if (winner.name === 'You') {
            updateBalance(this.gameState.pot);
            if (typeof soundManager !== 'undefined') soundManager.playWin();
            if (typeof particleSystem !== 'undefined') {
                particleSystem.createCoinBurst(window.innerWidth / 2, window.innerHeight / 2, this.gameState.pot);
            }
        }
        
        const resultMsg = document.createElement('div');
        resultMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #2ecc71, #27ae60);
            padding: 40px 60px;
            border-radius: 20px;
            color: white;
            font-size: 2em;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            z-index: 10000;
            border: 3px solid #FFD700;
        `;
        resultMsg.innerHTML = `
            🏆 ${winner.name} WINS! 🏆<br>
            <span style="font-size: 1.5em; color: #FFD700;">+${this.gameState.pot} chips</span>
        `;
        document.body.appendChild(resultMsg);
        
        setTimeout(() => resultMsg.remove(), 3000);
        
        this.updateDisplay();
    }
};

window.texasholdemGame = texasholdemGame;
