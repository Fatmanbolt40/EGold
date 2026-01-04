// VIP Level System
class VIPSystem {
    constructor() {
        this.levels = [
            { level: 0, name: 'Bronze', minWagered: 0, color: '#cd7f32', benefits: 'Standard play', rakeback: 0 },
            { level: 1, name: 'Silver', minWagered: 1000, color: '#c0c0c0', benefits: '+1% rakeback', rakeback: 0.01 },
            { level: 2, name: 'Gold', minWagered: 5000, color: '#ffd700', benefits: '+2% rakeback, Daily bonus x1.5', rakeback: 0.02 },
            { level: 3, name: 'Platinum', minWagered: 15000, color: '#e5e4e2', benefits: '+3% rakeback, Daily bonus x2', rakeback: 0.03 },
            { level: 4, name: 'Diamond', minWagered: 50000, color: '#b9f2ff', benefits: '+5% rakeback, Daily bonus x3', rakeback: 0.05 },
            { level: 5, name: 'Legend', minWagered: 100000, color: '#ff00ff', benefits: '+10% rakeback, Daily bonus x5', rakeback: 0.10 }
        ];
        
        this.totalWagered = 0;
        this.currentLevel = 0;
        this.loadProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem('vipProgress');
        if (saved) {
            const data = JSON.parse(saved);
            this.totalWagered = data.totalWagered || 0;
            this.updateLevel();
        }
    }

    saveProgress() {
        localStorage.setItem('vipProgress', JSON.stringify({
            totalWagered: this.totalWagered
        }));
    }

    addWager(amount) {
        this.totalWagered += amount;
        const oldLevel = this.currentLevel;
        this.updateLevel();
        
        if (this.currentLevel > oldLevel) {
            this.showLevelUp(this.levels[this.currentLevel]);
        }
        
        this.saveProgress();
    }

    updateLevel() {
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (this.totalWagered >= this.levels[i].minWagered) {
                this.currentLevel = i;
                break;
            }
        }
    }

    getCurrentLevel() {
        return this.levels[this.currentLevel];
    }

    getNextLevel() {
        if (this.currentLevel < this.levels.length - 1) {
            return this.levels[this.currentLevel + 1];
        }
        return null;
    }

    getProgressToNext() {
        const nextLevel = this.getNextLevel();
        if (!nextLevel) return 100;
        
        const currentLevelMin = this.levels[this.currentLevel].minWagered;
        const nextLevelMin = nextLevel.minWagered;
        const progress = ((this.totalWagered - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
        
        return Math.min(progress, 100);
    }

    getRakeback(amount) {
        const level = this.getCurrentLevel();
        return amount * level.rakeback;
    }

    showLevelUp(newLevel) {
        const notification = document.createElement('div');
        notification.className = 'vip-levelup';
        notification.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 20px;">👑</div>
            <div style="font-size: 2rem; font-weight: bold; color: ${newLevel.color}; text-shadow: 0 0 20px ${newLevel.color};">
                VIP LEVEL UP!
            </div>
            <div style="font-size: 1.5rem; margin: 15px 0; color: ${newLevel.color};">
                ${newLevel.name}
            </div>
            <div style="color: #d4af37; margin-top: 10px;">
                ${newLevel.benefits}
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: linear-gradient(135deg, #1a1a2e, #2d2d44);
            color: white;
            padding: 40px;
            border-radius: 20px;
            border: 3px solid ${newLevel.color};
            box-shadow: 0 0 50px ${newLevel.color};
            z-index: 10003;
            text-align: center;
            animation: vipPop 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(notification);
        
        // Epic celebration
        sound.play('achievement', 1);
        effects.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 200);
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                effects.createBurst(
                    window.innerWidth / 2 + (Math.random() - 0.5) * 200,
                    window.innerHeight / 2 + (Math.random() - 0.5) * 200,
                    newLevel.color,
                    30
                );
            }, i * 200);
        }
        
        setTimeout(() => {
            notification.style.animation = 'vipPopOut 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    getDisplayHTML() {
        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.getNextLevel();
        const progress = this.getProgressToNext();
        
        return `
            <div style="background: linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(45, 45, 68, 0.8)); padding: 20px; border-radius: 15px; border: 2px solid ${currentLevel.color};">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">👑</div>
                    <div style="font-size: 1.8rem; font-weight: bold; color: ${currentLevel.color}; text-shadow: 0 0 10px ${currentLevel.color};">
                        ${currentLevel.name} VIP
                    </div>
                    <div style="color: #d4af37; margin-top: 10px;">Level ${currentLevel.level}</div>
                </div>
                
                <div style="margin: 20px 0;">
                    <div style="color: #a0a0b0; margin-bottom: 10px;">Total Wagered: <span style="color: #2ecc71; font-weight: bold;">${this.totalWagered.toFixed(2)} eGold</span></div>
                    ${nextLevel ? `
                        <div style="color: #a0a0b0; margin-bottom: 10px;">
                            Next Level: <span style="color: ${nextLevel.color};">${nextLevel.name}</span>
                            (${nextLevel.minWagered.toFixed(0)} eGold)
                        </div>
                        <div style="background: rgba(100, 100, 100, 0.3); height: 20px; border-radius: 10px; overflow: hidden; margin-top: 10px;">
                            <div style="background: linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color}); height: 100%; width: ${progress}%; transition: width 0.5s ease;"></div>
                        </div>
                        <div style="text-align: center; color: #d4af37; margin-top: 5px; font-size: 0.9rem;">
                            ${progress.toFixed(1)}% to next level
                        </div>
                    ` : `
                        <div style="color: #ffd700; text-align: center; font-size: 1.2rem; margin-top: 20px;">
                            🌟 MAX LEVEL ACHIEVED! 🌟
                        </div>
                    `}
                </div>
                
                <div style="border-top: 1px solid rgba(212, 175, 55, 0.3); padding-top: 15px; margin-top: 15px;">
                    <div style="font-weight: bold; color: #d4af37; margin-bottom: 10px;">Current Benefits:</div>
                    <div style="color: #a0a0b0;">${currentLevel.benefits}</div>
                </div>
            </div>
        `;
    }
}

