// Spectator System with Live Games Feed and Global Chat
const spectatorSystem = {
    liveGames: [],
    chatMessages: [],
    spectating: null,
    username: localStorage.getItem('chatUsername') || `Player${Math.floor(Math.random() * 9999)}`,
    
    init() {
        localStorage.setItem('chatUsername', this.username);
        this.simulateLiveGames();
        // Update live games every 30 seconds
        setInterval(() => this.simulateLiveGames(), 30000);
    },
    
    // Simulate active games for demo
    simulateLiveGames() {
        const games = ['Royal Hold\'em', 'Omaha Royale', 'Pineapple Royale', 'Royal Table Multiplayer', 'Tonk Royale'];
        const players = ['DragonSlayer', 'LuckyAce', 'PokerPro', 'CasinoKing', 'HighRoller', 'ChipLeader', 'BluffMaster', 'RoyalFlush'];
        
        this.liveGames = [];
        const numGames = Math.floor(Math.random() * 3) + 2; // 2-4 live games
        
        for (let i = 0; i < numGames; i++) {
            const game = games[Math.floor(Math.random() * games.length)];
            const numPlayers = Math.floor(Math.random() * 4) + 2; // 2-5 players
            const gamePlayers = [];
            
            for (let j = 0; j < numPlayers; j++) {
                const player = players[Math.floor(Math.random() * players.length)];
                gamePlayers.push({
                    name: player,
                    chips: Math.floor(Math.random() * 5000) + 500
                });
            }
            
            this.liveGames.push({
                id: `game-${Date.now()}-${i}`,
                name: game,
                players: gamePlayers,
                pot: Math.floor(Math.random() * 1000) + 100,
                spectators: Math.floor(Math.random() * 10) + 1,
                status: ['Pre-Flop', 'Flop', 'Turn', 'River'][Math.floor(Math.random() * 4)]
            });
        }
    },
    
    // Show live games feed
    showLiveGamesFeed() {
        soundManager.playButtonClick();
        
        const modal = document.createElement('div');
        modal.id = 'liveGamesModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="background: linear-gradient(135deg, #2A3544 0%, #1A2332 100%); border-radius: 20px; padding: 40px; max-width: 900px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 3px solid #FFB800;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 style="color: #FFB800; font-size: 2em; margin: 0;">👁️ Live Games</h2>
                    <button onclick="spectatorSystem.closeLiveGames()" style="background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c; color: #e74c3c; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 1.1em; font-weight: bold;">✕ Close</button>
                </div>
                
                <div style="color: #cccccc; margin-bottom: 20px;">
                    <p style="font-size: 1.1em;">Watch live poker games and place side bets!</p>
                </div>
                
                <div id="liveGamesList" style="display: grid; gap: 20px;">
                    ${this.renderLiveGames()}
                </div>
                
                ${this.liveGames.length === 0 ? `
                    <div style="text-align: center; padding: 60px 20px; color: #999;">
                        <div style="font-size: 4em; margin-bottom: 20px;">🎰</div>
                        <p style="font-size: 1.3em;">No live games at the moment</p>
                        <p>Check back soon or start your own!</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    renderLiveGames() {
        if (this.liveGames.length === 0) return '';
        
        return this.liveGames.map(game => `
            <div style="background: rgba(255, 184, 0, 0.05); border: 2px solid #FFB800; border-radius: 15px; padding: 25px; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255, 184, 0, 0.1)'; this.style.transform='translateX(5px)'" onmouseout="this.style.background='rgba(255, 184, 0, 0.05)'; this.style.transform='translateX(0)'">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div>
                        <h3 style="color: #FFB800; font-size: 1.5em; margin: 0 0 10px 0;">${game.name}</h3>
                        <div style="color: #2ecc71; font-size: 1.1em; margin-bottom: 5px;">
                            💰 Pot: <b>${game.pot} eGold</b>
                        </div>
                        <div style="color: #3498db; font-size: 0.95em;">
                            👁️ ${game.spectators} spectators watching
                        </div>
                    </div>
                    <div style="background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71; padding: 8px 15px; border-radius: 8px; color: #2ecc71; font-weight: bold;">
                        ${game.status}
                    </div>
                </div>
                
                <div style="margin: 15px 0; padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 10px;">
                    <div style="color: #999; font-size: 0.9em; margin-bottom: 8px;">Players:</div>
                    ${game.players.map(p => `
                        <div style="display: flex; justify-content: space-between; color: #cccccc; margin-bottom: 5px;">
                            <span>🎮 ${p.name}</span>
                            <span style="color: #FFB800;">${p.chips} chips</span>
                        </div>
                    `).join('')}
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button onclick="spectatorSystem.spectateGame('${game.id}')" style="flex: 1; background: linear-gradient(135deg, #7B68EE 0%, #6a5acd 100%); border: 2px solid #7B68EE; color: white; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 1.1em; font-weight: bold; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(123, 104, 238, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        👁️ Spectate
                    </button>
                    <button onclick="alert('Side bets coming soon!')" style="flex: 1; background: rgba(255, 184, 0, 0.2); border: 2px solid #FFB800; color: #FFB800; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 1.1em; font-weight: bold;">
                        💰 Side Bet
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    spectateGame(gameId) {
        soundManager.playButtonClick();
        const game = this.liveGames.find(g => g.id === gameId);
        if (!game) return;
        
        this.spectating = game;
        alert(`Now spectating ${game.name}!\n\nThis is a demo - full spectator mode with live updates coming soon!`);
        this.closeLiveGames();
    },
    
    closeLiveGames() {
        soundManager.playButtonClick();
        const modal = document.getElementById('liveGamesModal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    },
    
    // Show global chat
    showGlobalChat() {
        soundManager.playButtonClick();
        
        const modal = document.createElement('div');
        modal.id = 'chatModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="background: linear-gradient(135deg, #2A3544 0%, #1A2332 100%); border-radius: 20px; padding: 0; max-width: 700px; width: 90%; height: 600px; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 3px solid #FFB800;">
                <div style="padding: 20px; border-bottom: 2px solid #FFB800; display: flex; justify-content: space-between; align-items: center;">
                    <h2 style="color: #FFB800; font-size: 2em; margin: 0;">💬 Casino Chat</h2>
                    <button onclick="spectatorSystem.closeChat()" style="background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c; color: #e74c3c; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 1.1em; font-weight: bold;">✕ Close</button>
                </div>
                
                <div style="padding: 20px; color: #cccccc; border-bottom: 1px solid rgba(255, 184, 0, 0.3);">
                    <p>Welcome, <b style="color: #FFB800;">${this.username}</b>! 
                    <button onclick="spectatorSystem.changeUsername()" style="background: none; border: 1px solid #7B68EE; color: #7B68EE; padding: 4px 12px; border-radius: 5px; cursor: pointer; margin-left: 10px; font-size: 0.9em;">Change Name</button></p>
                </div>
                
                <div id="chatMessages" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px;">
                    ${this.renderChatMessages()}
                </div>
                
                <div style="padding: 20px; border-top: 2px solid #FFB800; display: flex; gap: 10px;">
                    <input type="text" id="chatInput" placeholder="Type your message..." style="flex: 1; padding: 12px; background: rgba(255, 255, 255, 0.1); border: 2px solid #FFB800; border-radius: 8px; color: white; font-size: 1em;" onkeypress="if(event.key==='Enter') spectatorSystem.sendMessage()">
                    <button onclick="spectatorSystem.sendMessage()" style="background: linear-gradient(135deg, #FFB800 0%, #FFA500 100%); border: none; color: #1A2332; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-size: 1.1em; font-weight: bold;">Send</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-scroll to bottom
        setTimeout(() => {
            const messagesDiv = document.getElementById('chatMessages');
            if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 100);
        
        // Focus input
        document.getElementById('chatInput').focus();
    },
    
    renderChatMessages() {
        if (this.chatMessages.length === 0) {
            // Add welcome messages
            this.chatMessages = [
                { user: 'System', message: 'Welcome to Royal eGold Casino Chat! 🎰', isSystem: true, time: new Date() },
                { user: 'CasinoBot', message: 'Chat with other players, share strategies, and have fun!', isSystem: true, time: new Date() }
            ];
        }
        
        return this.chatMessages.map(msg => {
            const time = new Date(msg.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            
            if (msg.isSystem) {
                return `
                    <div style="padding: 12px; background: rgba(123, 104, 238, 0.1); border-left: 4px solid #7B68EE; border-radius: 8px;">
                        <div style="color: #7B68EE; font-weight: bold; margin-bottom: 5px;">🤖 ${msg.user}</div>
                        <div style="color: #cccccc;">${msg.message}</div>
                        <div style="color: #666; font-size: 0.8em; margin-top: 5px;">${time}</div>
                    </div>
                `;
            }
            
            const isOwnMessage = msg.user === this.username;
            return `
                <div style="padding: 12px; background: ${isOwnMessage ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255, 184, 0, 0.05)'}; border-left: 4px solid ${isOwnMessage ? '#2ecc71' : '#FFB800'}; border-radius: 8px;">
                    <div style="color: ${isOwnMessage ? '#2ecc71' : '#FFB800'}; font-weight: bold; margin-bottom: 5px;">${isOwnMessage ? '👤 You' : '🎮 ' + msg.user}</div>
                    <div style="color: #cccccc;">${msg.message}</div>
                    <div style="color: #666; font-size: 0.8em; margin-top: 5px;">${time}</div>
                </div>
            `;
        }).join('');
    },
    
    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message === '') return;
        
        soundManager.playButtonClick();
        
        // Add user message
        this.chatMessages.push({
            user: this.username,
            message: message,
            isSystem: false,
            time: new Date()
        });
        
        input.value = '';
        
        // Simulate response after 2-5 seconds
        setTimeout(() => {
            const responses = [
                'Nice play!',
                'Good luck at the tables!',
                'That\'s a great strategy!',
                'Just won 500 eGold on slots! 🎰',
                'Anyone up for a poker game?',
                'Royal Hold\'em is my favorite!',
                'The roulette wheel is hot today! 🎡',
                'Hit a jackpot on Royal Triple Spin! 💰'
            ];
            
            const botNames = ['LuckyAce', 'PokerPro', 'HighRoller', 'CasinoKing', 'RoyalFlush'];
            
            this.chatMessages.push({
                user: botNames[Math.floor(Math.random() * botNames.length)],
                message: responses[Math.floor(Math.random() * responses.length)],
                isSystem: false,
                time: new Date()
            });
            
            this.updateChatDisplay();
        }, Math.random() * 3000 + 2000);
        
        this.updateChatDisplay();
    },
    
    updateChatDisplay() {
        const messagesDiv = document.getElementById('chatMessages');
        if (messagesDiv) {
            messagesDiv.innerHTML = this.renderChatMessages();
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    },
    
    changeUsername() {
        const newName = prompt('Enter your new username:', this.username);
        if (newName && newName.trim() !== '') {
            const oldName = this.username;
            this.username = newName.trim();
            localStorage.setItem('chatUsername', this.username);
            
            // Add system message
            this.chatMessages.push({
                user: 'System',
                message: `${oldName} changed their name to ${this.username}`,
                isSystem: true,
                time: new Date()
            });
            
            this.closeChat();
            this.showGlobalChat();
        }
    },
    
    closeChat() {
        soundManager.playButtonClick();
        const modal = document.getElementById('chatModal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    }
};

// Initialize spectator system on load
if (typeof window !== 'undefined') {
    window.spectatorSystem = spectatorSystem;
    spectatorSystem.init();
}
