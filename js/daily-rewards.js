// Daily Rewards System
const dailyRewards = {
    lastClaim: localStorage.getItem('lastDailyClaim') || null,
    streak: parseInt(localStorage.getItem('dailyStreak')) || 0,
    totalClaimed: parseInt(localStorage.getItem('totalDailyRewards')) || 0,
    
    rewards: [
        { day: 1, amount: 50, icon: '🎁' },
        { day: 2, amount: 75, icon: '💎' },
        { day: 3, amount: 100, icon: '⭐' },
        { day: 4, amount: 150, icon: '🌟' },
        { day: 5, amount: 200, icon: '👑' },
        { day: 6, amount: 300, icon: '💰' },
        { day: 7, amount: 500, icon: '🎰', bonus: true }
    ],
    
    init() {
        // Check on page load
        this.checkDailyReward();
    },
    
    canClaim() {
        if (!this.lastClaim) return true;
        
        const now = new Date();
        const lastClaimDate = new Date(this.lastClaim);
        const hoursSince = (now - lastClaimDate) / (1000 * 60 * 60);
        
        return hoursSince >= 24;
    },
    
    checkStreak() {
        if (!this.lastClaim) return;
        
        const now = new Date();
        const lastClaimDate = new Date(this.lastClaim);
        const hoursSince = (now - lastClaimDate) / (1000 * 60 * 60);
        
        // If more than 48 hours, reset streak
        if (hoursSince > 48) {
            this.streak = 0;
            localStorage.setItem('dailyStreak', '0');
        }
    },
    
    checkDailyReward() {
        this.checkStreak();
        
        if (this.canClaim()) {
            // Show notification badge
            setTimeout(() => {
                this.showNotification();
            }, 2000);
        }
    },
    
    showNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #FFB800 0%, #FFA500 100%);
            color: #1A2332;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(255, 184, 0, 0.5);
            z-index: 9999;
            cursor: pointer;
            font-weight: bold;
            font-size: 1.1em;
            animation: bounceIn 0.5s ease;
        `;
        notification.innerHTML = `🎁 Daily Reward Available! Click to claim!`;
        notification.onclick = () => {
            this.showRewardModal();
            notification.remove();
        };
        
        document.body.appendChild(notification);
        
        // Remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'fadeOut 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }
        }, 10000);
    },
    
    showRewardModal() {
        soundManager.playButtonClick();
        
        const currentDay = (this.streak % 7) + 1;
        const todayReward = this.rewards[currentDay - 1];
        const canClaim = this.canClaim();
        
        const modal = document.createElement('div');
        modal.id = 'dailyRewardModal';
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
            <div style="background: linear-gradient(135deg, #2A3544 0%, #1A2332 100%); border-radius: 20px; padding: 40px; max-width: 700px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.5); border: 3px solid #FFB800;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 style="color: #FFB800; font-size: 2.2em; margin: 0;">🎁 Daily Rewards</h2>
                    <button onclick="dailyRewards.closeModal()" style="background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c; color: #e74c3c; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 1.1em; font-weight: bold;">✕</button>
                </div>
                
                ${canClaim ? `
                    <div style="text-align: center; margin-bottom: 30px; padding: 30px; background: linear-gradient(135deg, rgba(255, 184, 0, 0.2), rgba(212, 175, 55, 0.2)); border-radius: 15px; border: 2px solid #FFB800;">
                        <div style="font-size: 5em; margin-bottom: 15px; animation: pulse 2s ease-in-out infinite;">${todayReward.icon}</div>
                        <h3 style="color: #FFB800; font-size: 2em; margin-bottom: 10px;">Day ${currentDay} Reward</h3>
                        <div style="font-size: 2.5em; color: #2ecc71; font-weight: bold; margin: 15px 0;">
                            ${todayReward.amount} eGold
                        </div>
                        <div style="color: #cccccc; font-size: 1.1em;">
                            ≈ $${(todayReward.amount * 0.10).toFixed(2)} USD
                        </div>
                        ${todayReward.bonus ? `
                            <div style="margin-top: 15px; padding: 10px 20px; background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71; border-radius: 8px; color: #2ecc71; font-weight: bold; font-size: 1.2em;">
                                🎉 WEEKLY BONUS! 🎉
                            </div>
                        ` : ''}
                    </div>
                    
                    <button onclick="dailyRewards.claimReward()" style="width: 100%; padding: 20px; font-size: 1.5em; background: linear-gradient(135deg, #FFB800 0%, #FFA500 100%); border: none; border-radius: 12px; color: #1A2332; font-weight: bold; cursor: pointer; margin-bottom: 20px; transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 10px 30px rgba(255, 184, 0, 0.5)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        🎁 Claim Reward
                    </button>
                ` : `
                    <div style="text-align: center; padding: 40px 20px; color: #cccccc;">
                        <div style="font-size: 4em; margin-bottom: 20px; opacity: 0.5;">⏰</div>
                        <h3 style="color: #e74c3c; font-size: 1.5em; margin-bottom: 15px;">Already Claimed Today</h3>
                        <p style="font-size: 1.1em;">Come back tomorrow for your next reward!</p>
                        <div style="margin-top: 20px; padding: 15px; background: rgba(255, 184, 0, 0.1); border-radius: 10px;">
                            <p style="color: #FFB800; font-size: 1.2em; margin: 0;">Next Reward: ${this.rewards[(currentDay % 7)].amount} eGold ${this.rewards[(currentDay % 7)].icon}</p>
                        </div>
                    </div>
                `}
                
                <div style="margin-top: 20px;">
                    <h3 style="color: #FFB800; margin-bottom: 15px; font-size: 1.3em;">📅 7-Day Streak Calendar</h3>
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;">
                        ${this.rewards.map((reward, index) => {
                            const dayNum = index + 1;
                            const isClaimed = dayNum <= this.streak;
                            const isToday = dayNum === currentDay && canClaim;
                            
                            return `
                                <div style="padding: 15px; background: ${isToday ? 'rgba(255, 184, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)'}; border: 2px solid ${isToday ? '#FFB800' : isClaimed ? '#2ecc71' : '#666'}; border-radius: 10px; text-align: center; transition: all 0.3s ease;" ${isToday ? 'class="animate-pulse"' : ''}>
                                    <div style="font-size: 2em; margin-bottom: 5px; ${isClaimed ? '' : 'opacity: 0.3;'}">${reward.icon}</div>
                                    <div style="color: ${isClaimed ? '#2ecc71' : '#999'}; font-size: 0.9em; margin-bottom: 5px;">Day ${dayNum}</div>
                                    <div style="color: ${isToday ? '#FFB800' : isClaimed ? '#2ecc71' : '#ccc'}; font-weight: bold;">${reward.amount}</div>
                                    ${isClaimed ? '<div style="color: #2ecc71; font-size: 1.2em; margin-top: 5px;">✓</div>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div style="margin-top: 25px; padding: 20px; background: rgba(123, 104, 238, 0.1); border-radius: 10px; border: 2px solid #7B68EE;">
                    <h4 style="color: #7B68EE; margin-bottom: 10px;">📊 Your Stats</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; color: #cccccc;">
                        <div>
                            <div style="color: #999; font-size: 0.9em;">Current Streak</div>
                            <div style="color: #FFB800; font-size: 1.5em; font-weight: bold;">${this.streak} days</div>
                        </div>
                        <div>
                            <div style="color: #999; font-size: 0.9em;">Total Claimed</div>
                            <div style="color: #2ecc71; font-size: 1.5em; font-weight: bold;">${this.totalClaimed} eGold</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },
    
    claimReward() {
        const currentDay = (this.streak % 7) + 1;
        const reward = this.rewards[currentDay - 1];
        
        soundManager.playWin();
        
        // Update balance
        updateBalance(reward.amount);
        
        // Update streak
        this.streak = currentDay;
        this.totalClaimed += reward.amount;
        this.lastClaim = new Date().toISOString();
        
        // Save to localStorage
        localStorage.setItem('dailyStreak', this.streak.toString());
        localStorage.setItem('totalDailyRewards', this.totalClaimed.toString());
        localStorage.setItem('lastDailyClaim', this.lastClaim);
        
        // Show success animation
        particleManager.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 50);
        
        // Close and reopen to show updated state
        this.closeModal();
        setTimeout(() => this.showRewardModal(), 500);
    },
    
    closeModal() {
        soundManager.playButtonClick();
        const modal = document.getElementById('dailyRewardModal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    }
};

// Initialize on page load
if (typeof window !== 'undefined') {
    window.dailyRewards = dailyRewards;
    document.addEventListener('DOMContentLoaded', () => {
        dailyRewards.init();
    });
}