// Leaderboard System
class Leaderboard {
    constructor() {
        this.entries = [];
        this.playerName = 'Player';
        this.loadLeaderboard();
    }

    loadLeaderboard() {
        const saved = localStorage.getItem('leaderboard');
        if (saved) {
            this.entries = JSON.parse(saved);
        } else {
            // Initialize with some dummy data
            this.entries = [
                { name: 'HighRoller99', balance: 15420, totalWon: 45230, gamesPlayed: 342 },
                { name: 'LuckyLegend', balance: 12890, totalWon: 38760, gamesPlayed: 287 },
                { name: 'CasinoKing', balance: 10340, totalWon: 32100, gamesPlayed: 256 },
                { name: 'ChipMaster', balance: 8750, totalWon: 28340, gamesPlayed: 198 },
                { name: 'BetBeast', balance: 7200, totalWon: 23450, gamesPlayed: 176 }
            ];
        }
        
        const savedName = localStorage.getItem('playerName');
        if (savedName) {
            this.playerName = savedName;
        }
    }

    saveLeaderboard() {
        localStorage.setItem('leaderboard', JSON.stringify(this.entries));
    }

    updatePlayer(balance, totalWon, gamesPlayed) {
        // Update or add player
        const existingIndex = this.entries.findIndex(e => e.name === this.playerName);
        
        if (existingIndex >= 0) {
            this.entries[existingIndex] = {
                name: this.playerName,
                balance: balance,
                totalWon: totalWon,
                gamesPlayed: gamesPlayed
            };
        } else {
            this.entries.push({
                name: this.playerName,
                balance: balance,
                totalWon: totalWon,
                gamesPlayed: gamesPlayed
            });
        }
        
        // Sort by balance
        this.entries.sort((a, b) => b.balance - a.balance);
        
        // Keep top 50
        this.entries = this.entries.slice(0, 50);
        
        this.saveLeaderboard();
    }

    getTop10() {
        return this.entries.slice(0, 10);
    }

    getPlayerRank() {
        const index = this.entries.findIndex(e => e.name === this.playerName);
        return index >= 0 ? index + 1 : null;
    }

    getDisplayHTML() {
        const top10 = this.getTop10();
        const playerRank = this.getPlayerRank();
        
        return `
            <div style="background: linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(45, 45, 68, 0.8)); padding: 20px; border-radius: 15px;">
                <h3 style="color: #d4af37; text-align: center; margin-bottom: 20px;">🏆 Top Players 🏆</h3>
                
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${top10.map((entry, index) => {
                        const isPlayer = entry.name === this.playerName;
                        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                        
                        return `
                            <div style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 12px;
                                background: ${isPlayer ? 'rgba(212, 175, 55, 0.2)' : 'rgba(100, 100, 100, 0.1)'};
                                border-radius: 8px;
                                border: 1px solid ${isPlayer ? '#d4af37' : 'transparent'};
                            ">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="font-size: 1.2rem; width: 40px;">${medal}</span>
                                    <div>
                                        <div style="font-weight: bold; color: ${isPlayer ? '#d4af37' : '#ffffff'};">
                                            ${entry.name} ${isPlayer ? '(You)' : ''}
                                        </div>
                                        <div style="font-size: 0.8rem; color: #a0a0b0;">
                                            ${entry.gamesPlayed} games
                                        </div>
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="color: #2ecc71; font-weight: bold;">${entry.balance.toFixed(0)} eGold</div>
                                    <div style="font-size: 0.8rem; color: #a0a0b0;">Won: ${entry.totalWon.toFixed(0)}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                ${playerRank && playerRank > 10 ? `
                    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(212, 175, 55, 0.3); text-align: center; color: #d4af37;">
                        Your Rank: #${playerRank}
                    </div>
                ` : ''}
            </div>
        `;
    }
}

// Add VIP animation styles
const vipStyle = document.createElement('style');
vipStyle.textContent = `
    @keyframes vipPop {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(-180deg);
            opacity: 0;
        }
        70% {
            transform: translate(-50%, -50%) scale(1.1) rotate(10deg);
        }
        100% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
        }
    }
    
    @keyframes vipPopOut {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(vipStyle);

// Global instances
const vipSystem = new VIPSystem();
const leaderboard = new Leaderboard();
