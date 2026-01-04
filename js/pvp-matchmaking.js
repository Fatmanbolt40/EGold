// PVP Matchmaking and Room System
class PVPMatchmaking {
    constructor() {
        this.rooms = [];
        this.roomIdCounter = 1;
        this.playerQueue = {};
    }

    // Create a new PVP room
    createRoom(gameType, creatorName, buyIn, settings = {}) {
        const room = {
            id: this.roomIdCounter++,
            gameType: gameType,
            creator: creatorName,
            players: [{ name: creatorName, ready: false, balance: buyIn }],
            maxPlayers: this.getMaxPlayers(gameType),
            buyIn: buyIn,
            status: 'waiting', // waiting, active, finished
            settings: settings,
            startTime: null,
            spectators: [],
            createdAt: Date.now()
        };

        this.rooms.push(room);
        this.updateRoomsList();
        
        // Create live game entry
        const liveGame = liveGamesManager.createGame(
            gameType,
            `${creatorName} (PVP)`,
            buyIn,
            { roomId: room.id, pvp: true }
        );
        room.liveGameId = liveGame.id;

        return room;
    }

    // Get max players for game type
    getMaxPlayers(gameType) {
        const maxPlayers = {
            'texasholdem': 6,
            'omaha': 6,
            'pineapple': 6,
            'tonk': 4,
            'chess': 2,
            'checkers': 2
        };
        return maxPlayers[gameType] || 2;
    }

