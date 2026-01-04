// Roulette Game
const rouletteGame = {
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 1.8em; margin-bottom: 15px; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">🎡 ROULETTE ROYALE 🎡</h3>
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
                    <h3>🎯 How to Play</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                        <p style="padding: 8px; background: rgba(231, 76, 60, 0.2); border-radius: 5px;">🔴 Red: Numbers 1-18</p>
                        <p style="padding: 8px; background: rgba(44, 62, 80, 0.2); border-radius: 5px;">⚫ Black: Numbers 19-36</p>
                        <p style="padding: 8px; background: rgba(39, 174, 96, 0.2); border-radius: 5px; grid-column: 1 / -1;">🟢 Green: Number 0</p>
                    </div>
                    <p style="color: #FFB800; margin-top: 10px; font-weight: bold;">Color bets pay 1.9x • Number bets pay 30x</p>
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
        
        numberDisplay.textContent = 'Spinning...';
        
        setTimeout(() => {
            // Generate result
            const result = Math.floor(Math.random() * 37);
            
            let resultColor;
            if (result === 0) {
                resultColor = 'green';
            } else if (result <= 18) {
                    resultColor = 'red';
                    numberDisplay.style.color = '#e74c3c';
                } else {
                    resultColor = 'black';
                    numberDisplay.style.color = '#ffffff';
                }
                
                resultColor = 'black';
            }
            
            // Update wheel with result
            wheel.innerHTML = VisualEnhancer.createRouletteWheel(result);
            numberDisplay.textContent = `Number: ${result} (${resultColor.toUpperCase()})`;
            
            // Check win
            let won = false;
            let payout = 0;
            
            if (color && resultColor === color) {
                payout = bet * 1.9; // House edge: 1.9x instead of 2x
                won = true;
            } else if (pickedNumber !== null && result === pickedNumber) {
                payout = bet * 30; // House edge: 30x instead of 36x
                won = true;
            }
            
            if (won) {
                updateBalance(payout);
                const resultDiv = document.getElementById('rouletteResult');
                resultDiv.className = 'game-result win';
                resultDiv.innerHTML = `<span style="font-size: 1.8em;">🎉 WINNER! 🎉</span><br><span style="font-size: 1.4em;">Number ${result} (${resultColor})!</span><br><span style="font-size: 1.5em; color: #FFB800;">+${payout.toFixed(2)} eGold</span>`;
            } else {
                const resultDiv = document.getElementById('rouletteResult');
                resultDiv.className = 'game-result lose';
                resultDiv.innerHTML = `<span style="font-size: 1.4em;">Number ${result} (${resultColor})</span><br><span style="font-size: 1.2em;">💔 Try again!</span>`;
            }
        }, 2000);
    }
};

window.rouletteGame = rouletteGame;
