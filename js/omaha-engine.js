// Professional Omaha Poker Engine
const OmahaEngine = {
    // Game state
    players: [],
    communityCards: [],
    pot: 0,
    currentBet: 0,
    dealerPosition: 0,
    activePosition: 0,
    gamePhase: 'waiting',
    deck: [],
    smallBlind: 5,
    bigBlind: 10,
    
    init() {
        this.createDeck();
    },
    
    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.deck = [];
        
        for (const suit of suits) {
            for (const value of values) {
                this.deck.push({ 
                    value, 
                    suit, 
                    numValue: values.indexOf(value) + 2 
                });
            }
        }
    },
    
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    },
    
    initializeTable(playerChips = 1000) {
        const playerNames = ['You', 'OmahaKing', 'HighCard88', 'PLO_Pro', 'WrapMaster', 'NutFlusher'];
        
        this.players = playerNames.map((name, index) => ({
            id: index,
            name: name,
            chips: index === 0 ? playerChips : 800 + Math.floor(Math.random() * 400),
            cards: [],
            bet: 0,
            folded: false,
            isPlayer: index === 0,
            sittingOut: Math.random() > 0.75 && index > 0,
            position: index,
            lastAction: null
        }));
        
        this.dealerPosition = 0;
        this.pot = 0;
        this.communityCards = [];
    },
    
    startNewHand() {
        this.createDeck();
        this.shuffleDeck();
        
        this.players.forEach(player => {
            player.cards = [];
            player.bet = 0;
            player.folded = player.sittingOut;
            player.lastAction = null;
        });
        
        this.pot = 0;
        this.currentBet = 0;
        this.communityCards = [];
        
        // Post blinds
        const sbPos = (this.dealerPosition + 1) % this.players.length;
        const bbPos = (this.dealerPosition + 2) % this.players.length;
        
        this.players[sbPos].bet = this.smallBlind;
        this.players[sbPos].chips -= this.smallBlind;
        this.pot += this.smallBlind;
        
        this.players[bbPos].bet = this.bigBlind;
        this.players[bbPos].chips -= this.bigBlind;
        this.pot += this.bigBlind;
        this.currentBet = this.bigBlind;
        
        // Deal 4 hole cards to each player (Omaha)
        for (let i = 0; i < 4; i++) {
            this.players.forEach(player => {
                if (!player.folded) {
                    player.cards.push(this.deck.pop());
                }
            });
        }
        
        this.activePosition = (this.dealerPosition + 3) % this.players.length;
        this.gamePhase = 'preflop';
        
        return this.getGameState();
    },
    
    dealFlop() {
        this.deck.pop();
        this.communityCards.push(this.deck.pop());
        this.communityCards.push(this.deck.pop());
        this.communityCards.push(this.deck.pop());
        this.gamePhase = 'flop';
        this.currentBet = 0;
        this.players.forEach(p => { p.bet = 0; p.lastAction = null; });
        this.activePosition = (this.dealerPosition + 1) % this.players.length;
        while (this.players[this.activePosition].folded || this.players[this.activePosition].sittingOut) {
            this.activePosition = (this.activePosition + 1) % this.players.length;
        }
    },
    
    dealTurn() {
        this.deck.pop();
        this.communityCards.push(this.deck.pop());
        this.gamePhase = 'turn';
        this.currentBet = 0;
        this.players.forEach(p => { p.bet = 0; p.lastAction = null; });
        this.activePosition = (this.dealerPosition + 1) % this.players.length;
        while (this.players[this.activePosition].folded || this.players[this.activePosition].sittingOut) {
            this.activePosition = (this.activePosition + 1) % this.players.length;
        }
    },
    
    dealRiver() {
        this.deck.pop();
        this.communityCards.push(this.deck.pop());
        this.gamePhase = 'river';
        this.currentBet = 0;
        this.players.forEach(p => { p.bet = 0; p.lastAction = null; });
        this.activePosition = (this.dealerPosition + 1) % this.players.length;
        while (this.players[this.activePosition].folded || this.players[this.activePosition].sittingOut) {
            this.activePosition = (this.activePosition + 1) % this.players.length;
        }
    },
    
    playerFold(playerId) {
        const player = this.players[playerId];
        player.folded = true;
        player.lastAction = 'fold';
        this.nextPlayer();
    },
    
    playerCall(playerId) {
        const player = this.players[playerId];
        const callAmount = this.currentBet - player.bet;
        
        if (callAmount >= player.chips) {
            this.pot += player.chips;
            player.bet += player.chips;
            player.chips = 0;
            player.lastAction = 'all-in';
        } else {
            player.chips -= callAmount;
            player.bet += callAmount;
            this.pot += callAmount;
            player.lastAction = 'call';
        }
        
        this.nextPlayer();
    },
    
    playerRaise(playerId, amount) {
        const player = this.players[playerId];
        const totalBet = this.currentBet + amount;
        const raiseAmount = totalBet - player.bet;
        
        if (raiseAmount >= player.chips) {
            this.pot += player.chips;
            this.currentBet = player.bet + player.chips;
            player.bet = this.currentBet;
            player.chips = 0;
            player.lastAction = 'all-in';
        } else {
            player.chips -= raiseAmount;
            player.bet = totalBet;
            this.pot += raiseAmount;
            this.currentBet = totalBet;
            player.lastAction = `raise ${amount}`;
        }
        
        this.nextPlayer();
    },
    
    playerCheck(playerId) {
        const player = this.players[playerId];
        player.lastAction = 'check';
        this.nextPlayer();
    },
    
    getAIAction(player) {
        const callAmount = this.currentBet - player.bet;
        const handStrength = this.evaluateHandStrength(player.cards, this.communityCards);
        const random = Math.random();
        
        if (handStrength < 0.25 && callAmount > 0 && random > 0.3) {
            return { action: 'fold' };
        }
        
        if (handStrength > 0.75 && random > 0.5) {
            const raiseAmount = this.bigBlind * (2 + Math.floor(random * 4));
            return { action: 'raise', amount: raiseAmount };
        }
        
        if (callAmount === 0) {
            return { action: 'check' };
        } else if (random > 0.4 || handStrength > 0.5) {
            return { action: 'call' };
        }
        
        return { action: 'fold' };
    },
    
    nextPlayer() {
        let nextPos = (this.activePosition + 1) % this.players.length;
        let searched = 0;
        
        while (searched < this.players.length) {
            const player = this.players[nextPos];
            if (!player.folded && !player.sittingOut && player.chips > 0) {
                if (this.isBettingRoundComplete()) {
                    this.advancePhase();
                    return;
                }
                this.activePosition = nextPos;
                return;
            }
            nextPos = (nextPos + 1) % this.players.length;
            searched++;
        }
        
        this.advancePhase();
    },
    
    isBettingRoundComplete() {
        const activePlayers = this.players.filter(p => !p.folded && !p.sittingOut && p.chips > 0);
        
        if (activePlayers.length <= 1) return true;
        
        return activePlayers.every(p => 
            (p.bet === this.currentBet || p.chips === 0) && p.lastAction !== null
        );
    },
    
    advancePhase() {
        const activePlayers = this.players.filter(p => !p.folded).length;
        
        if (activePlayers === 1) {
            this.endHand();
            return;
        }
        
        switch (this.gamePhase) {
            case 'preflop':
                this.dealFlop();
                break;
            case 'flop':
                this.dealTurn();
                break;
            case 'turn':
                this.dealRiver();
                break;
            case 'river':
                this.showdown();
                break;
        }
    },
    
    endHand() {
        const winner = this.players.find(p => !p.folded);
        if (winner) {
            winner.chips += this.pot;
            this.gamePhase = 'complete';
        }
    },
    
    showdown() {
        this.gamePhase = 'showdown';
        
        const activePlayers = this.players.filter(p => !p.folded);
        
        const results = activePlayers.map(player => ({
            player: player,
            score: this.evaluateOmahaHand(player.cards, this.communityCards)
        }));
        
        results.sort((a, b) => b.score - a.score);
        const winner = results[0].player;
        
        winner.chips += this.pot;
        
        setTimeout(() => {
            this.dealerPosition = (this.dealerPosition + 1) % this.players.length;
            this.gamePhase = 'complete';
        }, 3000);
    },
    
    evaluateOmahaHand(holeCards, communityCards) {
        // Must use exactly 2 hole cards and 3 community cards
        let bestScore = 0;
        
        // Try all combinations of 2 hole cards
        for (let i = 0; i < holeCards.length - 1; i++) {
            for (let j = i + 1; j < holeCards.length; j++) {
                // Try all combinations of 3 community cards
                for (let a = 0; a < communityCards.length - 2; a++) {
                    for (let b = a + 1; b < communityCards.length - 1; b++) {
                        for (let c = b + 1; c < communityCards.length; c++) {
                            const hand = [
                                holeCards[i], 
                                holeCards[j], 
                                communityCards[a], 
                                communityCards[b], 
                                communityCards[c]
                            ];
                            const score = this.evaluateHand(hand);
                            if (score > bestScore) bestScore = score;
                        }
                    }
                }
            }
        }
        
        return bestScore;
    },
    
    evaluateHandStrength(holeCards, communityCards) {
        if (!holeCards || holeCards.length < 4) return 0.1;
        
        if (communityCards.length === 0) {
            // Pre-flop: look for high pairs, suited cards, connected cards
            const values = holeCards.map(c => c.numValue).sort((a, b) => b - a);
            const suits = holeCards.map(c => c.suit);
            
            // Count pairs
            const valueCounts = {};
            for (const v of values) {
                valueCounts[v] = (valueCounts[v] || 0) + 1;
            }
            const pairs = Object.values(valueCounts).filter(c => c >= 2).length;
            
            // High cards bonus
            const highCards = values.filter(v => v >= 11).length;
            
            // Suited cards
            const suitCounts = {};
            for (const s of suits) {
                suitCounts[s] = (suitCounts[s] || 0) + 1;
            }
            const maxSuited = Math.max(...Object.values(suitCounts));
            
            let strength = 0.3;
            if (pairs >= 2) strength += 0.3;
            if (highCards >= 2) strength += 0.2;
            if (maxSuited >= 3) strength += 0.15;
            if (values[0] >= 13) strength += 0.1;
            
            return Math.min(strength, 0.95);
        }
        
        const score = this.evaluateOmahaHand(holeCards, communityCards);
        return Math.min(score / 1000, 0.99);
    },
    
    evaluateHand(cards) {
        const values = cards.map(c => c.numValue).sort((a, b) => b - a);
        const suits = cards.map(c => c.suit);
        
        const valueCounts = {};
        for (const v of values) {
            valueCounts[v] = (valueCounts[v] || 0) + 1;
        }
        
        const counts = Object.values(valueCounts).sort((a, b) => b - a);
        const isFlush = suits.every(s => s === suits[0]);
        
        // Check straight
        let isStraight = false;
        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] - values[i + 1] !== 1) break;
            if (i === 3) isStraight = true;
        }
        // Check A-2-3-4-5 straight
        if (values[0] === 14 && values[1] === 5 && values[2] === 4 && values[3] === 3 && values[4] === 2) {
            isStraight = true;
        }
        
        // Royal flush
        if (isFlush && isStraight && values[0] === 14 && values[1] === 13) {
            return 900 + values[0];
        }
        
        // Straight flush
        if (isFlush && isStraight) {
            return 800 + values[0];
        }
        
        // Four of a kind
        if (counts[0] === 4) {
            return 700 + values[0];
        }
        
        // Full house
        if (counts[0] === 3 && counts[1] === 2) {
            return 600 + values[0];
        }
        
        // Flush
        if (isFlush) {
            return 500 + values[0];
        }
        
        // Straight
        if (isStraight) {
            return 400 + values[0];
        }
        
        // Three of a kind
        if (counts[0] === 3) {
            return 300 + values[0];
        }
        
        // Two pair
        if (counts[0] === 2 && counts[1] === 2) {
            return 200 + values[0];
        }
        
        // One pair
        if (counts[0] === 2) {
            return 100 + values[0];
        }
        
        // High card
        return values[0];
    },
    
    getGameState() {
        return {
            players: this.players,
            communityCards: this.communityCards,
            pot: this.pot,
            currentBet: this.currentBet,
            dealerPosition: this.dealerPosition,
            activePosition: this.activePosition,
            gamePhase: this.gamePhase,
            smallBlind: this.smallBlind,
            bigBlind: this.bigBlind
        };
    }
};

window.OmahaEngine = OmahaEngine;
