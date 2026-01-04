// Daily Rewards and Bonus System
class DailyRewards {
    constructor() {
        this.lastClaimDate = null;
        this.loginStreak = 0;
        this.loadProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem('dailyRewards');
        if (saved) {
            const data = JSON.parse(saved);
            this.lastClaimDate = data.lastClaimDate;
            this.loginStreak = data.loginStreak || 0;
        }
    }

    saveProgress() {
        localStorage.setItem('dailyRewards', JSON.stringify({
            lastClaimDate: this.lastClaimDate,
            loginStreak: this.loginStreak
        }));
    }

    canClaimDaily() {
        if (!this.lastClaimDate) return true;
        
        const lastClaim = new Date(this.lastClaimDate);
        const now = new Date();
        const hoursSince = (now - lastClaim) / (1000 * 60 * 60);
        
        return hoursSince >= 24;
    }

    claimDailyReward() {
        if (!this.canClaimDaily()) {
            const lastClaim = new Date(this.lastClaimDate);
            const now = new Date();
            const hoursLeft = 24 - Math.floor((now - lastClaim) / (1000 * 60 * 60));
            alert(`Daily reward already claimed! Come back in ${hoursLeft} hours.`);
            return 0;
        }

        // Check if streak continues
        if (this.lastClaimDate) {
            const lastClaim = new Date(this.lastClaimDate);
            const now = new Date();
            const hoursSince = (now - lastClaim) / (1000 * 60 * 60);
            
            if (hoursSince < 48) {
                // Streak continues
                this.loginStreak++;
            } else {
                // Streak broken
                this.loginStreak = 1;
            }
        } else {
            this.loginStreak = 1;
        }

        // Calculate reward based on streak
        let baseReward = 50;
        let streakBonus = Math.min(this.loginStreak * 10, 200); // Max 200 bonus
        let totalReward = baseReward + streakBonus;

        // Bonus rewards for milestones
        if (this.loginStreak === 7) {
            totalReward += 200;
            this.showBonus('🎊 Week Streak Bonus! +200 eGold');
        } else if (this.loginStreak === 30) {
            totalReward += 1000;
            this.showBonus('🎉 Monthly Legend! +1000 eGold');
        }

        this.lastClaimDate = new Date().toISOString();
        this.saveProgress();

        return totalReward;
    }

