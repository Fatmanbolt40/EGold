// Scratch Off Game
const scratchoffGame = {
    ticketCost: 10,
    balance: 1000,
    isScratching: false,
    scratchedPercent: 0,
    prizeResult: null,
    canvas: null,
    ctx: null,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 1.8em; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">🎫 INSTANT WIN SCRATCHERS 🎫</h3>
                    
                    <div id="scratchCard" style="background: linear-gradient(145deg, #2c3e50 0%, #1a252f 100%); border-radius: 20px; padding: 40px; max-width: 500px; margin: 20px auto; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 30px rgba(255, 184, 0, 0.1); position: relative; border: 3px solid #FFB800;">
                        <div style="color: #FFB800; font-size: 2.2em; font-weight: bold; margin-bottom: 20px; text-shadow: 0 0 20px rgba(255, 184, 0, 0.8), 2px 2px 4px rgba(0,0,0,0.5);">🎟️ eGold Lottery</div>
                        <div id="scratchContainer" style="position: relative; width: 100%; max-width: 400px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
                            <div id="prizeArea" style="opacity: 0; border-radius: 15px; padding: 0; height: 250px; position: relative; overflow: hidden;"></div>
                            <canvas id="scratchCanvas" style="position: absolute; top: 0; left: 0; border-radius: 15px; cursor: crosshair; touch-action: none; box-shadow: inset 0 0 20px rgba(0,0,0,0.3);"></canvas>
                        </div>
                        <div id="scratchInstructions" style="margin-top: 25px; color: #FFB800; font-size: 1.2em; font-weight: 600; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">
                            👆 Click "Buy Ticket" to start!
                        </div>
                    </div>
                </div>
                
                <button onclick="scratchoffGame.buy()" id="buyButton" class="game-button" style="font-size: 1.4em; padding: 18px 50px; box-shadow: 0 8px 20px rgba(255, 184, 0, 0.3);">
                    🎫 Buy Ticket (10 eGold)
                </button>
                
                <div id="scratchResult" class="game-result"></div>
                
                <div class="game-info-box">
                    <h3>👑 Instant Win Scratchers</h3>
                    <p style="font-size: 1.1em; color: #cccccc; margin: 10px 0;">Scratch to reveal your prize - professional scratch-off patterns!</p>
                    <h4 style="color: #FFB800; margin-top: 20px;">💎 Prize Patterns & Winning Combinations</h4>
                    <div style="display: grid; gap: 10px; margin-top: 15px;">
                        <div style="padding: 12px; background: linear-gradient(135deg, rgba(255, 184, 0, 0.2), rgba(212, 175, 55, 0.2)); border-radius: 8px; border: 2px solid #FFB800;">
                            💎💎💎 Diamond Triple: <b style="color: #FFB800; font-size: 1.3em;">500 eGold</b> <small style="color: #2ecc71;">($50 USD)</small> - <span style="color: #888;">1% chance</span>
                        </div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 5px;">⭐⭐⭐ Star Triple: <b>100 eGold</b> <small style="color: #2ecc71;">($10 USD)</small> - <span style="color: #888;">2% chance</span></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 5px;">🎯🎯🎯 Bulls-Eye Match: <b>50 eGold</b> <small style="color: #2ecc71;">($5 USD)</small> - <span style="color: #888;">5% chance</span></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 5px;">🎁🎁🎁 Gift Triple: <b>25 eGold</b> <small style="color: #2ecc71;">($2.50 USD)</small> - <span style="color: #888;">8% chance</span></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 5px;">💰💰💰 Money Bags: <b>15 eGold</b> <small style="color: #2ecc71;">($1.50 USD)</small> - <span style="color: #888;">14% chance</span></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 5px;">🍀🍀 Lucky Pair: <b>5 eGold</b> <small style="color: #2ecc71;">($0.50 USD)</small> - <span style="color: #888;">10% chance</span></div>
                        <div style="padding: 8px; background: rgba(231, 76, 60, 0.1); border-radius: 5px; color: #e74c3c;">😢 No Match - <span style="color: #888;">60% chance</span></div>
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 2px solid #2ecc71;">
                        <h4 style="color: #2ecc71; margin-bottom: 10px;">📜 Game Rules</h4>
                        <ul style="text-align: left; max-width: 450px; margin: 0 auto; color: #cccccc; line-height: 1.8;">
                            <li>Purchase a scratch card for <b>10 eGold</b></li>
                            <li><b>Scratch</b> the metallic coating to reveal symbols</li>
                            <li>Match 3 symbols to win the prize!</li>
                            <li>Use mouse or finger to scratch off the coating</li>
                            <li>Win up to <b style="color: #FFB800;">500 eGold!</b></li>
                            <li>40% overall win rate with professional patterns</li>
                            <li>Instant payout when fully revealed</li>
                            <li>Buy another card to play again</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        this.setupCanvas();
    },
    
    setupCanvas() {
        this.canvas = document.getElementById('scratchCanvas');
        if (!this.canvas) return;
        
        const container = document.getElementById('scratchContainer');
        this.canvas.width = container.offsetWidth;
        this.canvas.height = 250;
        this.ctx = this.canvas.getContext('2d');
        
        // Draw initial scratch-off coating
        this.drawScratchCoating();
    },
    
    drawScratchCoating() {
        if (!this.ctx) return;
        
        // Create metallic gradient base
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#d4d4d4');
        gradient.addColorStop(0.25, '#a8a8a8');
        gradient.addColorStop(0.5, '#c0c0c0');
        gradient.addColorStop(0.75, '#9e9e9e');
        gradient.addColorStop(1, '#b8b8b8');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add depth with shadows
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 5;
        
        // Add realistic metallic texture
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = Math.random() * 3 + 1;
            const brightness = Math.random() * 100 + 100;
            
            this.ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${Math.random() * 0.4 + 0.2})`;
            this.ctx.fillRect(x, y, size, size);
        }
        
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        
        // Add diagonal shine effect
        const shineGradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        shineGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.3)');
        shineGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = shineGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add "SCRATCH HERE" text with embossed effect
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        this.ctx.shadowBlur = 2;
        this.ctx.shadowOffsetX = -1;
        this.ctx.shadowOffsetY = -1;
        
        this.ctx.fillStyle = '#666';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SCRATCH HERE', this.canvas.width / 2, this.canvas.height / 2 - 10);
        
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        this.ctx.shadowOffsetX = 1;
        this.ctx.shadowOffsetY = 1;
        
        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillStyle = '#777';
        this.ctx.fillText('🖐️ Scratch to reveal symbols', this.canvas.width / 2, this.canvas.height / 2 + 25);
        
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
    },
    
    buy() {
        // Check if player has enough balance
        if (this.balance < this.ticketCost) {
            document.getElementById('scratchResult').innerHTML = '<span style="color: #e74c3c;">❌ Insufficient balance!</span>';
            return;
        }
        
        // Deduct ticket cost from balance
        this.balance -= this.ticketCost;
        
        // Generate the prize BEFORE scratching
        this.prizeResult = this.generatePrize();
        
        // Create the prize pattern (completely hidden with opacity 0)
        this.createPrizePattern();
        
        // Reset scratch state
        this.scratchedPercent = 0;
        this.isScratching = false;
        
        // Redraw the scratch coating
        this.drawScratchCoating();
        
        // Enable scratching
        this.setupScratchEvents();
        
        // Update instructions
        document.getElementById('scratchInstructions').innerHTML = '✨ Scratch to reveal your symbols!';
        document.getElementById('buyButton').disabled = true;
        document.getElementById('buyButton').style.opacity = '0.5';
        
        // Clear previous result
        document.getElementById('scratchResult').innerHTML = '';
    },
    
    createPrizePattern() {
        const prizeArea = document.getElementById('prizeArea');
        if (!prizeArea || !this.prizeResult) return;
        
        // Prize area is completely invisible until revealed
        prizeArea.style.opacity = '0';
        
        let pattern = '';
        
        if (this.prizeResult.prize > 0) {
            // Winner - show matching pattern
            const bgGradient = this.prizeResult.prize >= 100 ? 
                'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)' : 
                'linear-gradient(135deg, #2ecc71 0%, #27ae60 50%, #1e8449 100%)';
            
            pattern = `
                <div style="background: ${bgGradient}; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; overflow: hidden;">
                    <!-- Animated background pattern -->
                    <div style="position: absolute; inset: 0; opacity: 0.1; background-image: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.3) 35px, rgba(255,255,255,.3) 70px);"></div>
                    
                    <!-- Prize symbols in a row -->
                    <div style="display: flex; gap: 25px; margin-bottom: 20px; position: relative; z-index: 2;">
                        <div style="font-size: 5em; text-shadow: 0 5px 15px rgba(0,0,0,0.4), 0 0 30px rgba(255,255,255,0.3); animation: bounceIn 0.6s ease-out; filter: drop-shadow(0 0 20px rgba(255,184,0,0.6));">
                            ${this.prizeResult.symbol}
                        </div>
                        <div style="font-size: 5em; text-shadow: 0 5px 15px rgba(0,0,0,0.4), 0 0 30px rgba(255,255,255,0.3); animation: bounceIn 0.8s ease-out; filter: drop-shadow(0 0 20px rgba(255,184,0,0.6));">
                            ${this.prizeResult.symbol}
                        </div>
                        <div style="font-size: 5em; text-shadow: 0 5px 15px rgba(0,0,0,0.4), 0 0 30px rgba(255,255,255,0.3); animation: bounceIn 1s ease-out; filter: drop-shadow(0 0 20px rgba(255,184,0,0.6));">
                            ${this.prizeResult.symbol}
                        </div>
                    </div>
                    
                    <!-- WIN text -->
                    <div style="background: rgba(0,0,0,0.3); padding: 15px 40px; border-radius: 50px; backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); border: 3px solid rgba(255,255,255,0.3);">
                        <div style="font-size: 2.5em; font-weight: 900; color: white; text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 4px 8px rgba(0,0,0,0.5); letter-spacing: 3px;">
                            ${this.prizeResult.prize >= 100 ? '🎊 JACKPOT! 🎊' : '🎉 WINNER! 🎉'}
                        </div>
                        <div style="font-size: 1.8em; font-weight: bold; color: #FFD700; margin-top: 10px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                            ${this.prizeResult.prize} eGold
                        </div>
                    </div>
                    
                    <!-- Decorative elements -->
                    <div style="position: absolute; top: 10px; left: 10px; font-size: 2em; opacity: 0.3; animation: rotate 4s linear infinite;">✨</div>
                    <div style="position: absolute; top: 10px; right: 10px; font-size: 2em; opacity: 0.3; animation: rotate 4s linear infinite reverse;">✨</div>
                    <div style="position: absolute; bottom: 10px; left: 10px; font-size: 2em; opacity: 0.3; animation: rotate 4s linear infinite reverse;">💫</div>
                    <div style="position: absolute; bottom: 10px; right: 10px; font-size: 2em; opacity: 0.3; animation: rotate 4s linear infinite;">💫</div>
                </div>
            `;
        } else {
            // Loser - show mismatched pattern
            const symbols = ['🎲', '🎰', '🎯'];
            const randomSymbols = symbols.sort(() => Math.random() - 0.5);
            
            pattern = `
                <div style="background: linear-gradient(135deg, #34495e 0%, #2c3e50 50%, #1a252f 100%); height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; overflow: hidden;">
                    <!-- Background pattern -->
                    <div style="position: absolute; inset: 0; opacity: 0.05; background-image: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px);"></div>
                    
                    <!-- Mixed symbols (no match) -->
                    <div style="display: flex; gap: 25px; margin-bottom: 20px; position: relative; z-index: 2;">
                        <div style="font-size: 5em; text-shadow: 0 5px 15px rgba(0,0,0,0.6); opacity: 0.7; filter: grayscale(50%);">
                            ${randomSymbols[0]}
                        </div>
                        <div style="font-size: 5em; text-shadow: 0 5px 15px rgba(0,0,0,0.6); opacity: 0.7; filter: grayscale(50%);">
                            ${randomSymbols[1]}
                        </div>
                        <div style="font-size: 5em; text-shadow: 0 5px 15px rgba(0,0,0,0.6); opacity: 0.7; filter: grayscale(50%);">
                            ${randomSymbols[2]}
                        </div>
                    </div>
                    
                    <!-- NO MATCH text -->
                    <div style="background: rgba(231, 76, 60, 0.2); padding: 15px 40px; border-radius: 50px; backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); border: 3px solid rgba(231, 76, 60, 0.4);">
                        <div style="font-size: 2em; font-weight: 900; color: #e74c3c; text-shadow: 0 2px 4px rgba(0,0,0,0.5); letter-spacing: 2px;">
                            NO MATCH
                        </div>
                        <div style="font-size: 1.3em; font-weight: bold; color: #bdc3c7; margin-top: 8px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                            Try Again!
                        </div>
                    </div>
                    
                    <!-- Sad faces -->
                    <div style="position: absolute; top: 15px; left: 15px; font-size: 2.5em; opacity: 0.2;">😢</div>
                    <div style="position: absolute; top: 15px; right: 15px; font-size: 2.5em; opacity: 0.2;">😢</div>
                </div>
            `;
        }
        
        prizeArea.innerHTML = pattern;
    },
    
    generatePrize() {
        // Generate random outcome with proper probability distribution
        const outcomes = [
            { symbol: '💎', prize: 500, chance: 0.01, name: 'Diamond Triple' },
            { symbol: '⭐', prize: 100, chance: 0.02, name: 'Star Triple' },
            { symbol: '🎯', prize: 50, chance: 0.05, name: 'Bulls-Eye Match' },
            { symbol: '🎁', prize: 25, chance: 0.08, name: 'Gift Triple' },
            { symbol: '💰', prize: 15, chance: 0.14, name: 'Money Bags' },
            { symbol: '🍀', prize: 5, chance: 0.10, name: 'Lucky Pair' },
            { symbol: '😢', prize: 0, chance: 0.60, name: 'No Match' }
        ];
        
        const random = Math.random();
        let cumulative = 0;
        
        for (const outcome of outcomes) {
            cumulative += outcome.chance;
            if (random <= cumulative) {
                return outcome;
            }
        }
        
        return outcomes[outcomes.length - 1];
    },
    
    setupScratchEvents() {
        const canvas = this.canvas;
        if (!canvas) return;
        
        let isMouseDown = false;
        
        // Mouse events
        canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            this.scratch(e.offsetX, e.offsetY);
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                this.scratch(e.offsetX, e.offsetY);
            }
        });
        
        canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        
        canvas.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });
        
        // Touch events
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.scratch(touch.clientX - rect.left, touch.clientY - rect.top);
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.scratch(touch.clientX - rect.left, touch.clientY - rect.top);
        });
    },
    
    scratch(x, y) {
        if (!this.ctx) return;
        
        // Erase the scratch coating at mouse/touch position with larger brush
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 30, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Check how much has been scratched
        this.checkScratchProgress();
    },
    
    checkScratchProgress() {
        if (!this.ctx) return;
        
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixels = imageData.data;
        let transparent = 0;
        
        // Count transparent pixels
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 128) {
                transparent++;
            }
        }
        
        this.scratchedPercent = (transparent / (pixels.length / 4)) * 100;
        
        // Gradually reveal the prize as scratching progresses
        const prizeArea = document.getElementById('prizeArea');
        if (prizeArea && this.scratchedPercent > 20) {
            // Fade in prize as scratching progresses (20% to 100% scratch = 0 to 1 opacity)
            const opacity = Math.min((this.scratchedPercent - 20) / 80, 1);
            prizeArea.style.opacity = opacity.toString();
        }
        
        // If more than 65% scratched, fully reveal and complete
        if (this.scratchedPercent > 65 && this.prizeResult) {
            this.revealResult();
        }
    },
    
    revealResult() {
        if (!this.prizeResult) return;
        
        // Clear the canvas completely and hide it
        this.canvas.style.display = 'none';
        
        // Ensure prize area is fully visible
        const prizeArea = document.getElementById('prizeArea');
        if (prizeArea) {
            prizeArea.style.opacity = '1';
        }
        
        const resultDiv = document.getElementById('scratchResult');
        
        // Update balance if there's a win
        if (this.prizeResult.prize > 0) {
            this.balance += this.prizeResult.prize;
            
            if (this.prizeResult.prize >= 100) {
                resultDiv.className = 'game-result jackpot-effect';
                resultDiv.innerHTML = `
                    <div style="animation: pulse 0.5s ease-in-out infinite alternate;">
                        <span style="font-size: 2.5em;">🎊 ${this.prizeResult.name.toUpperCase()}! 🎊</span><br>
                        <span style="font-size: 2em; color: #FFD700;">You won ${this.prizeResult.prize} eGold!</span><br>
                        <span style="font-size: 1.3em; color: #2ecc71;">($${(this.prizeResult.prize * 0.10).toFixed(2)} USD)</span>
                    </div>
                `;
            } else {
                resultDiv.className = 'game-result win-effect';
                resultDiv.innerHTML = `
                    <span style="font-size: 2em;">🎉 ${this.prizeResult.name}! 🎉</span><br>
                    <span style="font-size: 1.8em;">You won ${this.prizeResult.prize} eGold!</span><br>
                    <span style="font-size: 1.2em; color: #2ecc71;">($${(this.prizeResult.prize * 0.10).toFixed(2)} USD)</span>
                `;
            }
        } else {
            resultDiv.className = 'game-result loss-effect';
            resultDiv.innerHTML = `
                <span style="font-size: 1.8em;">😢 No Match This Time!</span><br>
                <span style="font-size: 1.3em; color: #bdc3c7;">Better luck on the next card!</span>
            `;
        }
        
        // Update instructions
        document.getElementById('scratchInstructions').innerHTML = '🎫 Buy another ticket to play again!';
        
        // Reset after delay
        setTimeout(() => {
            this.resetGame();
        }, 4000);
    },
    
    resetGame() {
        // Reset state
        this.prizeResult = null;
        this.scratchedPercent = 0;
        this.isScratching = false;
        
        // Reset canvas
        if (this.canvas) {
            this.canvas.style.display = 'block';
            this.drawScratchCoating();
        }
        
        // Hide prize area completely
        const prizeArea = document.getElementById('prizeArea');
        if (prizeArea) {
            prizeArea.style.opacity = '0';
            prizeArea.innerHTML = '';
        }
        
        // Re-enable buy button
        const buyButton = document.getElementById('buyButton');
        if (buyButton) {
            buyButton.disabled = false;
            buyButton.style.opacity = '1';
        }
        
        // Reset instructions
        const instructions = document.getElementById('scratchInstructions');
        if (instructions) {
            instructions.innerHTML = '👆 Click "Buy Ticket" to start!';
        }
        
        // Clear result
        document.getElementById('scratchResult').innerHTML = '';
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes bounceIn {
        0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
        }
        50% {
            transform: scale(1.2) rotate(10deg);
        }
        100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
        }
    }
    
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    @keyframes pulse {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

// Make it globally accessible
window.scratchoffGame = scratchoffGame;
