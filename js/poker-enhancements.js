// WPT-Style Poker Enhancements
const pokerEnhancer = {
    handHistory: [],
    currentHand: null,
    
    init() {
        this.loadHandHistory();
    },
    
    loadHandHistory() {
        this.handHistory = JSON.parse(localStorage.getItem('egold_poker_history') || '[]');
    },
    
    saveHandHistory() {
        // Keep last 50 hands
        if (this.handHistory.length > 50) {
            this.handHistory = this.handHistory.slice(-50);
        }
        localStorage.setItem('egold_poker_history', JSON.stringify(this.handHistory));
    },
    
    // Record a poker hand
    recordHand(gameName, playerCards, dealerCards, communityCards, result, bet, payout) {
        const hand = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            gameName: gameName,
            playerCards: playerCards,
            dealerCards: dealerCards,
            communityCards: communityCards || [],
            result: result, // 'win', 'loss', 'draw'
            bet: bet,
            payout: payout,
            netProfit: payout - bet
        };
        
        this.handHistory.unshift(hand);
        this.saveHandHistory();
        this.currentHand = hand;
    },
    
    // Create premium 3D poker table
    createPremiumTable(gameType = 'holdem') {
        const tableColors = {
            holdem: { primary: '#0B4D2C', secondary: '#0A3D24', accent: '#FFB800' },
            omaha: { primary: '#1A1A4D', secondary: '#12123A', accent: '#FFB800' },
            pineapple: { primary: '#4D0B2C', secondary: '#3A0A24', accent: '#FFB800' }
        };
        
        const colors = tableColors[gameType] || tableColors.holdem;
        
        return `
            <div class="premium-poker-table" style="
                position: relative;
                background: radial-gradient(ellipse at center, ${colors.primary} 0%, ${colors.secondary} 100%);
                border-radius: 200px;
                padding: 40px 60px;
                box-shadow: 
                    inset 0 0 60px rgba(0,0,0,0.5),
                    0 20px 60px rgba(0,0,0,0.6),
                    inset 0 2px 0 rgba(255,255,255,0.1);
                border: 8px solid #8B4513;
                max-width: 900px;
                margin: 20px auto;
                min-height: 400px;
            ">
                <!-- Table Felt Texture -->
                <div style="
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-image: 
                        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px),
                        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px);
                    border-radius: 200px;
                    pointer-events: none;
                "></div>
                
                <!-- Inner Rail -->
                <div style="
                    position: absolute;
                    top: 12px; left: 12px; right: 12px; bottom: 12px;
                    border: 2px solid rgba(255,184,0,0.3);
                    border-radius: 190px;
                    pointer-events: none;
                "></div>
                
                <!-- Table Content -->
                <div style="position: relative; z-index: 1;">
                    <div id="tableContent"></div>
                </div>
            </div>
        `;
    },
    
    // Create player seat with VIP ring
    createPlayerSeat(position, playerName, chips, isActive = false, vipLevel = 0) {
        const vipRings = {
            0: { color: '#888', glow: 'rgba(136,136,136,0.4)' },
            1: { color: '#CD7F32', glow: 'rgba(205,127,50,0.6)' }, // Bronze
            2: { color: '#C0C0C0', glow: 'rgba(192,192,192,0.6)' }, // Silver
            3: { color: '#FFD700', glow: 'rgba(255,215,0,0.8)' },   // Gold
            4: { color: '#B9F2FF', glow: 'rgba(185,242,255,0.8)' }, // Platinum
            5: { color: '#E0115F', glow: 'rgba(224,17,95,0.8)' }    // Diamond
        };
        
        const ring = vipRings[vipLevel] || vipRings[0];
        const positions = {
            player: { bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
            dealer: { top: '20px', left: '50%', transform: 'translateX(-50%)' },
            left: { top: '50%', left: '20px', transform: 'translateY(-50%)' },
            right: { top: '50%', right: '20px', transform: 'translateY(-50%)' }
        };
        
        const pos = positions[position] || positions.player;
        
        return `
            <div class="poker-seat ${isActive ? 'active-seat' : ''}" style="
                position: absolute;
                ${Object.keys(pos).map(key => `${key}: ${pos[key]};`).join(' ')}
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
            ">
                <!-- Avatar with VIP Ring -->
                <div style="position: relative;">
                    <div class="vip-ring" style="
                        width: 70px;
                        height: 70px;
                        border-radius: 50%;
                        border: 3px solid ${ring.color};
                        box-shadow: 
                            0 0 20px ${ring.glow},
                            inset 0 0 10px ${ring.glow};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #1a1a2e, #16213e);
                        animation: ${isActive ? 'ringPulse 2s infinite' : 'none'};
                    ">
                        <div style="
                            font-size: 2em;
                            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
                        ">🎰</div>
                    </div>
                    ${isActive ? `
                        <div style="
                            position: absolute;
                            top: -5px;
                            right: -5px;
                            width: 20px;
                            height: 20px;
                            background: #2ecc71;
                            border-radius: 50%;
                            border: 2px solid #fff;
                            animation: activePulse 1.5s infinite;
                        "></div>
                    ` : ''}
                </div>
                
                <!-- Player Info -->
                <div style="
                    background: rgba(0,0,0,0.7);
                    padding: 6px 12px;
                    border-radius: 8px;
                    border: 1px solid ${ring.color};
                    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                ">
                    <div style="color: #fff; font-weight: bold; font-size: 0.9em;">${playerName}</div>
                    <div style="color: #FFB800; font-weight: bold; font-size: 0.95em;">💰 ${chips.toFixed(0)}</div>
                </div>
            </div>
        `;
    },
    
    // Create enhanced card with 3D effect
    createEnhancedCard(value, suit, faceDown = false) {
        if (faceDown) {
            return `
                <div class="poker-card card-back" style="
                    width: 70px;
                    height: 100px;
                    background: linear-gradient(135deg, #8B0000, #DC143C);
                    border-radius: 8px;
                    border: 2px solid #FFD700;
                    display: inline-block;
                    margin: 0 4px;
                    box-shadow: 
                        0 4px 8px rgba(0,0,0,0.4),
                        inset 0 1px 0 rgba(255,255,255,0.2);
                    position: relative;
                    transform-style: preserve-3d;
                    transition: transform 0.3s ease;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 1.5em;
                        color: #FFD700;
                        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                    ">👑</div>
                </div>
            `;
        }
        
        const suitColors = {
            '♠': '#000',
            '♣': '#000',
            '♥': '#DC143C',
            '♦': '#DC143C'
        };
        
        const color = suitColors[suit] || '#000';
        
        return `
            <div class="poker-card card-face animate-card-flip" style="
                width: 70px;
                height: 100px;
                background: linear-gradient(135deg, #fff, #f5f5f5);
                border-radius: 8px;
                border: 2px solid #333;
                display: inline-block;
                margin: 0 4px;
                box-shadow: 
                    0 4px 12px rgba(0,0,0,0.3),
                    inset 0 1px 0 rgba(255,255,255,0.8);
                position: relative;
                transform-style: preserve-3d;
                animation: cardFlip 0.6s ease;
            ">
                <!-- Top-left corner -->
                <div style="
                    position: absolute;
                    top: 6px;
                    left: 6px;
                    font-size: 1.1em;
                    font-weight: bold;
                    color: ${color};
                    line-height: 1;
                    text-align: center;
                ">
                    <div>${value}</div>
                    <div>${suit}</div>
                </div>
                
                <!-- Center suit -->
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 2.5em;
                    color: ${color};
                ">${suit}</div>
                
                <!-- Bottom-right corner (rotated) -->
                <div style="
                    position: absolute;
                    bottom: 6px;
                    right: 6px;
                    font-size: 1.1em;
                    font-weight: bold;
                    color: ${color};
                    line-height: 1;
                    text-align: center;
                    transform: rotate(180deg);
                ">
                    <div>${value}</div>
                    <div>${suit}</div>
                </div>
            </div>
        `;
    },
    
    // Create chip stack with denomination
    createChipStack(amount) {
        const chipColors = [
            { min: 1000, color: '#000', label: 'Black', value: 1000 },
            { min: 500, color: '#9B59B6', label: 'Purple', value: 500 },
            { min: 100, color: '#000', label: 'Black', value: 100 },
            { min: 25, color: '#2ecc71', label: 'Green', value: 25 },
            { min: 10, color: '#3498db', label: 'Blue', value: 10 },
            { min: 5, color: '#e74c3c', label: 'Red', value: 5 },
            { min: 1, color: '#fff', label: 'White', value: 1 }
        ];
        
        let remaining = amount;
        let chips = [];
        
        for (const chip of chipColors) {
            if (remaining >= chip.min) {
                const count = Math.floor(remaining / chip.value);
                chips.push({ ...chip, count: Math.min(count, 5) }); // Max 5 visible chips
                remaining -= count * chip.value;
            }
        }
        
        return `
            <div class="chip-stack" style="
                display: inline-flex;
                align-items: flex-end;
                gap: 2px;
                position: relative;
                padding: 5px;
            ">
                ${chips.map((chip, i) => `
                    <div style="
                        width: 35px;
                        height: 35px;
                        border-radius: 50%;
                        background: radial-gradient(circle at 30% 30%, ${chip.color}, ${chip.color === '#fff' ? '#ccc' : '#000'});
                        border: 3px dashed #FFD700;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: 0.7em;
                        color: ${chip.color === '#fff' ? '#000' : '#fff'};
                        box-shadow: 
                            0 ${chip.count * 2}px ${chip.count * 4}px rgba(0,0,0,0.4),
                            inset 0 2px 0 rgba(255,255,255,0.3);
                        position: relative;
                        animation: chipBounce 0.5s ease ${i * 0.1}s;
                    ">${chip.value}</div>
                `).join('')}
                <div style="
                    position: absolute;
                    bottom: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0,0,0,0.8);
                    padding: 3px 8px;
                    border-radius: 5px;
                    color: #FFB800;
                    font-weight: bold;
                    font-size: 0.85em;
                    white-space: nowrap;
                ">${amount.toFixed(0)}</div>
            </div>
        `;
    },
    
    // Show hand history panel
    showHandHistory() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
            z-index: 10000;
            max-width: 900px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            border: 3px solid #FFB800;
        `;
        
        panel.innerHTML = `
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: #FFB800; font-size: 2.2em; margin: 0; text-shadow: 0 0 20px rgba(255, 184, 0, 0.6);">📜 Hand History</h2>
                <p style="color: #888; margin-top: 10px;">Last ${this.handHistory.length} Poker Hands</p>
            </div>
            
            <div style="display: grid; gap: 15px; margin-bottom: 20px;">
                ${this.handHistory.length === 0 ? `
                    <div style="text-align: center; padding: 40px; color: #888;">
                        <p style="font-size: 1.2em;">No hands played yet</p>
                        <p>Play poker to build your hand history!</p>
                    </div>
                ` : this.handHistory.map(hand => {
                    const resultColors = { win: '#2ecc71', loss: '#e74c3c', draw: '#f39c12' };
                    const resultColor = resultColors[hand.result] || '#888';
                    const date = new Date(hand.timestamp);
                    
                    return `
                        <div style="
                            background: rgba(255,255,255,0.05);
                            padding: 20px;
                            border-radius: 12px;
                            border: 2px solid ${resultColor};
                            transition: all 0.3s ease;
                        " onmouseenter="this.style.background='rgba(255,255,255,0.08)'" onmouseleave="this.style.background='rgba(255,255,255,0.05)'">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                <div>
                                    <div style="color: #FFB800; font-weight: bold; font-size: 1.2em;">${hand.gameName}</div>
                                    <div style="color: #888; font-size: 0.9em;">${date.toLocaleString()}</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="color: ${resultColor}; font-weight: bold; font-size: 1.3em; text-transform: uppercase;">${hand.result}</div>
                                    <div style="color: ${hand.netProfit >= 0 ? '#2ecc71' : '#e74c3c'}; font-weight: bold;">
                                        ${hand.netProfit >= 0 ? '+' : ''}${hand.netProfit.toFixed(0)} eGold
                                    </div>
                                </div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                                <div>
                                    <div style="color: #888; font-size: 0.9em; margin-bottom: 5px;">Your Cards</div>
                                    <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
                                        ${hand.playerCards.map(card => this.createEnhancedCard(card.value, card.suit)).join('')}
                                    </div>
                                </div>
                                <div>
                                    <div style="color: #888; font-size: 0.9em; margin-bottom: 5px;">Dealer Cards</div>
                                    <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
                                        ${hand.dealerCards.map(card => this.createEnhancedCard(card.value, card.suit)).join('')}
                                    </div>
                                </div>
                            </div>
                            
                            ${hand.communityCards && hand.communityCards.length > 0 ? `
                                <div style="margin-top: 15px;">
                                    <div style="color: #888; font-size: 0.9em; margin-bottom: 5px;">Community Cards</div>
                                    <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; text-align: center;">
                                        ${hand.communityCards.map(card => this.createEnhancedCard(card.value, card.suit)).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                                <div style="color: #888;">Bet: <span style="color: #3498db;">${hand.bet.toFixed(0)}</span></div>
                                <div style="color: #888;">Payout: <span style="color: #2ecc71;">${hand.payout.toFixed(0)}</span></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <button onclick="this.parentElement.remove()" style="
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, #e74c3c, #c0392b);
                color: white;
                border: none;
                border-radius: 10px;
                font-size: 1.2em;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            ">Close</button>
        `;
        
        document.body.appendChild(panel);
        
        if (typeof soundManager !== 'undefined') {
            soundManager.playChipSound();
        }
    },
    
    // Quick chat emotes
    quickChatEmotes: [
        { text: "Nice hand! 👏", icon: "👏" },
        { text: "Good luck! 🍀", icon: "🍀" },
        { text: "Well played! 🎯", icon: "🎯" },
        { text: "Thanks! 🙏", icon: "🙏" },
        { text: "All in! 💪", icon: "💪" },
        { text: "Fold 😅", icon: "😅" },
        { text: "Nice bluff! 🎭", icon: "🎭" },
        { text: "GG! 🎮", icon: "🎮" }
    ],
    
    showQuickChat() {
        const existingChat = document.getElementById('quickChatPanel');
        if (existingChat) {
            existingChat.remove();
            return;
        }
        
        const panel = document.createElement('div');
        panel.id = 'quickChatPanel';
        panel.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            padding: 15px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            z-index: 9999;
            border: 2px solid #FFB800;
            animation: slideInRight 0.3s ease;
        `;
        
        panel.innerHTML = `
            <div style="color: #FFB800; font-weight: bold; margin-bottom: 10px; text-align: center;">💬 Quick Chat</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                ${this.quickChatEmotes.map(emote => `
                    <button onclick="pokerEnhancer.sendQuickChat('${emote.text}')" style="
                        background: rgba(255,184,0,0.1);
                        border: 1px solid #FFB800;
                        padding: 10px;
                        border-radius: 8px;
                        color: #fff;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        font-size: 0.9em;
                    " onmouseenter="this.style.background='rgba(255,184,0,0.2)'" onmouseleave="this.style.background='rgba(255,184,0,0.1)'">
                        ${emote.icon} ${emote.text.split(' ')[0]}
                    </button>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(panel);
    },
    
    sendQuickChat(message) {
        if (typeof spectatorSystem !== 'undefined' && spectatorSystem.sendChatMessage) {
            spectatorSystem.sendChatMessage(message);
        }
        document.getElementById('quickChatPanel')?.remove();
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes cardFlip {
        0% { transform: rotateY(90deg) scale(0.8); opacity: 0; }
        50% { transform: rotateY(45deg) scale(0.9); }
        100% { transform: rotateY(0deg) scale(1); opacity: 1; }
    }
    
    @keyframes chipBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes ringPulse {
        0%, 100% { box-shadow: 0 0 20px var(--ring-glow), inset 0 0 10px var(--ring-glow); }
        50% { box-shadow: 0 0 30px var(--ring-glow), inset 0 0 15px var(--ring-glow); }
    }
    
    @keyframes activePulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .poker-card:hover {
        transform: translateY(-5px) scale(1.05);
        box-shadow: 0 8px 20px rgba(0,0,0,0.5);
    }
    
    .chip-stack:hover {
        transform: scale(1.1);
    }
    
    .premium-poker-table {
        animation: tableGlow 3s ease-in-out infinite;
    }
    
    @keyframes tableGlow {
        0%, 100% { box-shadow: inset 0 0 60px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.1); }
        50% { box-shadow: inset 0 0 80px rgba(0,0,0,0.6), 0 25px 70px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,0.15); }
    }
`;
document.head.appendChild(style);

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => pokerEnhancer.init());
} else {
    pokerEnhancer.init();
}
