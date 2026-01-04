// Main Application Controller
let balance = parseFloat(localStorage.getItem('balance')) || 1000.00;
let currentGame = null;
const eGoldToUSD = 0.10; // 1 eGold = $0.10 USD

// Game database
const gamesDatabase = [
    { name: 'Royal Triple Spin', category: 'Slots', buyIn: 1, players: 'Single', badge: 'NEW', type: 'quick', id: 'slots' },
    { name: 'Heads or Tails Royale', category: 'Coin Flip', buyIn: 5, players: 'Single', badge: 'HOT', type: 'quick', id: 'coinflip' },
    { name: 'Royal Wheel 36', category: 'Roulette', buyIn: 5, players: 'Single', badge: 'NEW', type: 'table', id: 'roulette' },
    { name: 'eGold Lotto 6/49', category: 'Lottery', buyIn: 20, players: 'Single', badge: '', type: 'lottery', id: 'lottery' },
    { name: 'Instant Win Scratchers', category: 'Scratch-off', buyIn: 10, players: 'Single', badge: 'HOT', type: 'lottery', id: 'scratchoff' },
    { name: 'HexaRoll 16', category: 'Dice', buyIn: 15, players: 'Single', badge: '', type: 'quick', id: 'diceraffle' },
    { name: 'Royal Texas Hold\'em [Tournament]', category: 'Hold\'em', buyIn: 10, players: '8-max', badge: 'NEW', type: 'poker', id: 'texasholdem' },
    { name: 'Royal Omaha Hi [Quick Sim]', category: 'Omaha', buyIn: 10, players: 'Single', badge: '', type: 'poker', id: 'omaha' },
    { name: 'Royal Crazy Pineapple [Quick Sim]', category: 'Pineapple', buyIn: 10, players: 'Single', badge: '', type: 'poker', id: 'pineapple' },
    { name: 'Royal Tonk Championship', category: 'Card Game', buyIn: 10, players: 'Single', badge: '', type: 'table', id: 'tonk' },
    { name: 'Royal Chess Blitz [Quick Sim]', category: 'Chess', buyIn: 20, players: 'Single', badge: '', type: 'table', id: 'chess' },
    { name: 'Royal Checkers Elite [Quick Sim]', category: 'Checkers', buyIn: 15, players: 'Single', badge: '', type: 'table', id: 'checkers' }
];

// Update balance display
function updateBalance(amount) {
    balance = Math.max(0, balance + amount);
    const usdValue = (balance * eGoldToUSD).toFixed(2);
    const balanceEl = document.getElementById('balance');
    balanceEl.textContent = balance.toFixed(2);
    
    // Add animation on balance change
    if (amount > 0) {
        balanceEl.classList.add('animate-pulse');
        setTimeout(() => balanceEl.classList.remove('animate-pulse'), 500);
    }
    
    if (document.getElementById('usdValue')) {
        document.getElementById('usdValue').textContent = `$${usdValue} USD`;
    }
    localStorage.setItem('balance', balance.toString());
}

// Toggle sound on/off
function toggleSound() {
    const isEnabled = soundManager.toggle();
    const btn = document.getElementById('soundBtn');
    btn.textContent = isEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
    soundManager.playButtonClick();
}

