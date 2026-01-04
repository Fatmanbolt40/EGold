// Main Application Controller
let balance = parseFloat(localStorage.getItem('balance')) || 1000.00;
let currentGame = null;
const eGoldToUSD = 0.10; // 1 eGold = $0.10 USD

// Update balance display
function updateBalance(amount) {
    balance = Math.max(0, balance + amount);
    const usdValue = (balance * eGoldToUSD).toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);
    if (document.getElementById('usdValue')) {
        document.getElementById('usdValue').textContent = `$${usdValue} USD`;
    }
    localStorage.setItem('balance', balance.toString());
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const usdValue = (balance * eGoldToUSD).toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);
    if (document.getElementById('usdValue')) {
        document.getElementById('usdValue').textContent = `$${usdValue} USD`;
    }
});

// Filter games by category
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
    const gameArea = document.getElementById('gameArea');
    const gamesGrid = document.getElementById('gamesGrid');
    const categories = document.querySelector('.categories');
    const gameTitle = document.getElementById('gameTitle');
    const gameContent = document.getElementById('gameContent');
    
    // Hide game selection
    gamesGrid.style.display = 'none';
    categories.style.display = 'none';
    gameArea.style.display = 'block';
    
    // Set game title
    const titles = {
        'slots': '🎰 Slots',
        'coinflip': '🪙 Coin Flip',
        'roulette': '🎡 Roulette',
        'texasholdem': '🃏 Texas Hold\'em',
        'lottery': '🎟️ Lottery',
        'scratchoff': '💳 Scratch Off',
        'diceraffle': '🎲 Dice Raffle',
        'chess': '♟️ Chess',
        'checkers': '🔴 Checkers',
        'omaha': '🎴 Omaha Poker',
        'pineapple': '🍍 Pineapple Poker',
        'tonk': '🎯 Tonk',
        'holdtable': '🎰 Hold\'em Table'
    };
    
    gameTitle.textContent = titles[gameType] || gameType;
    
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
