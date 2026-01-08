// Professional Tonk (Tunk) Card Game Engine
// Real rummy-style game where you make spreads/books and knock
const TonkEngine = {
    gameState: null,
    
    init() {
        this.gameState = {
            players: [],
            deck: [],
            discardPile: [],
            currentPlayerIndex: 0,
            gamePhase: 'waiting', // waiting, playing, knocked, complete
            knocker: null,
            dealer: 0
        };
    },
    
    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const deck = [];
        
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ value, suit });
            }
        }
        
        // Shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        
        return deck;
    },
    
    getCardValue(card) {
        if (card.value === 'A') return 1;
        if (['J', 'Q', 'K'].includes(card.value)) return 10;
        return parseInt(card.value);
    },
    
    getHandValue(cards) {
        return cards.reduce((sum, card) => sum + this.getCardValue(card), 0);
    },
    
    initializeGame(playerBalance) {
        this.init();
        
        // Create players
        const aiNames = ['Tony', 'Tina', 'Tommy', 'Tanya'];
        const numPlayers = 2 + Math.floor(Math.random() * 3); // 2-4 players total
        
        // Human player
        this.gameState.players.push({
            id: 0,
            name: 'You',
            isPlayer: true,
            cards: [],
            chips: playerBalance,
            bet: 0,
            folded: false,
            knocked: false,
            hasDrawn: false
        });
        
        // AI players
        for (let i = 0; i < numPlayers - 1; i++) {
            this.gameState.players.push({
                id: i + 1,
                name: aiNames[i],
                isPlayer: false,
                cards: [],
                chips: 500 + Math.floor(Math.random() * 500),
                bet: 0,
                folded: false,
                knocked: false,
                hasDrawn: false
            });
        }
        
        return this.gameState;
    },
    
    startNewHand() {
        this.gameState.deck = this.createDeck();
        this.gameState.discardPile = [];
        this.gameState.currentPlayerIndex = (this.gameState.dealer + 1) % this.gameState.players.length;
        this.gameState.gamePhase = 'playing';
        this.gameState.knocker = null;
        
        // Reset players
        this.gameState.players.forEach(p => {
            p.cards = [];
            p.folded = false;
            p.knocked = false;
            p.hasDrawn = false;
        });
        
        // Deal 5 cards to each player
        for (let i = 0; i < 5; i++) {
            this.gameState.players.forEach(player => {
                if (!player.folded) {
                    player.cards.push(this.gameState.deck.pop());
                }
            });
        }
        
        // Check for immediate Tonks (49 or 50 points)
        this.gameState.players.forEach(player => {
            const handValue = this.getHandValue(player.cards);
            if (handValue === 49 || handValue === 50) {
                player.tonk = true;
            }
        });
        
        // Start discard pile
        this.gameState.discardPile.push(this.gameState.deck.pop());
        
        return this.gameState;
    },
    
    // Check if cards form a valid spread (3+ cards of same rank or run)
    isValidSpread(cards) {
        if (cards.length < 3) return false;
        
        // Check for book (same rank)
        const allSameRank = cards.every(c => c.value === cards[0].value);
        if (allSameRank) return true;
        
        // Check for run (consecutive same suit)
        const allSameSuit = cards.every(c => c.suit === cards[0].suit);
        if (!allSameSuit) return false;
        
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const indices = cards.map(c => values.indexOf(c.value)).sort((a, b) => a - b);
        
        // Check if consecutive
        for (let i = 1; i < indices.length; i++) {
            if (indices[i] !== indices[i-1] + 1) return false;
        }
        
        return true;
    },
    
    // Find all valid spreads in hand
    findSpreads(cards) {
        const spreads = [];
        
        // Group by rank for books
        const byRank = {};
        cards.forEach(card => {
            if (!byRank[card.value]) byRank[card.value] = [];
            byRank[card.value].push(card);
        });
        
        // Find books (3+ same rank)
        for (let rank in byRank) {
            if (byRank[rank].length >= 3) {
                spreads.push({
                    type: 'book',
                    cards: [...byRank[rank]]
                });
            }
        }
        
        // Group by suit for runs
        const bySuit = {};
        cards.forEach(card => {
            if (!bySuit[card.suit]) bySuit[card.suit] = [];
            bySuit[card.suit].push(card);
        });
        
        // Find runs (3+ consecutive same suit)
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        for (let suit in bySuit) {
            const suitCards = bySuit[suit].sort((a, b) => 
                values.indexOf(a.value) - values.indexOf(b.value)
            );
            
            for (let i = 0; i <= suitCards.length - 3; i++) {
                for (let len = 3; len <= suitCards.length - i; len++) {
                    const potentialRun = suitCards.slice(i, i + len);
                    if (this.isValidSpread(potentialRun)) {
                        spreads.push({
                            type: 'run',
                            cards: potentialRun
                        });
                    }
                }
            }
        }
        
        return spreads;
    },
    
    // Calculate deadwood (cards not in spreads)
    calculateDeadwood(cards) {
        const spreads = this.findSpreads(cards);
        if (spreads.length === 0) return this.getHandValue(cards);
        
        // Find best combination of spreads that minimizes deadwood
        let minDeadwood = this.getHandValue(cards);
        
        // Try each spread combination
        const usedCards = new Set();
        spreads.forEach(spread => {
            spread.cards.forEach(card => {
                const cardKey = `${card.value}${card.suit}`;
                usedCards.add(cardKey);
            });
        });
        
        const deadwoodCards = cards.filter(card => {
            const cardKey = `${card.value}${card.suit}`;
            return !usedCards.has(cardKey);
        });
        
        return this.getHandValue(deadwoodCards);
    },
    
    playerDrawFromDeck(playerId) {
        const player = this.gameState.players[playerId];
        if (player.hasDrawn || this.gameState.deck.length === 0) return false;
        
        player.cards.push(this.gameState.deck.pop());
        player.hasDrawn = true;
        return true;
    },
    
    playerDrawFromDiscard(playerId) {
        const player = this.gameState.players[playerId];
        if (player.hasDrawn || this.gameState.discardPile.length === 0) return false;
        
        player.cards.push(this.gameState.discardPile.pop());
        player.hasDrawn = true;
        return true;
    },
    
    playerDiscard(playerId, cardIndex) {
        const player = this.gameState.players[playerId];
        if (!player.hasDrawn || cardIndex >= player.cards.length) return false;
        
        const discarded = player.cards.splice(cardIndex, 1)[0];
        this.gameState.discardPile.push(discarded);
        player.hasDrawn = false;
        
        // Check if player can knock (5 or less deadwood)
        const deadwood = this.calculateDeadwood(player.cards);
        if (deadwood <= 5) {
            player.canKnock = true;
        }
        
        // Move to next player
        this.advanceToNextPlayer();
        
        return true;
    },
    
    playerKnock(playerId) {
        const player = this.gameState.players[playerId];
        const deadwood = this.calculateDeadwood(player.cards);
        
        if (deadwood > 5) return false;
        
        player.knocked = true;
        this.gameState.knocker = playerId;
        this.gameState.gamePhase = 'knocked';
        
        // Give other players one more turn to lay off cards
        this.resolveKnock();
        
        return true;
    },
    
    advanceToNextPlayer() {
        do {
            this.gameState.currentPlayerIndex = 
                (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
        } while (this.gameState.players[this.gameState.currentPlayerIndex].folded);
        
        // Check if round should end
        if (this.gameState.deck.length === 0) {
            this.gameState.gamePhase = 'complete';
        }
    },
    
    resolveKnock() {
        const knocker = this.gameState.players[this.gameState.knocker];
        const knockerDeadwood = this.calculateDeadwood(knocker.cards);
        
        // Calculate each player's deadwood
        const scores = this.gameState.players.map(player => ({
            id: player.id,
            name: player.name,
            deadwood: this.calculateDeadwood(player.cards),
            spreads: this.findSpreads(player.cards)
        }));
        
        // Find winner (lowest deadwood)
        const winner = scores.reduce((min, curr) => 
            curr.deadwood < min.deadwood ? curr : min
        );
        
        // If knocker doesn't have lowest, they get "caught"
        if (winner.id !== this.gameState.knocker) {
            winner.bonus = 10; // Caught the knocker
        }
        
        this.gameState.scores = scores;
        this.gameState.winner = winner;
        this.gameState.gamePhase = 'complete';
        
        return winner;
    },
    
    getAIAction(player) {
        const topDiscard = this.gameState.discardPile[this.gameState.discardPile.length - 1];
        const currentDeadwood = this.calculateDeadwood(player.cards);
        
        // Decide whether to draw from deck or discard
        let drawFromDiscard = false;
        if (topDiscard) {
            // Check if discard helps make a spread
            const testHand = [...player.cards, topDiscard];
            const testDeadwood = this.calculateDeadwood(testHand);
            if (testDeadwood < currentDeadwood - 3) {
                drawFromDiscard = true;
            }
        }
        
        return {
            action: 'draw',
            fromDiscard: drawFromDiscard
        };
    },
    
    getAIDiscard(player) {
        // Discard highest deadwood card
        const spreads = this.findSpreads(player.cards);
        const spreadCards = new Set();
        spreads.forEach(spread => {
            spread.cards.forEach(card => {
                spreadCards.add(`${card.value}${card.suit}`);
            });
        });
        
        // Find highest value card not in a spread
        let highestIndex = -1;
        let highestValue = -1;
        
        player.cards.forEach((card, index) => {
            const cardKey = `${card.value}${card.suit}`;
            if (!spreadCards.has(cardKey)) {
                const value = this.getCardValue(card);
                if (value > highestValue) {
                    highestValue = value;
                    highestIndex = index;
                }
            }
        });
        
        // If all cards in spreads, discard lowest value
        if (highestIndex === -1) {
            highestIndex = 0;
            highestValue = this.getCardValue(player.cards[0]);
            player.cards.forEach((card, index) => {
                const value = this.getCardValue(card);
                if (value < highestValue) {
                    highestValue = value;
                    highestIndex = index;
                }
            });
        }
        
        return highestIndex;
    },
    
    shouldAIKnock(player) {
        const deadwood = this.calculateDeadwood(player.cards);
        if (deadwood <= 2) return true; // Always knock with 2 or less
        if (deadwood <= 5 && Math.random() < 0.6) return true; // 60% chance with 3-5
        return false;
    },
    
    getGameState() {
        return this.gameState;
    }
};
