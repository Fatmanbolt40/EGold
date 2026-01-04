// Tournament Lobby System - ClubWPT Style
const TournamentLobby = {
    tournaments: [],
    
    init() {
        this.generateTournaments();
    },
    
    generateTournaments() {
        const now = new Date();
        
        this.tournaments = [
            {
                name: 'Daily $250 Guaranteed [Turbo]',
                type: 'Regular',
                format: 'Hold\'em',
                buyIn: 10,
                prize: 250,
                startTime: new Date(now.getTime() + 13 * 60000), // 13 min
                players: 42,
                maxPlayers: 2000,
                status: 'Registering',
                speed: 'Turbo'
            },
            {
                name: 'Sunday Scrimmage Satellite Round 1 [Hyper-Turbo], 1 Seat Guaranteed',
                type: 'Satellite',
                format: 'Hold\'em',
                buyIn: 5,
                prize: 100,
                startTime: new Date(now.getTime() + 33 * 60000),
                players: 2,
                maxPlayers: 500,
                status: 'Registering',
                speed: 'Hyper'
            },
            {
                name: 'Daily $500 Guaranteed [1R1A, 6-Max]',
                type: 'Regular',
                format: 'Hold\'em',
                buyIn: 15,
                prize: 500,
                startTime: new Date(now.getTime() + 43 * 60000),
                players: 14,
                maxPlayers: 2000,
                status: 'Registering',
                speed: 'Regular'
            },
            {
                name: 'Royal eGold Championship [2R1A]',
                type: 'Guaranteed',
                format: 'Hold\'em',
                buyIn: 25,
                prize: 1000,
                startTime: new Date(now.getTime() + 55 * 60000),
                players: 56,
                maxPlayers: 2000,
                status: 'Registering',
                speed: 'Regular'
            },
            {
                name: 'Lobby Celebration $100 Guaranteed [Turbo]',
                type: 'Regular',
                format: 'Hold\'em',
                buyIn: 5,
                prize: 100,
                startTime: new Date(now.getTime() + 27 * 60000),
                players: 40,
                maxPlayers: 2000,
                status: 'Registering',
                speed: 'Turbo'
            }
        ];
    },
    
    showLobby() {
        const panel = document.createElement('div');
        panel.id = 'tournamentLobby';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            padding: 0;
            border-radius: 15px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
            z-index: 10000;
            max-width: 95%;
            width: 1100px;
            max-height: 90vh;
            overflow: hidden;
            border: 3px solid #4A90A4;
        `;
        
        const timeUntil = (startTime) => {
            const diff = startTime - new Date();
            const minutes = Math.floor(diff / 60000);
            if (minutes < 60) return `in ${minutes} minutes`;
            const hours = Math.floor(minutes / 60);
            return `in ${hours} hour${hours > 1 ? 's' : ''}`;
        };
        
        panel.innerHTML = `
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #2C5F6F, #4A90A4); padding: 20px; border-bottom: 2px solid #5AA4B8;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="
                            width: 80px;
                            height: 80px;
                            background: radial-gradient(circle, #1a1a2e, #0f0f1a);
                            border-radius: 50%;
                            border: 3px solid #FFB800;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 2em;
                            box-shadow: 0 4px 20px rgba(255,184,0,0.4);
                        ">🃏</div>
                        <div>
                            <h2 style="color: #fff; margin: 0; font-size: 1.8em;">TOURNAMENT LOBBY</h2>
                            <p style="color: #9CB4BF; margin: 5px 0 0 0;">Select a tournament to join</p>
                        </div>
                    </div>
                    <button onclick="document.getElementById('tournamentLobby').remove()" style="
                        background: rgba(231, 76, 60, 0.8);
                        border: none;
                        color: #fff;
                        font-size: 2em;
                        width: 45px;
                        height: 45px;
                        border-radius: 50%;
                        cursor: pointer;
                        line-height: 1;
                    ">×</button>
                </div>
            </div>
            
            <!-- Filters -->
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                    <div>
                        <div style="color: #9CB4BF; font-size: 0.9em; margin-bottom: 8px;">Tournament Type</div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <label style="color: #fff; display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox" checked> Regular
                            </label>
                            <label style="color: #fff; display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox" checked> Guaranteed
                            </label>
                            <label style="color: #fff; display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox"> Satellite
                            </label>
                        </div>
                    </div>
                    <div>
                        <div style="color: #9CB4BF; font-size: 0.9em; margin-bottom: 8px;">Format</div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <label style="color: #fff; display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox" checked> Hold'em
                            </label>
                            <label style="color: #fff; display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox"> Omaha
                            </label>
                            <label style="color: #fff; display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox"> Pineapple
                            </label>
                        </div>
                    </div>
                    <div>
                        <div style="color: #9CB4BF; font-size: 0.9em; margin-bottom: 8px;">Buy-In</div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <label style="color: #fff; display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox" checked> Micro (5-10)
                            </label>
                            <label style="color: #fff; display: flex; align-items: center; gap: 5px;">
                                <input type="checkbox" checked> Low (15-25)
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tournament List -->
            <div style="overflow-y: auto; max-height: 500px; background: rgba(0,0,0,0.2);">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="position: sticky; top: 0; background: #2C5F6F; z-index: 1;">
                        <tr style="border-bottom: 2px solid #4A90A4;">
                            <th style="padding: 12px; text-align: left; color: #fff; font-size: 0.9em;">Type / Name</th>
                            <th style="padding: 12px; text-align: center; color: #fff; font-size: 0.9em;">Date / Time</th>
                            <th style="padding: 12px; text-align: center; color: #fff; font-size: 0.9em;">Buy-In</th>
                            <th style="padding: 12px; text-align: center; color: #fff; font-size: 0.9em;">Players</th>
                            <th style="padding: 12px; text-align: center; color: #fff; font-size: 0.9em;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.tournaments.map((t, i) => `
                            <tr style="
                                border-bottom: 1px solid rgba(255,255,255,0.05);
                                transition: background 0.2s ease;
                            " onmouseenter="this.style.background='rgba(74,144,164,0.2)'" onmouseleave="this.style.background='transparent'">
                                <td style="padding: 15px;">
                                    <div style="display: flex; align-items: center; gap: 10px;">
                                        <div style="
                                            background: linear-gradient(135deg, #5A67D8, #7C3AED);
                                            padding: 5px 10px;
                                            border-radius: 5px;
                                            font-size: 0.75em;
                                            font-weight: bold;
                                            color: #fff;
                                        ">${t.speed}</div>
                                        <div>
                                            <div style="color: #fff; font-weight: bold;">${t.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style="padding: 15px; text-align: center; color: #FFB800; font-weight: bold;">
                                    ${timeUntil(t.startTime)}
                                </td>
                                <td style="padding: 15px; text-align: center;">
                                    <div style="color: #2ecc71; font-weight: bold; font-size: 1.1em;">${t.buyIn} eGold</div>
                                    <div style="color: #888; font-size: 0.85em;">Prize: ${t.prize}</div>
                                </td>
                                <td style="padding: 15px; text-align: center; color: #fff; font-weight: bold;">
                                    ${t.players}/${t.maxPlayers}
                                </td>
                                <td style="padding: 15px; text-align: center;">
                                    <button onclick="TournamentLobby.joinTournament(${i})" style="
                                        background: linear-gradient(135deg, #f39c12, #e67e22);
                                        border: none;
                                        padding: 8px 20px;
                                        border-radius: 8px;
                                        color: #fff;
                                        font-weight: bold;
                                        cursor: pointer;
                                        transition: all 0.3s ease;
                                    " onmouseenter="this.style.transform='scale(1.05)'" onmouseleave="this.style.transform='scale(1)'">
                                        ${t.status}
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        if (typeof soundManager !== 'undefined') {
            soundManager.playChipSound();
        }
    },
    
    joinTournament(index) {
        const tournament = this.tournaments[index];
        
        if (balance < tournament.buyIn) {
            alert('Insufficient balance for this tournament!');
            return;
        }
        
        updateBalance(-tournament.buyIn);
        document.getElementById('tournamentLobby').remove();
        
        // Initialize poker table with tournament settings
        PokerEngine.smallBlind = 5;
        PokerEngine.bigBlind = 10;
        PokerEngine.initializeTable(1000); // Starting chips
        
        // Start the game
        texasholdemGame.initTournamentTable(tournament);
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TournamentLobby.init());
} else {
    TournamentLobby.init();
}
