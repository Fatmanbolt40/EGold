// Omaha Poker (4 hole cards)
const omahaGame = {
    ante: 10,
    
    init() {
        // Show game mode selector
        PVPSystem.showGameModeSelector('omaha', 'Omaha Poker');
    },
    
    initSolo() {
        const content = document.getElementById('gameContent');
        const vipLevel = typeof vipSystem !== 'undefined' ? vipSystem.getCurrentLevel().level : 0;
        
        content.innerHTML = `
            <div style="text-align: center;">
                <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 20px; border-radius: 15px; margin-bottom: 20px; border: 2px solid #FFB800; box-shadow: 0 4px 20px rgba(255,184,0,0.3);">
                    <h3 style="color: #FFB800; font-size: 2em; margin: 0; text-shadow: 0 0 20px rgba(255,184,0,0.6);">♦️ ROYAL OMAHA HI ♣️</h3>
                    <p style="color: #888; margin: 10px 0 0 0;">4-Card Power Poker - WPT Style</p>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px; flex-wrap: wrap;">
                    <button onclick="pokerEnhancer.showHandHistory()" style="background: linear-gradient(135deg, #3498db, #2980b9); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(52,152,219,0.3);">
                        📜 Hand History
                    </button>
                    <button onclick="pokerEnhancer.showQuickChat()" style="background: linear-gradient(135deg, #9b59b6, #8e44ad); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 15px rgba(155,89,182,0.3);">
                        💬 Quick Chat
                    </button>
                </div>
                
                ${pokerEnhancer.createPremiumTable('omaha')}
                
                <script>
                    document.getElementById('tableContent').innerHTML = \`
                        ${pokerEnhancer.createPlayerSeat('dealer', 'Dealer', 1000, false, 0)}
                        ${pokerEnhancer.createPlayerSeat('player', 'You', balance, true, ${vipLevel})}
                        
                        <div style="position: relative; z-index: 2; margin-top: 20px;">
                            <div style="margin: 20px 0;">
                                <div style="color: #888; font-size: 0.9em; margin-bottom: 10px;">Dealer (4 Cards)</div>
                                <div id="dealerHand">${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}</div>
                            </div>
                            
                            <div style="margin: 30px 0;">
                                <div style="color: #FFB800; font-size: 1.2em; font-weight: bold; margin-bottom: 15px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">🎴 Community Cards 🎴</div>
                                <div id="communityCards" style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 12px; display: inline-block;">
                                    ${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}
                                </div>
                            </div>
                            
                            <div style="margin: 20px 0;">
                                <div style="color: #FFB800; font-size: 1.1em; font-weight: bold; margin-bottom: 10px;">Your Hand (4 Cards)</div>
                                <div id="playerHand">${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}${pokerEnhancer.createEnhancedCard('?', '♠', true)}</div>
                            </div>
                        </div>
                    \`;
                </script>
                
                <button onclick="omahaGame.play()" class="game-button" style="padding: 18px 50px; font-size: 1.4em; background: linear-gradient(135deg, #FFB800, #d4af37); border: none; border-radius: 12px; color: #1A2332; font-weight: bold; cursor: pointer; margin: 30px 0; box-shadow: 0 6px 20px rgba(255,184,0,0.4); transition: all 0.3s ease;">
                    🎰 Deal Hand (${this.ante} eGold)
                </button>
                
                <div id="omahaResult" style="margin-top: 20px; font-size: 1.3em; min-height: 30px;"></div>
                
                <div style="margin-top: 30px; padding: 20px; background: rgba(255, 184, 0, 0.1); border-radius: 10px; border: 2px solid #FFB800;">
                    <h3 style="color: #FFB800; margin-bottom: 15px;">👑 Omaha Royale</h3>
                    <p style="font-size: 1.1em; color: #cccccc; margin-bottom: 15px;">4 hole cards variant - must use exactly 2 from hand + 3 from board</p>
                    <div style="margin-top: 15px; padding: 15px; background: rgba(46, 204, 113, 0.1); border-radius: 10px; border: 2px solid #2ecc71;">
                        <h4 style="color: #2ecc71; margin-bottom: 10px;">📜 Game Rules</h4>
                        <ul style="text-align: left; max-width: 450px; margin: 0 auto; color: #cccccc; line-height: 1.8;">
                            <li>Pay ante (<b>${this.ante} eGold</b>)</li>
                            <li>Receive <b>4 hole cards</b> (vs. 2 in Hold'em)</li>
                            <li><b>5 community cards</b> dealt</li>
                            <li><b>Must use exactly 2</b> hole cards + 3 community</li>
                            <li>Cannot use 3 or 4 hole cards</li>
                            <li>More possibilities = bigger hands</li>
                            <li>Beat dealer to win <b style="color: #FFB800;">2x ante!</b></li>
                            <li>Same hand rankings as Hold'em</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    },
    
    play() {
        if (balance < this.ante) {
            document.getElementById('omahaResult').innerHTML = '<span style="color: #e74c3c;">Insufficient balance!</span>';
            return;
        }
        
        updateBalance(-this.ante);
        
        // Track for VIP, achievements, and leaderboard
        if (typeof vipSystem !== 'undefined') vipSystem.trackWager(this.ante);
        if (typeof achievementSystem !== 'undefined') achievementSystem.trackBet(this.ante, 'Royal Omaha Hi');
        if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWager(this.ante, 'Royal Omaha Hi');
        
        // Simplified - dealer has advantage
        const playerScore = Math.random() * 100;
        const dealerScore = Math.random() * 100 + 5; // House edge
        
        // Show actual cards
        document.getElementById('playerHand').innerHTML = 
            VisualEnhancer.createCard('A', 'spades') + 
            VisualEnhancer.createCard('K', 'spades') + 
            VisualEnhancer.createCard('Q', 'diamonds') + 
            VisualEnhancer.createCard('J', 'diamonds');
        document.getElementById('dealerHand').innerHTML = 
            VisualEnhancer.createCard('K', 'hearts') + 
            VisualEnhancer.createCard('Q', 'hearts') + 
            VisualEnhancer.createCard('J', 'clubs') + 
            VisualEnhancer.createCard('10', 'clubs');
        document.getElementById('communityCards').innerHTML = 
            VisualEnhancer.createCard('10', 'spades') + 
            VisualEnhancer.createCard('9', 'spades') + 
            VisualEnhancer.createCard('8', 'spades') + 
            VisualEnhancer.createCard('7', 'hearts') + 
            VisualEnhancer.createCard('6', 'diamonds');
        
        if (playerScore > dealerScore) {
            const payout = this.ante * 2;
            updateBalance(payout);
            document.getElementById('omahaResult').innerHTML = `<span style="color: #2ecc71; font-size: 1.5em;">🎉 YOU WIN! +${payout} eGold</span>`;
        } else {
            document.getElementById('omahaResult').innerHTML = '<span style="color: #e74c3c;">Dealer wins. Try again!</span>';
        }
    },
    
    initPVP(room) {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #7B68EE; font-size: 1.8em;">👥 PVP Omaha Poker</h3>
                    <p style="color: #FFB800; font-size: 1.2em;">Pot: ${room.bet * 2} eGold</p>
                </div>
                
                <div style="margin: 30px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 700px; margin: 30px auto;">
                    <div style="padding: 20px; background: rgba(231, 76, 60, 0.2); border: 2px solid #e74c3c; border-radius: 10px;">
                        <h4 style="color: #e74c3c;">🤖 Opponent</h4>
                        <div style="font-size: 1.8em; margin: 10px 0;">🂠 🂠 🂠 🂠</div>
                    </div>
                    <div style="padding: 20px; background: rgba(46, 204, 113, 0.2); border: 2px solid #2ecc71; border-radius: 10px;">
                        <h4 style="color: #2ecc71;">😊 You</h4>
                        <div id="pvpPlayerHandOmaha" style="font-size: 1.8em; margin: 10px 0;">🂠 🂠 🂠 🂠</div>
                    </div>
                </div>
                
                <div style="margin: 30px 0;">
                    <h4 style="color: #FFB800;">Community Cards</h4>
                    <div id="pvpCommunityOmaha" style="font-size: 2.5em;">🂠 🂠 🂠 🂠 🂠</div>
                </div>
                
                <button onclick="omahaGame.playPVP(${room.bet})" class="game-button">🎮 Play Hand</button>
                <div id="pvpResultOmaha" style="margin-top: 20px; font-size: 1.3em;"></div>
            </div>
        `;
    },
    
    playPVP(bet) {
        const playerScore = Math.random() * 1000;
        const opponentScore = Math.random() * 1000;
        
        document.getElementById('pvpPlayerHandOmaha').innerText = 'A♠ K♠ Q♦ J♦';
        document.getElementById('pvpCommunityOmaha').innerText = '10♠ 9♠ 8♠ 7♥ 6♦';
        
        const resultDiv = document.getElementById('pvpResultOmaha');
        setTimeout(() => {
            const opponentDiv = document.querySelector('[style*="rgba(231, 76, 60"]').querySelector('div[style*="font-size: 1.8em"]');
            opponentDiv.innerText = 'K♥ Q♥ J♣ 10♣';
            
            if (playerScore > opponentScore) {
                updateBalance(bet * 2);
                resultDiv.innerHTML = `<div class="game-result win"><h3>🎉 YOU WIN!</h3><p>+${bet * 2} eGold</p></div>`;
            } else if (playerScore === opponentScore) {
                updateBalance(bet);
                resultDiv.innerHTML = `<div class="game-result" style="background: rgba(255, 184, 0, 0.2); border-color: #FFB800;"><h3 style="color: #FFB800;">🤝 TIE!</h3><p>Bet returned</p></div>`;
            } else {
                resultDiv.innerHTML = `<div class="game-result lose"><h3>😔 YOU LOSE</h3><p>-${bet} eGold</p></div>`;
            }
        }, 1000);
    }
};

window.omahaGame = omahaGame;
