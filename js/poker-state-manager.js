/**
 * Poker State Manager - Centralized state management for all poker games
 * Handles game state, player management, notifications, and session tracking
 */

class PokerStateManager {
    constructor() {
        this.state = {
            currentGame: null,
            players: [],
            pot: 0,
            deck: [],
            communityCards: [],
            round: 'pre-flop',
            currentPlayerIndex: 0,
            dealerIndex: 0,
            smallBlind: 5,
            bigBlind: 10,
            history: [],
            sessionStats: {
                totalBets: 0,
                totalPayouts: 0,
                netProfit: 0,
                gamesPlayed: 0,
                handsWon: 0,
                handsLost: 0,
                biggestWin: 0,
                biggestLoss: 0
            },
            notifications: []
        };
        
        this.maxHistory = 50;
        this.init();
    }
    
    init() {
        this.resetGame();
        console.log('✅ Poker State Manager initialized');
    }
    
    // Single source of truth for game state
    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }
    
    // Update state and track history
    updateState(newState) {
        try {
            const oldState = this.getState();
            
            // Merge new state with existing state
            Object.assign(this.state, newState);
            
            // Track history (last 50 changes)
            if (this.state.history.length >= this.maxHistory) {
                this.state.history.shift();
            }
            
            this.state.history.push({
                timestamp: Date.now(),
                action: newState.action || 'state_update',
                oldState: oldState,
                newState: JSON.parse(JSON.stringify(newState))
            });
            
            // Update session stats if applicable
            this.updateSessionStats(newState);
            
            // Persist state
            this.persistState();
            
            return true;
        } catch (error) {
            console.error('Error updating state:', error);
            return false;
        }
    }
    
    // Session statistics tracking
    updateSessionStats(newState) {
        if (newState.pot !== undefined && newState.pot > 0) {
            this.state.sessionStats.totalBets += newState.pot;
        }
        
        if (newState.gameResult) {
            this.state.sessionStats.gamesPlayed++;
            
            if (newState.gameResult.won) {
                this.state.sessionStats.handsWon++;
                this.state.sessionStats.totalPayouts += newState.gameResult.amount;
                this.state.sessionStats.netProfit += newState.gameResult.amount;
                
                if (newState.gameResult.amount > this.state.sessionStats.biggestWin) {
                    this.state.sessionStats.biggestWin = newState.gameResult.amount;
                }
            } else {
                this.state.sessionStats.handsLost++;
                this.state.sessionStats.netProfit -= newState.gameResult.amount;
                
                if (newState.gameResult.amount > this.state.sessionStats.biggestLoss) {
                    this.state.sessionStats.biggestLoss = newState.gameResult.amount;
                }
            }
        }
    }
    
    // Reset game state
    resetGame() {
        this.updateState({
            currentGame: null,
            players: [],
            pot: 0,
            deck: [],
            communityCards: [],
            round: 'pre-flop',
            currentPlayerIndex: 0,
            dealerIndex: 0,
            action: 'reset_game'
        });
    }
    
    // Add player to game
    addPlayer(playerData) {
        const newPlayer = {
            id: Date.now() + Math.random(),
            name: playerData.name || `Player ${this.state.players.length + 1}`,
            chips: playerData.chips || 1000,
            bet: 0,
            cards: [],
            folded: false,
            isDealer: false,
            isActive: true,
            position: this.state.players.length
        };
        
        this.updateState({
            players: [...this.state.players, newPlayer],
            action: 'add_player'
        });
        
        return newPlayer;
    }
    
    // Remove player from game
    removePlayer(playerId) {
        const updatedPlayers = this.state.players.filter(p => p.id !== playerId);
        this.updateState({ 
            players: updatedPlayers,
            action: 'remove_player'
        });
    }
    
    // Create a new game
    createGame(gameData) {
        try {
            // Initialize deck
            const deck = this.createDeck();
            
            // Deal initial cards based on game type
            const cardsPerPlayer = gameData.cardsPerPlayer || 2;
            const playersWithCards = this.state.players.map(player => ({
                ...player,
                cards: this.dealCards(deck, cardsPerPlayer),
                bet: 0,
                folded: false
            }));
            
            // Set dealer
            if (playersWithCards.length > 0) {
                playersWithCards[this.state.dealerIndex].isDealer = true;
            }
            
            this.updateState({
                currentGame: {
                    id: Date.now(),
                    name: gameData.name || 'Poker Game',
                    type: gameData.type || 'Texas Hold\'em',
                    createdAt: new Date().toISOString(),
                    smallBlind: gameData.smallBlind || 5,
                    bigBlind: gameData.bigBlind || 10
                },
                players: playersWithCards,
                deck: deck,
                pot: 0,
                communityCards: [],
                round: 'pre-flop',
                smallBlind: gameData.smallBlind || 5,
                bigBlind: gameData.bigBlind || 10,
                action: 'create_game'
            });
            
            return this.state.currentGame;
        } catch (error) {
            console.error('Error creating game:', error);
            return null;
        }
    }
    
    // Create a standard poker deck
    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];
        
        for (let suit of suits) {
            for (let rank of ranks) {
                deck.push({ suit, rank, value: this.getCardValue(rank) });
            }
        }
        
        return this.shuffleDeck(deck);
    }
    
    // Get numeric card value
    getCardValue(rank) {
        const values = {
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
            'J': 11, 'Q': 12, 'K': 13, 'A': 14
        };
        return values[rank] || 0;
    }
    
    // Fisher-Yates shuffle algorithm
    shuffleDeck(deck) {
        const shuffled = [...deck];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Deal cards from deck
    dealCards(deck, count = 1) {
        const cards = [];
        for (let i = 0; i < count; i++) {
            if (deck.length > 0) {
                cards.push(deck.pop());
            }
        }
        return cards;
    }
    
    // Deal community cards (flop, turn, river)
    dealCommunityCards(count) {
        const newCards = this.dealCards(this.state.deck, count);
        this.updateState({
            communityCards: [...this.state.communityCards, ...newCards],
            action: `deal_${count}_cards`
        });
        return newCards;
    }
    
    // Player action (bet, raise, fold, check, call)
    playerAction(playerId, action, amount = 0) {
        const playerIndex = this.state.players.findIndex(p => p.id === playerId);
        if (playerIndex === -1) return false;
        
        const players = [...this.state.players];
        const player = players[playerIndex];
        
        switch(action) {
            case 'fold':
                player.folded = true;
                break;
            case 'check':
                // No action needed
                break;
            case 'call':
                player.chips -= amount;
                player.bet += amount;
                this.state.pot += amount;
                break;
            case 'raise':
            case 'bet':
                player.chips -= amount;
                player.bet += amount;
                this.state.pot += amount;
                break;
        }
        
        this.updateState({
            players: players,
            currentPlayerIndex: (playerIndex + 1) % players.length,
            action: `player_${action}`
        });
        
        return true;
    }
    
    // Advance to next round
    nextRound() {
        const rounds = ['pre-flop', 'flop', 'turn', 'river', 'showdown'];
        const currentIndex = rounds.indexOf(this.state.round);
        
        if (currentIndex < rounds.length - 1) {
            const newRound = rounds[currentIndex + 1];
            
            // Deal community cards
            if (newRound === 'flop') {
                this.dealCommunityCards(3);
            } else if (newRound === 'turn' || newRound === 'river') {
                this.dealCommunityCards(1);
            }
            
            this.updateState({
                round: newRound,
                action: 'next_round'
            });
        }
    }
    
    // Get session statistics
    getSessionStats() {
        return { ...this.state.sessionStats };
    }
    
    // Get game history
    getHistory(limit = 50) {
        return this.state.history.slice(-limit);
    }
    
    // Secure state persistence
    persistState() {
        try {
            const stateString = JSON.stringify({
                sessionStats: this.state.sessionStats,
                history: this.state.history.slice(-10) // Only save last 10 for storage
            });
            
            if (typeof SecurityManager !== 'undefined' && SecurityManager.secureStorage) {
                SecurityManager.secureStorage.save('pokerGameState', stateString);
            } else {
                localStorage.setItem('pokerGameState', stateString);
            }
            
            return true;
        } catch (error) {
            console.error('Error persisting state:', error);
            return false;
        }
    }
    
    // Restore state from persistence
    restoreState() {
        try {
            let stored;
            
            if (typeof SecurityManager !== 'undefined' && SecurityManager.secureStorage) {
                stored = SecurityManager.secureStorage.load('pokerGameState');
            } else {
                const item = localStorage.getItem('pokerGameState');
                if (item) stored = JSON.parse(item);
            }
            
            if (stored) {
                this.state.sessionStats = stored.sessionStats || this.state.sessionStats;
                this.state.history = stored.history || [];
                console.log('✅ Poker state restored');
                return true;
            }
        } catch (error) {
            console.error('Error restoring state:', error);
        }
        return false;
    }
}