// Populate games table
function populateGamesTable() {
    const tbody = document.getElementById('gamesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = gamesDatabase.map(game => `
        <tr onclick="startGame('${game.id}')">
            <td>
                ${game.badge ? `<span class="game-badge">${game.badge}</span>` : ''}
                <span class="game-name">${game.name}</span>
            </td>
            <td style="color: #9CB4BF;">${game.category}</td>
            <td>
                <div style="color: #2ecc71; font-weight: bold;">${game.buyIn} eGold</div>
                <div style="color: #888; font-size: 0.85em;">$${(game.buyIn * eGoldToUSD).toFixed(2)}</div>
            </td>
            <td style="color: #fff; font-weight: 500;">${game.players}</td>
            <td>
                <button class="status-btn" onclick="event.stopPropagation(); startGame('${game.id}')">
                    Play Now
                </button>
            </td>
        </tr>
    `).join('');
}

// Search games
function searchGames(query) {
    const tbody = document.getElementById('gamesTableBody');
    if (!tbody) return;
    
    const filtered = gamesDatabase.filter(game => 
        game.name.toLowerCase().includes(query.toLowerCase()) ||
        game.category.toLowerCase().includes(query.toLowerCase())
    );
    
    tbody.innerHTML = filtered.map(game => `
        <tr onclick="startGame('${game.id}')">
            <td>
                ${game.badge ? `<span class="game-badge">${game.badge}</span>` : ''}
                <span class="game-name">${game.name}</span>
            </td>
            <td style="color: #9CB4BF;">${game.category}</td>
            <td>
                <div style="color: #2ecc71; font-weight: bold;">${game.buyIn} eGold</div>
                <div style="color: #888; font-size: 0.85em;">$${(game.buyIn * eGoldToUSD).toFixed(2)}</div>
            </td>
            <td style="color: #fff; font-weight: 500;">${game.players}</td>
            <td>
                <button class="status-btn" onclick="event.stopPropagation(); startGame('${game.id}')">
                    Play Now
                </button>
            </td>
        </tr>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const usdValue = (balance * eGoldToUSD).toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);
    if (document.getElementById('usdValue')) {
        document.getElementById('usdValue').textContent = `$${usdValue} USD`;
    }
    
    // Populate games table
    populateGamesTable();
    
    // Add click sound to all buttons
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.classList.contains('play-btn') || e.target.classList.contains('category-btn')) {
            soundManager.playButtonClick();
        }
    });
});

// Filter games by checkboxes (placeholder - can be enhanced)
function filterGames(category) {
    const cards = document.querySelectorAll('.game-card');
    const buttons = document.querySelectorAll('.category-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Start a game
function startGame(gameType) {
    currentGame = gameType;
    
    // Hide lobby, show game content
    const lobby = document.querySelector('.lobby-container');
    const gameContent = document.getElementById('gameContent');
    
    if (lobby) lobby.style.display = 'none';
    if (gameContent) {
        gameContent.style.display = 'block';
        gameContent.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
        gameContent.style.minHeight = '100vh';
        gameContent.style.padding = '20px';
    }
    
    // Add back button
    const backBtn = document.createElement('button');
    backBtn.textContent = '← Back to Lobby';
    backBtn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        padding: 12px 24px;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: #fff;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(231,76,60,0.3);
    `;
    backBtn.onclick = () => {
        if (lobby) lobby.style.display = 'flex';
        if (gameContent) gameContent.style.display = 'none';
        backBtn.remove();
    };
    document.body.appendChild(backBtn);
    
    // Initialize the specific game
    switch(gameType) {
        case 'slots':
            if (window.slotsGame) slotsGame.init();
            break;
        case 'coinflip':
            if (window.coinflipGame) coinflipGame.init();
            break;
        case 'roulette':
            if (window.rouletteGame) rouletteGame.init();
            break;
        case 'texasholdem':
            if (window.texasholdemGame) texasholdemGame.init();
            break;
        case 'lottery':
            if (window.lotteryGame) lotteryGame.init();
            break;
        case 'scratchoff':
            if (window.scratchoffGame) scratchoffGame.init();
            break;
        case 'diceraffle':
            if (window.diceraffleGame) diceraffleGame.init();
            break;
        case 'chess':
            if (window.chessGame) chessGame.init();
            break;
        case 'checkers':
            if (window.checkersGame) checkersGame.init();
            break;
        case 'omaha':
            if (window.omahaGame) omahaGame.init();
            break;
        case 'pineapple':
            if (window.pineappleGame) pineappleGame.init();
            break;
        case 'tonk':
            if (window.tonkGame) tonkGame.init();
            break;
        case 'holdtable':
            if (window.holdemTableGame) holdemTableGame.init();
            break;
    }
}

// Close game and return to selection
function closeGame() {
    const gameArea = document.getElementById('gameArea');
    const gamesGrid = document.getElementById('gamesGrid');
    const categories = document.querySelector('.categories');
    
    gameArea.style.display = 'none';
    gamesGrid.style.display = 'grid';
    categories.style.display = 'flex';
    
    currentGame = null;
}
