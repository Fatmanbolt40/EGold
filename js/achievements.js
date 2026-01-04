// Achievements and Leaderboard System
const achievementSystem = {
    achievements: [
        // Beginner Achievements
        { id: 'first_bet', name: 'First Bet', desc: 'Place your first bet', icon: '🎲', reward: 10, unlocked: false, category: 'beginner' },
        { id: 'first_win', name: 'First Win', desc: 'Win your first game', icon: '🎉', reward: 25, unlocked: false, category: 'beginner' },
        { id: 'chat_master', name: 'Social Butterfly', desc: 'Send 10 chat messages', icon: '💬', reward: 50, unlocked: false, category: 'social' },
        { id: 'daily_player', name: 'Daily Player', desc: 'Claim daily reward 3 times', icon: '📅', reward: 100, unlocked: false, category: 'daily' },
        
        // Wagering Achievements
        { id: 'wager_1k', name: 'High Roller', desc: 'Wager 1,000 eGold total', icon: '💰', reward: 50, unlocked: false, category: 'wagering' },
        { id: 'wager_10k', name: 'Whale', desc: 'Wager 10,000 eGold total', icon: '🐋', reward: 200, unlocked: false, category: 'wagering' },
        { id: 'wager_100k', name: 'Casino Legend', desc: 'Wager 100,000 eGold total', icon: '👑', reward: 1000, unlocked: false, category: 'wagering' },
        
        // Winning Achievements
        { id: 'win_100', name: 'Lucky Streak', desc: 'Win 100 eGold in one game', icon: '🍀', reward: 50, unlocked: false, category: 'winning' },
        { id: 'win_500', name: 'Big Winner', desc: 'Win 500 eGold in one game', icon: '💎', reward: 100, unlocked: false, category: 'winning' },
        { id: 'win_1000', name: 'Jackpot King', desc: 'Win 1,000+ eGold in one game', icon: '🎰', reward: 500, unlocked: false, category: 'winning' },
        
        // Game Specific
        { id: 'slots_master', name: 'Slot Savant', desc: 'Play slots 50 times', icon: '🎰', reward: 100, unlocked: false, category: 'games' },
        { id: 'poker_pro', name: 'Poker Professional', desc: 'Play poker 25 times', icon: '🃏', reward: 150, unlocked: false, category: 'games' },
        { id: 'roulette_regular', name: 'Roulette Regular', desc: 'Spin the wheel 30 times', icon: '🎡', reward: 75, unlocked: false, category: 'games' },
        
        // VIP Achievements
        { id: 'vip_silver', name: 'Silver Member', desc: 'Reach VIP Silver', icon: '🥈', reward: 100, unlocked: false, category: 'vip' },
        { id: 'vip_gold', name: 'Gold Member', desc: 'Reach VIP Gold', icon: '🥇', reward: 250, unlocked: false, category: 'vip' },
        { id: 'vip_diamond', name: 'Diamond Member', desc: 'Reach VIP Diamond', icon: '💠', reward: 1000, unlocked: false, category: 'vip' },
        
        // Special
        { id: 'streak_7', name: 'Dedicated Player', desc: 'Complete 7-day streak', icon: '🔥', reward: 500, unlocked: false, category: 'special' },
        { id: 'all_games', name: 'Game Explorer', desc: 'Play all 13 games', icon: '🌟', reward: 300, unlocked: false, category: 'special' }
    ],
    
    stats: {
        totalBets: parseInt(localStorage.getItem('stats_totalBets')) || 0,
        totalWins: parseInt(localStorage.getItem('stats_totalWins')) || 0,
        totalLosses: parseInt(localStorage.getItem('stats_totalLosses')) || 0,
        biggestWin: parseFloat(localStorage.getItem('stats_biggestWin')) || 0,
        gamesPlayed: JSON.parse(localStorage.getItem('stats_gamesPlayed')) || {},
        chatMessages: parseInt(localStorage.getItem('stats_chatMessages')) || 0,
        dailyClaims: parseInt(localStorage.getItem('stats_dailyClaims')) || 0
    },
    
    init() {
        this.loadAchievements();
        this.addAchievementsButton();
    },
    
    loadAchievements() {
        const saved = localStorage.getItem('achievements');
        if (saved) {
            const unlocked = JSON.parse(saved);
            this.achievements.forEach(ach => {
                if (unlocked.includes(ach.id)) {
                    ach.unlocked = true;
                }
            });
        }
    },
    
    saveAchievements() {
        const unlocked = this.achievements.filter(a => a.unlocked).map(a => a.id);
        localStorage.setItem('achievements', JSON.stringify(unlocked));
    },
    
    addAchievementsButton() {
        const header = document.querySelector('.header-content > div');
        if (header && !document.getElementById('achievementsBtn')) {
            const button = document.createElement('button');
            button.id = 'achievementsBtn';
            button.className = 'category-btn';
            button.style.cssText = 'padding: 8px 16px; font-size: 0.9em;';
            button.innerHTML = '🏆 Achievements';
            button.onclick = () => this.showPanel();
            
            const liveGamesBtn = header.querySelector('button');
            if (liveGamesBtn) {
                header.insertBefore(button, liveGamesBtn);
            }
        }
    },
    
    trackBet(amount, gameName) {
        this.stats.totalBets++;
        localStorage.setItem('stats_totalBets', this.stats.totalBets.toString());
        
        // Track game played
        if (!this.stats.gamesPlayed[gameName]) {
            this.stats.gamesPlayed[gameName] = 0;
        }
        this.stats.gamesPlayed[gameName]++;
        localStorage.setItem('stats_gamesPlayed', JSON.stringify(this.stats.gamesPlayed));
        
        this.checkAchievement('first_bet');
        this.checkGameAchievements(gameName);
        this.checkAllGamesAchievement();
    },
    
    trackWin(amount) {
        this.stats.totalWins++;
        localStorage.setItem('stats_totalWins', this.stats.totalWins.toString());
        
        if (amount > this.stats.biggestWin) {
            this.stats.biggestWin = amount;
            localStorage.setItem('stats_biggestWin', amount.toString());
        }
        
        this.checkAchievement('first_win');
        if (amount >= 100) this.checkAchievement('win_100');
        if (amount >= 500) this.checkAchievement('win_500');
        if (amount >= 1000) this.checkAchievement('win_1000');
    },
    
    trackLoss() {
        this.stats.totalLosses++;
        localStorage.setItem('stats_totalLosses', this.stats.totalLosses.toString());
    },
    
    trackChatMessage() {
        this.stats.chatMessages++;
        localStorage.setItem('stats_chatMessages', this.stats.chatMessages.toString());
        if (this.stats.chatMessages >= 10) {
            this.checkAchievement('chat_master');
        }
    },
    
    trackDailyClaim() {
        this.stats.dailyClaims++;
        localStorage.setItem('stats_dailyClaims', this.stats.dailyClaims.toString());
        if (this.stats.dailyClaims >= 3) {
            this.checkAchievement('daily_player');
        }
    },
    
    checkGameAchievements(gameName) {
        const count = this.stats.gamesPlayed[gameName] || 0;
        
        if (gameName.toLowerCase().includes('slot') && count >= 50) {
            this.checkAchievement('slots_master');
        }
        if ((gameName.toLowerCase().includes('hold') || gameName.toLowerCase().includes('omaha') || gameName.toLowerCase().includes('pineapple')) && count >= 25) {
            this.checkAchievement('poker_pro');
        }
        if (gameName.toLowerCase().includes('roulette') && count >= 30) {
            this.checkAchievement('roulette_regular');
        }
    },
    
    checkAllGamesAchievement() {
        const uniqueGames = Object.keys(this.stats.gamesPlayed).length;
        if (uniqueGames >= 13) {
            this.checkAchievement('all_games');
        }
    },
    
    checkVIPAchievement(level) {
        if (level >= 2) this.checkAchievement('vip_silver');
        if (level >= 3) this.checkAchievement('vip_gold');
        if (level >= 5) this.checkAchievement('vip_diamond');
    },
    
    checkStreakAchievement(streak) {
        if (streak >= 7) this.checkAchievement('streak_7');
    },
    
    checkAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) return;
        
        // Check if requirements are met based on achievement type
        let unlocked = false;
        
        switch(achievementId) {
            case 'first_bet':
                unlocked = this.stats.totalBets >= 1;
                break;
            case 'first_win':
                unlocked = this.stats.totalWins >= 1;
                break;
            case 'wager_1k':
                unlocked = (typeof vipSystem !== 'undefined' && vipSystem.totalWagered >= 1000);
                break;
            case 'wager_10k':
                unlocked = (typeof vipSystem !== 'undefined' && vipSystem.totalWagered >= 10000);
                break;
            case 'wager_100k':
                unlocked = (typeof vipSystem !== 'undefined' && vipSystem.totalWagered >= 100000);
                break;
            default:
                unlocked = true; // For achievements checked with specific conditions
        }
        
        if (unlocked) {
            this.unlockAchievement(achievement);
        }
    },
    
    unlockAchievement(achievement) {
        achievement.unlocked = true;
        this.saveAchievements();
        
        soundManager.playWin();
        particleManager.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 50);
        
        // Update balance with reward
        if (typeof updateBalance !== 'undefined') {
            updateBalance(achievement.reward);
        }
        
        // Show notification
        this.showUnlockNotification(achievement);
    },
    
    showUnlockNotification(achievement) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #FFB800, #FFA500);
            color: #1A2332;
            padding: 20px 30px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(255, 184, 0, 0.6);
            z-index: 10001;
            animation: slideInFromRight 0.5s ease;
            border: 3px solid white;
            max-width: 350px;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 3em; text-align: center; margin-bottom: 10px;">${achievement.icon}</div>
            <div style="font-size: 1.3em; font-weight: bold; text-align: center; margin-bottom: 5px;">🏆 Achievement Unlocked!</div>
            <div style="font-size: 1.5em; font-weight: bold; text-align: center; margin-bottom: 5px;">${achievement.name}</div>
            <div style="text-align: center; margin-bottom: 10px;">${achievement.desc}</div>
            <div style="text-align: center; font-size: 1.2em; font-weight: bold; color: #2ecc71;">+${achievement.reward} eGold</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    },
    
    showPanel() {
        soundManager.playButtonClick();
        
        const categories = {
            beginner: { name: 'Beginner', icon: '🎯', color: '#2ecc71' },
            wagering: { name: 'Wagering', icon: '💰', color: '#FFB800' },
            winning: { name: 'Winning', icon: '🎉', color: '#e74c3c' },
            games: { name: 'Game Master', icon: '🎮', color: '#3498db' },
            vip: { name: 'VIP', icon: '👑', color: '#9b59b6' },
            social: { name: 'Social', icon: '💬', color: '#1abc9c' },
            daily: { name: 'Daily', icon: '📅', color: '#f39c12' },
            special: { name: 'Special', icon: '⭐', color: '#e67e22' }
        };
        
        const totalAchievements = this.achievements.length;
        const unlockedAchievements = this.achievements.filter(a => a.unlocked).length;
        const completionPercent = ((unlockedAchievements / totalAchievements) * 100).toFixed(1);
        
        const modal = document.createElement('div');
        modal.id = 'achievementsModal';
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
            <div style="background: linear-gradient(135deg, #2A3544 0%, #1A2332 100%); border-radius: 20px; padding: 40px; max-width: 1000px; width: 90%; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 3px solid #FFB800;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <div>
                        <h2 style="color: #FFB800; font-size: 2.5em; margin: 0;">🏆 Achievements</h2>
                        <p style="color: #cccccc; margin: 5px 0 0 0;">Unlock rewards and track your progress!</p>
                    </div>
                    <button onclick="achievementSystem.closePanel()" style="background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c; color: #e74c3c; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 1.1em; font-weight: bold;">✕</button>
                </div>
                
                <div style="margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, rgba(255, 184, 0, 0.2), rgba(212, 175, 55, 0.2)); border-radius: 15px; border: 2px solid #FFB800;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div>
                            <div style="font-size: 0.9em; color: #999; margin-bottom: 5px;">Completion</div>
                            <div style="font-size: 2em; color: #FFB800; font-weight: bold;">${completionPercent}%</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 0.9em; color: #999; margin-bottom: 5px;">Progress</div>
                            <div style="font-size: 2em; color: #2ecc71; font-weight: bold;">${unlockedAchievements}/${totalAchievements}</div>
                        </div>
                    </div>
                    <div style="background: rgba(0, 0, 0, 0.3); border-radius: 10px; overflow: hidden; height: 25px;">
                        <div style="height: 100%; background: linear-gradient(90deg, #2ecc71, #FFB800); width: ${completionPercent}%; transition: width 0.5s ease;"></div>
                    </div>
                </div>
                
                ${Object.keys(categories).map(catKey => {
                    const cat = categories[catKey];
                    const catAchievements = this.achievements.filter(a => a.category === catKey);
                    const catUnlocked = catAchievements.filter(a => a.unlocked).length;
                    
                    return `
                        <div style="margin-bottom: 30px;">
                            <h3 style="color: ${cat.color}; font-size: 1.5em; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                                <span style="font-size: 1.3em;">${cat.icon}</span>
                                ${cat.name}
                                <span style="font-size: 0.8em; color: #999;">(${catUnlocked}/${catAchievements.length})</span>
                            </h3>
                            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;">
                                ${catAchievements.map(ach => `
                                    <div style="padding: 20px; background: ${ach.unlocked ? `linear-gradient(135deg, ${cat.color}33, ${cat.color}22)` : 'rgba(255, 255, 255, 0.03)'}; border: 2px solid ${ach.unlocked ? cat.color : '#333'}; border-radius: 12px; opacity: ${ach.unlocked ? '1' : '0.6'}; transition: all 0.3s ease; position: relative;" ${!ach.unlocked ? 'style="filter: grayscale(0.5);"' : ''}>
                                        ${ach.unlocked ? '<div style="position: absolute; top: 10px; right: 10px; color: #2ecc71; font-size: 1.5em;">✓</div>' : ''}
                                        <div style="font-size: 3em; text-align: center; margin-bottom: 10px;">${ach.icon}</div>
                                        <div style="text-align: center; color: ${ach.unlocked ? cat.color : '#999'}; font-size: 1.2em; font-weight: bold; margin-bottom: 5px;">${ach.name}</div>
                                        <div style="text-align: center; color: #cccccc; font-size: 0.9em; margin-bottom: 10px;">${ach.desc}</div>
                                        <div style="text-align: center; padding: 8px; background: rgba(46, 204, 113, 0.2); border-radius: 8px; color: #2ecc71; font-weight: bold;">
                                            ${ach.unlocked ? '✓ Claimed' : `🎁 ${ach.reward} eGold`}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
                
                <div style="margin-top: 30px; padding: 25px; background: rgba(123, 104, 238, 0.1); border-radius: 15px; border: 2px solid #7B68EE;">
                    <h3 style="color: #7B68EE; margin-bottom: 20px; font-size: 1.5em;">📊 Your Stats</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div style="text-align: center; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px;">
                            <div style="color: #999; font-size: 0.9em;">Total Bets</div>
                            <div style="color: #FFB800; font-size: 2em; font-weight: bold;">${this.stats.totalBets}</div>
                        </div>
                        <div style="text-align: center; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px;">
                            <div style="color: #999; font-size: 0.9em;">Total Wins</div>
                            <div style="color: #2ecc71; font-size: 2em; font-weight: bold;">${this.stats.totalWins}</div>
                        </div>
                        <div style="text-align: center; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px;">
                            <div style="color: #999; font-size: 0.9em;">Biggest Win</div>
                            <div style="color: #e67e22; font-size: 2em; font-weight: bold;">${this.stats.biggestWin.toFixed(0)}</div>
                        </div>
                        <div style="text-align: center; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 10px;">
                            <div style="color: #999; font-size: 0.9em;">Games Played</div>
                            <div style="color: #3498db; font-size: 2em; font-weight: bold;">${Object.keys(this.stats.gamesPlayed).length}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    closePanel() {
        soundManager.playButtonClick();
        const modal = document.getElementById('achievementsModal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    }
};

// Initialize
if (typeof window !== 'undefined') {
    window.achievementSystem = achievementSystem;
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => achievementSystem.init(), 1000);
    });
}
