// Main application controller
let currentBalance = 1000.00;
let currentGame = null;
let progressiveJackpot = 5000.00;
let achievements = {
    firstWin: false,
    bigWin: false,
    luckyStreak: false,
    highRoller: false,
    pokerPro: false,
    lotteryLuck: false
};
let stats = {
    totalGamesPlayed: 0,
    totalWon: 0,
    totalLost: 0,
    biggestWin: 0,
    winStreak: 0,
    currentStreak: 0
};

// Update balance display
function updateBalance(amount) {
    try {
        if (typeof errorLogger !== 'undefined') {
            errorLogger.debug('UPDATE_BALANCE', { amount, currentBalance });
        }
        currentBalance = parseFloat(currentBalance) + parseFloat(amount);
    document.getElementById('userBalance').textContent = currentBalance.toFixed(2);
    
    // Update stats
    if (amount > 0) {
        stats.totalWon += amount;
        stats.currentStreak++;
        stats.winStreak = Math.max(stats.winStreak, stats.currentStreak);
        
        if (amount > stats.biggestWin) {
            stats.biggestWin = amount;
            checkAchievements('biggestWin', amount);
        }
        
        if (stats.currentStreak >= 5) {
            checkAchievements('winStreak', stats.currentStreak);
        }
        
        // VIP rakeback
        const rakeback = vipSystem.getRakeback(amount);
        if (rakeback > 0) {
            currentBalance += rakeback;
            effects.floatingText(
                document.getElementById('userBalance').getBoundingClientRect().left + 150,
                120,
                `+${rakeback.toFixed(2)} Rakeback`,
                '#d4af37',
                '1rem'
            );
        }
    } else {
        stats.totalLost += Math.abs(amount);
        stats.currentStreak = 0;
        
        // Track wagers for VIP
        vipSystem.addWager(Math.abs(amount));
    }
    
    stats.totalGamesPlayed++;
    
    // Add to progressive jackpot
    if (amount < 0) {
        progressiveJackpot += Math.abs(amount) * 0.01; // 1% of losses go to jackpot
        updateJackpotDisplay();
    }
    
    // Check for high roller achievement
    if (currentBalance >= 5000) {
        checkAchievements('highRoller', currentBalance);
    }
    
    // Update leaderboard
    leaderboard.updatePlayer(currentBalance, stats.totalWon, stats.totalGamesPlayed);
    
    saveToLocalStorage();
    
    // Visual feedback
    if (amount > 0) {
        effects.floatingText(
            document.getElementById('userBalance').getBoundingClientRect().left + 100,
            100,
            `+${amount.toFixed(2)} eGold`,
            '#2ecc71',
            '1.5rem'
        );
    }
    } catch (error) {
        if (typeof errorLogger !== 'undefined') {
            errorLogger.error('UPDATE_BALANCE_ERROR', {
                error: error.message,
                stack: error.stack,
                amount
            });
        }
        console.error('Update balance error:', error);
    }
}

// Load balance from localStorage
function loadFromLocalStorage() {
    const savedBalance = localStorage.getItem('casinoBalance');
    if (savedBalance) {
        currentBalance = parseFloat(savedBalance);
        document.getElementById('userBalance').textContent = currentBalance.toFixed(2);
    }
    
    const savedJackpot = localStorage.getItem('casinoJackpot');
    if (savedJackpot) {
        progressiveJackpot = parseFloat(savedJackpot);
    }
    
    const savedAchievements = localStorage.getItem('casinoAchievements');
    if (savedAchievements) {
        achievements = JSON.parse(savedAchievements);
    }
    
    const savedStats = localStorage.getItem('casinoStats');
    if (savedStats) {
        stats = JSON.parse(savedStats);
    }
    
    updateJackpotDisplay();
}

// Save balance to localStorage
function saveToLocalStorage() {
    localStorage.setItem('casinoBalance', currentBalance.toFixed(2));
    localStorage.setItem('casinoJackpot', progressiveJackpot.toFixed(2));
    localStorage.setItem('casinoAchievements', JSON.stringify(achievements));
    localStorage.setItem('casinoStats', JSON.stringify(stats));
}

// Update progressive jackpot display
function updateJackpotDisplay() {
    const jackpotEl = document.getElementById('progressiveJackpot');
    if (jackpotEl) {
        jackpotEl.textContent = progressiveJackpot.toFixed(2);
        effects.glowPulse(jackpotEl, '#ffd700', 500);
    }
}

