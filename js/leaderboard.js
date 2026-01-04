// Global Leaderboard System
const leaderboardSystem = {
    init() {
        this.loadStats();
        this.addLeaderboardButton();
    },
    
    loadStats() {
        const defaultStats = {
            totalWagered: 0,
            totalWon: 0,
            biggestWin: 0,
            gamesPlayed: 0,
            currentStreak: 0,
            bestStreak: 0,
            favoriteGame: 'None',
            joinDate: Date.now()
        };
        
        this.playerStats = JSON.parse(localStorage.getItem('egold_leaderboard_stats') || JSON.stringify(defaultStats));
        this.globalLeaderboard = JSON.parse(localStorage.getItem('egold_global_leaderboard') || '[]');
    },
    
    saveStats() {
        localStorage.setItem('egold_leaderboard_stats', JSON.stringify(this.playerStats));
        localStorage.setItem('egold_global_leaderboard', JSON.stringify(this.globalLeaderboard));
    },
    
    // Track player actions
    trackWager(amount, gameName) {
        this.playerStats.totalWagered += amount;
        this.playerStats.gamesPlayed++;
        this.updateFavoriteGame(gameName);
        this.saveStats();
    },
    
    trackWin(amount) {
        this.playerStats.totalWon += amount;
        if (amount > this.playerStats.biggestWin) {
            this.playerStats.biggestWin = amount;
        }
        this.playerStats.currentStreak++;
        if (this.playerStats.currentStreak > this.playerStats.bestStreak) {
            this.playerStats.bestStreak = this.playerStats.currentStreak;
        }
        this.saveStats();
    },
    
    trackLoss() {
        this.playerStats.currentStreak = 0;
        this.saveStats();
    },
    
    updateFavoriteGame(gameName) {
        const gameCount = JSON.parse(localStorage.getItem('egold_game_counts') || '{}');
        gameCount[gameName] = (gameCount[gameName] || 0) + 1;
        localStorage.setItem('egold_game_counts', JSON.stringify(gameCount));
        
        // Find most played game
        let maxCount = 0;
        let favorite = 'None';
        for (const [game, count] of Object.entries(gameCount)) {
            if (count > maxCount) {
                maxCount = count;
                favorite = game;
            }
        }
        this.playerStats.favoriteGame = favorite;
    },
    
    // Get player name with fallback
    getPlayerName() {
        return localStorage.getItem('egold_player_name') || 'Player' + Math.floor(Math.random() * 9999);
    },
    
    // Generate global leaderboard with simulated players
    generateGlobalLeaderboard() {
        const playerName = this.getPlayerName();
        const vipLevel = typeof vipSystem !== 'undefined' ? vipSystem.getCurrentLevel().level : 0;
        
        // Create player entry
        const playerEntry = {
            name: playerName,
            totalWagered: this.playerStats.totalWagered,
            biggestWin: this.playerStats.biggestWin,
            vipLevel: vipLevel,
            gamesPlayed: this.playerStats.gamesPlayed
        };
        
        // Generate simulated top players
        const simulatedPlayers = [
            { name: 'CryptoKing777', totalWagered: 50000, biggestWin: 5000, vipLevel: 5, gamesPlayed: 2500 },
            { name: 'DiamondHands', totalWagered: 45000, biggestWin: 4500, vipLevel: 5, gamesPlayed: 2200 },
            { name: 'RoyalFlush', totalWagered: 40000, biggestWin: 4000, vipLevel: 4, gamesPlayed: 2000 },
            { name: 'GoldenGambler', totalWagered: 35000, biggestWin: 3500, vipLevel: 4, gamesPlayed: 1800 },
            { name: 'LuckyWhale', totalWagered: 30000, biggestWin: 3000, vipLevel: 4, gamesPlayed: 1600 },
            { name: 'SlotMaster99', totalWagered: 25000, biggestWin: 2500, vipLevel: 3, gamesPlayed: 1400 },
            { name: 'PokerPro', totalWagered: 22000, biggestWin: 2200, vipLevel: 3, gamesPlayed: 1200 },
            { name: 'RouletteRoyalty', totalWagered: 20000, biggestWin: 2000, vipLevel: 3, gamesPlayed: 1100 },
            { name: 'HighRoller', totalWagered: 18000, biggestWin: 1800, vipLevel: 2, gamesPlayed: 1000 },
            { name: 'ChipCollector', totalWagered: 15000, biggestWin: 1500, vipLevel: 2, gamesPlayed: 900 }
        ];
        
        // Add slight randomization to simulated players
        simulatedPlayers.forEach(player => {
            player.totalWagered += Math.floor(Math.random() * 1000);
            player.biggestWin += Math.floor(Math.random() * 100);
        });
        
        // Combine player with simulated players and sort
        const allPlayers = [...simulatedPlayers, playerEntry];
        allPlayers.sort((a, b) => b.totalWagered - a.totalWagered);
        
        return allPlayers;
    },
    
    // Show leaderboard panel
    showPanel() {
        const leaderboard = this.generateGlobalLeaderboard();
        const playerName = this.getPlayerName();
        const playerRank = leaderboard.findIndex(p => p.name === playerName) + 1;
        
        const vipIcons = ['', '🥉', '🥈', '🥇', '💎', '👑'];
        
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
            z-index: 10000;
            max-width: 700px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            border: 3px solid #FFB800;
        `;
        
        panel.innerHTML = `
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: #FFB800; font-size: 2.2em; margin: 0; text-shadow: 0 0 20px rgba(255, 184, 0, 0.6);">🏆 Global Leaderboard 🏆</h2>
                <p style="color: #888; margin-top: 10px;">Top Players by Total Wagered</p>
            </div>
            
            <div style="background: rgba(255, 184, 0, 0.1); padding: 20px; border-radius: 15px; margin-bottom: 25px; border: 2px solid rgba(255, 184, 0, 0.3);">
                <h3 style="color: #FFB800; margin: 0 0 15px 0;">📊 Your Stats</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 1.1em;">
                    <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px;">
                        <div style="color: #888; font-size: 0.9em;">Rank</div>
                        <div style="color: #FFB800; font-size: 1.4em; font-weight: bold;">#${playerRank}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px;">
                        <div style="color: #888; font-size: 0.9em;">Total Wagered</div>
                        <div style="color: #2ecc71; font-size: 1.4em; font-weight: bold;">${this.playerStats.totalWagered.toFixed(0)}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px;">
                        <div style="color: #888; font-size: 0.9em;">Biggest Win</div>
                        <div style="color: #e74c3c; font-size: 1.4em; font-weight: bold;">${this.playerStats.biggestWin.toFixed(0)}</div>
                    </div>
                    <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px;">
                        <div style="color: #888; font-size: 0.9em;">Games Played</div>
                        <div style="color: #3498db; font-size: 1.4em; font-weight: bold;">${this.playerStats.gamesPlayed}</div>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #FFB800; margin-bottom: 15px;">👥 Top 10 Players</h3>
                ${leaderboard.slice(0, 10).map((player, index) => {
                    const isPlayer = player.name === playerName;
                    const rankColor = index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#888';
                    const bgColor = isPlayer ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)';
                    const borderColor = isPlayer ? '#FFB800' : 'transparent';
                    
                    return `
                        <div style="display: flex; align-items: center; padding: 15px; margin-bottom: 10px; background: ${bgColor}; border-radius: 12px; border: 2px solid ${borderColor}; transition: all 0.3s ease;">
                            <div style="font-size: 1.8em; font-weight: bold; color: ${rankColor}; min-width: 50px;">#${index + 1}</div>
                            <div style="flex: 1; margin-left: 15px;">
                                <div style="color: ${isPlayer ? '#FFB800' : '#fff'}; font-size: 1.2em; font-weight: bold;">
                                    ${player.name} ${isPlayer ? '(You)' : ''} ${vipIcons[player.vipLevel] || ''}
                                </div>
                                <div style="color: #888; font-size: 0.9em; margin-top: 5px;">
                                    Wagered: <span style="color: #2ecc71;">${player.totalWagered.toFixed(0)}</span> | 
                                    Biggest Win: <span style="color: #e74c3c;">${player.biggestWin.toFixed(0)}</span> |
                                    Games: <span style="color: #3498db;">${player.gamesPlayed}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 2px solid #2ecc71;">
                <h4 style="color: #2ecc71; margin: 0 0 10px 0;">🎯 Leaderboard Info</h4>
                <ul style="color: #ccc; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li>Rankings update in real-time based on total wagered</li>
                    <li>VIP level shown next to player names</li>
                    <li>Compete with players globally for top spots</li>
                    <li>Higher rank = Exclusive rewards and recognition</li>
                </ul>
            </div>
            
            <button onclick="this.parentElement.remove()" style="width: 100%; padding: 15px; margin-top: 20px; background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; border: none; border-radius: 10px; font-size: 1.2em; cursor: pointer; font-weight: bold; transition: all 0.3s ease;">
                Close
            </button>
        `;
        
        document.body.appendChild(panel);
        
        // Play sound
        if (typeof soundManager !== 'undefined') {
            soundManager.playChipSound();
        }
    },
    
    // Add leaderboard button to header
    addLeaderboardButton() {
        const header = document.querySelector('header');
        if (!header) return;
        
        const liveGamesBtn = document.querySelector('button[onclick="spectatorSystem.showLiveGamesFeed()"]');
        if (!liveGamesBtn) return;
        
        const btn = document.createElement('button');
        btn.onclick = () => this.showPanel();
        btn.style.cssText = `
            background: linear-gradient(135deg, #FFB800, #d4af37);
            color: #1A2332;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 1em;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(255, 184, 0, 0.3);
        `;
        btn.textContent = '🏆 Leaderboard';
        
        btn.onmouseenter = function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 6px 20px rgba(255, 184, 0, 0.5)';
        };
        btn.onmouseleave = function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(255, 184, 0, 0.3)';
        };
        
        liveGamesBtn.parentNode.insertBefore(btn, liveGamesBtn.nextSibling);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => leaderboardSystem.init());
} else {
    leaderboardSystem.init();
}
