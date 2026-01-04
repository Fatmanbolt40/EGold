// Live Games and Spectator System
class LiveGamesManager {
    constructor() {
        this.activeGames = [];
        this.gameIdCounter = 1;
    }

    // Create a new live game
    createGame(gameType, playerName, buyIn, tableInfo = {}) {
        const game = {
            id: this.gameIdCounter++,
            gameType: gameType,
            playerName: playerName,
            buyIn: buyIn,
            pot: 0,
            spectators: [],
            sideBets: [],
            status: 'active',
            startTime: Date.now(),
            tableInfo: tableInfo,
            currentAction: '',
            handNumber: 1
        };
        
        this.activeGames.push(game);
        this.updateLiveGamesFeed();
        return game;
    }

    // End a game
    endGame(gameId) {
        const index = this.activeGames.findIndex(g => g.id === gameId);
        if (index >= 0) {
            const game = this.activeGames[index];
            
            // Resolve all side bets for this game
            game.sideBets.forEach(bet => {
                if (bet.status === 'pending') {
                    bet.status = 'cancelled';
                    updateBalance(bet.amount); // Refund
                }
            });
            
            this.activeGames.splice(index, 1);
            this.updateLiveGamesFeed();
        }
    }

    // Update game state
    updateGame(gameId, updates) {
        const game = this.activeGames.find(g => g.id === gameId);
        if (game) {
            Object.assign(game, updates);
            this.updateLiveGamesFeed();
            this.notifySpectators(gameId, updates);
        }
    }

    // Add spectator to game
    addSpectator(gameId, spectatorName = 'Spectator') {
        const game = this.activeGames.find(g => g.id === gameId);
        if (game) {
            if (!game.spectators.includes(spectatorName)) {
                game.spectators.push(spectatorName);
                this.updateLiveGamesFeed();
                
                effects.floatingText(
                    window.innerWidth / 2,
                    100,
                    `${spectatorName} is spectating`,
                    '#3498db',
                    '1rem'
                );
            }
        }
    }

    // Remove spectator
    removeSpectator(gameId, spectatorName) {
        const game = this.activeGames.find(g => g.id === gameId);
        if (game) {
            game.spectators = game.spectators.filter(s => s !== spectatorName);
            this.updateLiveGamesFeed();
        }
    }

    // Notify spectators of game updates
    notifySpectators(gameId, updates) {
        const game = this.activeGames.find(g => g.id === gameId);
        if (game && game.spectators.length > 0) {
            // Update spectator view if they're watching this game
            if (window.currentSpectatingGame === gameId) {
                this.updateSpectatorView(game);
            }
        }
    }

    // Update spectator view
    updateSpectatorView(game) {
        const spectatorContent = document.getElementById('spectatorContent');
        if (spectatorContent && window.currentSpectatingGame === game.id) {
            const actionDiv = spectatorContent.querySelector('.game-action');
            if (actionDiv) {
                actionDiv.textContent = game.currentAction || 'Waiting for action...';
            }
            
            const potDiv = spectatorContent.querySelector('.spectator-pot');
            if (potDiv) {
                potDiv.textContent = `${game.pot} eGold`;
            }
        }
    }

    // Get all active games
    getActiveGames() {
        return this.activeGames;
    }

