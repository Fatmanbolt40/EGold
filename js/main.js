// Main Application Controller
let balance = parseFloat(localStorage.getItem('balance')) || 1000.00;
let currentGame = null;
const eGoldToUSD = 0.10; // 1 eGold = $0.10 USD

// Game database
const gamesDatabase = [
    // Casino Games (playable now)
    { name: '🎰 Royal Triple Spin', category: 'Slots', buyIn: 1, players: '1 Player', badge: 'HOT', type: 'casino', id: 'slots', icon: '🎰' },
    { name: '🪙 Heads or Tails Royale', category: 'Coin Flip', buyIn: 5, players: '1 Player', badge: 'NEW', type: 'casino', id: 'coinflip', icon: '🪙' },
    { name: '🎡 Royal Wheel 36', category: 'Roulette', buyIn: 5, players: '1 Player', badge: 'HOT', type: 'casino', id: 'roulette', icon: '🎡' },
    { name: '🎫 Instant Win Scratchers', category: 'Scratch Cards', buyIn: 10, players: '1 Player', badge: 'NEW', type: 'casino', id: 'scratchoff', icon: '🎫' },
    { name: '🎲 HexaRoll 16', category: 'Dice Roll', buyIn: 15, players: '1 Player', badge: '', type: 'casino', id: 'diceraffle', icon: '🎲' },
    { name: '🎟️ eGold Lotto 6/49', category: 'Lottery', buyIn: 20, players: '1 Player', badge: '', type: 'casino', id: 'lottery', icon: '🎟️' },
    { name: '🃏 Royal Tonk', category: 'Card Game', buyIn: 10, players: '1 Player', badge: '', type: 'casino', id: 'tonk', icon: '🃏' },
    
    // Tournament/Multiplayer Games
    { name: 'Texas Hold\'em Tournament', category: 'Poker', buyIn: 25, players: '2-8', badge: 'LIVE', type: 'tournament', id: 'texasholdem', icon: '♠️' },
    { name: 'Omaha Hi Tournament', category: 'Poker', buyIn: 20, players: '2-8', badge: '', type: 'tournament', id: 'omaha', icon: '♥️' },
    { name: 'Crazy Pineapple Tournament', category: 'Poker', buyIn: 15, players: '2-8', badge: '', type: 'tournament', id: 'pineapple', icon: '♦️' },
    { name: 'Chess Championship', category: 'Board Game', buyIn: 20, players: '1v1', badge: '', type: 'tournament', id: 'chess', icon: '♟️' },
    { name: 'Checkers Elite', category: 'Board Game', buyIn: 15, players: '1v1', badge: '', type: 'tournament', id: 'checkers', icon: '⚫' }
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
    if (typeof soundManager !== 'undefined') {
        const isEnabled = soundManager.toggle();
        const btn = document.getElementById('soundBtn');
        if (btn) btn.textContent = isEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
        soundManager.playButtonClick();
    }
}

// Populate games table
function populateGamesTable() {
    console.log('populateGamesTable called');
    const tbody = document.getElementById('gamesTableBody');
    console.log('tbody element:', tbody);
    if (!tbody) {
        console.error('gamesTableBody element not found!');
        return;
    }
    
    // Filter to show only casino games in the main lobby
    const casinoGames = gamesDatabase.filter(game => game.type === 'casino');
    console.log('Casino games filtered:', casinoGames.length, casinoGames);
    
    tbody.innerHTML = casinoGames.map(game => `
        <tr onclick="startGame('${game.id}')" style="cursor: pointer;">
            <td class="game-type">
                ${game.badge ? `<span class="game-badge">${game.badge}</span>` : ''}
                <div class="game-name">${game.name}</div>
            </td>
            <td class="category-cell">
                <i class="fas fa-dice category-icon"></i>
                <span>${game.category}</span>
            </td>
            <td class="buyin-cell">
                <div style="font-weight: 600; color: #2ecc71;">${game.buyIn} eGold</div>
                <div style="color: #888; font-size: 0.85em;">$${(game.buyIn * eGoldToUSD).toFixed(2)} USD</div>
            </td>
            <td class="players-cell">
                <div class="player-count">${game.players}</div>
                <i class="fas fa-user"></i>
            </td>
            <td class="status-cell">
                <span class="status-indicator"></span>
                <button class="join-btn" onclick="event.stopPropagation(); startGame('${game.id}')">
                    <i class="fas fa-play"></i> Play Now
                </button>
            </td>
        </tr>
    `).join('');
}

