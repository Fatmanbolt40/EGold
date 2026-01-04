// 16-Sided Dice Raffle Game

let diceRaffleGame;

function initDiceRaffle(container) {
    diceRaffleGame = new DiceRaffleGame();
    diceRaffleGame.init(container);
}

class DiceRaffleGame {
    constructor() {
        this.currentPool = 0;
        this.entries = [];
        this.ticketPrice = 25;
        this.drawTime = null;
        this.winningNumber = null;
    }

    init(container) {
        container.innerHTML = `
            <div class="game-info">
                <h3>16-Sided Dice Raffle</h3>
                <p>Buy tickets with numbers 1-16. When the raffle draws, one number wins the entire pool!</p>
                <p>Ticket Price: ${this.ticketPrice} eGold | Current Pool: <span id="rafflePool">0</span> eGold</p>
            </div>

            <div class="dice-container" style="margin: 40px auto;">
                <div class="dice" id="raffleDice" style="
                    width: 150px;
                    height: 150px;
                    margin: 0 auto;
                    position: relative;
                    transform-style: preserve-3d;
                    transition: transform 2s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                ">
                    <div class="dice-face" id="diceFace" style="
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #ff6b6b, #ee5a6f, #ff6b6b);
                        border-radius: 20px;
                        font-size: 5rem;
                        box-shadow: 0 10px 40px rgba(255, 107, 107, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3);
                        border: 3px solid #c23b3b;
                    ">
                        🎲
                    </div>
                </div>
            </div>

            <div class="lottery-selection" style="max-width: 800px; margin: 0 auto;">
                <h4>Buy Raffle Tickets</h4>
                <p>Each number can have multiple tickets. More tickets = better odds!</p>
                <div class="lottery-numbers" id="raffleNumbers"></div>
            </div>

            <div id="raffleEntries" class="game-info" style="margin: 20px 0;">
                <h4>Your Entries</h4>
                <div id="entriesList">No entries yet</div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <button onclick="diceRaffleGame.drawRaffle()" class="btn-play" id="drawRaffleBtn">
                    Draw Raffle
                </button>
                <button onclick="diceRaffleGame.reset()" class="bet-btn">
                    Reset Pool
                </button>
            </div>

            <div id="raffleResult" class="game-message"></div>
        `;

        this.renderNumbers();
        this.updateDisplay();
        this.container = container;
    }

    renderNumbers() {
        const numbersDiv = document.getElementById('raffleNumbers');
        numbersDiv.innerHTML = '';

        for (let i = 1; i <= 16; i++) {
            const ball = document.createElement('div');
            ball.className = 'lottery-ball';
            
            const count = this.entries.filter(e => e === i).length;
            ball.innerHTML = `
                <div style="font-size: 1.5rem;">${i}</div>
                ${count > 0 ? `<div style="font-size: 0.8rem;">${count} tickets</div>` : ''}
            `;
            
            ball.addEventListener('click', () => this.buyTicket(i));
            numbersDiv.appendChild(ball);
        }
    }

    buyTicket(number) {
        if (currentBalance < this.ticketPrice) {
            alert('Insufficient balance!');
            return;
        }

        updateBalance(-this.ticketPrice);
        this.entries.push(number);
        this.currentPool += this.ticketPrice;
        
        this.renderNumbers();
        this.updateDisplay();
        
        this.showMessage(`Ticket purchased for number ${number}!`);
    }

    updateDisplay() {
        document.getElementById('rafflePool').textContent = this.currentPool.toFixed(2);
        
        if (this.entries.length > 0) {
            const entryCounts = {};
            this.entries.forEach(num => {
                entryCounts[num] = (entryCounts[num] || 0) + 1;
            });
            
            const entriesHTML = Object.entries(entryCounts)
                .map(([num, count]) => `Number ${num}: ${count} ticket${count > 1 ? 's' : ''}`)
                .join('<br>');
            
            document.getElementById('entriesList').innerHTML = entriesHTML;
        } else {
            document.getElementById('entriesList').textContent = 'No entries yet';
        }

        document.getElementById('drawRaffleBtn').disabled = this.entries.length === 0;
    }