// Check and award achievements
function checkAchievements(type, value) {
    let unlocked = false;
    let achievementName = '';
    
    switch(type) {
        case 'firstWin':
            if (!achievements.firstWin && value > 0) {
                achievements.firstWin = true;
                achievementName = '🎉 First Win!';
                unlocked = true;
            }
            break;
        case 'biggestWin':
            if (!achievements.bigWin && value >= 500) {
                achievements.bigWin = true;
                achievementName = '💰 Big Winner!';
                unlocked = true;
            }
            break;
        case 'winStreak':
            if (!achievements.luckyStreak && value >= 5) {
                achievements.luckyStreak = true;
                achievementName = '🔥 Lucky Streak!';
                unlocked = true;
            }
            break;
        case 'highRoller':
            if (!achievements.highRoller && currentBalance >= 5000) {
                achievements.highRoller = true;
                achievementName = '👑 High Roller!';
                unlocked = true;
            }
            break;
    }
    
    if (unlocked) {
        showAchievement(achievementName);
    }
}

// Show achievement notification
function showAchievement(name) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 10px;">🏆</div>
        <div style="font-weight: bold; font-size: 1.2rem;">Achievement Unlocked!</div>
        <div>${name}</div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #1a1a2e, #2d2d44);
        color: #d4af37;
        padding: 20px;
        border-radius: 15px;
        border: 3px solid #d4af37;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
        z-index: 10001;
        text-align: center;
        animation: slideInRight 0.5s ease-out;
    `;
    
    document.body.appendChild(notification);
    effects.createBurst(window.innerWidth - 100, 150, '#d4af37', 30);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-in';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Navigation filter functionality
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    updateVIPBadge();
    
    const navButtons = document.querySelectorAll('.nav-btn');
    const gameCards = document.querySelectorAll('.game-card');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter games
            const category = this.dataset.category;
            gameCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                } else {
                    if (card.dataset.category === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Back to lobby button
    document.getElementById('backToLobby').addEventListener('click', function() {
        document.getElementById('gameSelection').style.display = 'grid';
        document.getElementById('gameContainer').style.display = 'none';
        currentGame = null;
    });
    
    // Stats button
    const statsBtn = document.getElementById('statsBtn');
    if (statsBtn) {
        statsBtn.addEventListener('click', showStats);
    }
    
    // Daily reward button
    const dailyRewardBtn = document.getElementById('dailyRewardBtn');
    if (dailyRewardBtn) {
        dailyRewardBtn.addEventListener('click', showDailyReward);
    }
    
    // Spin wheel button
    const spinWheelBtn = document.getElementById('spinWheelBtn');
    if (spinWheelBtn) {
        spinWheelBtn.addEventListener('click', () => startGame('spinwheel'));
    }
    
    // Live games button
    const liveGamesBtn = document.getElementById('liveGamesBtn');
    if (liveGamesBtn) {
        liveGamesBtn.addEventListener('click', () => {
            spectatorSystem.showLiveGamesFeed();
        });
    }
});

// Show daily reward claim
function showDailyReward() {
    const modal = document.getElementById('walletModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.querySelector('.wallet-info');
    
    const canClaim = dailyRewards.canClaimDaily();
    const timeUntil = dailyRewards.getTimeUntilNextClaim();
    
    modalTitle.textContent = '🎁 Daily Reward';
    modalContent.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 4rem; margin: 20px 0;">🎁</div>
            <h3 style="color: #d4af37;">Daily Login Bonus</h3>
            <p style="color: #a0a0b0; margin: 20px 0;">Claim your daily reward and build your streak!</p>
            
            <div style="background: rgba(212, 175, 55, 0.1); padding: 20px; border-radius: 10px; margin: 20px 0;">
                <div style="font-size: 1.2rem; color: #2ecc71; margin-bottom: 10px;">
                    Current Streak: <span style="font-size: 2rem; font-weight: bold;">${dailyRewards.loginStreak}</span> days
                </div>
                <div style="color: #d4af37;">
                    Base Reward: 50 eGold<br>
                    Streak Bonus: +${Math.min(dailyRewards.loginStreak * 10, 200)} eGold
                </div>
            </div>
            
            ${canClaim ? `
                <button onclick="claimDaily()" class="btn-confirm" style="font-size: 1.2rem; padding: 15px 40px;">
                    🎉 Claim Reward
                </button>
            ` : `
                <div style="color: #e74c3c; font-size: 1.2rem; margin: 20px 0;">
                    ⏰ Next reward in: ${timeUntil}
                </div>
                <div style="color: #a0a0b0; font-size: 0.9rem;">
                    Come back tomorrow for your daily bonus!
                </div>
            `}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(212, 175, 55, 0.3);">
                <h4 style="color: #d4af37;">Streak Milestones</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px;">
                    <div style="padding: 10px; background: rgba(100, 200, 100, 0.1); border-radius: 5px;">
                        <div>🌟 Day 7</div>
                        <div style="color: #2ecc71;">+200 eGold Bonus</div>
                    </div>
                    <div style="padding: 10px; background: rgba(255, 215, 0, 0.1); border-radius: 5px;">
                        <div>🏆 Day 30</div>
                        <div style="color: #ffd700;">+1000 eGold Bonus</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Claim daily reward
function claimDaily() {
    const reward = dailyRewards.claimDailyReward();
    
    if (reward > 0) {
        updateBalance(reward);
        sound.winSound(reward);
        effects.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
        effects.floatingText(window.innerWidth / 2, window.innerHeight / 2, `+${reward} eGold`, '#2ecc71', '2.5rem');
        
        checkAchievements('firstWin', reward);
        
        // Close modal and show success
        document.getElementById('walletModal').style.display = 'none';
        
        setTimeout(() => {
            alert(`🎉 Daily reward claimed! +${reward} eGold\n\nCurrent streak: ${dailyRewards.loginStreak} days`);
        }, 500);
    }
}

// Show player statistics
function showStats() {
    const modal = document.getElementById('walletModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.querySelector('.wallet-info');
    
    modalTitle.textContent = 'Player Profile';
    modalContent.innerHTML = `
        <div style="text-align: left;">
            <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 2px solid rgba(212, 175, 55, 0.3);">
                <button class="stats-tab active" data-tab="stats" style="flex: 1; padding: 10px; background: rgba(212, 175, 55, 0.3); border: none; color: white; cursor: pointer; border-radius: 5px 5px 0 0;">📊 Stats</button>
                <button class="stats-tab" data-tab="vip" style="flex: 1; padding: 10px; background: rgba(100, 100, 100, 0.2); border: none; color: white; cursor: pointer; border-radius: 5px 5px 0 0;">👑 VIP</button>
                <button class="stats-tab" data-tab="leaderboard" style="flex: 1; padding: 10px; background: rgba(100, 100, 100, 0.2); border: none; color: white; cursor: pointer; border-radius: 5px 5px 0 0;">🏆 Ranks</button>
            </div>
            
            <div id="statsTabContent" class="tab-content">
                <h3 style="color: #d4af37; margin-top: 0;">📊 Game Stats</h3>
                <p>Games Played: <span style="color: #2ecc71;">${stats.totalGamesPlayed}</span></p>
                <p>Total Won: <span style="color: #2ecc71;">${stats.totalWon.toFixed(2)} eGold</span></p>
                <p>Total Lost: <span style="color: #e74c3c;">${stats.totalLost.toFixed(2)} eGold</span></p>
                <p>Net Profit: <span style="color: ${stats.totalWon - stats.totalLost >= 0 ? '#2ecc71' : '#e74c3c'};">${(stats.totalWon - stats.totalLost).toFixed(2)} eGold</span></p>
                <p>Biggest Win: <span style="color: #ffd700;">${stats.biggestWin.toFixed(2)} eGold</span></p>
                <p>Win Streak: <span style="color: #d4af37;">${stats.winStreak} games</span></p>
                
                <h3 style="color: #d4af37; margin-top: 20px;">🏆 Achievements</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    ${Object.entries(achievements).map(([key, unlocked]) => `
                        <div style="padding: 10px; background: ${unlocked ? 'rgba(212, 175, 55, 0.2)' : 'rgba(100, 100, 100, 0.1)'}; border-radius: 8px; text-align: center;">
                            ${unlocked ? '🏆' : '🔒'}
                            <div style="font-size: 0.8rem; margin-top: 5px;">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        </div>
                    `).join('')}
                </div>
                
                <h3 style="color: #d4af37; margin-top: 20px;">💎 Progressive Jackpot</h3>
                <div style="text-align: center; font-size: 2rem; color: #ffd700; text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);">
                    ${progressiveJackpot.toFixed(2)} eGold
                </div>
                <p style="text-align: center; font-size: 0.9rem; color: #a0a0b0;">Win big in any game for a chance at the jackpot!</p>
            </div>
            
            <div id="vipTabContent" class="tab-content" style="display: none;">
                ${vipSystem.getDisplayHTML()}
            </div>
            
            <div id="leaderboardTabContent" class="tab-content" style="display: none;">
                ${leaderboard.getDisplayHTML()}
            </div>
        </div>
    `;
    
    // Add tab switching
    const tabs = modalContent.querySelectorAll('.stats-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.style.background = 'rgba(100, 100, 100, 0.2)';
            });
            tab.classList.add('active');
            tab.style.background = 'rgba(212, 175, 55, 0.3)';
            
            document.getElementById('statsTabContent').style.display = 'none';
            document.getElementById('vipTabContent').style.display = 'none';
            document.getElementById('leaderboardTabContent').style.display = 'none';
            
            const tabName = tab.getAttribute('data-tab');
            document.getElementById(tabName + 'TabContent').style.display = 'block';
        });
    });
    
    modal.style.display = 'block';
}

// Start a game
function startGame(gameType) {
    errorLogger.info('START_GAME_CALLED', { gameType, timestamp: Date.now() });
    console.log('startGame called with:', gameType);
    
    try {
        currentGame = gameType;
        
        const gameSelection = document.getElementById('gameSelection');
        const gameContainer = document.getElementById('gameContainer');
        const gameContent = document.getElementById('gameContent');
        const gameTitle = document.getElementById('currentGameTitle');
        
        errorLogger.debug('CHECKING_ELEMENTS', {
            gameSelection: !!gameSelection,
            gameContainer: !!gameContainer,
            gameContent: !!gameContent,
            gameTitle: !!gameTitle
        });
        
        if (!gameSelection || !gameContainer || !gameContent || !gameTitle) {
            errorLogger.error('MISSING_REQUIRED_ELEMENTS', {
                gameSelection: !!gameSelection,
                gameContainer: !!gameContainer,
                gameContent: !!gameContent,
                gameTitle: !!gameTitle
            });
            return;
        }
        
        errorLogger.info('HIDING_GAME_SELECTION', { gameType });
        gameSelection.style.display = 'none';
        gameContainer.style.display = 'block';
        
        errorLogger.info('INITIALIZING_GAME', { gameType });
        
        switch(gameType) {
            case 'texasholdem':
                gameTitle.textContent = 'Texas Hold\'em Poker';
                errorLogger.debug('GAME_OBJECT_CHECK', { exists: typeof texasholdemGame !== 'undefined' });
                if (typeof texasholdemGame !== 'undefined') {
                    texasholdemGame.init();
                    errorLogger.info('GAME_INITIALIZED', { gameType: 'texasholdem' });
                } else {
                    errorLogger.error('GAME_OBJECT_MISSING', { gameType: 'texasholdem' });
                }
                break;
            case 'omaha':
                gameTitle.textContent = 'Omaha Poker';
                errorLogger.debug('GAME_OBJECT_CHECK', { exists: typeof omahaGame !== 'undefined' });
                if (typeof omahaGame !== 'undefined') {
                    omahaGame.init();
                    errorLogger.info('GAME_INITIALIZED', { gameType: 'omaha' });
                } else {
                    errorLogger.error('GAME_OBJECT_MISSING', { gameType: 'omaha' });
                }
                break;
            case 'pineapple':
                gameTitle.textContent = 'Pineapple Poker';
                errorLogger.debug('GAME_OBJECT_CHECK', { exists: typeof pineappleGame !== 'undefined' });
                if (typeof pineappleGame !== 'undefined') {
                    pineappleGame.init();
                    errorLogger.info('GAME_INITIALIZED', { gameType: 'pineapple' });
                } else {
                    errorLogger.error('GAME_OBJECT_MISSING', { gameType: 'pineapple' });
                }
                break;
            case 'tonk':
                gameTitle.textContent = 'Tonk';
                errorLogger.debug('GAME_OBJECT_CHECK', { exists: typeof tonkGame !== 'undefined' });
                if (typeof tonkGame !== 'undefined') {
                    tonkGame.init();
                    errorLogger.info('GAME_INITIALIZED', { gameType: 'tonk' });
                } else {
                    errorLogger.error('GAME_OBJECT_MISSING', { gameType: 'tonk' });
                }
                break;
            case 'chess':
                gameTitle.textContent = 'Chess Betting';
                errorLogger.debug('GAME_OBJECT_CHECK', { exists: typeof chessGame !== 'undefined' });
                if (typeof chessGame !== 'undefined') {
                    chessGame.init();
                    errorLogger.info('GAME_INITIALIZED', { gameType: 'chess' });
                } else {
                    errorLogger.error('GAME_OBJECT_MISSING', { gameType: 'chess' });
                }
                break;
            case 'checkers':
                gameTitle.textContent = 'Checkers Betting';
                errorLogger.debug('GAME_OBJECT_CHECK', { exists: typeof checkersGame !== 'undefined' });
                if (typeof checkersGame !== 'undefined') {
                    checkersGame.init();
                    errorLogger.info('GAME_INITIALIZED', { gameType: 'checkers' });
                } else {
                    errorLogger.error('GAME_OBJECT_MISSING', { gameType: 'checkers' });
                }
                break;
            case 'coinflip':
                gameTitle.textContent = 'Coin Flip';
                errorLogger.debug('GAME_OBJECT_CHECK', { exists: typeof coinflipGame !== 'undefined' });
                if (typeof coinflipGame !== 'undefined') {
                    coinflipGame.init();
                    errorLogger.info('GAME_INITIALIZED', { gameType: 'coinflip' });
                } else {
                    errorLogger.error('GAME_OBJECT_MISSING', { gameType: 'coinflip' });
                }
                break;
            case 'roulette':
                gameTitle.textContent = 'European Roulette';
                errorLogger.debug('GAME_OBJECT_CHECK', { exists: typeof rouletteGame !== 'undefined' });
                if (typeof rouletteGame !== 'undefined') {
                    rouletteGame.init();
                    errorLogger.info('GAME_INITIALIZED', { gameType: 'roulette' });
                } else {
                    errorLogger.error('GAME_OBJECT_MISSING', { gameType: 'roulette' });
                }
                break;
            case 'slots':
                gameTitle.textContent = 'Luxury Slots';
                errorLogger.debug('GAME_OBJECT_CHECK', { exists: typeof slotsGame !== 'undefined' });
                if (typeof slotsGame !== 'undefined') {
                    slotsGame.init();
                    errorLogger.info('GAME_INITIALIZED', { gameType: 'slots' });
                } else {
                    errorLogger.error('GAME_OBJECT_MISSING', { gameType: 'slots' });
                }
                break;
            case 'scratchoff':
                gameTitle.textContent = 'Scratch Off';
                errorLogger.debug('GAME_OBJECT_CHECK', { exists: typeof scratchoffGame !== 'undefined' });
                if (typeof scratchoffGame !== 'undefined') {
                    scratchoffGame.init();
                    errorLogger.info('GAME_INITIALIZED', { gameType: 'scratchoff' });
                } else {
                    errorLogger.error('GAME_OBJECT_MISSING', { gameType: 'scratchoff' });
                }
                break;
            case 'standardlottery':
                gameTitle.textContent = 'Standard Lottery';
                errorLogger.debug('GAME_OBJECT_CHECK', { exists: typeof lotteryGame !== 'undefined' });
                if (typeof lotteryGame !== 'undefined') {
                    lotteryGame.init();
                    errorLogger.info('GAME_INITIALIZED', { gameType: 'standardlottery' });
                } else {
                    errorLogger.error('GAME_OBJECT_MISSING', { gameType: 'standardlottery' });
                }
                break;
            case 'diceraffle':
                gameTitle.textContent = '16-Sided Dice Raffle';
                errorLogger.debug('GAME_OBJECT_CHECK', { exists: typeof diceraffleGame !== 'undefined' });
                if (typeof diceraffleGame !== 'undefined') {
                    diceraffleGame.init();
                    errorLogger.info('GAME_INITIALIZED', { gameType: 'diceraffle' });
                } else {
                    errorLogger.error('GAME_OBJECT_MISSING', { gameType: 'diceraffle' });
                }
                break;
            case 'spinwheel':
                gameTitle.textContent = '🎡 Spin the Wheel';
                if (typeof spinWheel !== 'undefined') {
                    gameContent.innerHTML = spinWheel.createWheelHTML();
                    errorLogger.info('GAME_INITIALIZED', { gameType: 'spinwheel' });
                } else {
                    errorLogger.error('GAME_OBJECT_MISSING', { gameType: 'spinwheel' });
                }
                break;
            default:
                errorLogger.error('UNKNOWN_GAME_TYPE', { gameType });
        }
        
        errorLogger.info('START_GAME_COMPLETED', { gameType });
        
    } catch (error) {
        errorLogger.error('START_GAME_EXCEPTION', {
            gameType,
            error: error.message,
            stack: error.stack
        });
        
        // Show user-friendly error
        alert(`Error starting game: ${error.message}\n\nCheck console (F12) for details or click the error notification to view logs.`);
    }
}

// Check if player has enough balance
function checkBalance(amount) {
    return currentBalance >= amount;
}

// Show message to player
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'game-message';
    messageDiv.textContent = message;
    
    if (type === 'success') {
        messageDiv.style.background = 'rgba(46, 204, 113, 0.2)';
        messageDiv.style.color = '#2ecc71';
    } else if (type === 'error') {
        messageDiv.style.background = 'rgba(231, 76, 60, 0.2)';
        messageDiv.style.color = '#e74c3c';
    }
    
    return messageDiv;
}

// Update VIP badge in header
function updateVIPBadge() {
    const badge = document.getElementById('vipBadge');
    if (!badge) return;
    
    const level = vipSystem.getCurrentLevel();
    badge.innerHTML = `<span style="font-size: 0.8rem; color: ${level.color};">👑 ${level.name} VIP</span>`;
    badge.style.background = `linear-gradient(135deg, ${level.color}33, ${level.color}11)`;
    badge.style.borderColor = level.color;
    badge.style.boxShadow = `0 0 10px ${level.color}44`;
}

// Expose functions to global scope for onclick handlers
window.startGame = startGame;
window.claimDaily = claimDaily;
window.showStats = showStats;
window.showDailyReward = showDailyReward;

// Log when main.js is loaded
errorLogger.info('MAIN_JS_LOADED', {
    timestamp: Date.now(),
    functions: {
        startGame: typeof startGame !== 'undefined',
        updateBalance: typeof updateBalance !== 'undefined',
        showStats: typeof showStats !== 'undefined'
    }
});

// Test button click handlers
document.addEventListener('DOMContentLoaded', () => {
    errorLogger.info('DOM_CONTENT_LOADED', { timestamp: Date.now() });
    
    // Add click event logging to all game buttons
    setTimeout(() => {
        const allButtons = document.querySelectorAll('.btn-play');
        errorLogger.info('BUTTON_SCAN', { 
            buttonCount: allButtons.length,
            buttons: Array.from(allButtons).map(btn => ({
                text: btn.textContent,
                onclick: btn.getAttribute('onclick')
            }))
        });
        
        allButtons.forEach((btn, index) => {
            btn.addEventListener('click', function(e) {
                errorLogger.info('BUTTON_CLICKED', {
                    index,
                    text: this.textContent,
                    onclick: this.getAttribute('onclick'),
                    target: e.target,
                    currentTarget: e.currentTarget
                });
            });
        });
    }, 1000);
});

// Log game objects availability after page load
window.addEventListener('load', () => {
    errorLogger.info('PAGE_FULLY_LOADED', {
        gameObjects: {
            texasholdemGame: typeof texasholdemGame !== 'undefined',
            omahaGame: typeof omahaGame !== 'undefined',
            pineappleGame: typeof pineappleGame !== 'undefined',
            tonkGame: typeof tonkGame !== 'undefined',
            chessGame: typeof chessGame !== 'undefined',
            checkersGame: typeof checkersGame !== 'undefined',
            coinflipGame: typeof coinflipGame !== 'undefined',
            rouletteGame: typeof rouletteGame !== 'undefined',
            slotsGame: typeof slotsGame !== 'undefined',
            scratchoffGame: typeof scratchoffGame !== 'undefined',
            lotteryGame: typeof lotteryGame !== 'undefined',
            diceraffleGame: typeof diceraffleGame !== 'undefined'
        },
        domElements: {
            gameSelection: !!document.getElementById('gameSelection'),
            gameContainer: !!document.getElementById('gameContainer'),
            gameContent: !!document.getElementById('gameContent'),
            currentGameTitle: !!document.getElementById('currentGameTitle')
        }
    });
});
