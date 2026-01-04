// Lottery Game
const lotteryGame = {
    ticketCost: 20,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #FFB800; font-size: 1.5em; margin-bottom: 20px;">Pick 6 Numbers (1-49)</h3>
                
                <div id="numberButtons" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; max-width: 600px; margin: 20px auto;">
                    ${Array.from({length: 49}, (_, i) => i + 1).map(num => 
                        `<button onclick="lotteryGame.toggleNumber(${num})" id="num${num}" style="padding: 12px; background: #2A3544; color: #FFB800; border: 2px solid #FFB800; border-radius: 5px; cursor: pointer; font-size: 1em; font-weight: bold;">
                            ${num}
                        </button>`
                    ).join('')}
                </div>
                
                <div style="margin: 20px 0;">
                    <p style="font-size: 1.2em;">Selected: <span id="selectedNumbers" style="color: #FFB800;">None</span></p>
                </div>
                
                <button onclick="lotteryGame.play()" style="padding: 15px 40px; font-size: 1.3em; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer; margin: 20px 0;">
                    Buy Ticket (20 eGold)
                </button>
                
                <div id="lotteryResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; margin-bottom: 10px;">Prizes</h3>
                    <div style="color: #cccccc;">
                        <p>6 matches: 2000 eGold 🎰</p>
                        <p>5 matches: 200 eGold</p>
                        <p>4 matches: 40 eGold</p>
                        <p>3 matches: 10 eGold</p>
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
            button.style.background = '#2A3544';
        } else {
            if (this.selected.length >= 6) {
                return;
            }
            this.selected.push(num);
            button.style.background = '#FFB800';
            button.style.color = '#1A2332';
        }
        
        document.getElementById('selectedNumbers').textContent = 
            this.selected.length > 0 ? this.selected.sort((a, b) => a - b).join(', ') : 'None';
    },
    
    play() {
        if (this.selected.length !== 6) {
            document.getElementById('lotteryResult').innerHTML = '<span style="color: #e74c3c;">Please select exactly 6 numbers!</span>';
            return;
        }
        
        if (balance < this.ticketCost) {
            document.getElementById('lotteryResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-this.ticketCost);
        
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
        
        if (prize > 0) {
            updateBalance(prize);
            document.getElementById('lotteryResult').innerHTML = `
                <span style="color: #2ecc71; font-size: 1.5em;">🎉 ${matches} MATCHES!</span><br>
                <span style="color: #FFB800;">Winning numbers: ${winning.join(', ')}</span><br>
                <span style="color: #2ecc71;">Prize: +${prize} eGold</span>
            `;
        } else {
            document.getElementById('lotteryResult').innerHTML = `
                <span style="color: #e74c3c;">${matches} matches</span><br>
                <span style="color: #FFB800;">Winning numbers: ${winning.join(', ')}</span><br>
                <span style="color: #cccccc;">Better luck next time!</span>
            `;
        }
        
        // Reset
        this.selected.forEach(num => {
            const button = document.getElementById(`num${num}`);
            button.style.background = '#2A3544';
            button.style.color = '#FFB800';
        });
        this.selected = [];
        document.getElementById('selectedNumbers').textContent = 'None';
    }
};

window.lotteryGame = lotteryGame;