    showBonus(message) {
        const notification = document.createElement('div');
        notification.className = 'bonus-notification';
        notification.innerHTML = `
            <div style="font-size: 2rem;">🎁</div>
            <div style="font-weight: bold; margin-top: 10px;">${message}</div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
            z-index: 10002;
            text-align: center;
            animation: bonusPop 0.5s ease-out forwards;
        `;
        
        document.body.appendChild(notification);
        effects.createBurst(window.innerWidth / 2, window.innerHeight / 2, '#764ba2', 50);
        
        setTimeout(() => {
            notification.style.animation = 'bonusPopOut 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    getTimeUntilNextClaim() {
        if (!this.lastClaimDate) return "Ready now!";
        
        const lastClaim = new Date(this.lastClaimDate);
        const now = new Date();
        const hoursLeft = 24 - Math.floor((now - lastClaim) / (1000 * 60 * 60));
        
        if (hoursLeft <= 0) return "Ready now!";
        
        return `${hoursLeft} hours`;
    }
}

// Spin Wheel Bonus Game
class SpinWheel {
    constructor() {
        this.prizes = [
            { label: '10 eGold', amount: 10, color: '#e74c3c', chance: 30 },
            { label: '25 eGold', amount: 25, color: '#3498db', chance: 25 },
            { label: '50 eGold', amount: 50, color: '#2ecc71', chance: 20 },
            { label: '100 eGold', amount: 100, color: '#f39c12', chance: 15 },
            { label: '250 eGold', amount: 250, color: '#9b59b6', chance: 7 },
            { label: '500 eGold', amount: 500, color: '#d4af37', chance: 2.5 },
            { label: 'JACKPOT', amount: 1000, color: '#ffd700', chance: 0.5 }
        ];
        this.isSpinning = false;
    }

    spin() {
        if (this.isSpinning) return null;
        
        const spinCost = 50;
        if (currentBalance < spinCost) {
            alert('Need 50 eGold to spin the wheel!');
            return null;
        }

        updateBalance(-spinCost);
        sound.chips(spinCost);
        this.isSpinning = true;

        // Weighted random selection
        const random = Math.random() * 100;
        let cumulative = 0;
        let selectedPrize = this.prizes[0];

        for (let prize of this.prizes) {
            cumulative += prize.chance;
            if (random <= cumulative) {
                selectedPrize = prize;
                break;
            }
        }

        return selectedPrize;
    }

    createWheelHTML() {
        return `
            <div class="spin-wheel-container" style="text-align: center; padding: 20px;">
                <h3 style="color: #d4af37; margin-bottom: 20px;">🎡 Spin the Wheel! 🎡</h3>
                <p style="color: #a0a0b0; margin-bottom: 20px;">Cost: 50 eGold per spin</p>
                
                <div style="position: relative; width: 300px; height: 300px; margin: 50px auto 20px;">
                    <!-- Fixed pointer at top -->
                    <div style="
                        position: absolute;
                        top: -30px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 0;
                        height: 0;
                        border-left: 15px solid transparent;
                        border-right: 15px solid transparent;
                        border-top: 30px solid #ffd700;
                        filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.5));
                        z-index: 20;
                    "></div>
                    
                    <!-- Spinning wheel -->
                    <div class="wheel" id="spinningWheel" style="
                        width: 300px;
                        height: 300px;
                        border-radius: 50%;
                        border: 10px solid #d4af37;
                        position: absolute;
                        top: 0;
                        left: 0;
                        background: conic-gradient(
                            #e74c3c 0deg 51.4deg,
                            #3498db 51.4deg 102.8deg,
                            #2ecc71 102.8deg 154.2deg,
                            #f39c12 154.2deg 205.6deg,
                            #9b59b6 205.6deg 257deg,
                            #d4af37 257deg 308.4deg,
                            #ffd700 308.4deg 360deg
                        );
                        box-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
                    ">
                        <!-- Center hub -->
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 60px;
                            height: 60px;
                            background: #1a1a2e;
                            border-radius: 50%;
                            border: 3px solid #d4af37;
                            z-index: 10;
                        "></div>
                    </div>
                </div>
                
                <button onclick="doSpin()" class="btn-spin" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 15px 40px;
                    font-size: 1.2rem;
                    border-radius: 10px;
                    cursor: pointer;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                ">SPIN (50 eGold)</button>
                
                <div id="spinResult" style="margin-top: 20px; font-size: 1.3rem; min-height: 40px;"></div>
            </div>
        `;
    }
}

// Add CSS animations
const dailyRewardStyle = document.createElement('style');
dailyRewardStyle.textContent = `
    @keyframes bonusPop {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        70% {
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    }
    
    @keyframes bonusPopOut {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
    
    .btn-spin:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
`;
document.head.appendChild(dailyRewardStyle);

// Global instances
const dailyRewards = new DailyRewards();
const spinWheel = new SpinWheel();

// Global spin function
function doSpin() {
    const prize = spinWheel.spin();
    if (!prize) return;
    
    const wheel = document.getElementById('spinningWheel');
    const resultDiv = document.getElementById('spinResult');
    
    // Spin animation - only rotate the wheel, not the pointer
    const randomSpin = 720 + Math.random() * 360;
    wheel.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    wheel.style.transform = `rotate(${randomSpin}deg)`;
    
    sound.play('deal');
    
    setTimeout(() => {
        updateBalance(prize.amount);
        
        resultDiv.innerHTML = `<span style="color: ${prize.color}; font-weight: bold; text-shadow: 0 0 10px ${prize.color};">
            🎉 You won ${prize.label}! 🎉
        </span>`;
        
        if (prize.amount >= 500) {
            sound.jackpotSound();
            effects.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 150);
            effects.coinRain();
        } else if (prize.amount >= 100) {
            sound.winSound(prize.amount);
            effects.createBurst(window.innerWidth / 2, window.innerHeight / 2, prize.color, 40);
        } else {
            sound.play('win', prize.amount / 100);
            effects.createBurst(window.innerWidth / 2, window.innerHeight / 2, prize.color, 20);
        }
        
        effects.floatingText(window.innerWidth / 2, window.innerHeight / 2, `+${prize.amount} eGold`, prize.color, '2rem');
        
        checkAchievements('firstWin', prize.amount);
        
        spinWheel.isSpinning = false;
        
        // Reset rotation for next spin
        setTimeout(() => {
            wheel.style.transition = 'none';
            wheel.style.transform = 'rotate(0deg)';
        }, 500);
    }, 3000);
}
