// Lottery Game
const lotteryGame = {
    ticketCost: 20,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 1.8em; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">🎟️ MEGA LOTTERY 🎟️</h3>
                    <p style="font-size: 1.2em; color: #cccccc; margin-bottom: 20px;">Pick 6 Lucky Numbers (1-49)</p>
                </div>
                
                <div id="numberButtons" class="number-grid" style="grid-template-columns: repeat(7, 1fr); max-width: 650px;">
                    ${Array.from({length: 49}, (_, i) => i + 1).map(num => 
                        `<button onclick="lotteryGame.toggleNumber(${num})" id="num${num}" class="number-btn">
                            ${num}
                        </button>`
                    ).join('')}
                </div>
                
                <div style="margin: 25px 0; padding: 15px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <p style="font-size: 1.3em;">Selected: <span id="selectedNumbers" style="color: #FFB800; font-weight: bold;">None</span></p>
                </div>
                
                <button onclick="lotteryGame.play()" class="game-button" style="font-size: 1.4em; padding: 18px 50px;">
                    🎫 Buy Ticket (20 eGold)
                </button>
                
                <div id="lotteryResult" class="game-result"></div>
                
                <div class="game-info-box">
                    <h3>💎 Prize Table</h3>
                    <div style="display: grid; gap: 10px; margin-top: 15px;">
                        <div style="padding: 12px; background: linear-gradient(135deg, rgba(255, 184, 0, 0.2), rgba(212, 175, 55, 0.2)); border-radius: 8px; border: 2px solid #FFB800;">
                            <span style="font-size: 1.5em;">🎰</span> 6 matches: <b style="color: #FFB800; font-size: 1.3em;">2000 eGold</b> <small style="color: #2ecc71;">($200 USD)</small>
                        </div>
                        <div style="padding: 10px; background: rgba(255, 184, 0, 0.1); border-radius: 8px;">⭐ 5 matches: <b>200 eGold</b> <small style="color: #2ecc71;">($20 USD)</small></div>
                        <div style="padding: 10px; background: rgba(255, 184, 0, 0.1); border-radius: 8px;">🎯 4 matches: <b>40 eGold</b> <small style="color: #2ecc71;">($4 USD)</small></div>
                        <div style="padding: 10px; background: rgba(255, 184, 0, 0.1); border-radius: 8px;">🎁 3 matches: <b>10 eGold</b> <small style="color: #2ecc71;">($1 USD)</small></div>
                    </div>
                </div>
            </div>
        `;
        this.selected = [];
    },
    
    selected: [],
    
    toggleNumber(num) {
        const index = this.selected.indexOf(num);
        const button = document.getElementById(`num${num}`);
        
        if (index > -1) {
            this.selected.splice(index, 1);
            button.classList.remove('selected');
        } else {
            if (this.selected.length >= 6) {
                return;
            }
            this.selected.push(num);
            button.classList.add('selected');
        }
        
        document.getElementById('selectedNumbers').textContent = 
            this.selected.length > 0 ? this.selected.sort((a, b) => a - b).join(', ') : 'None';
    },
    
    play() {
        if (this.selected.length !== 6) {
            document.getElementById('lotteryResult').innerHTML = '<span style="color: #e74c3c;">Please select exactly 6 numbers!</span>';
            soundManager.playButtonClick();
            return;
        }
        
        if (balance < this.ticketCost) {
            document.getElementById('lotteryResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            soundManager.playButtonClick();
            return;
        }
        
        // Play shuffle sound
        soundManager.playShuffle();
        
        updateBalance(-this.ticketCost);
        
        const resultDiv = document.getElementById('lotteryResult');
        resultDiv.innerHTML = '<div class="loading-spinner"></div><p style="margin-top: 10px;">Drawing numbers...</p>';
        
        setTimeout(() => {
            // Draw winning numbers
            const winning = [];
            while (winning.length < 6) {
                const num = Math.floor(Math.random() * 49) + 1;
                if (!winning.includes(num)) {
                    winning.push(num);
                }
            }
            winning.sort((a, b) => a - b);
            
            // Count matches
            const matches = this.selected.filter(num => winning.includes(num)).length;
            
            // Calculate prize (house edge: reduced payouts)
            let prize = 0;
            switch(matches) {
                case 6: prize = 2000; break;
                case 5: prize = 200; break;
                case 4: prize = 40; break;
                case 3: prize = 10; break;
            }
            
            // Highlight matching numbers
            this.selected.forEach(num => {
                const btn = document.getElementById(`num${num}`);
                if (winning.includes(num)) {
                    btn.classList.add('win-effect');
                }
            });
            
            if (prize > 0) {
                updateBalance(prize);
                resultDiv.className = 'game-result win-effect';
                
                if (matches >= 5) {
                    soundManager.playJackpot();
                    particleSystem.createConfetti(window.innerWidth / 2, window.innerHeight / 2, 150);
                    resultDiv.classList.add('jackpot-effect');
                    resultDiv.innerHTML = `<span style="font-size: 2em;">🎊 JACKPOT! 🎊</span><br>
                        <span style="font-size: 1.3em;">Winning: ${winning.join(', ')}</span><br>
                        <span style="font-size: 1.3em;">Your picks: ${this.selected.join(', ')}</span><br>
                        <span style="font-size: 1.6em; color: #2ecc71;">${matches} MATCHES!</span><br>
                        <span style="font-size: 1.8em; color: #FFB800;">+${prize.toFixed(2)} eGold <small style="color: #2ecc71;">($${(prize * 0.10).toFixed(2)})</small></span>`;
                } else {
                    soundManager.playWin();
                    particleSystem.createCoinBurst(window.innerWidth / 2, window.innerHeight / 2, prize);
                    resultDiv.innerHTML = `<span style="font-size: 1.8em;">🎉 WINNER! 🎉</span><br>
                        <span style="font-size: 1.2em;">Winning: ${winning.join(', ')}</span><br>
                        <span style="font-size: 1.2em;">Your picks: ${this.selected.join(', ')}</span><br>
                        <span style="font-size: 1.3em; color: #2ecc71;">${matches} matches!</span><br>
                        <span style="font-size: 1.5em; color: #FFB800;">+${prize.toFixed(2)} eGold <small style="color: #2ecc71;">($${(prize * 0.10).toFixed(2)})</small></span>`;
                }
            } else {
                soundManager.playLoss();
                resultDiv.className = 'game-result loss-effect';
                resultDiv.innerHTML = `<span style="font-size: 1.3em;">Winning: ${winning.join(', ')}</span><br>
                    <span style="font-size: 1.2em;">Your picks: ${this.selected.join(', ')}</span><br>
                    <span style="font-size: 1.3em; color: #e74c3c;">${matches} matches</span><br>
                    <span style="font-size: 1.1em;">💔 Try again!</span>`;
            }
            
            // Clear selection after showing result
            setTimeout(() => {
                this.selected.forEach(num => {
                    const btn = document.getElementById(`num${num}`);
                    btn.classList.remove('selected', 'win-effect');
                });
                this.selected = [];
                document.getElementById('selectedNumbers').textContent = 'None';
            }, 5000);
        }, 1500);
    }
            case 3: prize = 10; break;
        }
        
        if (prize > 0) {
            updateBalance(prize);
            document.getElementById('lotteryResult').innerHTML = `
            const resultDiv = document.getElementById('lotteryResult');
            resultDiv.className = 'game-result win';
            resultDiv.innerHTML = `
                <span style="font-size: 1.8em;">🎉 ${matches} MATCHES! 🎉</span><br>
                <span style="color: #FFB800; font-size: 1.3em;">Winning numbers: ${winning.join(', ')}</span><br>
                <span style="font-size: 1.5em; color: #2ecc71;">Prize: +${prize} eGold</span>
            `;
        } else {
            const resultDiv = document.getElementById('lotteryResult');
            resultDiv.className = 'game-result lose';
            resultDiv.innerHTML = `
                <span style="font-size: 1.4em;">${matches} matches</span><br>
                <span style="color: #FFB800;">Winning numbers: ${winning.join(', ')}</span><br>
                <span style="font-size: 1.2em;">💔 Better luck next time!</span>
            `;
        }
        
        // Reset
        this.selected.forEach(num => {
            const button = document.getElementById(`num${num}`);
            button.classList.remove('selected')
        this.selected = [];
        document.getElementById('selectedNumbers').textContent = 'None';
    }
};

window.lotteryGame = lotteryGame;
