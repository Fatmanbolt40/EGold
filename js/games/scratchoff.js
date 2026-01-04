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
                    
                    <div id="scratchCard" style="background: linear-gradient(135deg, #FFB800 0%, #d4af37 100%); border-radius: 20px; padding: 40px; max-width: 450px; margin: 20px auto; box-shadow: 0 8px 32px rgba(255, 184, 0, 0.4); position: relative;">
                        <div style="color: #1A2332; font-size: 2.2em; font-weight: bold; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">🎟️ eGold Lottery</div>
                        <div id="scratchContainer" style="position: relative; width: 100%; max-width: 350px; margin: 0 auto;">
                            <div id="prizeArea" style="background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); border-radius: 15px; padding: 60px 20px; font-size: 3em; font-weight: bold; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); display: none;">
                                <div id="prizeSymbol"></div>
                                <div id="prizeAmount" style="font-size: 0.6em; margin-top: 10px;"></div>
                            </div>
                            <canvas id="scratchCanvas" style="position: absolute; top: 0; left: 0; border-radius: 15px; cursor: crosshair; touch-action: none;"></canvas>
                        </div>
                        <div id="scratchInstructions" style="margin-top: 20px; color: #1A2332; font-size: 1.2em; font-weight: 600;">
                            👆 Click "Buy Ticket" to start!
                        </div>
                    </div>
                </div>
                
                <button onclick="scratchoffGame.buy()" id="buyButton" class="game-button" style="font-size: 1.4em; padding: 18px 50px;">
                    🎫 Buy Ticket (10 eGold)
                </button>
                
                <div id="scratchResult" class="game-result"></div>
                
                <div class="game-info-box">
                    <h3>👑 Instant Win Scratchers</h3>
                    <p style="font-size: 1.1em; color: #cccccc; margin: 10px 0;">Scratch to reveal your prize - real scratch-off experience!</p>
                    <h4 style="color: #FFB800; margin-top: 20px;">💎 Possible Prizes</h4>
                    <div style="display: grid; gap: 10px; margin-top: 15px;">
                        <div style="padding: 12px; background: linear-gradient(135deg, rgba(255, 184, 0, 0.2), rgba(212, 175, 55, 0.2)); border-radius: 8px; border: 2px solid #FFB800;">
                            💎 Jackpot: <b style="color: #FFB800; font-size: 1.3em;">500 eGold</b> <small style="color: #2ecc71;">($50 USD)</small> - <span style="color: #888;">1% chance</span>
                        </div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 5px;">⭐ Big Win: <b>100 eGold</b> <small style="color: #2ecc71;">($10 USD)</small> - <span style="color: #888;">2% chance</span></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 5px;">🎯 Good Win: <b>50 eGold</b> <small style="color: #2ecc71;">($5 USD)</small> - <span style="color: #888;">5% chance</span></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 5px;">🎁 Nice: <b>25 eGold</b> <small style="color: #2ecc71;">($2.50 USD)</small> - <span style="color: #888;">8% chance</span></div>
                        <div style="padding: 8px; background: rgba(255, 184, 0, 0.1); border-radius: 5px;">💰 Win: <b>15 eGold</b> <small style="color: #2ecc71;">($1.50 USD)</small> - <span style="color: #888;">14% chance</span></div>
                        <div style="padding: 8px; background: rgba(231, 76, 60, 0.1); border-radius: 5px; color: #e74c3c;">😢 Better Luck Next Time - <span style="color: #888;">70% chance</span></div>
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 2px solid #2ecc71;">
                        <h4 style="color: #2ecc71; margin-bottom: 10px;">📜 Game Rules</h4>
                        <ul style="text-align: left; max-width: 450px; margin: 0 auto; color: #cccccc; line-height: 1.8;">
                            <li>Purchase a scratch card for <b>10 eGold</b></li>
                            <li><b>Scratch</b> the silver area to reveal your prize</li>
                            <li>Use mouse or finger to scratch off the coating</li>
                            <li>Win up to <b style="color: #FFB800;">500 eGold!</b></li>
                            <li>30% overall win rate</li>
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
        this.canvas.height = 200;
        this.ctx = this.canvas.getContext('2d');
        
        // Draw initial scratch-off coating
        this.drawScratchCoating();
    },
    
    drawScratchCoating() {
        if (!this.ctx) return;
        
        // Fill with silver scratch-off color
        this.ctx.fillStyle = '#c0c0c0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add texture pattern
        for (let i = 0; i < 50; i++) {
            this.ctx.fillStyle = `rgba(${150 + Math.random() * 50}, ${150 + Math.random() * 50}, ${150 + Math.random() * 50}, 0.3)`;
            this.ctx.fillRect(Math.random() * this.canvas.width, Math.random() * this.canvas.height, 
                             Math.random() * 20 + 5, Math.random() * 20 + 5);
        }
        
        // Add "SCRATCH HERE" text
        this.ctx.fillStyle = '#888';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SCRATCH HERE', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillText('👆 Use mouse or finger', this.canvas.width / 2, this.canvas.height / 2 + 30);
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
        
        // Show the prize area with the result
        const prizeArea = document.getElementById('prizeArea');
        const prizeSymbol = document.getElementById('prizeSymbol');
        const prizeAmount = document.getElementById('prizeAmount');
        
        prizeArea.style.display = 'block';
        
        if (this.prizeResult.prize > 0) {
            prizeArea.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';
            prizeSymbol.textContent = this.prizeResult.symbol;
            prizeAmount.textContent = `${this.prizeResult.prize} eGold`;
        } else {
            prizeArea.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
            prizeSymbol.textContent = this.prizeResult.symbol;
            prizeAmount.textContent = 'Try Again!';
        }
        
        // Reset scratch state
        this.scratchedPercent = 0;
        this.isScratching = false;
        
        // Redraw the scratch coating
        this.drawScratchCoating();
        
        // Enable scratching
        this.setupScratchEvents();
        
        // Update instructions
        document.getElementById('scratchInstructions').innerHTML = '✨ Scratch to reveal your prize!';
        document.getElementById('buyButton').disabled = true;
        document.getElementById('buyButton').style.opacity = '0.5';
        
        // Clear previous result
        document.getElementById('scratchResult').innerHTML = '';
    },
    
    generatePrize() {
        // Generate random outcome with proper probability distribution
        const outcomes = [
            { symbol: '💎', prize: 500, chance: 0.01 },
            { symbol: '⭐', prize: 100, chance: 0.02 },
            { symbol: '🎯', prize: 50, chance: 0.05 },
            { symbol: '🎁', prize: 25, chance: 0.08 },
            { symbol: '💰', prize: 15, chance: 0.14 },
            { symbol: '😢', prize: 0, chance: 0.70 }
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
        
        // Erase the scratch coating at mouse/touch position
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 25, 0, Math.PI * 2);
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
        
        // If more than 60% scratched, reveal the result
        if (this.scratchedPercent > 60 && this.prizeResult) {
            this.revealResult();
        }
    },
    
    revealResult() {
        if (!this.prizeResult) return;
        
        // Clear the canvas completely
        this.canvas.style.display = 'none';
        
        const resultDiv = document.getElementById('scratchResult');
        
        // Update balance if there's a win
        if (this.prizeResult.prize > 0) {
            this.balance += this.prizeResult.prize;
            
            if (this.prizeResult.prize >= 100) {
                resultDiv.className = 'game-result jackpot-effect';
                resultDiv.innerHTML = `<span style="font-size: 2em;">💫 JACKPOT! 💫</span><br><span style="font-size: 1.6em;">You won ${this.prizeResult.prize} eGold!</span>`;
            } else {
                resultDiv.className = 'game-result win-effect';
                resultDiv.innerHTML = `<span style="font-size: 1.8em;">🎉 You won ${this.prizeResult.prize} eGold!</span>`;
            }
        } else {
            resultDiv.className = 'game-result loss-effect';
            resultDiv.innerHTML = '<span style="font-size: 1.3em;">💔 Better luck next time!</span>';
        }
        
        // Update instructions
        document.getElementById('scratchInstructions').innerHTML = '🎫 Buy another ticket to play again!';
        
        // Reset after delay
        setTimeout(() => {
            this.resetGame();
        }, 3000);
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
        
        // Hide prize area
        const prizeArea = document.getElementById('prizeArea');
        if (prizeArea) {
            prizeArea.style.display = 'none';
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

// Make it globally accessible
window.scratchoffGame = scratchoffGame;