// Search games
function searchGames(query) {
    const tbody = document.getElementById('gamesTableBody');
    if (!tbody) return;
    
    // Filter casino games by search query
    const casinoGames = gamesDatabase.filter(game => game.type === 'casino');
    const filtered = casinoGames.filter(game => 
        game.name.toLowerCase().includes(query.toLowerCase()) ||
        game.category.toLowerCase().includes(query.toLowerCase())
    );
    
    tbody.innerHTML = filtered.map(game => `
        <tr onclick="startGame('${game.id}')" style="cursor: pointer;">
            <td class="game-type">
                ${game.badge ? `<span class="game-badge">${game.badge}</span>` : ''}
                <div class="game-name">${game.name}</div>
            </td>
            <td class="category-cell">
                <i class="fas fa-dice category-icon"></i>
                <span>${game.category}</span>
            </td>
            <td class="buyin-cell">
                <div style="font-weight: 600; color: #2ecc71;">${game.buyIn} eGold</div>
                <div style="color: #888; font-size: 0.85em;">$${(game.buyIn * eGoldToUSD).toFixed(2)} USD</div>
            </td>
            <td class="players-cell">
                <div class="player-count">${game.players}</div>
                <i class="fas fa-user"></i>
            </td>
            <td class="status-cell">
                <span class="status-indicator"></span>
                <button class="join-btn" onclick="event.stopPropagation(); startGame('${game.id}')">
                    <i class="fas fa-play"></i> Play Now
                </button>
            </td>
        </tr>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    console.log('Games Database:', gamesDatabase);
    
    const usdValue = (balance * eGoldToUSD).toFixed(2);
    const balanceEl = document.getElementById('balance');
    if (balanceEl) {
        balanceEl.textContent = balance.toFixed(2);
    }
    if (document.getElementById('usdValue')) {
        document.getElementById('usdValue').textContent = `$${usdValue} USD`;
    }
    
    // Populate games table
    console.log('Calling populateGamesTable');
    populateGamesTable();
    
    // Add click sound to all buttons
    document.addEventListener('click', function(e) {
        if ((e.target.tagName === 'BUTTON' || e.target.classList.contains('play-btn') || e.target.classList.contains('category-btn')) && typeof soundManager !== 'undefined') {
            soundManager.playButtonClick();
        }
    });
});

// Track current game tab
let currentGameTab = 'casino';

// Switch between casino and tournament games
function switchGameTab(tab) {
    currentGameTab = tab;
    
    // Update button styles
    const casinoBtn = document.getElementById('casinoTab');
    const tournamentBtn = document.getElementById('tournamentTab');
    const filterPanel = document.getElementById('filterPanel');
    
    if (tab === 'casino') {
        casinoBtn.style.background = 'linear-gradient(135deg, #FFB800, #FF8C00)';
        casinoBtn.style.color = '#0a1929';
        casinoBtn.style.border = 'none';
        casinoBtn.style.boxShadow = '0 4px 15px rgba(255, 184, 0, 0.4)';
        
        tournamentBtn.style.background = 'rgba(74, 144, 164, 0.3)';
        tournamentBtn.style.color = '#9cb4bf';
        tournamentBtn.style.border = '1px solid rgba(74, 144, 164, 0.5)';
        tournamentBtn.style.boxShadow = 'none';
        
        // Show filters for casino games
        if (filterPanel) filterPanel.style.display = 'block';
        
        populateGamesTable();
    } else {
        tournamentBtn.style.background = 'linear-gradient(135deg, #FFB800, #FF8C00)';
        tournamentBtn.style.color = '#0a1929';
        tournamentBtn.style.border = 'none';
        tournamentBtn.style.boxShadow = '0 4px 15px rgba(255, 184, 0, 0.4)';
        
        casinoBtn.style.background = 'rgba(74, 144, 164, 0.3)';
        casinoBtn.style.color = '#9cb4bf';
        casinoBtn.style.border = '1px solid rgba(74, 144, 164, 0.5)';
        casinoBtn.style.boxShadow = 'none';
        
        // Hide filters for tournament games
        if (filterPanel) filterPanel.style.display = 'none';
        
        showTournamentGames();
    }
}

// Show tournament games
function showTournamentGames() {
    const tbody = document.getElementById('gamesTableBody');
    if (!tbody) return;
    
    const tournamentGames = gamesDatabase.filter(game => game.type === 'tournament');
    
    tbody.innerHTML = tournamentGames.map(game => `
        <tr onclick="startGame('${game.id}')" style="cursor: pointer;">
            <td class="game-type">
                ${game.badge ? `<span class="game-badge">${game.badge}</span>` : ''}
                <div class="game-name">${game.name}</div>
            </td>
            <td class="category-cell">
                <i class="fas fa-trophy category-icon"></i>
                <span>${game.category}</span>
            </td>
            <td class="buyin-cell">
                <div style="font-weight: 600; color: #2ecc71;">${game.buyIn} eGold</div>
                <div style="color: #888; font-size: 0.85em;">$${(game.buyIn * eGoldToUSD).toFixed(2)} USD</div>
            </td>
            <td class="players-cell">
                <div class="player-count">${game.players}</div>
                <i class="fas fa-users"></i>
            </td>
            <td class="status-cell">
                <span class="status-indicator"></span>
                <button class="join-btn" onclick="event.stopPropagation(); startGame('${game.id}')">
                    <i class="fas fa-play"></i> Play Now
                </button>
            </td>
        </tr>
    `).join('');
    
    if (tournamentGames.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #888;">No tournament games available.</td></tr>';
    }
}

// Filter games based on checkboxes
function filterGames() {
    const tbody = document.getElementById('gamesTableBody');
    if (!tbody) return;
    
    // Get all checkboxes
    const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const checkedFilters = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.parentElement.textContent.trim());
    
    // Filter casino games
    const casinoGames = gamesDatabase.filter(game => game.type === 'casino');
    
    // If no filters are checked, show all casino games
    if (checkedFilters.length === 0) {
        const gamesToShow = casinoGames;
        
        tbody.innerHTML = gamesToShow.map(game => `
            <tr onclick="startGame('${game.id}')" style="cursor: pointer;">
                <td class="game-type">
                    ${game.badge ? `<span class="game-badge">${game.badge}</span>` : ''}
                    <div class="game-name">${game.name}</div>
                </td>
                <td class="category-cell">
                    <i class="fas fa-dice category-icon"></i>
                    <span>${game.category}</span>
                </td>
                <td class="buyin-cell">
                    <div style="font-weight: 600; color: #2ecc71;">${game.buyIn} eGold</div>
                    <div style="color: #888; font-size: 0.85em;">$${(game.buyIn * eGoldToUSD).toFixed(2)} USD</div>
                </td>
                <td class="players-cell">
                    <div class="player-count">${game.players}</div>
                    <i class="fas fa-user"></i>
                </td>
                <td class="status-cell">
                    <span class="status-indicator"></span>
                    <button class="join-btn" onclick="event.stopPropagation(); startGame('${game.id}')">
                        <i class="fas fa-play"></i> Play Now
                    </button>
                </td>
            </tr>
        `).join('');
        return;
    }
    
    // Apply filters
    const filtered = casinoGames.filter(game => {
        // Game Type filters
        const gameTypeMatch = 
            checkedFilters.includes('Slots & Spins') && (game.category === 'Slots' || game.category === 'Coin Flip' || game.category === 'Roulette') ||
            checkedFilters.includes('Card Games') && game.category === 'Card Game' ||
            checkedFilters.includes('Lottery & Scratch') && (game.category === 'Scratch Cards' || game.category === 'Lottery' || game.category === 'Dice Roll');
        
        // Play Speed filters
        const speedMatch =
            checkedFilters.includes('Instant Win') && (game.buyIn <= 5) ||
            checkedFilters.includes('Quick Play') && (game.buyIn > 5 && game.buyIn <= 15) ||
            checkedFilters.includes('Extended') && (game.buyIn > 15);
        
        // Popularity filters
        const popularityMatch =
            checkedFilters.includes('Hot Games') && game.badge === 'HOT' ||
            checkedFilters.includes('New Releases') && game.badge === 'NEW' ||
            checkedFilters.includes('Classic Favorites') && !game.badge;
        
        // Bet Range filters
        const betRangeMatch =
            checkedFilters.includes('Low Stakes (1-5)') && (game.buyIn >= 1 && game.buyIn <= 5) ||
            checkedFilters.includes('Medium (10-15)') && (game.buyIn >= 10 && game.buyIn <= 15) ||
            checkedFilters.includes('High Roller (20+)') && (game.buyIn >= 20);
        
        // Show game if it matches any filter in each category
        return gameTypeMatch || speedMatch || popularityMatch || betRangeMatch;
    });
    
    const gamesToShow = filtered;
    
    // Update table
    tbody.innerHTML = gamesToShow.map(game => `
        <tr onclick="startGame('${game.id}')" style="cursor: pointer;">
            <td class="game-type">
                ${game.badge ? `<span class="game-badge">${game.badge}</span>` : ''}
                <div class="game-name">${game.name}</div>
            </td>
            <td class="category-cell">
                <i class="fas fa-dice category-icon"></i>
                <span>${game.category}</span>
            </td>
            <td class="buyin-cell">
                <div style="font-weight: 600; color: #2ecc71;">${game.buyIn} eGold</div>
                <div style="color: #888; font-size: 0.85em;">$${(game.buyIn * eGoldToUSD).toFixed(2)} USD</div>
            </td>
            <td class="players-cell">
                <div class="player-count">${game.players}</div>
                <i class="fas fa-user"></i>
            </td>
            <td class="status-cell">
                <span class="status-indicator"></span>
                <button class="join-btn" onclick="event.stopPropagation(); startGame('${game.id}')">
                    <i class="fas fa-play"></i> Play Now
                </button>
            </td>
        </tr>
    `).join('');
    
    // Show message if no games match
    if (gamesToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #888;">No games match the selected filters. Try adjusting your filters.</td></tr>';
    }
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
