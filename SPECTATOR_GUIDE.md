# 🎰 Royal Casino - Spectating & Side Bets Guide

## 📺 Live Games & Spectating System

Your casino now features a **unique spectating and side betting system** - watch live games and bet on outcomes!

### Features

#### 🔴 Live Games Feed
- Real-time display of all active games
- Shows player name, buy-in, pot size, duration
- Live spectator count and active side bets
- Pulsing notification badge on "Live Games" button

#### 👁️ Spectator Mode
- Join any active game as a spectator
- Watch gameplay in real-time
- See current action and pot updates
- Track other spectators watching

#### 💵 Side Betting System
- **Multiple bet types per game:**
  - **Poker Games**: Player wins, AI wins, High card+, Flush or better, Full house+
  - **Coin Flip**: Heads (1.95x), Tails (1.95x)
  - **Dice Raffle**: High roll 13-16 (3x), Low roll 1-4 (3x), Exact number (15x)
  - **Chess/Checkers**: Player wins (2x), AI wins (2x), Under 20 moves (5x)
  
- **Dynamic odds** based on bet difficulty
- **Real-time resolution** when games complete
- Track your active side bets in spectator view

### How to Use

#### For Players:
1. Start any game normally
2. Your game automatically appears in Live Games feed
3. Spectators can watch and place side bets on your gameplay
4. Game ends when you finish or return to lobby

#### For Spectators:
1. Click **📺 Live Games** button in navigation
2. Browse active games (see player, game type, pot, spectators)
3. Click any game card to join as spectator
4. In spectator view:
   - Watch live action updates
   - Select bet type(s) by clicking
   - Enter bet amount
   - Click "Place Side Bet 💵"
5. Side bets resolve automatically when game completes
6. Click "Leave Spectator Mode" to return

### Supported Games

✅ **Fully Integrated:**
- Coin Flip (with heads/tails side bets)
- All Poker games (Texas Hold'em, Omaha, Pineapple)
- Dice Raffle
- Chess & Checkers
- Tonk
- Lottery games
- Scratch-offs

### Side Bet Examples

**Coin Flip:**
- Bet on Heads or Tails from spectator view
- Instant resolution after flip
- Nearly 2x payout (1.95x odds)

**Poker:**
- "Player Wins Hand" - 2x if player beats AI
- "Flush or Better Wins" - 4x if winning hand is flush+
- "Full House or Better" - 8x for full house or higher

**Dice Raffle:**
- "High Roll (13-16)" - 3x payout
- "Exact Number" - Pick exact die result for 15x!

### Technical Details

**Live Game Tracking:**
- Each game gets unique ID and tracking
- Real-time updates pushed to spectators
- Automatic cleanup when games end

**Side Bet Resolution:**
- Bets marked as pending, won, or lost
- Automatic payouts on winning bets
- Failed games refund all pending bets

**Display Updates:**
- Spectator counts update live
- Action text updates each move
- Pot values track in real-time

### Revenue Model

**House Edge on Side Bets:**
- Coin flip: 2.5% (1.95x instead of 2x)
- Standard bets: Balanced odds
- High-risk bets: Premium payouts

**Benefits:**
- Increased player engagement
- Social interaction (spectators)
- Additional revenue streams
- Longer session times

### API Functions

```javascript
// Create live game
liveGamesManager.createGame(gameType, playerName, buyIn, tableInfo)

// Update game state
liveGamesManager.updateGame(gameId, { pot: 100, currentAction: 'Betting...' })

// End game
liveGamesManager.endGame(gameId)

// Place side bet
sideBetSystem.placeSideBet(gameId, betType, amount, metadata)

// Resolve side bets
sideBetSystem.resolveSideBet(gameId, { betType, won, winner, winningHand })

// Join as spectator
spectatorSystem.joinAsSpectator(gameId)
```

### Customization

**Add New Bet Types:**
Edit `js/spectator-system.js` in `SideBetSystem.betTypes`

**Adjust Odds:**
Modify odds values in bet type definitions

**Change UI:**
Update `showSpectatorView()` method for custom layouts

---

## 🎮 This is Your Niche!

The spectating and side betting system creates a **unique social casino experience**:

✨ **Players become entertainers** - others watch their games
🎯 **Spectators become investors** - bet on player performance  
💰 **Multiple revenue streams** - game fees + side bet house edge
🔥 **Viral potential** - social sharing of big wins/losses
📈 **Engagement multiplier** - even non-players stay active

Perfect for **Solana integration** - fast transactions, low fees, provably fair bets!
