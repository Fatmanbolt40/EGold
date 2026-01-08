// Playable Chess Game with NPC
const chessGame = {
    bet: 15,
    board: [],
    selectedPiece: null,
    currentPlayer: 'white', // 'white' or 'black'
    gameActive: false,
    difficulty: 'medium', // 'easy', 'medium', 'hard'
    moveHistory: [],
    whiteKingMoved: false,
    blackKingMoved: false,
    whiteRookLeftMoved: false,
    whiteRookRightMoved: false,
    blackRookLeftMoved: false,
    blackRookRightMoved: false,
    lastMove: null,
    
    pieces: {
        white: {
            king: '♔',
            queen: '♕',
            rook: '♖',
            bishop: '♗',
            knight: '♘',
            pawn: '♙'
        },
        black: {
            king: '♚',
            queen: '♛',
            rook: '♜',
            bishop: '♝',
            knight: '♞',
            pawn: '♟'
        }
    },
    
    init() {
        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div style="text-align: center;">
                <div class="game-display">
                    <h3 style="color: #FFB800; font-size: 1.8em; margin-bottom: 20px; text-shadow: 0 0 10px rgba(255, 184, 0, 0.5);">♟️ CHESS vs NPC ♟️</h3>
                    <div id="gameStatus" style="font-size: 1.3em; color: #FFB800; margin-bottom: 15px; font-weight: bold;">Click "Start Game" to play!</div>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 20px;">
                    <div style="padding: 12px 25px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; border: 2px solid #ddd;">
                        <div style="color: #ddd; font-weight: bold;">YOU (White)</div>
                        <div id="capturedByWhite" style="font-size: 1.2em; min-height: 30px;"></div>
                    </div>
                    <div style="padding: 12px 25px; background: rgba(0, 0, 0, 0.3); border-radius: 10px; border: 2px solid #666;">
                        <div style="color: #999; font-weight: bold;">NPC (Black)</div>
                        <div id="capturedByBlack" style="font-size: 1.2em; min-height: 30px;"></div>
                    </div>
                </div>
                
                <div id="chessBoard" style="display: inline-block; background: #2c3e50; padding: 20px; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);"></div>
                
                <div style="margin: 20px 0;">
                    <label style="color: #FFB800; font-size: 1.2em; margin-right: 10px;">NPC Difficulty:</label>
                    <select id="difficultySelect" onchange="chessGame.setDifficulty(this.value)" style="padding: 8px; font-size: 1.1em; border-radius: 5px; background: #34495e; color: #FFB800; border: 2px solid #FFB800;">
                        <option value="easy">Easy</option>
                        <option value="medium" selected>Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                
                <button onclick="chessGame.startGame()" id="startButton" class="game-button" style="font-size: 1.4em; padding: 18px 50px;">
                    🎮 Start Game (${this.bet} eGold)
                </button>
                
                <button onclick="chessGame.forfeit()" id="forfeitButton" class="game-button" style="font-size: 1.2em; padding: 12px 30px; background: #e74c3c; display: none;">
                    🏳️ Forfeit Game
                </button>
                
                <div id="chessResult" class="game-result"></div>
                
                <div class="game-info-box">
                    <h3>♟️ Chess Rules</h3>
                    <ul style="text-align: left; max-width: 500px; margin: 0 auto; color: #cccccc; line-height: 1.8;">
                        <li>♔ You play as WHITE (bottom), moving first</li>
                        <li>♚ NPC plays as BLACK (top)</li>
                        <li>Click your piece, then click where to move</li>
                        <li>♔ King: 1 square in any direction</li>
                        <li>♕ Queen: Any direction, any distance</li>
                        <li>♖ Rook: Horizontal/vertical, any distance</li>
                        <li>♗ Bishop: Diagonal, any distance</li>
                        <li>♘ Knight: L-shape (2+1 squares)</li>
                        <li>♙ Pawn: Forward 1 (or 2 from start), captures diagonally</li>
                        <li>🎯 Capture enemy pieces, protect your king</li>
                        <li>👑 Checkmate the enemy king to win!</li>
                        <li>💰 Win: +${this.bet * 3} eGold | Lose: -${this.bet} eGold</li>
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
        if (typeof achievementSystem !== 'undefined') achievementSystem.trackBet(this.bet, 'Chess');
        if (typeof leaderboardSystem !== 'undefined') leaderboardSystem.trackWager(this.bet, 'Chess');
        
        this.gameActive = true;
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.moveHistory = [];
        this.whiteKingMoved = false;
        this.blackKingMoved = false;
        this.whiteRookLeftMoved = false;
        this.whiteRookRightMoved = false;
        this.blackRookLeftMoved = false;
        this.blackRookRightMoved = false;
        this.lastMove = null;
        this.initBoard();
        this.drawBoard();
        this.updateStatus('Your turn! (White)');
        
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('forfeitButton').style.display = 'inline-block';
        document.getElementById('chessResult').innerHTML = '';
    },
    
    forfeit() {
        this.gameActive = false;
        this.updateStatus('You forfeited the game!');
        document.getElementById('chessResult').innerHTML = '<span style="font-size: 1.5em; color: #e74c3c;">💔 You Forfeited</span><br><span style="font-size: 1.2em;">Better luck next time!</span>';
        document.getElementById('startButton').style.display = 'inline-block';
        document.getElementById('forfeitButton').style.display = 'none';
    },
    
    initBoard() {
        // Initialize 8x8 board with standard chess setup
        this.board = [
            // Row 0 (Black's back rank)
            [
                { type: 'rook', color: 'black' },
                { type: 'knight', color: 'black' },
                { type: 'bishop', color: 'black' },
                { type: 'queen', color: 'black' },
                { type: 'king', color: 'black' },
                { type: 'bishop', color: 'black' },
                { type: 'knight', color: 'black' },
                { type: 'rook', color: 'black' }
            ],
            // Row 1 (Black's pawns)
            Array(8).fill(null).map(() => ({ type: 'pawn', color: 'black' })),
            // Rows 2-5 (empty)
            ...Array(4).fill(null).map(() => Array(8).fill(null)),
            // Row 6 (White's pawns)
            Array(8).fill(null).map(() => ({ type: 'pawn', color: 'white' })),
            // Row 7 (White's back rank)
            [
                { type: 'rook', color: 'white' },
                { type: 'knight', color: 'white' },
                { type: 'bishop', color: 'white' },
                { type: 'queen', color: 'white' },
                { type: 'king', color: 'white' },
                { type: 'bishop', color: 'white' },
                { type: 'knight', color: 'white' },
                { type: 'rook', color: 'white' }
            ]
        ];
    },
    
    drawBoard() {
        const boardDiv = document.getElementById('chessBoard');
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        let html = '<div style="display: grid; grid-template-columns: repeat(8, 60px); grid-template-rows: repeat(8, 60px); gap: 0;">';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const isLight = (row + col) % 2 === 0;
                const bgColor = isLight ? '#F0D9B5' : '#B58863';
                const piece = this.board[row][col];
                
                let cellContent = '';
                let clickHandler = '';
                let cursor = 'default';
                let border = 'none';
                let bgStyle = bgColor;
                
                // Highlight last move
                if (this.lastMove && 
                    ((this.lastMove.fromRow === row && this.lastMove.fromCol === col) ||
                     (this.lastMove.toRow === row && this.lastMove.toCol === col))) {
                    bgStyle = isLight ? '#CDD26A' : '#AAA23A';
                }
                
                if (piece) {
                    const emoji = this.pieces[piece.color][piece.type];
                    cellContent = `<div style="font-size: 2.5em;">${emoji}</div>`;
                    
                    if (this.gameActive && piece.color === this.currentPlayer) {
                        cursor = 'pointer';
                        clickHandler = `onclick="chessGame.selectPiece(${row}, ${col})"`;
                    }
                    
                    if (this.selectedPiece && this.selectedPiece.row === row && this.selectedPiece.col === col) {
                        border = '3px solid #FFB800';
                        bgStyle = '#7FA650';
                    }
                } else if (this.selectedPiece) {
                    // Check if this is a valid move
                    if (this.isValidMove(this.selectedPiece.row, this.selectedPiece.col, row, col)) {
                        cellContent = '<div style="width: 20px; height: 20px; background: rgba(0,0,0,0.2); border-radius: 50%;"></div>';
                        cursor = 'pointer';
                        clickHandler = `onclick="chessGame.movePiece(${row}, ${col})"`;
                        
                        // Highlight capture squares differently
                        const targetPiece = this.board[row][col];
                        if (targetPiece) {
                            border = '3px solid #e74c3c';
                        }
                    }
                }
                
                html += `
                    <div ${clickHandler} style="
                        background: ${bgStyle};
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
        
        this.updateCaptured();
    },
    
    selectPiece(row, col) {
        if (!this.gameActive || this.currentPlayer !== 'white') return;
        
        const piece = this.board[row][col];
        if (!piece || piece.color !== 'white') return;
        
        this.selectedPiece = { row, col };
        this.drawBoard();
    },
    
    movePiece(toRow, toCol) {
        if (!this.selectedPiece || !this.gameActive) return;
        
        const fromRow = this.selectedPiece.row;
        const fromCol = this.selectedPiece.col;
        
        if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return;
        
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        // Make the move
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Track king/rook movement for castling
        if (piece.type === 'king' && piece.color === 'white') {
            this.whiteKingMoved = true;
        }
        if (piece.type === 'rook' && piece.color === 'white') {
            if (fromCol === 0) this.whiteRookLeftMoved = true;
            if (fromCol === 7) this.whiteRookRightMoved = true;
        }
        
        // Pawn promotion
        if (piece.type === 'pawn' && piece.color === 'white' && toRow === 0) {
            piece.type = 'queen';
        }
        
        this.lastMove = { fromRow, fromCol, toRow, toCol };
        this.selectedPiece = null;
        
        // Check for checkmate/stalemate
        if (this.isCheckmate('black')) {
            this.endGame(true, 'Checkmate! You win!');
            return;
        }
        
        if (this.isStalemate('black')) {
            this.endGame(null, 'Stalemate - Draw!');
            return;
        }
        
        // Switch to NPC turn
        this.currentPlayer = 'black';
        this.drawBoard();
        this.updateStatus('NPC is thinking...');
        
        setTimeout(() => this.npcMove(), 800);
    },
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;
        
        const targetPiece = this.board[toRow][toCol];
        if (targetPiece && targetPiece.color === piece.color) return false;
        
        const rowDiff = toRow - fromRow;
        const colDiff = toCol - fromCol;
        const absRowDiff = Math.abs(rowDiff);
        const absColDiff = Math.abs(colDiff);
        
        switch (piece.type) {
            case 'pawn':
                const direction = piece.color === 'white' ? -1 : 1;
                const startRow = piece.color === 'white' ? 6 : 1;
                
                // Forward move
                if (colDiff === 0 && !targetPiece) {
                    if (rowDiff === direction) return true;
                    if (fromRow === startRow && rowDiff === direction * 2 && !this.board[fromRow + direction][fromCol]) return true;
                }
                
                // Capture
                if (absColDiff === 1 && rowDiff === direction && targetPiece && targetPiece.color !== piece.color) {
                    return true;
                }
                return false;
                
            case 'knight':
                return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
                
            case 'bishop':
                if (absRowDiff !== absColDiff) return false;
                return this.isPathClear(fromRow, fromCol, toRow, toCol);
                
            case 'rook':
                if (rowDiff !== 0 && colDiff !== 0) return false;
                return this.isPathClear(fromRow, fromCol, toRow, toCol);
                
            case 'queen':
                if (rowDiff !== 0 && colDiff !== 0 && absRowDiff !== absColDiff) return false;
                return this.isPathClear(fromRow, fromCol, toRow, toCol);
                
            case 'king':
                return absRowDiff <= 1 && absColDiff <= 1;
                
            default:
                return false;
        }
    },
    
    isPathClear(fromRow, fromCol, toRow, toCol) {
        const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
        const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
        
        let currentRow = fromRow + rowStep;
        let currentCol = fromCol + colStep;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (this.board[currentRow][currentCol]) return false;
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        return true;
    },
    
    getAllValidMoves(color) {
        const moves = [];
        
        for (let fromRow = 0; fromRow < 8; fromRow++) {
            for (let fromCol = 0; fromCol < 8; fromCol++) {
                const piece = this.board[fromRow][fromCol];
                if (piece && piece.color === color) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (this.isValidMove(fromRow, fromCol, toRow, toCol)) {
                                moves.push({
                                    fromRow, fromCol, toRow, toCol,
                                    piece: piece.type,
                                    capture: this.board[toRow][toCol] !== null
                                });
                            }
                        }
                    }
                }
            }
        }
        
        return moves;
    },
    
    npcMove() {
        if (!this.gameActive) return;
        
        const moves = this.getAllValidMoves('black');
        if (moves.length === 0) {
            if (this.isInCheck('black')) {
                this.endGame(true, 'Checkmate! You win!');
            } else {
                this.endGame(null, 'Stalemate - Draw!');
            }
            return;
        }
        
        let selectedMove;
        
        // Choose move based on difficulty
        if (this.difficulty === 'easy') {
            selectedMove = moves[Math.floor(Math.random() * moves.length)];
        } else if (this.difficulty === 'medium') {
            // Prefer captures
            const captures = moves.filter(m => m.capture);
            if (captures.length > 0 && Math.random() > 0.3) {
                selectedMove = captures[Math.floor(Math.random() * captures.length)];
            } else {
                selectedMove = moves[Math.floor(Math.random() * moves.length)];
            }
        } else {
            // Hard: prioritize captures, especially high-value pieces
            const captures = moves.filter(m => m.capture);
            if (captures.length > 0) {
                // Sort by piece value
                captures.sort((a, b) => {
                    const valueMap = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 100 };
                    const aValue = valueMap[this.board[a.toRow][a.toCol].type] || 0;
                    const bValue = valueMap[this.board[b.toRow][b.toCol].type] || 0;
                    return bValue - aValue;
                });
                selectedMove = captures[0];
            } else {
                // Develop pieces or control center
                const centerMoves = moves.filter(m => 
                    (m.toRow >= 2 && m.toRow <= 5 && m.toCol >= 2 && m.toCol <= 5)
                );
                selectedMove = centerMoves.length > 0 ? centerMoves[0] : moves[0];
            }
        }
        
        // Execute move
        const piece = this.board[selectedMove.fromRow][selectedMove.fromCol];
        this.board[selectedMove.toRow][selectedMove.toCol] = piece;
        this.board[selectedMove.fromRow][selectedMove.fromCol] = null;
        
        // Track king/rook movement
        if (piece.type === 'king' && piece.color === 'black') {
            this.blackKingMoved = true;
        }
        if (piece.type === 'rook' && piece.color === 'black') {
            if (selectedMove.fromCol === 0) this.blackRookLeftMoved = true;
            if (selectedMove.fromCol === 7) this.blackRookRightMoved = true;
        }
        
        // Pawn promotion
        if (piece.type === 'pawn' && piece.color === 'black' && selectedMove.toRow === 7) {
            piece.type = 'queen';
        }
        
        this.lastMove = selectedMove;
        
        // Check for checkmate/stalemate
        if (this.isCheckmate('white')) {
            this.endGame(false, 'Checkmate! NPC wins!');
            return;
        }
        
        if (this.isStalemate('white')) {
            this.endGame(null, 'Stalemate - Draw!');
            return;
        }
        
        this.currentPlayer = 'white';
        this.drawBoard();
        
        const checkStatus = this.isInCheck('white') ? ' - CHECK! ⚠️' : '';
        this.updateStatus('Your turn! (White)' + checkStatus);
    },
    
    isInCheck(color) {
        // Find king position
        let kingRow, kingCol;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === 'king' && piece.color === color) {
                    kingRow = row;
                    kingCol = col;
                    break;
                }
            }
        }
        
        // Check if any enemy piece can capture the king
        const enemyColor = color === 'white' ? 'black' : 'white';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === enemyColor) {
                    if (this.isValidMove(row, col, kingRow, kingCol)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    },
    
    isCheckmate(color) {
        if (!this.isInCheck(color)) return false;
        return this.getAllValidMoves(color).length === 0;
    },
    
    isStalemate(color) {
        if (this.isInCheck(color)) return false;
        return this.getAllValidMoves(color).length === 0;
    },
    
    endGame(playerWon, message) {
        this.gameActive = false;
        
        const resultDiv = document.getElementById('chessResult');
        
        if (playerWon === true) {
            const payout = this.bet * 3;
            updateBalance(payout);
            
            resultDiv.className = 'game-result win';
            resultDiv.innerHTML = `
                <span style="font-size: 2em;">🎉 VICTORY! 🎉</span><br>
                <span style="font-size: 1.3em;">${message}</span><br>
                <span style="font-size: 1.5em; color: #FFB800;">+${payout} eGold</span>
            `;
            
            // Track win
            if (typeof achievementSystem !== 'undefined') achievementSystem.trackWin(payout, 'Chess');
        } else if (playerWon === false) {
            resultDiv.className = 'game-result lose';
            resultDiv.innerHTML = `
                <span style="font-size: 1.8em;">💔 DEFEAT</span><br>
                <span style="font-size: 1.3em;">${message}</span>
            `;
        } else {
            // Draw - return bet
            updateBalance(this.bet);
            resultDiv.className = 'game-result';
            resultDiv.style.background = 'linear-gradient(135deg, rgba(255, 184, 0, 0.2), rgba(212, 175, 55, 0.2))';
            resultDiv.style.borderColor = '#FFB800';
            resultDiv.innerHTML = `
                <span style="font-size: 1.8em; color: #FFB800;">⚖️ DRAW</span><br>
                <span style="font-size: 1.3em;">${message}</span><br>
                <span style="font-size: 1.2em;">Bet returned</span>
            `;
        }
        
        this.updateStatus('Game Over!');
        document.getElementById('startButton').style.display = 'inline-block';
        document.getElementById('forfeitButton').style.display = 'none';
    },
    
    updateStatus(message) {
        document.getElementById('gameStatus').textContent = message;
    },
    
    updateCaptured() {
        const captured = { white: [], black: [] };
        const allPieces = {
            white: { king: 1, queen: 1, rook: 2, bishop: 2, knight: 2, pawn: 8 },
            black: { king: 1, queen: 1, rook: 2, bishop: 2, knight: 2, pawn: 8 }
        };
        
        // Count remaining pieces
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    allPieces[piece.color][piece.type]--;
                }
            }
        }
        
        // Display captured pieces
        for (const color of ['white', 'black']) {
            for (const [type, count] of Object.entries(allPieces[color])) {
                if (count > 0 && type !== 'king') {
                    const capturedBy = color === 'white' ? 'black' : 'white';
                    for (let i = 0; i < count; i++) {
                        captured[capturedBy].push(this.pieces[color][type]);
                    }
                }
            }
        }
        
        document.getElementById('capturedByWhite').textContent = captured.white.join(' ');
        document.getElementById('capturedByBlack').textContent = captured.black.join(' ');
    }
};

window.chessGame = chessGame;