    // Update live games feed UI
    updateLiveGamesFeed() {
        const feedElement = document.getElementById('liveGamesFeed');
        if (!feedElement) return;
        
        // Update live games button badge
        const liveGamesBtn = document.getElementById('liveGamesBtn');
        if (liveGamesBtn) {
            const count = this.activeGames.length;
            const existingBadge = liveGamesBtn.querySelector('.live-badge');
            if (count > 0) {
                if (!existingBadge) {
                    const badge = document.createElement('span');
                    badge.className = 'live-badge';
                    badge.textContent = count;
                    badge.style.cssText = `
                        position: absolute;
                        top: -5px;
                        right: -5px;
                        background: #e74c3c;
                        color: white;
                        border-radius: 50%;
                        width: 24px;
                        height: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 0.8rem;
                        font-weight: bold;
                        animation: pulse 2s ease-in-out infinite;
                    `;
                    liveGamesBtn.style.position = 'relative';
                    liveGamesBtn.appendChild(badge);
                } else {
                    existingBadge.textContent = count;
                }
            } else if (existingBadge) {
                existingBadge.remove();
            }
        }

        if (this.activeGames.length === 0) {
            feedElement.innerHTML = '<div style="text-align: center; color: #a0a0b0; padding: 20px;">No live games at the moment</div>';
            return;
        }

        feedElement.innerHTML = this.activeGames.map(game => {
            const duration = Math.floor((Date.now() - game.startTime) / 60000);
            const gameIcons = {
                'texasholdem': '🃏',
                'omaha': '🂡',
                'pineapple': '🍍',
                'tonk': '🎴',
                'chess': '♔',
                'checkers': '⚫',
                'coinflip': '🪙',
                'scratchoff': '🎫',
                'lottery': '🎱',
                'diceraffle': '🎲'
            };

            return `
                <div class="live-game-card" style="
                    background: linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(45, 45, 68, 0.8));
                    border: 2px solid #d4af37;
                    border-radius: 12px;
                    padding: 15px;
                    margin-bottom: 15px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onclick="spectatorSystem.joinAsSpectator(${game.id})">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-size: 1.5rem; margin-bottom: 5px;">
                                ${gameIcons[game.gameType] || '🎮'} ${game.gameType.toUpperCase()}
                            </div>
                            <div style="color: #a0a0b0; font-size: 0.9rem;">
                                Player: <span style="color: #2ecc71;">${game.playerName}</span>
                            </div>
                            <div style="color: #a0a0b0; font-size: 0.9rem;">
                                Buy-in: <span style="color: #ffd700;">${game.buyIn} eGold</span>
                            </div>
                            <div style="color: #a0a0b0; font-size: 0.9rem;">
                                Duration: ${duration}m
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1.2rem; color: #ffd700; margin-bottom: 5px;">
                                💰 ${game.pot} eGold
                            </div>
                            <div style="color: #3498db; font-size: 0.9rem;">
                                👁️ ${game.spectators.length} watching
                            </div>
                            <div style="color: #9b59b6; font-size: 0.9rem;">
                                💵 ${game.sideBets.filter(b => b.status === 'pending').length} side bets
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Side Bet System
class SideBetSystem {
    constructor() {
        this.betTypes = {
            'poker': [
                { id: 'player_wins', name: 'Player Wins Hand', odds: 2.0 },
                { id: 'ai_wins', name: 'AI Wins Hand', odds: 2.0 },
                { id: 'high_card', name: 'Winner has Pair or Better', odds: 1.5 },
                { id: 'flush_or_better', name: 'Flush or Better Wins', odds: 4.0 },
                { id: 'full_house', name: 'Full House or Better', odds: 8.0 }
            ],
            'coinflip': [
                { id: 'heads', name: 'Heads', odds: 1.95 },
                { id: 'tails', name: 'Tails', odds: 1.95 }
            ],
            'dice': [
                { id: 'high_roll', name: 'Roll 13-16', odds: 3.0 },
                { id: 'low_roll', name: 'Roll 1-4', odds: 3.0 },
                { id: 'exact_number', name: 'Exact Number', odds: 15.0 }
            ],
            'chess': [
                { id: 'player_wins', name: 'Player Wins', odds: 2.0 },
                { id: 'ai_wins', name: 'AI Wins', odds: 2.0 },
                { id: 'under_20_moves', name: 'Game Ends Under 20 Moves', odds: 5.0 }
            ],
            'default': [
                { id: 'player_wins', name: 'Player Wins', odds: 2.0 },
                { id: 'house_wins', name: 'House Wins', odds: 2.0 }
            ]
        };
    }

    // Place a side bet
    placeSideBet(gameId, betType, amount, metadata = {}) {
        if (currentBalance < amount) {
            alert('Insufficient balance for side bet');
            return null;
        }

        const game = liveGamesManager.activeGames.find(g => g.id === gameId);
        if (!game) {
            alert('Game not found');
            return null;
        }

        updateBalance(-amount);
        sound.chips(amount);

        const bet = {
            id: Date.now() + Math.random(),
            gameId: gameId,
            betType: betType.id,
            betName: betType.name,
            amount: amount,
            odds: betType.odds,
            potentialWin: amount * betType.odds,
            status: 'pending',
            metadata: metadata,
            timestamp: Date.now()
        };

        game.sideBets.push(bet);
        liveGamesManager.updateLiveGamesFeed();

        effects.floatingText(
            window.innerWidth / 2,
            window.innerHeight / 2,
            `Side Bet Placed: ${betType.name}`,
            '#9b59b6',
            '1.2rem'
        );

        return bet;
    }

    // Resolve side bet
    resolveSideBet(gameId, results) {
        const game = liveGamesManager.activeGames.find(g => g.id === gameId);
        if (!game) return;

        game.sideBets.forEach(bet => {
            if (bet.status !== 'pending') return;

            let won = false;

            // Check if bet won based on results
            if (results.betType === bet.betType) {
                won = results.won;
            } else if (bet.betType === 'player_wins' && results.winner === 'player') {
                won = true;
            } else if (bet.betType === 'ai_wins' && results.winner === 'ai') {
                won = true;
            } else if (bet.betType === 'high_card' && results.winningHand >= 1) {
                won = true;
            } else if (bet.betType === 'flush_or_better' && results.winningHand >= 5) {
                won = true;
            } else if (bet.betType === 'full_house' && results.winningHand >= 6) {
                won = true;
            }

            if (won) {
                bet.status = 'won';
                const winAmount = bet.potentialWin;
                updateBalance(winAmount);
                
                effects.createBurst(window.innerWidth / 2, window.innerHeight / 2, '#9b59b6', 30);
                effects.floatingText(
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    `Side Bet Won! +${winAmount.toFixed(2)} eGold`,
                    '#2ecc71',
                    '1.5rem'
                );
                sound.winSound(winAmount);
            } else {
                bet.status = 'lost';
            }
        });
    }

    // Get available bet types for game
    getBetTypes(gameType) {
        if (gameType.includes('poker') || gameType === 'texasholdem' || gameType === 'omaha' || gameType === 'pineapple') {
            return this.betTypes['poker'];
        } else if (gameType === 'coinflip') {
            return this.betTypes['coinflip'];
        } else if (gameType === 'diceraffle') {
            return this.betTypes['dice'];
        } else if (gameType === 'chess' || gameType === 'checkers') {
            return this.betTypes['chess'];
        } else {
            return this.betTypes['default'];
        }
    }
}

// Spectator Manager
class SpectatorSystem {
    constructor() {
        this.currentGame = null;
        this.isSpectating = false;
    }

    // Join as spectator
    joinAsSpectator(gameId) {
        const game = liveGamesManager.activeGames.find(g => g.id === gameId);
        if (!game) {
            alert('Game not found');
            return;
        }

        this.currentGame = game;
        this.isSpectating = true;
        window.currentSpectatingGame = gameId;

        liveGamesManager.addSpectator(gameId, 'You');

        this.showSpectatorView(game);
    }

    // Leave spectating
    leaveSpectating() {
        if (this.currentGame) {
            liveGamesManager.removeSpectator(this.currentGame.id, 'You');
        }
        
        this.currentGame = null;
        this.isSpectating = false;
        window.currentSpectatingGame = null;

        // Return to live games feed
        this.showLiveGamesFeed();
    }

    // Show spectator view
    showSpectatorView(game) {
        document.getElementById('gameSelection').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        
        const gameTitle = document.getElementById('currentGameTitle');
        const gameContent = document.getElementById('gameContent');
        
        gameTitle.textContent = `👁️ Spectating: ${game.gameType.toUpperCase()}`;

        const betTypes = sideBetSystem.getBetTypes(game.gameType);

        gameContent.innerHTML = `
            <div id="spectatorContent" style="max-width: 1200px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(45, 45, 68, 0.9)); padding: 30px; border-radius: 15px; border: 2px solid #3498db;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                        <div>
                            <h2 style="color: #3498db; margin: 0;">👁️ Spectator Mode</h2>
                            <p style="color: #a0a0b0; margin: 5px 0 0 0;">Watching: <span style="color: #2ecc71;">${game.playerName}</span></p>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 2rem; color: #ffd700; margin-bottom: 10px;">
                                Pot: <span class="spectator-pot">${game.pot}</span> eGold
                            </div>
                            <div style="color: #3498db;">👁️ ${game.spectators.length} spectators</div>
                        </div>
                    </div>

                    <div class="game-action" style="
                        background: rgba(52, 152, 219, 0.2);
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                        font-size: 1.3rem;
                        color: #3498db;
                        margin-bottom: 30px;
                        border: 2px solid #3498db;
                    ">
                        ${game.currentAction || 'Waiting for action...'}
                    </div>

                    <div style="background: rgba(155, 89, 182, 0.2); padding: 25px; border-radius: 12px; border: 2px solid #9b59b6;">
                        <h3 style="color: #9b59b6; margin-top: 0;">💵 Place Side Bets</h3>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin-bottom: 20px;">
                            ${betTypes.map(betType => `
                                <div class="side-bet-option" style="
                                    background: rgba(155, 89, 182, 0.3);
                                    padding: 15px;
                                    border-radius: 8px;
                                    border: 2px solid transparent;
                                    cursor: pointer;
                                    transition: all 0.3s ease;
                                " onclick="this.classList.toggle('selected'); this.style.borderColor = this.classList.contains('selected') ? '#9b59b6' : 'transparent';" data-bet-id="${betType.id}">
                                    <div style="font-weight: bold; color: #9b59b6; margin-bottom: 5px;">${betType.name}</div>
                                    <div style="color: #ffd700; font-size: 1.2rem;">Odds: ${betType.odds}x</div>
                                    <div style="color: #a0a0b0; font-size: 0.9rem; margin-top: 5px;">Click to select</div>
                                </div>
                            `).join('')}
                        </div>

                        <div style="display: flex; gap: 15px; align-items: center;">
                            <input type="number" id="sideBetAmount" placeholder="Bet amount" min="1" step="1" style="
                                flex: 1;
                                padding: 15px;
                                background: rgba(0, 0, 0, 0.3);
                                border: 2px solid #9b59b6;
                                border-radius: 8px;
                                color: white;
                                font-size: 1.1rem;
                            ">
                            <button onclick="spectatorSystem.placeSideBet(${game.id})" style="
                                padding: 15px 40px;
                                background: linear-gradient(135deg, #9b59b6, #8e44ad);
                                border: none;
                                border-radius: 8px;
                                color: white;
                                font-size: 1.1rem;
                                font-weight: bold;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                                Place Side Bet 💵
                            </button>
                        </div>

                        <div id="activeSideBets" style="margin-top: 20px;">
                            ${this.renderSideBets(game.sideBets.filter(b => b.status === 'pending'))}
                        </div>
                    </div>

                    <div style="margin-top: 30px; text-align: center;">
                        <button onclick="spectatorSystem.leaveSpectating()" style="
                            padding: 15px 40px;
                            background: linear-gradient(135deg, #e74c3c, #c0392b);
                            border: none;
                            border-radius: 8px;
                            color: white;
                            font-size: 1.1rem;
                            cursor: pointer;
                        ">← Leave Spectator Mode</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Render side bets
    renderSideBets(bets) {
        if (bets.length === 0) {
            return '<div style="text-align: center; color: #a0a0b0; padding: 20px;">No active side bets</div>';
        }

        return `
            <h4 style="color: #9b59b6; margin-bottom: 15px;">Active Side Bets:</h4>
            ${bets.map(bet => `
                <div style="background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 6px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="color: #9b59b6; font-weight: bold;">${bet.betName}</span>
                        <span style="color: #a0a0b0; margin-left: 10px;">Bet: ${bet.amount} eGold</span>
                    </div>
                    <div style="color: #2ecc71; font-weight: bold;">
                        Win: ${bet.potentialWin.toFixed(2)} eGold
                    </div>
                </div>
            `).join('')}
        `;
    }

    // Place side bet from spectator view
    placeSideBet(gameId) {
        const selectedBet = document.querySelector('.side-bet-option.selected');
        if (!selectedBet) {
            alert('Please select a bet type');
            return;
        }

        const amount = parseFloat(document.getElementById('sideBetAmount').value);
        if (!amount || amount <= 0) {
            alert('Please enter a valid bet amount');
            return;
        }

        const betId = selectedBet.getAttribute('data-bet-id');
        const betTypes = sideBetSystem.getBetTypes(this.currentGame.gameType);
        const betType = betTypes.find(b => b.id === betId);

        if (betType) {
            sideBetSystem.placeSideBet(gameId, betType, amount);
            
            // Refresh side bets display
            const game = liveGamesManager.activeGames.find(g => g.id === gameId);
            if (game) {
                document.getElementById('activeSideBets').innerHTML = this.renderSideBets(
                    game.sideBets.filter(b => b.status === 'pending')
                );
            }

            // Clear selection
            selectedBet.classList.remove('selected');
            selectedBet.style.borderColor = 'transparent';
            document.getElementById('sideBetAmount').value = '';
        }
    }

    // Show live games feed
    showLiveGamesFeed() {
        document.getElementById('gameSelection').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        
        const gameTitle = document.getElementById('currentGameTitle');
        const gameContent = document.getElementById('gameContent');
        
        gameTitle.textContent = '📺 Live Games';
        
        gameContent.innerHTML = `
            <div style="max-width: 900px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #d4af37;">📺 Watch Live Games & Place Side Bets</h2>
                    <p style="color: #a0a0b0;">Join as a spectator and bet on ongoing games</p>
                </div>
                <div id="liveGamesFeed"></div>
            </div>
        `;
        
        liveGamesManager.updateLiveGamesFeed();
    }
}

// Global instances
const liveGamesManager = new LiveGamesManager();
const sideBetSystem = new SideBetSystem();
const spectatorSystem = new SpectatorSystem();

// Expose to window for onclick handlers
window.liveGamesManager = liveGamesManager;
window.sideBetSystem = sideBetSystem;
window.spectatorSystem = spectatorSystem;

// Add CSS for spectator system
const spectatorStyle = document.createElement('style');
spectatorStyle.textContent = `
    .live-game-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
        border-color: #ffd700;
    }

    .side-bet-option:hover {
        background: rgba(155, 89, 182, 0.5) !important;
        transform: scale(1.02);
    }

    .side-bet-option.selected {
        background: rgba(155, 89, 182, 0.6) !important;
        box-shadow: 0 0 20px rgba(155, 89, 182, 0.6);
    }
`;
document.head.appendChild(spectatorStyle);
