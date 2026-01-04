// Scratch Off Game

let scratchOffGame;

function initScratchOff(container) {
    scratchOffGame = new ScratchOffGame();
    scratchOffGame.init(container);
}

class ScratchOffGame {
    constructor() {
        this.isScratching = false;
        this.scratchedPercent = 0;
        this.prizes = [0, 0, 5, 10, 20, 50, 100, 500, 1000];
    }

    init(container) {
        container.innerHTML = `
            <div class="game-info">
                <h3>Scratch Off Tickets</h3>
                <p>Scratch to reveal your prize! Tickets cost 10 eGold each.</p>
                <p>Prizes range from 0 to 1000 eGold!</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <button onclick="scratchOffGame.buyTicket()" class="btn-play" id="buyTicketBtn">
                    Buy Ticket (10 eGold)
                </button>
            </div>

            <div id="scratchArea" style="display: none;">
                <div class="scratch-card-container" style="position: relative; width: 400px; margin: 0 auto;">
                    <canvas id="scratchCanvas" width="400" height="300" 
                            style="border: 3px solid #d4af37; border-radius: 10px; cursor: crosshair;"></canvas>
                    <div id="prizeReveal" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                                                  display: flex; align-items: center; justify-content: center; 
                                                  font-size: 3rem; font-weight: bold; color: #d4af37;
                                                  pointer-events: none; z-index: 1;">
                    </div>
                </div>
                <div id="scratchMessage" class="game-message" style="margin-top: 20px;"></div>
            </div>
        `;

        this.container = container;
    }

    buyTicket() {
        if (currentBalance < 10) {
            alert('Insufficient balance! Need 10 eGold.');
            return;
        }

        updateBalance(-10);
        this.prize = this.prizes[Math.floor(Math.random() * this.prizes.length)];
        
        document.getElementById('buyTicketBtn').style.display = 'none';
        document.getElementById('scratchArea').style.display = 'block';
        
        this.setupCanvas();
    }

    setupCanvas() {
        const canvas = document.getElementById('scratchCanvas');
        const ctx = canvas.getContext('2d');
        
        // Draw prize underneath
        document.getElementById('prizeReveal').innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 20px;">
                    ${this.prize === 0 ? '😢' : '💰'}
                </div>
                <div>${this.prize} eGold</div>
            </div>
        `;

        // Draw scratch surface
        ctx.fillStyle = '#888';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#666';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);

        this.scratchedPercent = 0;
        this.isScratching = false;

        // Add scratching functionality
        let scratching = false;

        canvas.addEventListener('mousedown', () => scratching = true);
        canvas.addEventListener('mouseup', () => scratching = false);
        canvas.addEventListener('mouseleave', () => scratching = false);

        canvas.addEventListener('mousemove', (e) => {
            if (scratching) {
                this.scratch(ctx, e.offsetX, e.offsetY);
            }
        });

        // Touch support
        canvas.addEventListener('touchstart', (e) => {
            scratching = true;
            e.preventDefault();
        });
        
        canvas.addEventListener('touchend', () => scratching = false);
        
        canvas.addEventListener('touchmove', (e) => {
            if (scratching) {
                const rect = canvas.getBoundingClientRect();
                const touch = e.touches[0];
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                this.scratch(ctx, x, y);
                e.preventDefault();
            }
        });
    }

    scratch(ctx, x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, 2 * Math.PI);
        ctx.fill();

        this.scratchedPercent++;

        // Check if fully scratched
        if (this.scratchedPercent > 100) {
            this.revealPrize();
        }
    }

    revealPrize() {
        const canvas = document.getElementById('scratchCanvas');
        canvas.style.display = 'none';
        
        const message = this.prize > 0 
            ? `Congratulations! You won ${this.prize} eGold!` 
            : 'Better luck next time!';
        
        document.getElementById('scratchMessage').textContent = message;
        document.getElementById('scratchMessage').style.color = this.prize > 0 ? '#2ecc71' : '#e74c3c';

        if (this.prize > 0) {
            updateBalance(this.prize);
            bettingSystem.placeBet('scratchoff', 10, { prize: this.prize, won: true });
            
            // Visual effects
            setTimeout(() => {
                if (this.prize >= 500) {
                    effects.createConfetti(document.body, 4000);
                    effects.floatingText(window.innerWidth / 2, 300, '🎊 BIG WIN! 🎊', '#ffd700', '3.5rem');
                } else if (this.prize >= 50) {
                    effects.createBurst(window.innerWidth / 2, 400, '#d4af37', 30);
                    effects.floatingText(window.innerWidth / 2, 300, `+${this.prize} eGold!`, '#2ecc71', '3rem');
                } else {
                    effects.floatingText(window.innerWidth / 2, 300, `+${this.prize} eGold`, '#2ecc71', '2.5rem');
                }
            }, 200);
        }

        setTimeout(() => {
            if (confirm('Buy another ticket?')) {
                document.getElementById('buyTicketBtn').style.display = 'block';
                document.getElementById('scratchArea').style.display = 'none';
            }
        }, 2000);
    }
}