    // Join existing room
    joinRoom(roomId, playerName, buyIn) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) {
            return { success: false, message: 'Room not found' };
        }

        if (room.status !== 'waiting') {
            return { success: false, message: 'Game already started' };
        }

        if (room.players.length >= room.maxPlayers) {
            return { success: false, message: 'Room is full' };
        }

        if (buyIn < room.buyIn) {
            return { success: false, message: `Minimum buy-in is ${room.buyIn} eGold` };
        }

        // Check if player already in room
        if (room.players.find(p => p.name === playerName)) {
            return { success: false, message: 'Already in this room' };
        }

        room.players.push({ name: playerName, ready: false, balance: buyIn });
        this.updateRoomsList();

        // Update live game
        if (room.liveGameId) {
            liveGamesManager.updateGame(room.liveGameId, {
                currentAction: `${playerName} joined (${room.players.length}/${room.maxPlayers})`,
                tableInfo: { players: room.players.length }
            });
        }

        return { success: true, room: room };
    }

    // Leave room
    leaveRoom(roomId, playerName) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) return;

        room.players = room.players.filter(p => p.name !== playerName);

        if (room.players.length === 0 || playerName === room.creator) {
            // Room empty or creator left - close it
            this.closeRoom(roomId);
        } else {
            this.updateRoomsList();
        }
    }

    // Mark player as ready
    setPlayerReady(roomId, playerName, ready = true) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) return;

        const player = room.players.find(p => p.name === playerName);
        if (player) {
            player.ready = ready;
            this.updateRoomsList();

            // Check if all players ready
            if (room.players.length >= 2 && room.players.every(p => p.ready)) {
                this.startGame(roomId);
            }
        }
    }

    // Start the game
    startGame(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) return;

        room.status = 'active';
        room.startTime = Date.now();
        this.updateRoomsList();

        // Update live game
        if (room.liveGameId) {
            liveGamesManager.updateGame(room.liveGameId, {
                currentAction: 'Game starting...',
                status: 'active'
            });
        }

        // Initialize game based on type
        this.initializePVPGame(room);
    }

    // Initialize specific PVP game
    initializePVPGame(room) {
        const gameContent = document.getElementById('gameContent');
        if (!gameContent) return;

        switch(room.gameType) {
            case 'chess':
                this.initPVPChess(room, gameContent);
                break;
            case 'checkers':
                this.initPVPCheckers(room, gameContent);
                break;
            case 'texasholdem':
            case 'omaha':
            case 'pineapple':
                this.initPVPPoker(room, gameContent);
                break;
            case 'tonk':
                this.initPVPTonk(room, gameContent);
                break;
        }
    }

    // Close room
    closeRoom(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (room && room.liveGameId) {
            liveGamesManager.endGame(room.liveGameId);
        }
        
        this.rooms = this.rooms.filter(r => r.id !== roomId);
        this.updateRoomsList();
    }

    // Get all rooms for a game type
    getRooms(gameType = null) {
        if (gameType) {
            return this.rooms.filter(r => r.gameType === gameType);
        }
        return this.rooms;
    }

    // Update rooms list UI
    updateRoomsList() {
        const roomsList = document.getElementById('pvpRoomsList');
        if (!roomsList) return;

        const activeRooms = this.rooms.filter(r => r.status === 'waiting');

        if (activeRooms.length === 0) {
            roomsList.innerHTML = '<div style="text-align: center; color: #a0a0b0; padding: 40px;">No active rooms. Create one to start!</div>';
            return;
        }

        roomsList.innerHTML = activeRooms.map(room => `
            <div class="pvp-room-card" style="
                background: linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(41, 128, 185, 0.2));
                border: 2px solid #3498db;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 15px;
                transition: all 0.3s ease;
            " onmouseover="this.style.borderColor='#2ecc71'" onmouseout="this.style.borderColor='#3498db'">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="color: #3498db; margin: 0 0 10px 0;">${this.getGameIcon(room.gameType)} ${room.gameType.toUpperCase()}</h4>
                        <div style="color: #a0a0b0; margin: 5px 0;">
                            Host: <span style="color: #2ecc71;">${room.creator}</span>
                        </div>
                        <div style="color: #a0a0b0; margin: 5px 0;">
                            Buy-in: <span style="color: #ffd700;">${room.buyIn} eGold</span>
                        </div>
                        <div style="color: #a0a0b0; margin: 5px 0;">
                            Players: <span style="color: #3498db;">${room.players.length}/${room.maxPlayers}</span>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <button onclick="pvpMatchmaking.joinRoomPrompt(${room.id})" style="
                            padding: 12px 30px;
                            background: linear-gradient(135deg, #2ecc71, #27ae60);
                            border: none;
                            border-radius: 8px;
                            color: white;
                            font-size: 1rem;
                            font-weight: bold;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            Join Game
                        </button>
                        <div style="margin-top: 10px; color: #95a5a6; font-size: 0.9rem;">
                            ${Math.floor((Date.now() - room.createdAt) / 60000)}m ago
                        </div>
                    </div>
                </div>
                ${room.players.length > 1 ? `
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(52, 152, 219, 0.3);">
                        <div style="color: #a0a0b0; margin-bottom: 10px;">Players in lobby:</div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            ${room.players.map(p => `
                                <span style="
                                    background: ${p.ready ? 'rgba(46, 204, 113, 0.3)' : 'rgba(149, 165, 166, 0.3)'};
                                    padding: 5px 15px;
                                    border-radius: 15px;
                                    color: ${p.ready ? '#2ecc71' : '#95a5a6'};
                                    font-size: 0.9rem;
                                ">
                                    ${p.name} ${p.ready ? '✓' : '⏳'}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    // Get game icon
    getGameIcon(gameType) {
        const icons = {
            'texasholdem': '🃏',
            'omaha': '🂡',
            'pineapple': '🍍',
            'tonk': '🎴',
            'chess': '♔',
            'checkers': '⚫'
        };
        return icons[gameType] || '🎮';
    }

    // Prompt to join room
    joinRoomPrompt(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) return;

        const buyIn = prompt(`Enter buy-in amount (minimum ${room.buyIn} eGold):`, room.buyIn);
        if (!buyIn) return;

        const amount = parseFloat(buyIn);
        if (amount < room.buyIn || amount > currentBalance) {
            alert('Invalid buy-in amount');
            return;
        }

        // Deduct buy-in
        updateBalance(-amount);

        const result = this.joinRoom(roomId, leaderboard.playerName || 'Player', amount);
        if (!result.success) {
            alert(result.message);
            updateBalance(amount); // Refund
            return;
        }

        sound.chips(amount);
        effects.floatingText(window.innerWidth / 2, 100, 'Joined PVP Room!', '#2ecc71', '1.5rem');

        // Show room lobby
        this.showRoomLobby(roomId);
    }

    // Show room lobby
    showRoomLobby(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) return;

        const gameContent = document.getElementById('gameContent');
        const gameTitle = document.getElementById('currentGameTitle');

        gameTitle.textContent = `${this.getGameIcon(room.gameType)} PVP Lobby: ${room.gameType.toUpperCase()}`;

        const isCreator = room.creator === (leaderboard.playerName || 'Player');
        const currentPlayer = room.players.find(p => p.name === (leaderboard.playerName || 'Player'));

        gameContent.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(45, 45, 68, 0.9)); padding: 30px; border-radius: 15px; border: 2px solid #3498db;">
                    <h2 style="color: #3498db; text-align: center; margin-bottom: 30px;">⚔️ PVP Lobby</h2>
                    
                    <div style="background: rgba(52, 152, 219, 0.2); padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                        <h3 style="color: #3498db; margin-top: 0;">Game Info</h3>
                        <div style="color: #a0a0b0;">
                            <p>Game: <span style="color: white;">${room.gameType.toUpperCase()}</span></p>
                            <p>Host: <span style="color: #2ecc71;">${room.creator}</span></p>
                            <p>Buy-in: <span style="color: #ffd700;">${room.buyIn} eGold</span></p>
                            <p>Players: <span style="color: #3498db;">${room.players.length}/${room.maxPlayers}</span></p>
                        </div>
                    </div>

                    <div style="background: rgba(46, 204, 113, 0.2); padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                        <h3 style="color: #2ecc71; margin-top: 0;">Players</h3>
                        <div style="display: grid; gap: 10px;">
                            ${room.players.map(p => `
                                <div style="
                                    background: ${p.ready ? 'rgba(46, 204, 113, 0.3)' : 'rgba(149, 165, 166, 0.2)'};
                                    padding: 15px;
                                    border-radius: 8px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                ">
                                    <div>
                                        <span style="color: white; font-weight: bold;">${p.name}</span>
                                        ${p.name === room.creator ? '<span style="color: #ffd700; margin-left: 10px;">👑 Host</span>' : ''}
                                    </div>
                                    <div style="color: ${p.ready ? '#2ecc71' : '#95a5a6'}; font-size: 1.2rem;">
                                        ${p.ready ? '✓ Ready' : '⏳ Waiting'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div style="text-align: center;">
                        ${currentPlayer && !currentPlayer.ready ? `
                            <button onclick="pvpMatchmaking.setPlayerReady(${roomId}, '${leaderboard.playerName || 'Player'}', true)" style="
                                padding: 15px 40px;
                                background: linear-gradient(135deg, #2ecc71, #27ae60);
                                border: none;
                                border-radius: 8px;
                                color: white;
                                font-size: 1.2rem;
                                font-weight: bold;
                                cursor: pointer;
                                margin-right: 15px;
                            ">✓ Ready Up</button>
                        ` : currentPlayer && currentPlayer.ready ? `
                            <div style="color: #2ecc71; font-size: 1.3rem; margin-bottom: 20px;">
                                ✓ You are ready! Waiting for others...
                            </div>
                        ` : ''}
                        
                        <button onclick="pvpMatchmaking.leaveRoomAndRefund(${roomId}, '${leaderboard.playerName || 'Player'}')" style="
                            padding: 15px 40px;
                            background: linear-gradient(135deg, #e74c3c, #c0392b);
                            border: none;
                            border-radius: 8px;
                            color: white;
                            font-size: 1.2rem;
                            cursor: pointer;
                        ">Leave Lobby</button>
                    </div>

                    ${room.players.length < 2 ? `
                        <div style="text-align: center; color: #f39c12; margin-top: 20px; padding: 15px; background: rgba(243, 156, 18, 0.2); border-radius: 8px;">
                            ⏳ Waiting for more players to join...
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        // Auto-refresh lobby every 2 seconds
        window.pvpLobbyInterval = setInterval(() => {
            const stillInRoom = this.rooms.find(r => r.id === roomId);
            if (!stillInRoom || stillInRoom.status !== 'waiting') {
                clearInterval(window.pvpLobbyInterval);
                if (stillInRoom && stillInRoom.status === 'active') {
                    // Game started!
                    this.initializePVPGame(stillInRoom);
                }
            } else {
                this.showRoomLobby(roomId);
            }
        }, 2000);
    }

    // Leave room and refund
    leaveRoomAndRefund(roomId, playerName) {
        const room = this.rooms.find(r => r.id === roomId);
        if (room) {
            const player = room.players.find(p => p.name === playerName);
            if (player) {
                updateBalance(player.balance); // Refund buy-in
                effects.floatingText(window.innerWidth / 2, 100, `Refunded ${player.balance} eGold`, '#2ecc71', '1.2rem');
            }
        }

        this.leaveRoom(roomId, playerName);
        clearInterval(window.pvpLobbyInterval);

        // Return to game selection
        document.getElementById('gameSelection').style.display = 'grid';
        document.getElementById('gameContainer').style.display = 'none';
    }

    // Show PVP menu for a game
    showPVPMenu(gameType) {
        console.log('showPVPMenu called with:', gameType);
        
        const gameSelection = document.getElementById('gameSelection');
        const gameContainer = document.getElementById('gameContainer');
        const gameTitle = document.getElementById('currentGameTitle');
        const gameContent = document.getElementById('gameContent');
        
        if (!gameSelection || !gameContainer || !gameTitle || !gameContent) {
            console.error('Missing elements in showPVPMenu');
            return;
        }
        
        gameSelection.style.display = 'none';
        gameContainer.style.display = 'block';
        
        gameTitle.textContent = `⚔️ ${gameType.toUpperCase()} - PVP Mode`;

        gameContent.innerHTML = `
            <div style="max-width: 1000px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #3498db;">⚔️ Player vs Player</h2>
                    <p style="color: #a0a0b0;">Create a room or join an existing game</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.2)); padding: 30px; border-radius: 15px; border: 2px solid #2ecc71; text-align: center;">
                        <h3 style="color: #2ecc71; margin-top: 0;">Create New Room</h3>
                        <p style="color: #a0a0b0; margin-bottom: 20px;">Host a new PVP game</p>
                        
                        <div style="margin: 20px 0;">
                            <label style="color: #a0a0b0; display: block; margin-bottom: 10px;">Buy-in Amount (eGold):</label>
                            <input type="number" id="pvpBuyIn" min="10" max="${currentBalance}" value="50" step="10" style="
                                width: 100%;
                                padding: 15px;
                                background: rgba(0, 0, 0, 0.3);
                                border: 2px solid #2ecc71;
                                border-radius: 8px;
                                color: white;
                                font-size: 1.1rem;
                                text-align: center;
                            ">
                        </div>

                        <button onclick="pvpMatchmaking.createRoomPrompt('${gameType}')" style="
                            padding: 15px 40px;
                            background: linear-gradient(135deg, #2ecc71, #27ae60);
                            border: none;
                            border-radius: 8px;
                            color: white;
                            font-size: 1.1rem;
                            font-weight: bold;
                            cursor: pointer;
                            width: 100%;
                        ">Create Room</button>
                    </div>

                    <div style="background: linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(41, 128, 185, 0.2)); padding: 30px; border-radius: 15px; border: 2px solid #3498db; text-align: center;">
                        <h3 style="color: #3498db; margin-top: 0;">Quick Match</h3>
                        <p style="color: #a0a0b0; margin-bottom: 20px;">Join any available room</p>
                        
                        <button onclick="pvpMatchmaking.quickMatch('${gameType}')" style="
                            padding: 15px 40px;
                            background: linear-gradient(135deg, #3498db, #2980b9);
                            border: none;
                            border-radius: 8px;
                            color: white;
                            font-size: 1.1rem;
                            font-weight: bold;
                            cursor: pointer;
                            width: 100%;
                            margin-top: 48px;
                        ">Find Game</button>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(45, 45, 68, 0.9)); padding: 20px; border-radius: 15px; border: 2px solid #95a5a6;">
                    <h3 style="color: #95a5a6; margin-top: 0;">Available Rooms</h3>
                    <div id="pvpRoomsList"></div>
                </div>
            </div>
        `;

        this.updateRoomsList();
    }

    // Create room prompt
    createRoomPrompt(gameType) {
        const buyIn = parseFloat(document.getElementById('pvpBuyIn').value);
        if (!buyIn || buyIn <= 0 || buyIn > currentBalance) {
            alert('Invalid buy-in amount');
            return;
        }

        // Deduct buy-in
        updateBalance(-buyIn);
        sound.chips(buyIn);

        const room = this.createRoom(gameType, leaderboard.playerName || 'Player', buyIn);
        
        effects.floatingText(window.innerWidth / 2, 100, 'Room Created!', '#2ecc71', '1.5rem');

        // Show room lobby
        this.showRoomLobby(room.id);
    }

    // Quick match - join first available room
    quickMatch(gameType) {
        const available = this.rooms.filter(r => 
            r.gameType === gameType && 
            r.status === 'waiting' && 
            r.players.length < r.maxPlayers
        );

        if (available.length === 0) {
            alert('No available rooms. Create one!');
            return;
        }

        // Join first available
        this.joinRoomPrompt(available[0].id);
    }

    // Placeholder PVP game initializers
    initPVPChess(room, container) {
        container.innerHTML = '<div style="text-align: center; padding: 50px; color: #3498db;">PVP Chess game starting...</div>';
        // Will implement full PVP chess
    }

    initPVPCheckers(room, container) {
        container.innerHTML = '<div style="text-align: center; padding: 50px; color: #3498db;">PVP Checkers game starting...</div>';
        // Will implement full PVP checkers
    }

    initPVPPoker(room, container) {
        container.innerHTML = '<div style="text-align: center; padding: 50px; color: #3498db;">PVP Poker table starting...</div>';
        // Will implement multiplayer poker
    }

    initPVPTonk(room, container) {
        container.innerHTML = '<div style="text-align: center; padding: 50px; color: #3498db;">PVP Tonk game starting...</div>';
        // Will implement PVP tonk
    }
}

// Global instance
const pvpMatchmaking = new PVPMatchmaking();
window.pvpMatchmaking = pvpMatchmaking;
