// Roulette Game

let rouletteGame;

function initRoulette(container) {
    rouletteGame = new RouletteGame();
    rouletteGame.init(container);
}

class RouletteGame {
    constructor() {
        this.isSpinning = false;
        this.numbers = [
            { num: 0, color: 'green' },
            ...this.generateNumbers()
        ];
        this.bets = [];
    }

    generateNumbers() {
        const reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        const numbers = [];
        for (let i = 1; i <= 36; i++) {
            numbers.push({
                num: i,
                color: reds.includes(i) ? 'red' : 'black'
            });
        }
        return numbers;
    }

    init(container) {
        container.innerHTML = `
            <div class="game-info">
                <h3>🎡 European Roulette</h3>
                <p>Place your bets and spin the wheel! Multiple bet types available.</p>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 15px 0; font-size: 0.85rem;">
                    <div style="background: rgba(231, 76, 60, 0.2); padding: 8px; border-radius: 5px;">
                        <strong>Red/Black:</strong> 2x payout
                    </div>
                    <div style="background: rgba(52, 152, 219, 0.2); padding: 8px; border-radius: 5px;">
                        <strong>Odd/Even:</strong> 2x payout
                    </div>
                    <div style="background: rgba(46, 204, 113, 0.2); padding: 8px; border-radius: 5px;">
                        <strong>Single Number:</strong> 36x payout
                    </div>
                </div>
            </div>

            <div class="roulette-table" style="max-width: 900px; margin: 30px auto;">
                <!-- Roulette Wheel -->
                <div class="wheel-container" style="
                    width: 400px;
                    height: 400px;
                    margin: 0 auto 40px;
                    position: relative;
                ">
                    <div id="rouletteWheel" style="
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: radial-gradient(circle, #8b4513 0%, #654321 30%, #4a3120 60%, #2c1810 100%);
                        box-shadow: 
                            0 0 0 20px #d4af37,
                            0 0 0 25px #8b7355,
                            0 20px 60px rgba(0, 0, 0, 0.8),
                            inset 0 0 50px rgba(0, 0, 0, 0.8);
                        position: relative;
                        transition: transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
                    ">
                        <div id="wheelNumbers" style="
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        "></div>
                        
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            width: 80px;
                            height: 80px;
                            border-radius: 50%;
                            background: radial-gradient(circle, #ffd700, #d4af37);
                            box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 2rem;
                            font-weight: bold;
                            color: #000;
                        ">
                            🎰
                        </div>
                    </div>
                    
                    <!-- Result Display -->
                    <div id="wheelResult" style="
                        text-align: center;
                        font-size: 3rem;
                        font-weight: bold;
                        color: #ffd700;
                        text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
                        margin-top: -50px;
                        min-height: 60px;
                    "></div>
                </div>

                <!-- Betting Board -->
                <div class="betting-board" style="
                    background: linear-gradient(135deg, #0f5132 0%, #0a3d23 100%);
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
                    border: 3px solid #d4af37;
                ">
                    <!-- Number Grid -->
                    <div style="display: grid; grid-template-columns: repeat(12, 1fr); gap: 5px; margin-bottom: 20px;">
                        ${this.generateNumberGrid()}
                    </div>

                    <!-- Outside Bets -->
                    <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-top: 20px;">
                        <button onclick="rouletteGame.placeBet('red', 2)" class="roulette-bet-btn" style="background: #e74c3c; grid-column: span 2;">
                            Red (2x)
                        </button>
                        <button onclick="rouletteGame.placeBet('black', 2)" class="roulette-bet-btn" style="background: #2c3e50; grid-column: span 2;">
                            Black (2x)
                        </button>
                        <button onclick="rouletteGame.placeBet('green', 36)" class="roulette-bet-btn" style="background: #27ae60; grid-column: span 2;">
                            Green 0 (36x)
                        </button>
                        <button onclick="rouletteGame.placeBet('odd', 2)" class="roulette-bet-btn">
                            Odd (2x)
                        </button>
                        <button onclick="rouletteGame.placeBet('even', 2)" class="roulette-bet-btn">
                            Even (2x)
                        </button>
                        <button onclick="rouletteGame.placeBet('low', 2)" class="roulette-bet-btn">
                            1-18 (2x)
                        </button>
                        <button onclick="rouletteGame.placeBet('high', 2)" class="roulette-bet-btn">
                            19-36 (2x)
                        </button>
                        <button onclick="rouletteGame.placeBet('dozen1', 3)" class="roulette-bet-btn">
                            1st 12 (3x)
                        </button>
                        <button onclick="rouletteGame.placeBet('dozen2', 3)" class="roulette-bet-btn">
                            2nd 12 (3x)
                        </button>
                    </div>

                    <!-- Bet Controls -->
                    <div style="margin-top: 30px; text-align: center;">
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label for="rouletteBetAmount" style="color: #ffd700; font-size: 1.1rem; margin-right: 15px;">
                                Bet Amount (eGold):
                            </label>
                            <input type="number" id="rouletteBetAmount" min="1" max="${currentBalance || 1000}" value="10" step="1"
                                style="width: 150px; padding: 10px; font-size: 1.1rem; text-align: center; border-radius: 10px; border: 2px solid #d4af37; background: rgba(0,0,0,0.3); color: #ffd700;">
                        </div>

                        <div style="display: flex; gap: 20px; justify-content: center; align-items: center;">
                            <button onclick="rouletteGame.spin()" class="btn-play" id="spinRouletteBtn" style="
                                font-size: 1.5rem;
                                padding: 15px 60px;
                                background: linear-gradient(135deg, #ffd700, #ffed4e);
                                color: #000;
                            ">
                                🎡 SPIN WHEEL 🎡
                            </button>
                            <button onclick="rouletteGame.clearBets()" class="bet-btn" style="padding: 15px 30px;">
                                Clear Bets
                            </button>
                        </div>

                        <div id="currentBets" style="margin-top: 20px; color: #ffd700; font-size: 1.1rem;">
                            Total Bet: <span id="totalBet">0</span> eGold
                        </div>
                    </div>
                </div>

                <div id="rouletteResult" class="game-message" style="font-size: 1.5rem; text-align: center; margin-top: 30px;"></div>
            </div>
        `;

        this.container = container;
        this.createWheelNumbers();
    }

