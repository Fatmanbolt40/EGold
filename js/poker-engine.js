// Full Texas Hold'em Poker Engine - ClubWPT Style
const PokerEngine = {
    // Game state
    players: [],
    communityCards: [],
    pot: 0,
    currentBet: 0,
    dealerPosition: 0,
    activePosition: 0,
    gamePhase: 'waiting', // waiting, preflop, flop, turn, river, showdown
    deck: [],
    
    // Tournament settings
    smallBlind: 5,
    bigBlind: 10,
    tournamentLevel: 1,
    
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
    
    // Initialize 8-player table
    initializeTable(playerChips = 1000) {
        const playerNames = ['You', 'ClubWPT', 'gflsk86', 'sugar2022', 'DavidJT', 'Lash7', 'Player7', 'Player8'];
        
        this.players = playerNames.map((name, index) => ({
            id: index,
            name: name,
            chips: index === 0 ? playerChips : 800 + Math.floor(Math.random() * 400),
            cards: [],
            bet: 0,
            folded: false,
            isPlayer: index === 0,
            sittingOut: Math.random() > 0.7 && index > 0, // Some AI sitting out
            position: index,
            lastAction: null
        }));
        
        this.dealerPosition = 0;
        this.pot = 0;
        this.communityCards = [];
    },
    
    // Start new hand
    startNewHand() {
        this.createDeck();
        this.shuffleDeck();
        
        // Reset player states
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
        
        // Deal hole cards
        for (let i = 0; i < 2; i++) {
            this.players.forEach(player => {
                if (!player.folded) {
                    player.cards.push(this.deck.pop());
                }
            });
        }
        
        // Set action to left of big blind
        this.activePosition = (this.dealerPosition + 3) % this.players.length;
        this.gamePhase = 'preflop';
        
        return this.getGameState();
    },
    
    // Deal community cards
    dealFlop() {
        this.deck.pop(); // Burn card
        this.communityCards.push(this.deck.pop());
        this.communityCards.push(this.deck.pop());
        this.communityCards.push(this.deck.pop());
        this.gamePhase = 'flop';
        this.currentBet = 0;
        this.players.forEach(p => p.bet = 0);
        this.activePosition = (this.dealerPosition + 1) % this.players.length;
    },
    
    dealTurn() {
        this.deck.pop(); // Burn card
        this.communityCards.push(this.deck.pop());
        this.gamePhase = 'turn';
        this.currentBet = 0;
        this.players.forEach(p => p.bet = 0);
        this.activePosition = (this.dealerPosition + 1) % this.players.length;
    },
    
    dealRiver() {
        this.deck.pop(); // Burn card
        this.communityCards.push(this.deck.pop());
        this.gamePhase = 'river';
        this.currentBet = 0;
        this.players.forEach(p => p.bet = 0);
        this.activePosition = (this.dealerPosition + 1) % this.players.length;
    },
    
    // Player actions
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
            // All-in
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
            // All-in
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
    
    // AI decision making
    getAIAction(player) {
        const activePlayers = this.players.filter(p => !p.folded && !p.sittingOut).length;
        const callAmount = this.currentBet - player.bet;
        const potOdds = callAmount / (this.pot + callAmount);
        
        // Simple AI strategy
        const handStrength = this.evaluateHandStrength(player.cards, this.communityCards);
        const random = Math.random();
        
        // Fold if weak hand and facing bet
        if (handStrength < 0.3 && callAmount > 0 && random > 0.3) {
            return { action: 'fold' };
        }
        
        // Raise with strong hand
        if (handStrength > 0.7 && random > 0.5) {
            const raiseAmount = this.bigBlind * (2 + Math.floor(random * 3));
            return { action: 'raise', amount: raiseAmount };
        }
        
        // Call or check
        if (callAmount === 0) {
            return { action: 'check' };
        } else if (random > potOdds || handStrength > 0.5) {
            return { action: 'call' };
        }
        
        return { action: 'fold' };
    },
    
    // Advance to next player
    nextPlayer() {
        let nextPos = (this.activePosition + 1) % this.players.length;
        let searched = 0;
        
        // Find next active player
        while (searched < this.players.length) {
            const player = this.players[nextPos];
            if (!player.folded && !player.sittingOut && player.chips > 0) {
                // Check if betting round is complete
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
        
        // All players acted, advance phase
        this.advancePhase();
    },
    
    isBettingRoundComplete() {
        const activePlayers = this.players.filter(p => !p.folded && !p.sittingOut && p.chips > 0);
        
        if (activePlayers.length <= 1) return true;
        
        // All active players have matched current bet or are all-in
        return activePlayers.every(p => 
            p.bet === this.currentBet || p.chips === 0
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
        
        // Evaluate all hands
        const results = activePlayers.map(player => ({
            player: player,
            score: this.evaluateHand([...player.cards, ...this.communityCards])
        }));
        
        // Find winner
        results.sort((a, b) => b.score - a.score);
        const winner = results[0].player;
        
        winner.chips += this.pot;
        
        setTimeout(() => {
            this.dealerPosition = (this.dealerPosition + 1) % this.players.length;
            this.gamePhase = 'complete';
        }, 3000);
    },
    
    evaluateHandStrength(holeCards, communityCards) {
        if (communityCards.length === 0) {
            // Pre-flop hand strength
            const card1 = holeCards[0].numValue;
            const card2 = holeCards[1].numValue;
            const isPair = card1 === card2;
            const highCard = Math.max(card1, card2);
            
            if (isPair && highCard >= 12) return 0.9; // High pair
            if (isPair) return 0.7;
            if (highCard >= 13) return 0.6; // Ace high
            if (highCard >= 11) return 0.5; // Face card
            return 0.3;
        }
        
        const score = this.evaluateHand([...holeCards, ...communityCards]);
        return score / 1000;
    },
    
    evaluateHand(cards) {
        const values = cards.map(c => c.numValue).sort((a, b) => b - a);
        const suits = cards.map(c => c.suit);
        
        // Count occurrences
        const valueCounts = {};
        for (const v of values) {
            valueCounts[v] = (valueCounts[v] || 0) + 1;
        }
        
        const counts = Object.values(valueCounts).sort((a, b) => b - a);
        const isFlush = suits.some(suit => suits.filter(s => s === suit).length >= 5);
        
        // Check for straight
        const uniqueValues = [...new Set(values)].sort((a, b) => b - a);
        let isStraight = false;
        for (let i = 0; i <= uniqueValues.length - 5; i++) {
            if (uniqueValues[i] - uniqueValues[i + 4] === 4) {
                isStraight = true;
                break;
            }
        }
        
        const highCard = Math.max(...values);
        
        // Royal Flush
        if (isStraight && isFlush && highCard === 14) return 1000;
        // Straight Flush
        if (isStraight && isFlush) return 900;
        // Four of a Kind
        if (counts[0] === 4) return 800 + highCard;
        // Full House
        if (counts[0] === 3 && counts[1] >= 2) return 700 + highCard;
        // Flush
        if (isFlush) return 600 + highCard;
        // Straight
        if (isStraight) return 500 + highCard;
        // Three of a Kind
        if (counts[0] === 3) return 400 + highCard;
        // Two Pair
        if (counts[0] === 2 && counts[1] === 2) return 300 + highCard;
        // Pair
        if (counts[0] === 2) return 200 + highCard;
        // High Card
        return highCard;
    },
    
    getGameState() {
        return {
            players: this.players,
            communityCards: this.communityCards,
            pot: this.pot,
            currentBet: this.currentBet,
            activePosition: this.activePosition,
            dealerPosition: this.dealerPosition,
            gamePhase: this.gamePhase,
            smallBlind: this.smallBlind,
            bigBlind: this.bigBlind
        };
    }
};
