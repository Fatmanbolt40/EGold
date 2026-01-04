// Roulette Game
const rouletteGame = {
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div id="rouletteWheel" style="font-size: 6em; margin: 20px 0;">🎡</div>
                <div id="rouletteNumber" style="font-size: 2em; color: #FFB800; min-height: 50px; margin: 10px 0;"></div>
                
                <div style="margin: 20px 0;">
                    <label style="font-size: 1.2em;">Bet Amount: </label>
                    <input type="number" id="rouletteBet" value="10" min="5" max="500" style="padding: 10px; font-size: 1.1em; border-radius: 5px; border: 2px solid #FFB800; background: #2A3544; color: #FFB800; width: 100px;">
                    <span style="color: #FFB800;"> eGold</span>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-width: 500px; margin: 20px auto;">
                    <button onclick="rouletteGame.bet('red')" style="padding: 15px; background: #e74c3c; color: white; border: none; border-radius: 8px; font-size: 1.1em; font-weight: bold; cursor: pointer;">
                        RED (1.9x)
                    </button>
                    <button onclick="rouletteGame.bet('black')" style="padding: 15px; background: #2c3e50; color: white; border: none; border-radius: 8px; font-size: 1.1em; font-weight: bold; cursor: pointer;">
                        BLACK (1.9x)
                    </button>
                    <button onclick="rouletteGame.bet('green')" style="padding: 15px; background: #27ae60; color: white; border: none; border-radius: 8px; font-size: 1.1em; font-weight: bold; cursor: pointer;">
                        GREEN (30x)
                    </button>
                </div>
                
                <div style="margin-top: 20px;">
                    <label style="font-size: 1.1em; margin-right: 10px;">Or pick a number (0-36):</label>
                    <input type="number" id="rouletteNumberPick" min="0" max="36" placeholder="0-36" style="padding: 10px; font-size: 1.1em; border-radius: 5px; border: 2px solid #FFB800; background: #2A3544; color: #FFB800; width: 80px;">
                    <button onclick="rouletteGame.betNumber()" style="padding: 10px 20px; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer; margin-left: 10px;">
                        Bet Number (30x)
                    </button>
                </div>
                
                <div id="rouletteResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800;">How to Play</h3>
                    <p style="color: #cccccc; margin-top: 10px;">Red: Numbers 1-18 | Black: Numbers 19-36 | Green: 0</p>
                    <p style="color: #cccccc; margin-top: 5px;">Color bets pay 1.9x • Number bets pay 30x</p>
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
        
        let spins = 0;
        const spinInterval = setInterval(() => {
            wheel.style.transform = `rotate(${spins * 45}deg)`;
            numberDisplay.textContent = Math.floor(Math.random() * 37);
            spins++;
            
            if (spins >= 20) {
                clearInterval(spinInterval);
                
                // Generate result
                const result = Math.floor(Math.random() * 37);
                numberDisplay.textContent = result;
                
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
                    document.getElementById('rouletteResult').innerHTML = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 WIN! Number ${result} (${resultColor})! +${payout.toFixed(2)} eGold</span>`;
                } else {
                    document.getElementById('rouletteResult').innerHTML = `<span style="color: #e74c3c;">Number ${result} (${resultColor}). Try again!</span>`;
                }
            }
        }, 100);
    }
};

window.rouletteGame = rouletteGame;
