// Game Test Suite
const testAllGames = () => {
    const games = [
        'texasholdem',
        'omaha', 
        'pineapple',
        'tonk',
        'chess',
        'checkers',
        'roulette',
        'slots',
        'coinflip',
        'scratchoff',
        'standardlottery',
        'diceraffle'
    ];

    console.log('🎮 Testing all games...\n');
    
    games.forEach(game => {
        try {
            const initFunctions = {
                'texasholdem': typeof initTexasHoldem !== 'undefined',
                'omaha': typeof initOmaha !== 'undefined',
                'pineapple': typeof initPineapple !== 'undefined',
                'tonk': typeof initTonk !== 'undefined',
                'chess': typeof initChess !== 'undefined',
                'checkers': typeof initCheckers !== 'undefined',
                'roulette': typeof initRoulette !== 'undefined',
                'slots': typeof initSlots !== 'undefined',
                'coinflip': typeof initCoinFlip !== 'undefined',
                'scratchoff': typeof initScratchOff !== 'undefined',
                'standardlottery': typeof initStandardLottery !== 'undefined',
                'diceraffle': typeof initDiceRaffle !== 'undefined'
            };
            
            if (initFunctions[game]) {
                console.log(`✅ ${game} - READY`);
            } else {
                console.error(`❌ ${game} - MISSING INIT FUNCTION`);
            }
        } catch (error) {
            console.error(`❌ ${game} - ERROR:`, error.message);
        }
    });
    
    console.log('\n🎰 Testing effects systems...');
    console.log(`Effects Manager: ${typeof effects !== 'undefined' ? '✅' : '❌'}`);
    console.log(`Advanced Effects: ${typeof advancedEffects !== 'undefined' ? '✅' : '❌'}`);
    console.log(`Game Enhancements: ${typeof gameEnhancements !== 'undefined' ? '✅' : '❌'}`);
    console.log(`Sound Effects: ${typeof soundEffects !== 'undefined' ? '✅' : '❌'}`);
    
    console.log('\n💎 Testing systems...');
    console.log(`VIP System: ${typeof vipSystem !== 'undefined' ? '✅' : '❌'}`);
    console.log(`Daily Rewards: ${typeof dailyRewards !== 'undefined' ? '✅' : '❌'}`);
    console.log(`Live Games Manager: ${typeof liveGamesManager !== 'undefined' ? '✅' : '❌'}`);
    console.log(`Side Bet System: ${typeof sideBetSystem !== 'undefined' ? '✅' : '❌'}`);
    console.log(`PVP Matchmaking: ${typeof pvpMatchmaking !== 'undefined' ? '✅' : '❌'}`);
    
    console.log('\n🎉 Test Complete!');
};

// Auto-run test after page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(testAllGames, 1000);
    });
} else {
    setTimeout(testAllGames, 1000);
}
