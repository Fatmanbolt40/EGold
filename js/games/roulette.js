// Roulette Game
const rouletteGame = {
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 1.8em; margin-bottom: 15px; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">🎡 ROYAL WHEEL 36 🎡</h3>
                    <div id="rouletteWheel">${VisualEnhancer.createRouletteWheel()}</div>
                    <div id="rouletteNumber" style="font-size: 2.5em; color: #FFB800; min-height: 60px; margin: 15px 0; font-weight: bold; text-shadow: 0 0 15px rgba(255, 184, 0, 0.6);"></div>
                </div>
                
                <div class="game-controls">
                    <label style="font-size: 1.3em; color: #FFB800;">💰 Bet:</label>
                    <input type="number" id="rouletteBet" value="10" min="5" max="500" class="game-input" style="width: 120px;">
                    <span style="color: #FFB800; font-size: 1.2em;">eGold</span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; max-width: 600px; margin: 25px auto;">
                    <button onclick="rouletteGame.bet('red')" class="game-button" style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 18px;">
                        🔴 RED<br><small style="font-size: 0.8em;">(1.9x)</small>
                    </button>
                    <button onclick="rouletteGame.bet('black')" class="game-button" style="background: linear-gradient(135deg, #2c3e50, #1a252f); color: white; padding: 18px;">
                        ⚫ BLACK<br><small style="font-size: 0.8em;">(1.9x)</small>
                    </button>
                    <button onclick="rouletteGame.bet('green')" class="game-button" style="background: linear-gradient(135deg, #27ae60, #229954); color: white; padding: 18px;">
                        🟢 GREEN<br><small style="font-size: 0.8em;">(30x)</small>
                    </button>
                </div>
                
                <div style="margin: 25px 0;">
                    <label style="font-size: 1.2em; color: #FFB800; margin-right: 10px;">Or pick a number (0-36):</label><br>
                    <div style="margin-top: 10px;">
                        <input type="number" id="rouletteNumberPick" min="0" max="36" placeholder="0-36" class="game-input" style="width: 100px;">
                        <button onclick="rouletteGame.betNumber()" class="game-button secondary" style="padding: 12px 25px; margin-left: 10px;">
                            Bet Number (30x)
                        </button>
                    </div>
                </div>
                
                <div id="rouletteResult" class="game-result"></div>
                
                <div class="game-info-box">
                    <h3>👑 Royal Wheel 36</h3>
                    <p style="font-size: 1.1em; color: #cccccc; margin: 10px 0;">Premium European-style roulette with smooth spin physics and glowing number pockets</p>
                    <div style="margin-top: 20px;">
                        <h4 style="color: #FFB800;">🎯 Betting Options</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                            <div style="padding: 10px; background: rgba(231, 76, 60, 0.2); border-radius: 8px;">
                                <b>🔴 Red (1-18)</b><br><small>Payout: 1.9x</small>
                            </div>
                            <div style="padding: 10px; background: rgba(44, 62, 80, 0.2); border-radius: 8px;">
                                <b>⚫ Black (19-36)</b><br><small>Payout: 1.9x</small>
                            </div>
                            <div style="padding: 10px; background: rgba(39, 174, 96, 0.2); border-radius: 8px; grid-column: 1 / -1;">
                                <b>🟢 Green (0)</b><br><small>Payout: 30x</small>
                            </div>
                            <div style="padding: 10px; background: rgba(255, 184, 0, 0.15); border-radius: 8px; grid-column: 1 / -1;">
                                <b>🎯 Single Number</b><br><small>Pick any 0-36 • Payout: 30x</small>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 2px solid #2ecc71;">
                        <h4 style="color: #2ecc71; margin-bottom: 10px;">📜 Game Rules</h4>
                        <ul style="text-align: left; max-width: 450px; margin: 0 auto; color: #cccccc; line-height: 1.8;">
                            <li>Numbers <b>0-36</b> on the wheel</li>
                            <li>Red: 1-18 • Black: 19-36 • Green: 0</li>
                            <li>Color bets pay <b style="color: #FFB800;">1.9x</b></li>
                            <li>Number bets pay <b style="color: #FFB800;">30x</b></li>
                            <li>Watch the wheel spin with smooth physics</li>
                            <li>Sparkle effects on winning numbers!</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },
    
    bet(color) {
        const betInput = document.getElementById('rouletteBet');
        const bet = parseFloat(betInput.value);
        
        if (bet < 5) {
            document.getElementById('rouletteResult').innerHTML = '<span style="color: #e74c3c;">Minimum bet is 5 eGold!</span>';
            return;
        }
        
        if (bet > balance) {
            document.getElementById('rouletteResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-bet);
        this.spin(bet, color, null);
    },
    
    betNumber() {
        const betInput = document.getElementById('rouletteBet');
        const numberInput = document.getElementById('rouletteNumberPick');
        const bet = parseFloat(betInput.value);
        const number = parseInt(numberInput.value);
        
        if (isNaN(number) || number < 0 || number > 36) {
            document.getElementById('rouletteResult').innerHTML = '<span style="color: #e74c3c;">Pick a number between 0 and 36!</span>';
            return;
        }
        
        if (bet < 5) {
            document.getElementById('rouletteResult').innerHTML = '<span style="color: #e74c3c;">Minimum bet is 5 eGold!</span>';
            return;
        }
        
        if (bet > balance) {
            document.getElementById('rouletteResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-bet);
        this.spin(bet, null, number);
    },
    
    spin(bet, color, pickedNumber) {
        const wheel = document.getElementById('rouletteWheel');
        const numberDisplay = document.getElementById('rouletteNumber');
        
        // Play roulette wheel sound
        soundManager.playRouletteWheel();
        
        numberDisplay.textContent = 'Spinning...';
        numberDisplay.className = 'animate-pulse';
        
        // Add spinning animation
        wheel.querySelector('svg').style.animation = 'spin 2s ease-out';
        
        setTimeout(() => {
            // Stop animation
            wheel.querySelector('svg').style.animation = '';
            
            // Generate result
            const result = Math.floor(Math.random() * 37);
            
            let resultColor;
            if (result === 0) {
                resultColor = 'green';
                numberDisplay.style.color = '#27ae60';
            } else if (result <= 18) {
                resultColor = 'red';
                numberDisplay.style.color = '#e74c3c';
            } else {
                resultColor = 'black';
                numberDisplay.style.color = '#ffffff';
            }
            
            // Update wheel with result
            wheel.innerHTML = VisualEnhancer.createRouletteWheel(result);
            numberDisplay.textContent = `Number: ${result} (${resultColor.toUpperCase()})`;
            numberDisplay.className = 'animate-bounce';
            
            // Create sparkle effect at wheel
            const wheelRect = wheel.getBoundingClientRect();
            particleSystem.createSparkles(wheelRect.left + wheelRect.width / 2, wheelRect.top + wheelRect.height / 2, 40);
            
            // Check win
            let won = false;
            let payout = 0;
            let isJackpot = false;
            
            if (color && resultColor === color) {
                payout = bet * 1.9; // House edge: 1.9x instead of 2x
                won = true;
            } else if (pickedNumber !== null && result === pickedNumber) {
                payout = bet * 30; // House edge: 30x instead of 36x
                won = true;
                isJackpot = true;
            }
            
            if (won) {
                updateBalance(payout);
                const resultDiv = document.getElementById('rouletteResult');
                resultDiv.className = 'game-result win-effect';
                
                if (isJackpot) {
                    soundManager.playJackpot();
                    particleSystem.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 120);
                    resultDiv.classList.add('jackpot-effect');
                    resultDiv.innerHTML = `<span style="font-size: 2em;">💫 JACKPOT! 💫</span><br><span style="font-size: 1.6em;">Number ${result} (${resultColor})!</span><br><span style="font-size: 1.8em; color: #FFB800;">+${payout.toFixed(2)} eGold <small style="color: #2ecc71;">($${(payout * 0.10).toFixed(2)})</small></span>`;
                } else {
                    soundManager.playWin();
                    particleSystem.createCoinBurst(window.innerWidth / 2, window.innerHeight / 2, payout);
                    resultDiv.innerHTML = `<span style="font-size: 1.8em;">🎉 WINNER! 🎉</span><br><span style="font-size: 1.4em;">Number ${result} (${resultColor})!</span><br><span style="font-size: 1.5em; color: #FFB800;">+${payout.toFixed(2)} eGold <small style="color: #2ecc71;">($${(payout * 0.10).toFixed(2)})</small></span>`;
                }
            } else {
                soundManager.playLoss();
                const resultDiv = document.getElementById('rouletteResult');
                resultDiv.className = 'game-result loss-effect';
                resultDiv.innerHTML = `<span style="font-size: 1.4em;">Number ${result} (${resultColor})</span><br><span style="font-size: 1.2em;">💔 Try again!</span>`;
            }
        }, 2000);
    }
};

window.rouletteGame = rouletteGame;
