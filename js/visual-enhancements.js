// Visual Enhancement Utilities for Casino Games

const VisualEnhancer = {
    // Create a realistic roulette wheel
    createRouletteWheel(resultNumber = null) {
        const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
        const reds = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];
        
        return `
            <div style="position: relative; width: 300px; height: 300px; margin: 20px auto;">
                <svg width="300" height="300" viewBox="0 0 300 300" style="filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));">
                    <!-- Outer rim -->
                    <circle cx="150" cy="150" r="145" fill="#8B4513" stroke="#FFB800" stroke-width="4"/>
                    <circle cx="150" cy="150" r="135" fill="#1a1a1a" stroke="#FFB800" stroke-width="2"/>
                    
                    <!-- Number segments -->
                    ${numbers.map((num, i) => {
                        const angle = (i * 360 / 37) - 90;
                        const nextAngle = ((i + 1) * 360 / 37) - 90;
                        const rad1 = angle * Math.PI / 180;
                        const rad2 = nextAngle * Math.PI / 180;
                        
                        const x1 = 150 + 130 * Math.cos(rad1);
                        const y1 = 150 + 130 * Math.sin(rad1);
                        const x2 = 150 + 130 * Math.cos(rad2);
                        const y2 = 150 + 130 * Math.sin(rad2);
                        
                        const color = num === 0 ? '#27ae60' : (reds.includes(num) ? '#e74c3c' : '#2c3e50');
                        const isWinning = num === resultNumber;
                        
                        return `
                            <path d="M 150 150 L ${x1} ${y1} A 130 130 0 0 1 ${x2} ${y2} Z" 
                                  fill="${color}" 
                                  stroke="#FFB800" 
                                  stroke-width="${isWinning ? '3' : '1'}"
                                  opacity="${isWinning ? '1' : '0.9'}"/>
                        `;
                    }).join('')}
                    
                    <!-- Center circle -->
                    <circle cx="150" cy="150" r="30" fill="#2c2c2c" stroke="#FFB800" stroke-width="3"/>
                    <text x="150" y="160" text-anchor="middle" fill="#FFB800" font-size="24" font-weight="bold">
                        ${resultNumber !== null ? resultNumber : '?'}
                    </text>
                    
                    <!-- Ball -->
                    ${resultNumber !== null ? `
                        <circle cx="150" cy="150" r="8" fill="white" style="animation: ballBounce 0.5s ease;">
                            <animateTransform attributeName="transform" type="rotate" 
                                from="0 150 150" to="360 150 150" dur="2s" repeatCount="1"/>
                        </circle>
                    ` : ''}
                </svg>
            </div>
        `;
    },
    
    // Create chess board with pieces
    createChessBoard(result = null) {
        const pieces = {
            white: ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
            black: ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
        };
        
        let html = '<div style="display: inline-block; border: 10px solid #8B4513; box-shadow: 0 10px 40px rgba(0,0,0,0.5); background: #8B4513; border-radius: 8px;">';
        html += '<div style="display: grid; grid-template-columns: repeat(8, 50px); grid-template-rows: repeat(8, 50px); gap: 0;">';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isLight = (row + col) % 2 === 0;
                const bgColor = isLight ? '#f0d9b5' : '#b58863';
                let piece = '';
                
                if (row === 0) piece = pieces.black[col];
                else if (row === 1) piece = '♟';
                else if (row === 6) piece = '♙';
                else if (row === 7) piece = pieces.white[col];
                
                html += `<div style="width: 50px; height: 50px; background: ${bgColor}; display: flex; align-items: center; justify-content: center; font-size: 2.5em; user-select: none;">${piece}</div>`;
            }
        }
        
        html += '</div></div>';
        if (result) {
            html += `<div style="margin-top: 20px; font-size: 1.5em; color: #FFB800; font-weight: bold;">${result}</div>`;
        }
        return html;
    },
    
    // Create checkers board
    createCheckersBoard(result = null) {
        let html = '<div style="display: inline-block; border: 10px solid #8B4513; box-shadow: 0 10px 40px rgba(0,0,0,0.5); background: #8B4513; border-radius: 8px;">';
        html += '<div style="display: grid; grid-template-columns: repeat(8, 55px); grid-template-rows: repeat(8, 55px); gap: 0;">';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isLight = (row + col) % 2 === 0;
                const bgColor = isLight ? '#f0d9b5' : '#b58863';
                let piece = '';
                
                if (!isLight) {
                    if (row < 3) piece = '<div style="width: 40px; height: 40px; background: radial-gradient(circle, #e74c3c, #c0392b); border-radius: 50%; border: 2px solid #000; box-shadow: 0 3px 8px rgba(0,0,0,0.4);"></div>';
                    else if (row > 4) piece = '<div style="width: 40px; height: 40px; background: radial-gradient(circle, #2c3e50, #1a252f); border-radius: 50%; border: 2px solid #000; box-shadow: 0 3px 8px rgba(0,0,0,0.4);"></div>';
                }
                
                html += `<div style="width: 55px; height: 55px; background: ${bgColor}; display: flex; align-items: center; justify-content: center;">${piece}</div>`;
            }
        }
        
        html += '</div></div>';
        if (result) {
            html += `<div style="margin-top: 20px; font-size: 1.5em; color: #FFB800; font-weight: bold;">${result}</div>`;
        }
        return html;
    },
    
    // Create playing card
    createCard(value, suit, faceDown = false) {
        const suitSymbols = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
        const suitColors = { hearts: '#e74c3c', diamonds: '#e74c3c', clubs: '#2c3e50', spades: '#2c3e50' };
        
        if (faceDown) {
            return `
                <div style="width: 80px; height: 120px; background: linear-gradient(135deg, #8B0000, #b30000); border: 3px solid #FFB800; border-radius: 8px; display: inline-block; margin: 0 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); position: relative; overflow: hidden;">
                    <div style="position: absolute; width: 100%; height: 100%; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,184,0,0.1) 10px, rgba(255,184,0,0.1) 20px);"></div>
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2em; color: #FFB800;">🎴</div>
                </div>
            `;
        }
        
        return `
            <div style="width: 80px; height: 120px; background: white; border: 3px solid #333; border-radius: 8px; display: inline-block; margin: 0 5px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); position: relative; padding: 8px;">
                <div style="position: absolute; top: 5px; left: 8px; font-size: 1.2em; font-weight: bold; color: ${suitColors[suit]}; line-height: 1;">
                    ${value}<br><span style="font-size: 1.5em;">${suitSymbols[suit]}</span>
                </div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 2.5em; color: ${suitColors[suit]};">
                    ${suitSymbols[suit]}
                </div>
                <div style="position: absolute; bottom: 5px; right: 8px; font-size: 1.2em; font-weight: bold; color: ${suitColors[suit]}; transform: rotate(180deg); line-height: 1;">
                    ${value}<br><span style="font-size: 1.5em;">${suitSymbols[suit]}</span>
                </div>
            </div>
        `;
    },
    
    // Create slot machine with actual reels
    createSlotMachine(symbols = ['🍒', '🍋', '💎']) {
        return `
            <div style="background: linear-gradient(135deg, #8B0000, #b30000); padding: 40px; border-radius: 20px; border: 8px solid #FFB800; box-shadow: 0 15px 50px rgba(0,0,0,0.6); max-width: 600px; margin: 30px auto; position: relative;">
                <!-- Machine Top -->
                <div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #FFB800, #ffa500); padding: 10px 30px; border-radius: 20px 20px 0 0; border: 4px solid #FFB800; font-size: 1.5em; font-weight: bold; color: #8B0000; box-shadow: 0 -5px 15px rgba(0,0,0,0.3);">
                    🎰 ROYAL SLOTS 🎰
                </div>
                
                <!-- Display Screen -->
                <div style="background: #000; padding: 20px; border-radius: 15px; border: 4px solid #333; margin-bottom: 20px; box-shadow: inset 0 0 20px rgba(0,0,0,0.8);">
                    <div style="display: flex; justify-content: center; gap: 15px;">
                        ${symbols.map(symbol => `
                            <div class="reel" style="background: linear-gradient(135deg, #1a1a1a, #2c2c2c); width: 120px; height: 140px; border: 4px solid #FFB800; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 4em; box-shadow: inset 0 0 15px rgba(0,0,0,0.6), 0 0 20px rgba(255,184,0,0.4);">
                                ${symbol}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Light Strip -->
                <div style="display: flex; justify-content: space-around; margin-top: 15px;">
                    ${[...Array(8)].map((_, i) => `
                        <div style="width: 12px; height: 12px; background: ${i % 2 === 0 ? '#FFB800' : '#e74c3c'}; border-radius: 50%; box-shadow: 0 0 10px currentColor; animation: blink ${1 + (i * 0.1)}s infinite;"></div>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    // Animated coin flip
    createCoinFlip(result = null, isFlipping = false) {
        const coinStyle = isFlipping ? 'animation: coinFlip 1s ease-in-out;' : '';
        const displaySide = result || 'heads';
        
        return `
            <div style="perspective: 1000px; margin: 30px auto;">
                <div style="width: 200px; height: 200px; margin: 0 auto; position: relative; transform-style: preserve-3d; ${coinStyle}">
                    <div style="width: 200px; height: 200px; background: radial-gradient(circle, #FFB800, #b38600); border: 8px solid #8B4513; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 5px 20px rgba(255,255,255,0.3); font-size: 3em; font-weight: bold; color: #1a1a1a; backface-visibility: hidden;">
                        ${displaySide === 'heads' ? '👑' : '🦅'}
                    </div>
                </div>
                ${result ? `<div style="margin-top: 20px; font-size: 2em; color: #FFB800; font-weight: bold; text-transform: uppercase;">${result}!</div>` : ''}
            </div>
        `;
    },
    
    // 3D Dice
    create3DDice(number = 1) {
        const dots = {
            1: ['center'],
            2: ['top-left', 'bottom-right'],
            3: ['top-left', 'center', 'bottom-right'],
            4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
            6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
        };
        
        const dotPositions = {
            'center': 'top: 50%; left: 50%; transform: translate(-50%, -50%);',
            'top-left': 'top: 15%; left: 15%;',
            'top-right': 'top: 15%; right: 15%;',
            'middle-left': 'top: 50%; left: 15%; transform: translateY(-50%);',
            'middle-right': 'top: 50%; right: 15%; transform: translateY(-50%);',
            'bottom-left': 'bottom: 15%; left: 15%;',
            'bottom-right': 'bottom: 15%; right: 15%;'
        };
        
        return `
            <div style="width: 150px; height: 150px; margin: 20px auto; background: white; border: 4px solid #2c3e50; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.4); position: relative;">
                ${(dots[number] || dots[1]).map(pos => `
                    <div style="position: absolute; ${dotPositions[pos]} width: 25px; height: 25px; background: #2c3e50; border-radius: 50%;"></div>
                `).join('')}
            </div>
        `;
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ballBounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    @keyframes coinFlip {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(1080deg); }
    }
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
    
    @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

window.VisualEnhancer = VisualEnhancer;
