// VIP System with Levels and Perks
const vipSystem = {
    xp: parseInt(localStorage.getItem('vipXP')) || 0,
    level: parseInt(localStorage.getItem('vipLevel')) || 1,
    totalWagered: parseFloat(localStorage.getItem('totalWagered')) || 0,
    
    levels: [
        { level: 1, name: 'Bronze', xpRequired: 0, rakeback: 0, color: '#CD7F32', icon: '🥉', dailyBonus: 0 },
        { level: 2, name: 'Silver', xpRequired: 1000, rakeback: 0.5, color: '#C0C0C0', icon: '🥈', dailyBonus: 10 },
        { level: 3, name: 'Gold', xpRequired: 5000, rakeback: 1, color: '#FFD700', icon: '🥇', dailyBonus: 25 },
        { level: 4, name: 'Platinum', xpRequired: 15000, rakeback: 1.5, color: '#E5E4E2', icon: '💎', dailyBonus: 50 },
        { level: 5, name: 'Diamond', xpRequired: 50000, rakeback: 2, color: '#B9F2FF', icon: '💠', dailyBonus: 100 },
        { level: 6, name: 'Royal', xpRequired: 150000, rakeback: 3, color: '#9B59B6', icon: '👑', dailyBonus: 250 }
    ],
    
    init() {
        this.updateLevel();
        this.addVIPButton();
    },
    
    addVIPButton() {
        // Add VIP button to header if not exists
        const header = document.querySelector('.header-content');
        if (header && !document.getElementById('vipButton')) {
            const currentLevel = this.getCurrentLevel();
            const button = document.createElement('button');
            button.id = 'vipButton';
            button.className = 'category-btn';
            button.style.cssText = `padding: 8px 16px; font-size: 0.9em; background: linear-gradient(135deg, ${currentLevel.color}, ${currentLevel.color}dd); border: 2px solid ${currentLevel.color};`;
            button.innerHTML = `${currentLevel.icon} VIP ${currentLevel.level}`;
            button.onclick = () => this.showVIPPanel();
            
            // Insert before sound button
            const soundBtn = document.getElementById('soundBtn');
            if (soundBtn && soundBtn.parentElement) {
                soundBtn.parentElement.insertBefore(button, soundBtn);
            }
        }
    },
    
    getCurrentLevel() {
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (this.xp >= this.levels[i].xpRequired) {
                return this.levels[i];
            }
        }
        return this.levels[0];
    },
    
    getNextLevel() {
        const currentLevel = this.getCurrentLevel();
        const currentIndex = this.levels.findIndex(l => l.level === currentLevel.level);
        return this.levels[currentIndex + 1] || null;
    },
    
    addXP(amount) {
        this.xp += amount;
        localStorage.setItem('vipXP', this.xp.toString());
        
        const oldLevel = this.level;
        this.updateLevel();
        
        // Check for level up
        if (this.level > oldLevel) {
            this.showLevelUpNotification();
        }
        
        this.updateVIPButton();
    },
    
    updateLevel() {
        const currentLevel = this.getCurrentLevel();
        if (currentLevel.level !== this.level) {
            this.level = currentLevel.level;
            localStorage.setItem('vipLevel', this.level.toString());
        }
    },
    
    updateVIPButton() {
        const button = document.getElementById('vipButton');
        if (button) {
            const currentLevel = this.getCurrentLevel();
            button.style.background = `linear-gradient(135deg, ${currentLevel.color}, ${currentLevel.color}dd)`;
            button.style.borderColor = currentLevel.color;
            button.innerHTML = `${currentLevel.icon} VIP ${currentLevel.level}`;
        }
    },
    
    trackWager(amount) {
        this.totalWagered += amount;
        localStorage.setItem('totalWagered', this.totalWagered.toString());
        
        // Award XP (1 XP per 10 eGold wagered)
        const xpGained = Math.floor(amount / 10);
        if (xpGained > 0) {
            this.addXP(xpGained);
        }
    },
    
    getRakebackAmount(betAmount) {
        const currentLevel = this.getCurrentLevel();
        return (betAmount * currentLevel.rakeback) / 100;
    },
    
    applyRakeback(betAmount) {
        const rakeback = this.getRakebackAmount(betAmount);
        if (rakeback > 0) {
            updateBalance(rakeback);
            return rakeback;
        }
        return 0;
    },
    
    showLevelUpNotification() {
        const currentLevel = this.getCurrentLevel();
        
        soundManager.playJackpot();
        particleManager.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, ${currentLevel.color}, ${currentLevel.color}dd);
            color: white;
            padding: 40px 60px;
            border-radius: 20px;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
            z-index: 10001;
            text-align: center;
            animation: bounceIn 0.5s ease;
            border: 3px solid white;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 5em; margin-bottom: 20px;">${currentLevel.icon}</div>
            <h2 style="font-size: 2.5em; margin: 0 0 15px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">LEVEL UP!</h2>
            <div style="font-size: 2em; font-weight: bold; margin-bottom: 10px;">VIP ${currentLevel.level} - ${currentLevel.name}</div>
            <div style="font-size: 1.2em; margin-top: 15px;">
                ${currentLevel.rakeback}% Rakeback Unlocked!
            </div>
            ${currentLevel.dailyBonus > 0 ? `
                <div style="font-size: 1.2em; margin-top: 10px;">
                    +${currentLevel.dailyBonus} Daily Bonus!
                </div>
            ` : ''}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    },
    
    showVIPPanel() {
        soundManager.playButtonClick();
        
        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.getNextLevel();
        const progress = nextLevel ? 
            ((this.xp - currentLevel.xpRequired) / (nextLevel.xpRequired - currentLevel.xpRequired)) * 100 : 100;
        
        const modal = document.createElement('div');
        modal.id = 'vipModal';
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
            <div style="background: linear-gradient(135deg, #2A3544 0%, #1A2332 100%); border-radius: 20px; padding: 40px; max-width: 900px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 3px solid ${currentLevel.color};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <div>
                        <h2 style="color: ${currentLevel.color}; font-size: 2.5em; margin: 0;">${currentLevel.icon} VIP System</h2>
                        <p style="color: #cccccc; margin: 5px 0 0 0; font-size: 1.1em;">Level ${currentLevel.level} - ${currentLevel.name}</p>
                    </div>
                    <button onclick="vipSystem.closePanel()" style="background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c; color: #e74c3c; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 1.1em; font-weight: bold;">✕</button>
                </div>
                
                <div style="margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, ${currentLevel.color}22, ${currentLevel.color}11); border-radius: 15px; border: 2px solid ${currentLevel.color};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div style="color: #cccccc;">
                            <div style="font-size: 0.9em; margin-bottom: 5px;">Current XP</div>
                            <div style="font-size: 1.8em; color: ${currentLevel.color}; font-weight: bold;">${this.xp.toLocaleString()}</div>
                        </div>
                        ${nextLevel ? `
                            <div style="color: #cccccc; text-align: right;">
                                <div style="font-size: 0.9em; margin-bottom: 5px;">Next Level</div>
                                <div style="font-size: 1.8em; color: ${nextLevel.color}; font-weight: bold;">${nextLevel.xpRequired.toLocaleString()}</div>
                            </div>
                        ` : `
                            <div style="color: #2ecc71; text-align: right;">
                                <div style="font-size: 1.5em; font-weight: bold;">MAX LEVEL!</div>
                            </div>
                        `}
                    </div>
                    
                    ${nextLevel ? `
                        <div style="background: rgba(0, 0, 0, 0.3); border-radius: 10px; overflow: hidden; height: 25px; margin-bottom: 10px;">
                            <div style="height: 100%; background: linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color}); width: ${progress}%; transition: width 0.5s ease; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.9em;">
                                ${progress.toFixed(1)}%
                            </div>
                        </div>
                        <div style="color: #999; text-align: center; font-size: 0.9em;">
                            ${(nextLevel.xpRequired - this.xp).toLocaleString()} XP to ${nextLevel.name}
                        </div>
                    ` : ''}
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #FFB800; margin-bottom: 15px; font-size: 1.5em;">🎁 Your Current Perks</h3>
                    <div style="display: grid; gap: 15px;">
                        <div style="padding: 15px; background: rgba(46, 204, 113, 0.1); border-left: 4px solid #2ecc71; border-radius: 8px;">
                            <div style="color: #2ecc71; font-weight: bold; margin-bottom: 5px;">💰 Rakeback</div>
                            <div style="color: #cccccc; font-size: 1.2em;">${currentLevel.rakeback}% on all bets</div>
                        </div>
                        ${currentLevel.dailyBonus > 0 ? `
                            <div style="padding: 15px; background: rgba(255, 184, 0, 0.1); border-left: 4px solid #FFB800; border-radius: 8px;">
                                <div style="color: #FFB800; font-weight: bold; margin-bottom: 5px;">🎁 Daily Bonus</div>
                                <div style="color: #cccccc; font-size: 1.2em;">+${currentLevel.dailyBonus} eGold extra per day</div>
                            </div>
                        ` : ''}
                        <div style="padding: 15px; background: rgba(123, 104, 238, 0.1); border-left: 4px solid #7B68EE; border-radius: 8px;">
                            <div style="color: #7B68EE; font-weight: bold; margin-bottom: 5px;">⭐ XP Gain</div>
                            <div style="color: #cccccc; font-size: 1.2em;">1 XP per 10 eGold wagered</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #FFB800; margin-bottom: 15px; font-size: 1.5em;">📊 Your Stats</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                        <div style="padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; text-align: center;">
                            <div style="color: #999; font-size: 0.9em; margin-bottom: 5px;">Total Wagered</div>
                            <div style="color: #FFB800; font-size: 1.8em; font-weight: bold;">${this.totalWagered.toLocaleString()}</div>
                            <div style="color: #2ecc71; font-size: 0.9em;">≈ $${(this.totalWagered * 0.10).toFixed(2)}</div>
                        </div>
                        <div style="padding: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; text-align: center;">
                            <div style="color: #999; font-size: 0.9em; margin-bottom: 5px;">Rakeback Earned</div>
                            <div style="color: #2ecc71; font-size: 1.8em; font-weight: bold;">${((this.totalWagered * currentLevel.rakeback) / 100).toFixed(0)}</div>
                            <div style="color: #999; font-size: 0.9em;">eGold</div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 style="color: #FFB800; margin-bottom: 15px; font-size: 1.5em;">🏆 All VIP Levels</h3>
                    <div style="display: grid; gap: 10px;">
                        ${this.levels.map(level => {
                            const isUnlocked = this.xp >= level.xpRequired;
                            const isCurrent = level.level === currentLevel.level;
                            
                            return `
                                <div style="padding: 20px; background: ${isCurrent ? `linear-gradient(135deg, ${level.color}33, ${level.color}22)` : 'rgba(255, 255, 255, 0.03)'}; border: 2px solid ${isCurrent ? level.color : '#333'}; border-radius: 12px; opacity: ${isUnlocked ? '1' : '0.5'}; display: flex; justify-content: space-between; align-items: center;">
                                    <div style="display: flex; align-items: center; gap: 15px;">
                                        <div style="font-size: 2.5em;">${level.icon}</div>
                                        <div>
                                            <div style="color: ${level.color}; font-size: 1.3em; font-weight: bold;">${level.name} ${isCurrent ? '(Current)' : ''}</div>
                                            <div style="color: #999; font-size: 0.9em;">${level.xpRequired.toLocaleString()} XP Required</div>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="color: #2ecc71; font-size: 1.2em; font-weight: bold;">${level.rakeback}% Rakeback</div>
                                        ${level.dailyBonus > 0 ? `<div style="color: #FFB800; font-size: 0.9em;">+${level.dailyBonus} Daily</div>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    closePanel() {
        soundManager.playButtonClick();
        const modal = document.getElementById('vipModal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    }
};

// Initialize on page load
if (typeof window !== 'undefined') {
    window.vipSystem = vipSystem;
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => vipSystem.init(), 500);
    });
}