/**
 * Notification Manager - Handles all game notifications
 */
class NotificationManager {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        this.container = document.getElementById('notifications-container');
        if (!this.container) {
            this.container = this.createNotificationContainer();
        }
    }
    
    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notifications-container';
        container.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10000;
            width: 320px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getColorByType(type)};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            position: relative;
            pointer-events: auto;
            font-size: 0.95em;
            line-height: 1.4;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.3em;">${this.getIconByType(type)}</span>
                <div style="flex: 1;">${message}</div>
                <button class="close-btn" style="
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 18px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                ">×</button>
            </div>
        `;
        
        // Add close functionality
        const closeButton = notification.querySelector('.close-btn');
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.background = 'rgba(255,255,255,0.3)';
        });
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.background = 'rgba(255,255,255,0.2)';
        });
        closeButton.addEventListener('click', () => {
            this.hideNotification(notification);
        });
        
        // Add to container and animate in
        this.container.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });
        
        // Auto-hide
        if (duration > 0) {
            setTimeout(() => {
                this.hideNotification(notification);
            }, duration);
        }
        
        return notification;
    }
    
    hideNotification(element) {
        element.style.transform = 'translateX(400px)';
        element.style.opacity = '0';
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 300);
    }
    
    getColorByType(type) {
        switch(type) {
            case 'error': return 'linear-gradient(135deg, #e74c3c, #c0392b)';
            case 'warning': return 'linear-gradient(135deg, #f39c12, #e67e22)';
            case 'success': return 'linear-gradient(135deg, #2ecc71, #27ae60)';
            case 'info': return 'linear-gradient(135deg, #3498db, #2980b9)';
            default: return 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
        }
    }
    
    getIconByType(type) {
        switch(type) {
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'success': return '✅';
            case 'info': return 'ℹ️';
            default: return '💬';
        }
    }
}

// Initialize global instances
const pokerStateManager = new PokerStateManager();
const notificationManager = new NotificationManager();

// Restore previous session on load
document.addEventListener('DOMContentLoaded', () => {
    pokerStateManager.restoreState();
    
    // Example usage notification
    notificationManager.showNotification('Poker State Manager Ready!', 'success', 2000);
});

console.log('✅ Poker State Manager and Notification Manager loaded');
