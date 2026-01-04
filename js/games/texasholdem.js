// Texas Hold'em Poker (Simplified)
const texasholdemGame = {
    ante: 10,
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: #FFB800; font-size: 1.5em; margin-bottom: 20px;">Texas Hold'em Poker</h3>
                
                <div style="margin: 20px 0;">
                    <div style="background: rgba(255, 184, 0, 0.1); padding: 15px; border-radius: 10px; display: inline-block;">
                        <p style="color: #FFB800; font-size: 1.2em;">Ante: ${this.ante} eGold</p>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4 style="color: #FFB800;">Dealer's Hand</h4>
                    <div id="dealerHand" style="font-size: 2.5em; margin: 10px 0;">🂠 🂠</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4 style="color: #FFB800;">Community Cards</h4>
                    <div id="communityCards" style="font-size: 2.5em; margin: 10px 0;">🂠 🂠 🂠 🂠 🂠</div>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4 style="color: #FFB800;">Your Hand</h4>
                    <div id="playerHand" style="font-size: 2.5em; margin: 10px 0;">🂠 🂠</div>
                </div>
                
                <button onclick="texasholdemGame.play()" style="padding: 15px 40px; font-size: 1.3em; background: #FFB800; border: none; border-radius: 8px; color: #1A2332; font-weight: bold; cursor: pointer; margin: 20px 0;">
                    Play Hand (${this.ante} eGold)
                </button>
                
                <div id="pokerResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; margin-bottom: 10px;">Hand Rankings</h3>
                    <div style="color: #cccccc; font-size: 0.9em;">
                        <p>Royal Flush > Straight Flush > Four of a Kind > Full House</p>
                        <p>Flush > Straight > Three of a Kind > Two Pair > Pair > High Card</p>
                        <p style="margin-top: 10px; color: #e74c3c;">Note: Dealer has slight advantage</p>
                    </div>
                </div>
            </div>
        `;
    },
    
    play() {
        if (balance < this.ante) {
            document.getElementById('pokerResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-this.ante);
        
        // Create deck and shuffle
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];
        
        for (const suit of suits) {
            for (const value of values) {
                deck.push({ value, suit, numValue: values.indexOf(value) + 2 });
            }
        }
        
        // Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        
        // Deal cards
        const playerCards = [deck.pop(), deck.pop()];
        const dealerCards = [deck.pop(), deck.pop()];
        const community = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()];
        
        // Display
        document.getElementById('playerHand').textContent = 
            playerCards.map(c => `${c.value}${c.suit}`).join(' ');
        document.getElementById('communityCards').textContent = 
            community.map(c => `${c.value}${c.suit}`).join(' ');
        document.getElementById('dealerHand').textContent = 
            dealerCards.map(c => `${c.value}${c.suit}`).join(' ');
        
        // Evaluate hands (simplified)
        const playerScore = this.evaluateHand([...playerCards, ...community]);
        const dealerScore = this.evaluateHand([...dealerCards, ...community]) + 0.5; // House edge
        
        if (playerScore > dealerScore) {
            const payout = this.ante * 2;
            updateBalance(payout);
            document.getElementById('pokerResult').innerHTML = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 YOU WIN! +${payout} eGold</span>`;
        } else if (playerScore === dealerScore) {
            document.getElementById('pokerResult').innerHTML = '<span style="color: #FFB800;">Push - Dealer wins ties (house rule)</span>';
        } else {
            document.getElementById('pokerResult').innerHTML = '<span style="color: #e74c3c;">Dealer wins. Try again!</span>';
        }
    },
    
    evaluateHand(cards) {
        // Simplified hand evaluation - returns a score
        const values = cards.map(c => c.numValue).sort((a, b) => b - a);
        const suits = cards.map(c => c.suit);
        
        // Check for flush
        const isFlush = suits.every(s => s === suits[0]);
        
        // Check for pairs, three of a kind, etc.
        const valueCounts = {};
        for (const v of values) {
            valueCounts[v] = (valueCounts[v] || 0) + 1;
        }
        
        const counts = Object.values(valueCounts).sort((a, b) => b - a);
        
        // Scoring (simplified)
        let score = Math.max(...values); // High card
        
        if (counts[0] === 4) score = 800; // Four of a kind
        else if (counts[0] === 3 && counts[1] === 2) score = 700; // Full house
        else if (isFlush) score = 600; // Flush
        else if (counts[0] === 3) score = 400; // Three of a kind
        else if (counts[0] === 2 && counts[1] === 2) score = 300; // Two pair
        else if (counts[0] === 2) score = 200; // Pair
        
        return score;
    }
};

window.texasholdemGame = texasholdemGame;