    generateNumberGrid() {
        let html = '';
        for (let i = 1; i <= 36; i++) {
            const numData = this.numbers.find(n => n.num === i);
            const bgColor = numData.color === 'red' ? '#e74c3c' : '#2c3e50';
            html += `
                <button onclick="rouletteGame.placeBet(${i}, 36)" class="roulette-number-btn" 
                    style="background: ${bgColor}; color: white; padding: 15px 5px; border-radius: 8px; border: 2px solid #d4af37; cursor: pointer; font-weight: bold; transition: all 0.3s;">
                    ${i}
                </button>
            `;
        }
        return html;
    }

    createWheelNumbers() {
        const wheelNumbers = document.getElementById('wheelNumbers');
        const rouletteOrder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
        
        rouletteOrder.forEach((num, index) => {
            const angle = (index * 360 / 37) - 90; // Start from top
            const numData = this.numbers.find(n => n.num === num);
            const colorClass = numData.color === 'red' ? '#e74c3c' : numData.color === 'black' ? '#2c3e50' : '#27ae60';
            
            const segment = document.createElement('div');
            segment.style.cssText = `
                position: absolute;
                width: 50%;
                height: 50%;
                top: 50%;
                left: 50%;
                transform-origin: 0 0;
                transform: rotate(${angle}deg);
                color: white;
                font-size: 0.8rem;
                font-weight: bold;
            `;
            
            segment.innerHTML = `
                <div style="
                    width: 30px;
                    height: 30px;
                    background: ${colorClass};
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: absolute;
                    top: -15px;
                    left: 150px;
                    border: 2px solid #ffd700;
                    transform: rotate(${-angle}deg);
                ">
                    ${num}
                </div>
            `;
            
            wheelNumbers.appendChild(segment);
        });
    }

    placeBet(type, payout) {
        const betAmount = parseFloat(document.getElementById('rouletteBetAmount').value);
        
        if (betAmount <= 0 || betAmount > currentBalance) {
            this.showResult('Invalid bet amount!', '#e74c3c');
            return;
        }

        this.bets.push({ type, amount: betAmount, payout });
        this.updateBetsDisplay();
        this.showResult(`Bet placed: ${typeof type === 'number' ? 'Number ' + type : type} - ${betAmount} eGold`, '#3498db');
    }

    clearBets() {
        this.bets = [];
        this.updateBetsDisplay();
        this.showResult('All bets cleared', '#95a5a6');
    }

    updateBetsDisplay() {
        const total = this.bets.reduce((sum, bet) => sum + bet.amount, 0);
        document.getElementById('totalBet').textContent = total.toFixed(2);
    }

