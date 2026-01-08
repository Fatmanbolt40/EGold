// Professional Pineapple Poker Engine (Crazy Pineapple)
const PineappleEngine = {
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
    discardPhase: false,
    playersDiscarded: new Set(),
    
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
        const playerNames = ['You', 'Pineapple_King', 'CrazyP', 'DiscardPro', 'TropicalAce', 'FruitNuts'];
        
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
            lastAction: null,
            hasDiscarded: false
        }));
        
        this.dealerPosition = 0;
        this.pot = 0;
        this.communityCards = [];
        this.discardPhase = false;
        this.playersDiscarded = new Set();
    },
    
    startNewHand() {
        this.createDeck();
        this.shuffleDeck();
        
        this.players.forEach(player => {
            player.cards = [];
            player.bet = 0;
            player.folded = player.sittingOut;
            player.lastAction = null;
            player.hasDiscarded = false;
        });
        
        this.pot = 0;
        this.currentBet = 0;
        this.communityCards = [];
        this.discardPhase = false;
        this.playersDiscarded = new Set();
        
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
        
        // Deal 3 hole cards to each player (Pineapple)
        for (let i = 0; i < 3; i++) {
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
    
    // After flop betting, enter discard phase
    enterDiscardPhase() {
        this.discardPhase = true;
        this.gamePhase = 'discard';
        this.playersDiscarded = new Set();
        this.activePosition = 0; // Player goes first for discard
    },
    
    playerDiscard(playerId, cardIndex) {
        const player = this.players[playerId];
        if (player.cards.length === 3 && cardIndex >= 0 && cardIndex < 3) {
            player.cards.splice(cardIndex, 1);
            player.hasDiscarded = true;
            this.playersDiscarded.add(playerId);
            
            // Check if all active players have discarded
            const activePlayers = this.players.filter(p => !p.folded && !p.sittingOut);
            if (this.playersDiscarded.size === activePlayers.length) {
                this.finishDiscardPhase();
            }
        }
    },
    
    aiDiscard(playerId) {
        const player = this.players[playerId];
        if (player.cards.length === 3) {
            // Simple AI: discard lowest value card, or one that doesn't fit
            const cardValues = player.cards.map((c, i) => ({ card: c, index: i, value: c.numValue }));
            cardValues.sort((a, b) => a.value - b.value);
            
            // Discard lowest card
            const discardIndex = cardValues[0].index;
            player.cards.splice(discardIndex, 1);
            player.hasDiscarded = true;
            this.playersDiscarded.add(playerId);
        }
    },
    
    finishDiscardPhase() {
        this.discardPhase = false;
        this.dealTurn();
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
        
        if (handStrength < 0.3 && callAmount > 0 && random > 0.3) {
            return { action: 'fold' };
        }
        
        if (handStrength > 0.7 && random > 0.5) {
            const raiseAmount = this.bigBlind * (2 + Math.floor(random * 3));
            return { action: 'raise', amount: raiseAmount };
        }
        
        if (callAmount === 0) {
            return { action: 'check' };
        } else if (random > 0.5 || handStrength > 0.5) {
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
                // After flop betting, enter discard phase
                this.enterDiscardPhase();
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
            score: this.evaluateHand([...player.cards, ...this.communityCards])
        }));
        
        results.sort((a, b) => b.score - a.score);
        const winner = results[0].player;
        
        winner.chips += this.pot;
        
        setTimeout(() => {
            this.dealerPosition = (this.dealerPosition + 1) % this.players.length;
            this.gamePhase = 'complete';
        }, 3000);
    },
    
    evaluateHandStrength(holeCards, communityCards) {
        if (!holeCards || holeCards.length === 0) return 0.1;
        
        if (communityCards.length === 0) {
            // Pre-flop with 3 cards
            const values = holeCards.map(c => c.numValue).sort((a, b) => b - a);
            const suits = holeCards.map(c => c.suit);
            
            const isPair = values[0] === values[1] || values[1] === values[2] || values[0] === values[2];
            const isTrips = values[0] === values[1] && values[1] === values[2];
            const highCard = Math.max(...values);
            const suited = suits[0] === suits[1] || suits[1] === suits[2] || suits[0] === suits[2];
            
            if (isTrips) return 0.95;
            if (isPair && highCard >= 12) return 0.8;
            if (isPair) return 0.6;
            if (suited && highCard >= 12) return 0.55;
            if (highCard >= 13) return 0.5;
            return 0.3;
        }
        
        // After discard, should have 2 cards
        if (holeCards.length === 2) {
            const score = this.evaluateHand([...holeCards, ...communityCards]);
            return Math.min(score / 1000, 0.99);
        }
        
        // Before discard with 3 cards - evaluate best 2-card combination
        let bestScore = 0;
        for (let i = 0; i < holeCards.length - 1; i++) {
            for (let j = i + 1; j < holeCards.length; j++) {
                const score = this.evaluateHand([holeCards[i], holeCards[j], ...communityCards]);
                if (score > bestScore) bestScore = score;
            }
        }
        return Math.min(bestScore / 1000, 0.99);
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
        
        let isStraight = false;
        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] - values[i + 1] !== 1) break;
            if (i === 3) isStraight = true;
        }
        if (values[0] === 14 && values[1] === 5 && values[2] === 4 && values[3] === 3 && values[4] === 2) {
            isStraight = true;
        }
        
        if (isFlush && isStraight && values[0] === 14 && values[1] === 13) {
            return 900 + values[0];
        }
        if (isFlush && isStraight) {
            return 800 + values[0];
        }
        if (counts[0] === 4) {
            return 700 + values[0];
        }
        if (counts[0] === 3 && counts[1] === 2) {
            return 600 + values[0];
        }
        if (isFlush) {
            return 500 + values[0];
        }
        if (isStraight) {
            return 400 + values[0];
        }
        if (counts[0] === 3) {
            return 300 + values[0];
        }
        if (counts[0] === 2 && counts[1] === 2) {
            return 200 + values[0];
        }
        if (counts[0] === 2) {
            return 100 + values[0];
        }
        
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
            bigBlind: this.bigBlind,
            discardPhase: this.discardPhase
        };
    }
};

window.PineappleEngine = PineappleEngine;
