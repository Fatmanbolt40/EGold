// Poker Engine - Hand evaluation and card utilities

class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    toString() {
        return this.rank + this.suit;
    }

    getDisplayValue() {
        const suitSymbols = { 'H': '♥', 'D': '♦', 'C': '♣', 'S': '♠' };
        return this.rank + suitSymbols[this.suit];
    }

    getColor() {
        return (this.suit === 'H' || this.suit === 'D') ? 'red' : 'black';
    }
}

class Deck {
    constructor() {
        this.cards = [];
        this.reset();
    }

    reset() {
        this.cards = [];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const suits = ['H', 'D', 'C', 'S'];

        for (let suit of suits) {
            for (let rank of ranks) {
                this.cards.push(new Card(rank, suit));
            }
        }
        this.shuffle();
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    deal(count = 1) {
        return this.cards.splice(0, count);
    }
}

class HandEvaluator {
    static rankValues = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };

    static handRankings = {
        'Royal Flush': 10,
        'Straight Flush': 9,
        'Four of a Kind': 8,
        'Full House': 7,
        'Flush': 6,
        'Straight': 5,
        'Three of a Kind': 4,
        'Two Pair': 3,
        'One Pair': 2,
        'High Card': 1
    };

    static evaluateHand(cards) {
        if (cards.length < 5) return { rank: 0, name: 'Incomplete Hand', value: 0 };

        const allCombinations = this.getCombinations(cards, 5);
        let bestHand = { rank: 0, name: 'High Card', value: 0 };

        for (let combo of allCombinations) {
            const evaluation = this.evaluateFiveCards(combo);
            if (evaluation.rank > bestHand.rank || 
                (evaluation.rank === bestHand.rank && evaluation.value > bestHand.value)) {
                bestHand = evaluation;
                bestHand.cards = combo;
            }
        }

        return bestHand;
    }

    static evaluateFiveCards(cards) {
        const isFlush = this.checkFlush(cards);
        const isStraight = this.checkStraight(cards);
        const rankCounts = this.getRankCounts(cards);
        const counts = Object.values(rankCounts).sort((a, b) => b - a);

        // Royal Flush
        if (isFlush && isStraight && this.getRankValue(cards[0].rank) === 14) {
            return { rank: this.handRankings['Royal Flush'], name: 'Royal Flush', value: 14 };
        }

        // Straight Flush
        if (isFlush && isStraight) {
            return { rank: this.handRankings['Straight Flush'], name: 'Straight Flush', 
                    value: this.getHighestRankValue(cards) };
        }

        // Four of a Kind
        if (counts[0] === 4) {
            return { rank: this.handRankings['Four of a Kind'], name: 'Four of a Kind', 
                    value: this.getHighestRankValue(cards) };
        }

        // Full House
        if (counts[0] === 3 && counts[1] === 2) {
            return { rank: this.handRankings['Full House'], name: 'Full House', 
                    value: this.getHighestRankValue(cards) };
        }

        // Flush
        if (isFlush) {
            return { rank: this.handRankings['Flush'], name: 'Flush', 
                    value: this.getHighestRankValue(cards) };
        }

        // Straight
        if (isStraight) {
            return { rank: this.handRankings['Straight'], name: 'Straight', 
                    value: this.getHighestRankValue(cards) };
        }

        // Three of a Kind
        if (counts[0] === 3) {
            return { rank: this.handRankings['Three of a Kind'], name: 'Three of a Kind', 
                    value: this.getHighestRankValue(cards) };
        }

        // Two Pair
        if (counts[0] === 2 && counts[1] === 2) {
            return { rank: this.handRankings['Two Pair'], name: 'Two Pair', 
                    value: this.getHighestRankValue(cards) };
        }

        // One Pair
        if (counts[0] === 2) {
            return { rank: this.handRankings['One Pair'], name: 'One Pair', 
                    value: this.getHighestRankValue(cards) };
        }

        // High Card
        return { rank: this.handRankings['High Card'], name: 'High Card', 
                value: this.getHighestRankValue(cards) };
    }

    static checkFlush(cards) {
        const suit = cards[0].suit;
        return cards.every(card => card.suit === suit);
    }