    async spin() {
        if (this.isSpinning) return;
        
        if (this.bets.length === 0) {
            this.showResult('Please place at least one bet!', '#e74c3c');
            return;
        }

        const totalBet = this.bets.reduce((sum, bet) => sum + bet.amount, 0);
        
        if (totalBet > currentBalance) {
            this.showResult('Insufficient balance!', '#e74c3c');
            return;
        }

        this.isSpinning = true;
        updateBalance(-totalBet);
        document.getElementById('spinRouletteBtn').disabled = true;
        document.getElementById('wheelResult').textContent = '🎰 SPINNING...';

        // Spin animation
        const wheel = document.getElementById('rouletteWheel');
        const rouletteOrder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
        const winningNumber = rouletteOrder[Math.floor(Math.random() * rouletteOrder.length)];
        const winningIndex = rouletteOrder.indexOf(winningNumber);
        
        const spins = 8 + Math.random() * 3;
        const finalAngle = (winningIndex * (360 / 37)) + (spins * 360);
        
        wheel.style.transform = `rotate(${finalAngle}deg)`;
        
        // Show particle effects during spin
        const wheelRect = wheel.getBoundingClientRect();
        advancedEffects.shockwave(wheelRect.left + wheelRect.width / 2, wheelRect.top + wheelRect.height / 2, '#ffd700');

        await new Promise(resolve => setTimeout(resolve, 5500));

        // Display result
        const numData = this.numbers.find(n => n.num === winningNumber);
        const resultColor = numData.color === 'red' ? '#e74c3c' : numData.color === 'black' ? '#2c3e50' : '#27ae60';
        
        document.getElementById('wheelResult').innerHTML = `
            <div style="display: inline-block; background: ${resultColor}; padding: 15px 30px; border-radius: 50%; border: 5px solid #ffd700; box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);">
                ${winningNumber}
            </div>
        `;

        advancedEffects.explosion(wheelRect.left + wheelRect.width / 2, wheelRect.top + wheelRect.height / 2, 60, ['#ffd700', resultColor, '#ffffff']);

        // Check wins
        await this.checkWins(winningNumber, numData.color);

        this.bets = [];
        this.updateBetsDisplay();
        this.isSpinning = false;
        document.getElementById('spinRouletteBtn').disabled = false;
    }

    async checkWins(winningNumber, winningColor) {
        let totalWin = 0;
        const winningBets = [];

        this.bets.forEach(bet => {
            let isWin = false;

            if (typeof bet.type === 'number' && bet.type === winningNumber) {
                isWin = true;
            } else if (bet.type === 'red' && winningColor === 'red') {
                isWin = true;
            } else if (bet.type === 'black' && winningColor === 'black') {
                isWin = true;
            } else if (bet.type === 'green' && winningColor === 'green') {
                isWin = true;
            } else if (bet.type === 'odd' && winningNumber % 2 === 1 && winningNumber !== 0) {
                isWin = true;
            } else if (bet.type === 'even' && winningNumber % 2 === 0 && winningNumber !== 0) {
                isWin = true;
            } else if (bet.type === 'low' && winningNumber >= 1 && winningNumber <= 18) {
                isWin = true;
            } else if (bet.type === 'high' && winningNumber >= 19 && winningNumber <= 36) {
                isWin = true;
            } else if (bet.type === 'dozen1' && winningNumber >= 1 && winningNumber <= 12) {
                isWin = true;
            } else if (bet.type === 'dozen2' && winningNumber >= 13 && winningNumber <= 24) {
                isWin = true;
            }

            if (isWin) {
                const winAmount = bet.amount * bet.payout;
                totalWin += winAmount;
                winningBets.push({ ...bet, winAmount });
            }
        });

        if (totalWin > 0) {
            updateBalance(totalWin);
            this.showResult(`🎉 YOU WIN ${totalWin.toFixed(2)} eGold!`, '#2ecc71');
            
            // Epic win effects
            setTimeout(() => {
                advancedEffects.explosion(window.innerWidth / 2, window.innerHeight / 2, 100, ['#ffd700', '#2ecc71', '#00ffff']);
                advancedEffects.holographicGlow(document.getElementById('rouletteWheel'), 4000);
                effects.createConfetti(document.body, 4000);
                effects.floatingText(window.innerWidth / 2, 200, `+${totalWin.toFixed(2)} eGold!`, '#2ecc71', '3rem');
                effects.coinRain(2500);
            }, 500);

            await bettingSystem.placeBet('roulette', this.bets.reduce((sum, bet) => sum + bet.amount, 0), {
                winningNumber,
                winningColor,
                won: true,
                payout: totalWin
            });
        } else {
            this.showResult(`Number ${winningNumber} (${winningColor}) - Better luck next time!`, '#e74c3c');
            effects.shake(document.getElementById('wheelResult'));
            
            await bettingSystem.placeBet('roulette', this.bets.reduce((sum, bet) => sum + bet.amount, 0), {
                winningNumber,
                winningColor,
                won: false
            });
        }
    }

    showResult(message, color) {
        const resultDiv = document.getElementById('rouletteResult');
        resultDiv.textContent = message;
        resultDiv.style.color = color;
    }
}