    async drawRaffle() {
        if (this.entries.length === 0) {
            alert('No entries in the raffle!');
            return;
        }

        document.getElementById('drawRaffleBtn').disabled = true;
        
        // Epic 3D dice roll animation
        const dice = document.getElementById('raffleDice');
        const diceFace = document.getElementById('diceFace');
        const diceRect = dice.getBoundingClientRect();
        
        // Pre-roll effects
        advancedEffects.shockwave(diceRect.left + diceRect.width / 2, diceRect.top + diceRect.height / 2, '#ff6b6b');
        
        this.showMessage('Rolling the dice...');

        // 3D rotation animation with random numbers
        const spins = 8 + Math.floor(Math.random() * 4);
        dice.style.transform = `
            rotateX(${spins * 360 + Math.random() * 360}deg) 
            rotateY(${spins * 360 + Math.random() * 360}deg) 
            rotateZ(${spins * 360 + Math.random() * 360}deg)
            scale(1.2)
        `;
        
        // Rapid number changes during spin
        for (let i = 0; i < 20; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            const randomNum = Math.floor(Math.random() * 16) + 1;
            diceFace.textContent = randomNum;
        }

        // Final result
        this.winningNumber = Math.floor(Math.random() * 16) + 1;
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Reset dice to flat position with final number
        dice.style.transition = 'transform 800ms cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        dice.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';
        
        setTimeout(() => {
            advancedEffects.explosion(diceRect.left + diceRect.width / 2, diceRect.top + diceRect.height / 2, 40, ['#ff6b6b', '#ffd700', '#2ecc71']);
        }, 400);
        
        diceFace.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div class="neon-text" style="font-size: 4.5rem; color: #d4af37; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${this.winningNumber}</div>
                <div style="font-size: 1rem; color: #2ecc71; font-weight: bold; margin-top: -10px;">WINNER!</div>
            </div>
        `;

        // Check if player won
        const playerWinningTickets = this.entries.filter(e => e === this.winningNumber).length;
        const totalWinningTickets = this.entries.filter(e => e === this.winningNumber).length;

        if (playerWinningTickets > 0) {
            // Player has winning tickets
            const playerShare = (playerWinningTickets / totalWinningTickets) * this.currentPool;
            updateBalance(playerShare);
            
            this.showMessage(`🎉 WINNER! Number ${this.winningNumber} wins! You won ${playerShare.toFixed(2)} eGold!`);
            document.getElementById('raffleResult').style.color = '#2ecc71';
            
            // Epic visual effects
            setTimeout(() => {
                const diceRect = dice.getBoundingClientRect();
                advancedEffects.explosion(diceRect.left + diceRect.width / 2, diceRect.top + diceRect.height / 2, 80, ['#2ecc71', '#ffd700', '#00ffff']);
                advancedEffects.holographicGlow(dice, 4000);
                advancedEffects.matrixRain(document.querySelector('.dice-container'), 3000, '#2ecc71');
                effects.createConfetti(document.body, 4000);
                effects.floatingText(window.innerWidth / 2, 200, `+${playerShare.toFixed(2)} eGold!`, '#2ecc71', '3.5rem');
                effects.coinRain(2500);
                effects.glowPulse(dice, '#2ecc71', 1500);
            }, 500);
            
            await bettingSystem.placeBet('diceraffle', this.ticketPrice * playerWinningTickets, {
                winningNumber: this.winningNumber,
                playerTickets: playerWinningTickets,
                prize: playerShare
            });
        } else {
            this.showMessage(`😔 Number ${this.winningNumber} wins. You didn't have any tickets for that number.`);
            document.getElementById('raffleResult').style.color = '#e74c3c';
            const messageEl = document.getElementById('raffleResult');
            effects.shake(messageEl);
        }

        setTimeout(() => {
            if (confirm('Start new raffle?')) {
                this.reset();
            }
        }, 3000);
    }

    reset() {
        this.currentPool = 0;
        this.entries = [];
        this.winningNumber = null;
        
        const dice = document.getElementById('raffleDice');
        const diceFace = document.getElementById('diceFace');
        if (diceFace) {
            diceFace.innerHTML = '🎲';
        } else {
            dice.innerHTML = '<div class="dice-face" id="diceFace">🎲</div>';
        }
        
        this.renderNumbers();
        this.updateDisplay();
        this.showMessage('');
        
        document.getElementById('drawRaffleBtn').disabled = true;
    }

    showMessage(msg) {
        document.getElementById('raffleResult').textContent = msg;
    }
}