    static checkStraight(cards) {
        const values = cards.map(card => this.getRankValue(card.rank)).sort((a, b) => a - b);
        
        // Check for regular straight
        let isStraight = true;
        for (let i = 1; i < values.length; i++) {
            if (values[i] !== values[i-1] + 1) {
                isStraight = false;
                break;
            }
        }
        
        // Check for wheel (A-2-3-4-5)
        if (!isStraight && values[4] === 14) {
            const wheelValues = [values[0], values[1], values[2], values[3], 1];
            isStraight = wheelValues[0] === 1 && wheelValues[1] === 2 && 
                        wheelValues[2] === 3 && wheelValues[3] === 4;
        }
        
        return isStraight;
    }

    static getRankCounts(cards) {
        const counts = {};
        for (let card of cards) {
            counts[card.rank] = (counts[card.rank] || 0) + 1;
        }
        return counts;
    }

    static getRankValue(rank) {
        return this.rankValues[rank];
    }

    static getHighestRankValue(cards) {
        return Math.max(...cards.map(card => this.getRankValue(card.rank)));
    }

    static getCombinations(array, size) {
        if (size > array.length) return [];
        if (size === array.length) return [array];
        if (size === 1) return array.map(item => [item]);

        const combinations = [];
        for (let i = 0; i <= array.length - size; i++) {
            const head = array[i];
            const tailCombinations = this.getCombinations(array.slice(i + 1), size - 1);
            for (let tail of tailCombinations) {
                combinations.push([head, ...tail]);
            }
        }
        return combinations;
    }

    static compareHands(hand1, hand2) {
        if (hand1.rank > hand2.rank) return 1;
        if (hand1.rank < hand2.rank) return -1;
        if (hand1.value > hand2.value) return 1;
        if (hand1.value < hand2.value) return -1;
        return 0;
    }
}

// AI Player class for poker games
class AIPlayer {
    constructor(name, chips, style = 'balanced') {
        this.name = name;
        this.chips = chips;
        this.hand = [];
        this.folded = false;
        this.currentBet = 0;
        this.style = style; // 'aggressive', 'passive', 'balanced'
    }

    makeDecision(gameState) {
        const { currentBet, pot, communityCards } = gameState;
        const toCall = currentBet - this.currentBet;

        // Simple AI logic based on hand strength
        const handStrength = this.evaluateHandStrength(communityCards);
        const potOdds = toCall / (pot + toCall);

        if (this.style === 'aggressive') {
            if (handStrength > 0.3) {
                return Math.random() > 0.5 ? 'raise' : 'call';
            } else if (handStrength > 0.1) {
                return toCall === 0 ? 'check' : (Math.random() > 0.7 ? 'call' : 'fold');
            } else {
                return toCall === 0 ? 'check' : 'fold';
            }
        } else if (this.style === 'passive') {
            if (handStrength > 0.6) {
                return 'raise';
            } else if (handStrength > 0.3) {
                return toCall === 0 ? 'check' : 'call';
            } else {
                return toCall === 0 ? 'check' : 'fold';
            }
        } else { // balanced
            if (handStrength > 0.5) {
                return Math.random() > 0.4 ? 'raise' : 'call';
            } else if (handStrength > 0.2) {
                return toCall === 0 ? 'check' : (handStrength > potOdds ? 'call' : 'fold');
            } else {
                return toCall === 0 ? 'check' : 'fold';
            }
        }
    }

    evaluateHandStrength(communityCards) {
        if (this.hand.length === 0) return 0;
        
        const allCards = [...this.hand, ...communityCards];
        if (allCards.length < 2) return Math.random() * 0.5;

        if (allCards.length >= 5) {
            const evaluation = HandEvaluator.evaluateHand(allCards);
            return evaluation.rank / 10;
        } else {
            // Pre-flop hand strength
            const pairValue = this.hand[0].rank === this.hand[1].rank ? 0.7 : 0;
            const highCardValue = (HandEvaluator.getRankValue(this.hand[0].rank) + 
                                  HandEvaluator.getRankValue(this.hand[1].rank)) / 28;
            const suitedBonus = this.hand[0].suit === this.hand[1].suit ? 0.1 : 0;
            
            return Math.min(pairValue + highCardValue + suitedBonus, 1);
        }
    }

    getRaiseAmount(minRaise, maxRaise) {
        const factor = this.style === 'aggressive' ? 0.7 : (this.style === 'passive' ? 0.3 : 0.5);
        return Math.floor(minRaise + (maxRaise - minRaise) * factor);
    }
}
