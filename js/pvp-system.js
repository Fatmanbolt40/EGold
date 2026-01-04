// PVP Multiplayer System
const PVPSystem = {
    currentRoom: null,
    playerName: localStorage.getItem('playerName') || 'Player' + Math.floor(Math.random() * 1000),
    
    init() {
        localStorage.setItem('playerName', this.playerName);
    },
    
    showGameModeSelector(gameType, gameName) {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 2em; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">
                        ${gameName}
                    </h3>
                    <p style="font-size: 1.3em; color: #cccccc; margin-bottom: 30px;">Choose Game Mode</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 700px; margin: 40px auto;">
                    <div onclick="PVPSystem.startSolo('${gameType}')" style="padding: 40px 30px; background: linear-gradient(135deg, #2A3544 0%, #1A2332 100%); border: 3px solid #FFB800; border-radius: 15px; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 30px rgba(255, 184, 0, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        <div style="font-size: 5em; margin-bottom: 15px;">🤖</div>
                        <h3 style="color: #FFB800; font-size: 1.5em; margin-bottom: 10px;">SOLO</h3>
                        <p style="color: #cccccc;">Play against AI</p>
                    </div>
                    
                    <div onclick="PVPSystem.showPVPLobby('${gameType}', '${gameName}')" style="padding: 40px 30px; background: linear-gradient(135deg, #7B68EE 0%, #6a5acd 100%); border: 3px solid #7B68EE; border-radius: 15px; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 30px rgba(123, 104, 238, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        <div style="font-size: 5em; margin-bottom: 15px;">👥</div>
                        <h3 style="color: white; font-size: 1.5em; margin-bottom: 10px;">MULTIPLAYER</h3>
                        <p style="color: #e0e0e0;">Play vs Players</p>
                    </div>
                </div>
                
                <div class="game-info-box">
                    <h3>💡 Game Modes</h3>
                    <p><b>Solo:</b> Play against the computer/dealer with house edge</p>
                    <p style="margin-top: 10px;"><b>Multiplayer:</b> Create or join rooms to play against real players!</p>
                </div>
            </div>
        `;
    },
    
    startSolo(gameType) {
        // Start the original solo game
        if (gameType === 'texasholdem' && window.texasholdemGame) {
            texasholdemGame.initSolo();
        } else if (gameType === 'omaha' && window.omahaGame) {
            omahaGame.initSolo();
        } else if (gameType === 'pineapple' && window.pineappleGame) {
            pineappleGame.initSolo();
        } else if (gameType === 'tonk' && window.tonkGame) {
            tonkGame.initSolo();
        }
    },
    
    showPVPLobby(gameType, gameName) {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #7B68EE; font-size: 1.8em; margin-bottom: 10px;">👥 Multiplayer Lobby</h3>
                    <p style="color: #cccccc; font-size: 1.2em;">${gameName}</p>
                </div>
                
                <div style="margin: 30px 0; padding: 20px; background: rgba(123, 104, 238, 0.1); border: 2px solid #7B68EE; border-radius: 12px; max-width: 500px; margin: 30px auto;">
                    <p style="font-size: 1.2em; color: #FFB800; margin-bottom: 15px;">Your Name: <b>${this.playerName}</b></p>
                    <button onclick="PVPSystem.changeName()" class="game-button secondary" style="padding: 10px 20px; font-size: 1em;">
                        ✏️ Change Name
                    </button>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 600px; margin: 30px auto;">
                    <div style="padding: 30px; background: rgba(123, 104, 238, 0.1); border: 2px solid #7B68EE; border-radius: 12px;">
                        <h3 style="color: #7B68EE; margin-bottom: 20px;">🎮 Create Room</h3>
                        <input type="number" id="pvpBet" value="50" min="10" max="500" class="game-input" style="width: 100%; margin-bottom: 15px;" placeholder="Bet Amount">
                        <button onclick="PVPSystem.createRoom('${gameType}', '${gameName}')" class="game-button" style="width: 100%;">
                            Create Game
                        </button>
                    </div>
                    
                    <div style="padding: 30px; background: rgba(123, 104, 238, 0.1); border: 2px solid #7B68EE; border-radius: 12px;">
                        <h3 style="color: #7B68EE; margin-bottom: 20px;">🔍 Join Room</h3>
                        <input type="text" id="roomCode" class="game-input" style="width: 100%; margin-bottom: 15px;" placeholder="Room Code">
                        <button onclick="PVPSystem.joinRoom('${gameType}', '${gameName}')" class="game-button secondary" style="width: 100%;">
                            Join Game
                        </button>
                    </div>
                </div>
                
                <div id="pvpStatus" style="margin-top: 20px; font-size: 1.2em;"></div>
                
                <div class="game-info-box">
                    <h3>🎯 How Multiplayer Works</h3>
                    <p>1️⃣ <b>Create a room</b> and share the code with a friend</p>
                    <p style="margin-top: 8px;">2️⃣ Or <b>join a room</b> using their code</p>
                    <p style="margin-top: 8px;">3️⃣ Both players bet the same amount</p>
                    <p style="margin-top: 8px;">4️⃣ Winner takes all! 💰</p>
                </div>
            </div>
        `;
    },
    
    changeName() {
        const newName = prompt('Enter your player name:', this.playerName);
        if (newName && newName.trim()) {
            this.playerName = newName.trim();
            localStorage.setItem('playerName', this.playerName);
            location.reload();
        }
    },
    
    createRoom(gameType, gameName) {
        const betInput = document.getElementById('pvpBet');
        const bet = parseFloat(betInput.value);
        
        if (bet < 10) {
            document.getElementById('pvpStatus').innerHTML = '<span style="color: #e74c3c;">Minimum bet is 10 eGold!</span>';
            return;
        }
        
        if (bet > balance) {
            document.getElementById('pvpStatus').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        // Generate room code
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        this.currentRoom = {
            code: roomCode,
            gameType: gameType,
            gameName: gameName,
            bet: bet,
            host: this.playerName,
            hostReady: true,
            guest: null,
            guestReady: false
        };
        
        // Deduct bet
        updateBalance(-bet);
        
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #7B68EE; font-size: 1.8em; margin-bottom: 20px;">🎮 Room Created!</h3>
                </div>
                
                <div style="padding: 40px; background: linear-gradient(135deg, rgba(123, 104, 238, 0.2), rgba(106, 90, 205, 0.2)); border: 3px solid #7B68EE; border-radius: 15px; max-width: 500px; margin: 30px auto;">
                    <p style="font-size: 1.3em; color: #cccccc; margin-bottom: 15px;">Share this code:</p>
                    <div style="font-size: 3em; color: #FFB800; font-weight: bold; letter-spacing: 5px; margin: 20px 0; text-shadow: 0 0 20px rgba(255, 184, 0, 0.5);">
                        ${roomCode}
                    </div>
                    <p style="color: #cccccc; margin-top: 20px;">Bet Amount: <b style="color: #FFB800;">${bet} eGold</b></p>
                    <p style="color: #cccccc; margin-top: 10px;">Game: <b style="color: #7B68EE;">${gameName}</b></p>
                </div>
                
                <div style="margin: 30px 0;">
                    <p style="font-size: 1.3em; color: #FFB800;">⏳ Waiting for opponent...</p>
                    <button onclick="PVPSystem.simulateOpponent()" class="game-button secondary" style="margin-top: 20px;">
                        🤖 Play vs AI (Start Now)
                    </button>
                    <button onclick="PVPSystem.cancelRoom()" class="game-button" style="margin-top: 10px; background: #e74c3c;">
                        ❌ Cancel
                    </button>
                </div>
            </div>
        `;
    },
    
    joinRoom(gameType, gameName) {
        const roomCode = document.getElementById('roomCode').value.trim().toUpperCase();
        
        if (!roomCode) {
            document.getElementById('pvpStatus').innerHTML = '<span style="color: #e74c3c;">Please enter a room code!</span>';
            return;
        }
        
        // For demo, simulate joining
        document.getElementById('pvpStatus').innerHTML = '<span style="color: #FFB800;">🔍 Searching for room...</span>';
        
        setTimeout(() => {
            document.getElementById('pvpStatus').innerHTML = '<span style="color: #e74c3c;">Room not found. Create a new game instead!</span>';
        }, 1000);
    },
    
    simulateOpponent() {
        const room = this.currentRoom;
        if (!room) return;
        
        // Start the PVP game with simulated opponent
        if (room.gameType === 'texasholdem' && window.texasholdemGame) {
            texasholdemGame.initPVP(room);
        } else if (room.gameType === 'omaha' && window.omahaGame) {
            omahaGame.initPVP(room);
        } else if (room.gameType === 'pineapple' && window.pineappleGame) {
            pineappleGame.initPVP(room);
        } else if (room.gameType === 'tonk' && window.tonkGame) {
            tonkGame.initPVP(room);
        }
    },
    
    cancelRoom() {
        if (this.currentRoom) {
            // Refund bet
            updateBalance(this.currentRoom.bet);
            this.currentRoom = null;
        }
        closeGame();
    }
};

// Initialize on load
PVPSystem.init();
window.PVPSystem = PVPSystem;
