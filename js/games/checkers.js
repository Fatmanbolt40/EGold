// Playable Checkers Game with NPC
const checkersGame = {
    bet: 10,
    board: [],
    selectedPiece: null,
    currentPlayer: 'red', // 'red' or 'black'
    gameActive: false,
    mustJump: false,
    jumpingPiece: null,
    difficulty: 'medium', // 'easy', 'medium', 'hard'
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 1.8em; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">🔴 CHECKERS vs NPC 🔴</h3>
                    <div id="gameStatus" style="font-size: 1.3em; color: #FFB800; margin-bottom: 15px; font-weight: bold;">Click "Start Game" to play!</div>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 20px;">
                    <div style="padding: 12px 25px; background: rgba(231, 76, 60, 0.2); border-radius: 10px; border: 2px solid #e74c3c;">
                        <div style="color: #e74c3c; font-weight: bold;">YOU (Red)</div>
                        <div id="redCount" style="font-size: 1.5em; color: #FFB800;">12</div>
                    </div>
                    <div style="padding: 12px 25px; background: rgba(100, 100, 100, 0.2); border-radius: 10px; border: 2px solid #666;">
                        <div style="color: #999; font-weight: bold;">NPC (Black)</div>
                        <div id="blackCount" style="font-size: 1.5em; color: #FFB800;">12</div>
                    </div>
                </div>
                
                <div id="checkersBoard" style="display: inline-block; background: #2c3e50; padding: 20px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);"></div>
                
                <div style="margin: 20px 0;">
                    <label style="color: #FFB800; font-size: 1.2em; margin-right: 10px;">NPC Difficulty:</label>
                    <select id="difficultySelect" onchange="checkersGame.setDifficulty(this.value)" style="padding: 8px; font-size: 1.1em; border-radius: 5px; background: #34495e; color: #FFB800; border: 2px solid #FFB800;">
                        <option value="easy">Easy</option>
                        <option value="medium" selected>Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                
                <button onclick="checkersGame.startGame()" id="startButton" class="game-button" style="font-size: 1.4em; padding: 18px 50px;">
                    🎮 Start Game (${this.bet} eGold)
                </button>
                
                <button onclick="checkersGame.forfeit()" id="forfeitButton" class="game-button" style="font-size: 1.2em; padding: 12px 30px; background: #e74c3c; display: none;">
                    🏳️ Forfeit Game
                </button>
                
                <div id="checkersResult" class="game-result"></div>
                
                <div class="game-info-box">
                    <h3>🔴 Checkers Rules</h3>
                    <ul style="text-align: left; max-width: 500px; margin: 0 auto; color: #cccccc; line-height: 1.8;">
                        <li>🔴 You play as RED, moving UP the board</li>
                        <li>⚫ NPC plays as BLACK, moving DOWN</li>
                        <li>Click your piece, then click where to move</li>
                        <li>Pieces move diagonally on dark squares</li>
                        <li>👑 Reach the opposite end to get KINGED!</li>
                        <li>Kings can move both forwards and backwards</li>
                        <li>⚔️ Jump over enemy pieces to capture them</li>
                        <li>🎯 Must take jumps when available</li>
                        <li>🏆 Win by capturing all enemy pieces</li>
                        <li>💰 Win: +${this.bet * 2} eGold | Lose: -${this.bet} eGold</li>
                    </ul>
                </div>
            </div>
        `;
        
        this.drawBoard();
    },
    
    setDifficulty(level) {
        this.difficulty = level;
        this.updateStatus(`Difficulty set to ${level.toUpperCase()}`);
    },
    
    startGame() {
        if (balance < this.bet) {
            this.updateStatus('❌ Insufficient balance!');
            return;
        }
        
        updateBalance(-this.bet);
        
        // Track for VIP, achievements, and leaderboard
        if (typeof vipSystem !== 'undefined') vipSystem.trackWager(this.bet);
        if (typeof achievementSystem !== 'undefined') achievementSystem.trackBet(this.bet, 'Checkers');
        if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWager(this.bet, 'Checkers');
        
        this.gameActive = true;
        this.currentPlayer = 'red';
        this.selectedPiece = null;
        this.mustJump = false;
        this.jumpingPiece = null;
        this.initBoard();
        this.drawBoard();
        this.updateStatus('Your turn! (Red)');
        
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('forfeitButton').style.display = 'inline-block';
        document.getElementById('checkersResult').innerHTML = '';
    },
    
    forfeit() {
        this.gameActive = false;
        this.updateStatus('You forfeited the game!');
        document.getElementById('checkersResult').innerHTML = '<span style="font-size: 1.5em; color: #e74c3c;">💔 You Forfeited</span><br><span style="font-size: 1.2em;">Better luck next time!</span>';
        document.getElementById('startButton').style.display = 'inline-block';
        document.getElementById('forfeitButton').style.display = 'none';
    },
    
    initBoard() {
        // Initialize 8x8 board
        this.board = [];
        for (let row = 0; row < 8; row++) {
            this.board[row] = [];
            for (let col = 0; col < 8; col++) {
                // Only place pieces on dark squares (checkerboard pattern)
                if ((row + col) % 2 === 1) {
                    if (row < 3) {
                        this.board[row][col] = { type: 'black', king: false };
                    } else if (row > 4) {
                        this.board[row][col] = { type: 'red', king: false };
                    } else {
                        this.board[row][col] = null;
                    }
                } else {
                    this.board[row][col] = null;
                }
            }
        }
    },
    
    drawBoard() {
        const boardDiv = document.getElementById('checkersBoard');
        let html = '<div style="display: grid; grid-template-columns: repeat(8, 60px); grid-template-rows: repeat(8, 60px); gap: 0;">';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isDark = (row + col) % 2 === 1;
                const bgColor = isDark ? '#8B4513' : '#F4E4C1';
                const piece = this.board[row][col];
                
                let cellContent = '';
                let clickHandler = '';
                let cursor = 'default';
                let border = 'none';
                
                if (piece) {
                    const emoji = piece.king ? (piece.type === 'red' ? '👑' : '🖤') : (piece.type === 'red' ? '🔴' : '⚫');
                    cellContent = `<div style="font-size: 2.5em;">${emoji}</div>`;
                    
                    if (this.gameActive && piece.type === this.currentPlayer) {
                        cursor = 'pointer';
                        clickHandler = `onclick="checkersGame.selectPiece(${row}, ${col})"`;
                    }
                    
                    if (this.selectedPiece && this.selectedPiece.row === row && this.selectedPiece.col === col) {
                        border = '3px solid #FFB800';
                    }
                } else if (this.selectedPiece && isDark) {
                    // Check if this is a valid move
                    if (this.isValidMove(this.selectedPiece.row, this.selectedPiece.col, row, col)) {
                        cellContent = '<div style="font-size: 2em; opacity: 0.5;">✨</div>';
                        cursor = 'pointer';
                        clickHandler = `onclick="checkersGame.movePiece(${row}, ${col})"`;
                        border = '2px dashed #2ecc71';
                    }
                }
                
                html += `
                    <div ${clickHandler} style="
                        background: ${bgColor};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: ${cursor};
                        border: ${border};
                        box-sizing: border-box;
                        position: relative;
                    ">
                        ${cellContent}
                    </div>
                `;
            }
        }
        
        html += '</div>';
        boardDiv.innerHTML = html;
        
        // Update piece counts
        this.updatePieceCounts();
    },
    
    selectPiece(row, col) {
        if (!this.gameActive || this.currentPlayer !== 'red') return;
        
        const piece = this.board[row][col];
        if (!piece || piece.type !== 'red') return;
        
        // If must jump, only allow selecting the jumping piece
        if (this.mustJump && this.jumpingPiece) {
            if (this.jumpingPiece.row !== row || this.jumpingPiece.col !== col) {
                return;
            }
        }
        
        // Check if this piece has jumps available when jumps are mandatory
        const jumps = this.getAvailableJumps('red');
        if (jumps.length > 0) {
            const pieceHasJump = jumps.some(j => j.fromRow === row && j.fromCol === col);
            if (!pieceHasJump) {
                this.updateStatus('⚠️ You must take a jump!');
                return;
            }
        }
        
        this.selectedPiece = { row, col };
        this.drawBoard();
    },
    
    movePiece(toRow, toCol) {
        if (!this.selectedPiece || !this.gameActive) return;
        
        const fromRow = this.selectedPiece.row;
        const fromCol = this.selectedPiece.col;
        
        if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return;
        
        const piece = this.board[fromRow][fromCol];
        const isJump = Math.abs(toRow - fromRow) === 2;
        
        // Move the piece
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Handle jump
        if (isJump) {
            const jumpedRow = (fromRow + toRow) / 2;
            const jumpedCol = (fromCol + toCol) / 2;
            this.board[jumpedRow][jumpedCol] = null;
            
            // Check for additional jumps
            const moreJumps = this.getJumpsForPiece(toRow, toCol);
            if (moreJumps.length > 0) {
                this.mustJump = true;
                this.jumpingPiece = { row: toRow, col: toCol };
                this.selectedPiece = { row: toRow, col: toCol };
                this.checkKing(toRow, toCol);
                this.drawBoard();
                this.updateStatus('Double jump available! Continue jumping!');
                return;
            }
        }
        
        // Check for king promotion
        this.checkKing(toRow, toCol);
        
        this.selectedPiece = null;
        this.mustJump = false;
        this.jumpingPiece = null;
        
        // Check win condition
        if (this.checkWin()) return;
        
        // Switch to NPC turn
        this.currentPlayer = 'black';
        this.drawBoard();
        this.updateStatus('NPC is thinking...');
        
        setTimeout(() => this.npcMove(), 800);
    },
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece || this.board[toRow][toCol]) return false;
        
        const rowDiff = toRow - fromRow;
        const colDiff = Math.abs(toCol - fromCol);
        
        // Check if must jump
        const availableJumps = this.getAvailableJumps(piece.type);
        if (availableJumps.length > 0) {
            // Must be a jump move
            if (Math.abs(rowDiff) !== 2) return false;
            return availableJumps.some(j => 
                j.fromRow === fromRow && j.fromCol === fromCol &&
                j.toRow === toRow && j.toCol === toCol
            );
        }
        
        // Normal move (diagonal by 1)
        if (colDiff !== 1) return false;
        
        if (piece.king) {
            return Math.abs(rowDiff) === 1;
        } else {
            // Red moves up (decreasing row), black moves down (increasing row)
            if (piece.type === 'red') {
                return rowDiff === -1;
            } else {
                return rowDiff === 1;
            }
        }
    },
    
    getAvailableJumps(playerType) {
        const jumps = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === playerType) {
                    jumps.push(...this.getJumpsForPiece(row, col));
                }
            }
        }
        return jumps;
    },
    
    getJumpsForPiece(row, col) {
        const piece = this.board[row][col];
        if (!piece) return [];
        
        const jumps = [];
        const directions = piece.king ? 
            [[-1, -1], [-1, 1], [1, -1], [1, 1]] :
            piece.type === 'red' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
        
        for (const [dRow, dCol] of directions) {
            const jumpRow = row + dRow * 2;
            const jumpCol = col + dCol * 2;
            const midRow = row + dRow;
            const midCol = col + dCol;
            
            if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8) {
                const middle = this.board[midRow][midCol];
                const landing = this.board[jumpRow][jumpCol];
                
                if (middle && middle.type !== piece.type && !landing) {
                    jumps.push({ fromRow: row, fromCol: col, toRow: jumpRow, toCol: jumpCol });
                }
            }
        }
        
        return jumps;
    },
    
    checkKing(row, col) {
        const piece = this.board[row][col];
        if (!piece || piece.king) return;
        
        if ((piece.type === 'red' && row === 0) || (piece.type === 'black' && row === 7)) {
            piece.king = true;
        }
    },
    
    npcMove() {
        if (!this.gameActive) return;
        
        const moves = this.getAllValidMoves('black');
        if (moves.length === 0) {
            this.endGame(true, 'NPC has no moves! You win!');
            return;
        }
        
        let selectedMove;
        
        // Choose move based on difficulty
        if (this.difficulty === 'easy') {
            selectedMove = moves[Math.floor(Math.random() * moves.length)];
        } else if (this.difficulty === 'medium') {
            // Prefer jumps
            const jumps = moves.filter(m => m.isJump);
            if (jumps.length > 0) {
                selectedMove = jumps[Math.floor(Math.random() * jumps.length)];
            } else {
                selectedMove = moves[Math.floor(Math.random() * moves.length)];
            }
        } else {
            // Hard: prioritize jumps, kings, and forward progress
            const jumps = moves.filter(m => m.isJump);
            if (jumps.length > 0) {
                selectedMove = jumps[0];
            } else {
                const kingMoves = moves.filter(m => this.board[m.fromRow][m.fromCol].king);
                selectedMove = kingMoves.length > 0 ? kingMoves[0] : moves[0];
            }
        }
        
        // Execute move
        const piece = this.board[selectedMove.fromRow][selectedMove.fromCol];
        this.board[selectedMove.toRow][selectedMove.toCol] = piece;
        this.board[selectedMove.fromRow][selectedMove.fromCol] = null;
        
        if (selectedMove.isJump) {
            const jumpedRow = (selectedMove.fromRow + selectedMove.toRow) / 2;
            const jumpedCol = (selectedMove.fromCol + selectedMove.toCol) / 2;
            this.board[jumpedRow][jumpedCol] = null;
            
            // Check for multi-jump
            const moreJumps = this.getJumpsForPiece(selectedMove.toRow, selectedMove.toCol);
            if (moreJumps.length > 0) {
                this.checkKing(selectedMove.toRow, selectedMove.toCol);
                this.drawBoard();
                setTimeout(() => this.npcMove(), 800);
                return;
            }
        }
        
        this.checkKing(selectedMove.toRow, selectedMove.toCol);
        
        if (this.checkWin()) return;
        
        this.currentPlayer = 'red';
        this.drawBoard();
        this.updateStatus('Your turn! (Red)');
    },
    
    getAllValidMoves(playerType) {
        const moves = [];
        
        // Check for jumps first
        const jumps = this.getAvailableJumps(playerType);
        if (jumps.length > 0) {
            return jumps.map(j => ({ ...j, isJump: true }));
        }
        
        // Get regular moves
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === playerType) {
                    const directions = piece.king ?
                        [[-1, -1], [-1, 1], [1, -1], [1, 1]] :
                        playerType === 'red' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
                    
                    for (const [dRow, dCol] of directions) {
                        const toRow = row + dRow;
                        const toCol = col + dCol;
                        
                        if (toRow >= 0 && toRow < 8 && toCol >= 0 && toCol < 8 && !this.board[toRow][toCol]) {
                            moves.push({ fromRow: row, fromCol: col, toRow, toCol, isJump: false });
                        }
                    }
                }
            }
        }
        
        return moves;
    },
    
    checkWin() {
        let redCount = 0;
        let blackCount = 0;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    if (piece.type === 'red') redCount++;
                    else blackCount++;
                }
            }
        }
        
        if (blackCount === 0) {
            this.endGame(true, 'You captured all enemy pieces!');
            return true;
        }
        
        if (redCount === 0) {
            this.endGame(false, 'NPC captured all your pieces!');
            return true;
        }
        
        // Check for no valid moves
        if (this.currentPlayer === 'red' && this.getAllValidMoves('red').length === 0) {
            this.endGame(false, 'No valid moves! You lose!');
            return true;
        }
        
        return false;
    },
    
    endGame(playerWon, message) {
        this.gameActive = false;
        
        const resultDiv = document.getElementById('checkersResult');
        
        if (playerWon) {
            const payout = this.bet * 2;
            updateBalance(payout);
            
            resultDiv.className = 'game-result win';
            resultDiv.innerHTML = `
                <span style="font-size: 2em;">🎉 VICTORY! 🎉</span><br>
                <span style="font-size: 1.3em;">${message}</span><br>
                <span style="font-size: 1.5em; color: #FFB800;">+${payout} eGold</span>
            `;
            
            // Track win
            if (typeof achievementSystem !== 'undefined') achievementSystem.trackWin(payout, 'Checkers');
        } else {
            resultDiv.className = 'game-result lose';
            resultDiv.innerHTML = `
                <span style="font-size: 1.8em;">💔 DEFEAT</span><br>
                <span style="font-size: 1.3em;">${message}</span>
            `;
        }
        
        this.updateStatus('Game Over!');
        document.getElementById('startButton').style.display = 'inline-block';
        document.getElementById('forfeitButton').style.display = 'none';
    },
    
    updateStatus(message) {
        document.getElementById('gameStatus').textContent = message;
    },
    
    updatePieceCounts() {
        let redCount = 0;
        let blackCount = 0;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    if (piece.type === 'red') redCount++;
                    else blackCount++;
                }
            }
        }
        
        document.getElementById('redCount').textContent = redCount;
        document.getElementById('blackCount').textContent = blackCount;
    }
};

window.checkersGame = checkersGame;
