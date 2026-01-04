// Standard Lottery Game

let lotteryGame;

function initStandardLottery(container) {
    lotteryGame = new StandardLotteryGame();
    lotteryGame.init(container);
}

class StandardLotteryGame {
    constructor() {
        this.selectedNumbers = [];
        this.maxNumbers = 6;
        this.numberRange = 49;
        this.ticketPrice = 20;
    }

    init(container) {
        container.innerHTML = `
            <div class="game-info">
                <h3>Standard Lottery</h3>
                <p>Pick ${this.maxNumbers} numbers from 1-${this.numberRange}. Match all to win the jackpot!</p>
                <p>Ticket Price: ${this.ticketPrice} eGold | Jackpot: 10,000 eGold</p>
            </div>

            <div class="lottery-selection">
                <h4>Select ${this.maxNumbers} Numbers (<span id="selectedCount">0</span>/${this.maxNumbers})</h4>
                <div class="lottery-numbers" id="lotteryNumbers"></div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <button onclick="lotteryGame.buyTicket()" class="btn-play" id="buyLotteryBtn" disabled>
                    Buy Ticket (${this.ticketPrice} eGold)
                </button>
                <button onclick="lotteryGame.quickPick()" class="bet-btn">
                    Quick Pick
                </button>
            </div>

            <div id="lotteryResult" style="display: none;">
                <h3>Drawing Results</h3>
                <div class="lottery-numbers" id="winningNumbers"></div>
                <div id="lotteryMessage" class="game-message"></div>
                <button onclick="lotteryGame.reset()" class="btn-play" style="margin-top: 20px;">
                    Play Again
                </button>
            </div>
        `;

        this.renderNumbers();
        this.container = container;
    }

    renderNumbers() {
        const numbersDiv = document.getElementById('lotteryNumbers');
        numbersDiv.innerHTML = '';

        for (let i = 1; i <= this.numberRange; i++) {
            const ball = document.createElement('div');
            ball.className = 'lottery-ball';
            ball.textContent = i;
            ball.dataset.number = i;
            
            if (this.selectedNumbers.includes(i)) {
                ball.classList.add('selected');
            }

            ball.addEventListener('click', () => this.toggleNumber(i));
            numbersDiv.appendChild(ball);
        }
    }

    toggleNumber(num) {
        const index = this.selectedNumbers.indexOf(num);
        
        if (index > -1) {
            this.selectedNumbers.splice(index, 1);
        } else {
            if (this.selectedNumbers.length < this.maxNumbers) {
                this.selectedNumbers.push(num);
            } else {
                alert(`You can only select ${this.maxNumbers} numbers!`);
                return;
            }
        }

        this.selectedNumbers.sort((a, b) => a - b);
        this.renderNumbers();
        
        document.getElementById('selectedCount').textContent = this.selectedNumbers.length;
        document.getElementById('buyLotteryBtn').disabled = this.selectedNumbers.length !== this.maxNumbers;
    }

    quickPick() {
        this.selectedNumbers = [];
        const available = Array.from({length: this.numberRange}, (_, i) => i + 1);
        
        for (let i = 0; i < this.maxNumbers; i++) {
            const index = Math.floor(Math.random() * available.length);
            this.selectedNumbers.push(available[index]);
            available.splice(index, 1);
        }

        this.selectedNumbers.sort((a, b) => a - b);
        this.renderNumbers();
        
        document.getElementById('selectedCount').textContent = this.selectedNumbers.length;
        document.getElementById('buyLotteryBtn').disabled = false;
    }

    buyTicket() {
        if (currentBalance < this.ticketPrice) {
            alert('Insufficient balance!');
            return;
        }

        updateBalance(-this.ticketPrice);
        
        // Generate winning numbers
        const winningNumbers = [];
        const available = Array.from({length: this.numberRange}, (_, i) => i + 1);
        
        for (let i = 0; i < this.maxNumbers; i++) {
            const index = Math.floor(Math.random() * available.length);
            winningNumbers.push(available[index]);
            available.splice(index, 1);
        }
        
        winningNumbers.sort((a, b) => a - b);

        // Check matches
        const matches = this.selectedNumbers.filter(num => winningNumbers.includes(num)).length;
        
        // Show results
        document.querySelector('.lottery-selection').style.display = 'none';
        document.getElementById('buyLotteryBtn').style.display = 'none';
        document.getElementById('lotteryResult').style.display = 'block';

        // Display winning numbers
        const winningDiv = document.getElementById('winningNumbers');
        winningDiv.innerHTML = winningNumbers.map(num => {
            const isMatch = this.selectedNumbers.includes(num);
            return `<div class="lottery-ball ${isMatch ? 'selected' : ''}" style="margin: 10px;">${num}</div>`;
        }).join('');

        // Calculate prize
        let prize = 0;
        let message = '';

        switch(matches) {
            case 6:
                prize = 10000;
                message = '🎉 JACKPOT! You matched all 6 numbers!';
                break;
            case 5:
                prize = 1000;
                message = '🎊 Amazing! 5 numbers matched!';
                break;
            case 4:
                prize = 100;
                message = '🎁 Great! 4 numbers matched!';
                break;
            case 3:
                prize = 20;
                message = '✨ Nice! 3 numbers matched!';
                break;
            default:
                message = `😔 ${matches} numbers matched. Better luck next time!`;
        }

        if (prize > 0) {
            updateBalance(prize);
            message += ` You won ${prize} eGold!`;
            
            // Visual effects based on prize amount
            setTimeout(() => {
                if (prize >= 1000) {
                    effects.createConfetti(document.body, 5000);
                    effects.floatingText(window.innerWidth / 2, 200, '🎉 JACKPOT! 🎉', '#ffd700', '4rem');
                    effects.coinRain(3000);
                } else if (prize >= 100) {
                    effects.createConfetti(document.body, 3000);
                    effects.floatingText(window.innerWidth / 2, 200, `+${prize} eGold!`, '#2ecc71', '3rem');
                } else {
                    effects.floatingText(window.innerWidth / 2, 200, `+${prize} eGold`, '#2ecc71', '2.5rem');
                }
            }, 500);
            
            bettingSystem.placeBet('lottery', this.ticketPrice, { 
                selected: this.selectedNumbers, 
                winning: winningNumbers, 
                matches: matches, 
                prize: prize 
            });
        } else {
            const messageEl = document.getElementById('lotteryMessage');
            effects.shake(messageEl.parentElement);
        }

        document.getElementById('lotteryMessage').textContent = message;
        document.getElementById('lotteryMessage').style.color = prize > 0 ? '#2ecc71' : '#e74c3c';
    }

    reset() {
        this.selectedNumbers = [];
        document.querySelector('.lottery-selection').style.display = 'block';
        document.getElementById('buyLotteryBtn').style.display = 'inline-block';
        document.getElementById('lotteryResult').style.display = 'none';
        document.getElementById('selectedCount').textContent = '0';
        document.getElementById('buyLotteryBtn').disabled = true;
        this.renderNumbers();
    }
}
