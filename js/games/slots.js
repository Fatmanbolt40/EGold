// Slot Machine Game

let slotsGame;

function initSlots(container) {
    slotsGame = new SlotsGame();
    slotsGame.init(container);
}

class SlotsGame {
    constructor() {
        this.isSpinning = false;
        this.symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];
        this.reels = [[], [], []];
        this.multipliers = {
            '🍒': 2,
            '🍋': 3,
            '🍊': 4,
            '🍇': 5,
            '⭐': 10,
            '💎': 25,
            '7️⃣': 100
        };
    }

    init(container) {
        container.innerHTML = `
            <div class="game-info">
                <h3>💰 Luxury Slots</h3>
                <p>Match 3 symbols to win! Higher value symbols pay more!</p>
                <div style="margin: 15px 0; padding: 15px; background: rgba(255, 215, 0, 0.1); border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3);">
                    <h4 style="margin: 0 0 10px 0; color: #ffd700;">💎 Paytable</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 0.9rem;">
                        <div>🍒🍒🍒 = 2x</div>
                        <div>🍋🍋🍋 = 3x</div>
                        <div>🍊🍊🍊 = 4x</div>
                        <div>🍇🍇🍇 = 5x</div>
                        <div>⭐⭐⭐ = 10x</div>
                        <div>💎💎💎 = 25x</div>
                        <div style="grid-column: span 2; text-align: center; font-size: 1.1rem; color: #d4af37;">7️⃣7️⃣7️⃣ = 100x JACKPOT!</div>
                    </div>
                </div>
            </div>

            <div class="slots-machine" style="
                max-width: 600px;
                margin: 30px auto;
                padding: 40px;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(255, 215, 0, 0.2);
                border: 5px solid #d4af37;
            ">
                <div class="reels-container" style="
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 30px;
                    background: linear-gradient(180deg, #0f3460 0%, #16213e 100%);
                    padding: 30px 20px;
                    border-radius: 15px;
                    box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.8);
                ">
                    ${[0, 1, 2].map(i => `
                        <div class="reel" id="reel${i}" style="
                            width: 120px;
                            height: 140px;
                            background: linear-gradient(135deg, #2c3e50, #34495e);
                            border-radius: 15px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 5rem;
                            position: relative;
                            overflow: hidden;
                            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5);
                            border: 3px solid #d4af37;
                        ">
                            <div class="reel-symbols" id="symbols${i}" style="
                                position: absolute;
                                top: 0;
                                width: 100%;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                transition: transform 0.1s linear;
                            ">
                                <div class="symbol">🎰</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div style="text-align: center;">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label for="slotsBet" style="color: #ffd700; font-size: 1.1rem; display: block; margin-bottom: 10px;">Bet Amount (eGold):</label>
                        <input type="number" id="slotsBet" min="1" max="${currentBalance || 1000}" value="10" step="1" 
                            style="width: 200px; padding: 10px; font-size: 1.2rem; text-align: center; border-radius: 10px; border: 2px solid #d4af37; background: rgba(0,0,0,0.3); color: #ffd700;">
                    </div>

                    <button onclick="slotsGame.spin()" class="btn-play" id="spinBtn" style="
                        font-size: 1.5rem;
                        padding: 15px 60px;
                        background: linear-gradient(135deg, #ffd700, #ffed4e);
                        color: #000;
                        border: none;
                        border-radius: 50px;
                        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    ">
                        🎰 SPIN 🎰
                    </button>
                </div>
            </div>

            <div id="slotsResult" class="game-message" style="font-size: 1.5rem; text-align: center; margin-top: 20px;"></div>
        `;

        this.container = container;
        this.initializeReels();
    }

    initializeReels() {
        for (let i = 0; i < 3; i++) {
            this.reels[i] = [this.getRandomSymbol()];
        }
    }

    getRandomSymbol() {
        return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }

    async spin() {
        if (this.isSpinning) return;

        const betAmount = parseFloat(document.getElementById('slotsBet').value);
        
        if (betAmount > currentBalance) {
            this.showResult('Insufficient balance!', '#e74c3c');
            return;
        }

        if (betAmount <= 0) {
            this.showResult('Invalid bet amount!', '#e74c3c');
            return;
        }

        this.isSpinning = true;
        updateBalance(-betAmount);
        document.getElementById('spinBtn').disabled = true;
        document.getElementById('spinBtn').textContent = '🎰 SPINNING... 🎰';

        // Play sound effect
        sound.play('deal');

        // Start spinning all reels
        for (let i = 0; i < 3; i++) {
            this.spinReel(i);
        }

        // Determine final results
        const results = [
            this.getRandomSymbol(),
            this.getRandomSymbol(),
            this.getRandomSymbol()
        ];

        // Stop reels one by one with delay
        await this.stopReel(0, results[0], 1500);
        await this.stopReel(1, results[1], 2000);
        await this.stopReel(2, results[2], 2500);

        // Check for wins
        await this.checkWin(results, betAmount);

        this.isSpinning = false;
        document.getElementById('spinBtn').disabled = false;
        document.getElementById('spinBtn').textContent = '🎰 SPIN 🎰';
    }

    spinReel(reelIndex) {
        const symbolsDiv = document.getElementById(`symbols${reelIndex}`);
        let position = 0;
        const symbolHeight = 140; // Match reel height
        
        // Create multiple symbols for spinning effect
        const spinSymbols = [];
        for (let i = 0; i < 20; i++) {
            spinSymbols.push(this.getRandomSymbol());
        }
        
        symbolsDiv.innerHTML = spinSymbols.map(s => 
            `<div class="symbol" style="height: ${symbolHeight}px; display: flex; align-items: center; justify-content: center; font-size: 5rem;">${s}</div>`
        ).join('');

        const spinInterval = setInterval(() => {
            position += 10;
            symbolsDiv.style.transform = `translateY(-${position}px)`;
            
            if (position >= symbolHeight * 20) {
                position = 0;
            }
        }, 50);

        symbolsDiv.dataset.spinInterval = spinInterval;
    }

    async stopReel(reelIndex, finalSymbol, delay) {
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const symbolsDiv = document.getElementById(`symbols${reelIndex}`);
        const reel = document.getElementById(`reel${reelIndex}`);
        
        // Clear spin interval
        clearInterval(parseInt(symbolsDiv.dataset.spinInterval));
        
        // Animate to final position
        symbolsDiv.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        symbolsDiv.style.transform = 'translateY(0)';
        symbolsDiv.innerHTML = `<div class="symbol" style="height: 140px; display: flex; align-items: center; justify-content: center; font-size: 5rem;">${finalSymbol}</div>`;
        
        // Flash effect on stop
        const reelRect = reel.getBoundingClientRect();
        advancedEffects.shockwave(reelRect.left + reelRect.width / 2, reelRect.top + reelRect.height / 2, '#ffd700');
        
        // Bounce effect
        await new Promise(resolve => setTimeout(resolve, 500));
        reel.style.animation = 'bounce 0.5s';
        setTimeout(() => {
            reel.style.animation = '';
        }, 500);
    }

    async checkWin(results, betAmount) {
        const [s1, s2, s3] = results;
        
        // Check if all three match
        if (s1 === s2 && s2 === s3) {
            const multiplier = this.multipliers[s1];
            const winAmount = betAmount * multiplier;
            
            updateBalance(winAmount);
            
            // Epic win animations
            if (multiplier >= 10) {
                // Big win!
                this.showResult(`🎉 EPIC WIN! ${s1}${s2}${s3} = ${winAmount.toFixed(2)} eGold!`, '#2ecc71');
                
                setTimeout(() => {
                    advancedEffects.explosion(window.innerWidth / 2, window.innerHeight / 2, 100, ['#ffd700', '#ff6b6b', '#2ecc71', '#00ffff']);
                    advancedEffects.matrixRain(document.querySelector('.slots-machine'), 4000, '#ffd700');
                    effects.createConfetti(document.body, 5000);
                    effects.coinRain(3000);
                    effects.floatingText(window.innerWidth / 2, 200, `+${winAmount.toFixed(2)} eGold!`, '#2ecc71', '4rem');
                    
                    // Holographic glow on all reels
                    for (let i = 0; i < 3; i++) {
                        const reel = document.getElementById(`reel${i}`);
                        advancedEffects.holographicGlow(reel, 5000);
                    }
                    
                    // Play win sound
                    sound.jackpotSound();
                }, 300);
            } else {
                // Regular win
                this.showResult(`✨ WIN! ${s1}${s2}${s3} = ${winAmount.toFixed(2)} eGold!`, '#2ecc71');
                
                setTimeout(() => {
                    effects.createConfetti(document.body, 2000);
                    effects.floatingText(window.innerWidth / 2, 200, `+${winAmount.toFixed(2)} eGold!`, '#2ecc71', '2.5rem');
                    sound.winSound(winAmount);
                }, 200);
            }
            
            await bettingSystem.placeBet('slots', betAmount, { result: results, won: true, payout: winAmount });
            
        } else {
            // No win
            this.showResult(`${s1} ${s2} ${s3} - Better luck next time!`, '#e74c3c');
            
            // Shake effect on loss
            const machine = document.querySelector('.slots-machine');
            effects.shake(machine);
            sound.play('lose');
            
            await bettingSystem.placeBet('slots', betAmount, { result: results, won: false });
        }
    }

    showResult(message, color) {
        const resultDiv = document.getElementById('slotsResult');
        resultDiv.textContent = message;
        resultDiv.style.color = color;
        
        if (color === '#2ecc71') {
            resultDiv.classList.add('neon-text');
            setTimeout(() => {
                resultDiv.classList.remove('neon-text');
            }, 5000);
        }
    }
}

// Add bounce animation
const slotsStyle = document.createElement('style');
slotsStyle.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        25% { transform: translateY(-10px); }
        50% { transform: translateY(0); }
        75% { transform: translateY(-5px); }
    }
    
    #spinBtn:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 15px 40px rgba(255, 215, 0, 0.7);
    }
    
    #spinBtn:active:not(:disabled) {
        transform: scale(0.95);
    }
`;
document.head.appendChild(slotsStyle);
