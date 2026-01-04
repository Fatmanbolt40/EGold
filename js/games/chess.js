// Chess Betting Game

let chessGame;

function initChess(container) {
    chessGame = new ChessGame();
    chessGame.init(container);
}

class ChessGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.betAmount = 50;
        this.gameActive = false;
    }

    initializeBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Set up pieces (simplified)
        const pieces = {
            white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
            black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
        };

        // Pawns
        for (let i = 0; i < 8; i++) {
            board[1][i] = { type: 'pawn', color: 'black', symbol: pieces.black.pawn };
            board[6][i] = { type: 'pawn', color: 'white', symbol: pieces.white.pawn };
        }

        // Other pieces
        const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        for (let i = 0; i < 8; i++) {
            board[0][i] = { type: backRow[i], color: 'black', symbol: pieces.black[backRow[i]] };
            board[7][i] = { type: backRow[i], color: 'white', symbol: pieces.white[backRow[i]] };
        }

        return board;
    }

    init(container) {
        container.innerHTML = `
            <div class="game-info">
                <h3>Chess Betting</h3>
                <p>Play chess against AI. Checkmate to win double your bet!</p>
            </div>

            <div class="betting-setup" id="chessSetup">
                <label for="chessBet">Bet Amount (eGold):</label>
                <input type="number" id="chessBet" min="10" max="${currentBalance}" value="50" step="10">
                <button onclick="chessGame.startGame()" class="btn-play">Start Game</button>
            </div>

            <div class="board-container" id="chessBoard" style="display: none;">
                <div class="game-info">
                    <p>Turn: <span id="chessTurn">White</span> | Bet: <span id="chessBetAmount">0</span> eGold</p>
                </div>
                <div class="chess-board" id="boardGrid"></div>
                <div class="betting-controls">
                    <button onclick="chessGame.resign()" class="bet-btn" style="background: #e74c3c;">Resign</button>
                    <button onclick="chessGame.offerDraw()" class="bet-btn">Offer Draw</button>
                </div>
                <div id="chessMessages" class="game-message"></div>
            </div>
        `;

        this.container = container;
    }

    startGame() {
        const bet = parseFloat(document.getElementById('chessBet').value);
        
        if (bet > currentBalance) {
            alert('Insufficient balance!');
            return;
        }

        this.betAmount = bet;
        updateBalance(-bet);
        this.gameActive = true;
        
        document.getElementById('chessSetup').style.display = 'none';
        document.getElementById('chessBoard').style.display = 'block';
        document.getElementById('chessBetAmount').textContent = bet;
        
        this.renderBoard();
        this.showMessage('Your turn! Move white pieces.');
    }

    renderBoard() {
        const boardGrid = document.getElementById('boardGrid');
        boardGrid.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `board-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = this.board[row][col];
                if (piece) {
                    square.textContent = piece.symbol;
                    square.dataset.color = piece.color;
                }

                square.addEventListener('click', () => this.handleSquareClick(row, col));
                boardGrid.appendChild(square);
            }
        }
    }

    handleSquareClick(row, col) {
        if (!this.gameActive || this.currentPlayer !== 'white') return;

        const piece = this.board[row][col];

        // Select piece
        if (!this.selectedPiece && piece && piece.color === 'white') {
            this.selectedPiece = { row, col };
            document.querySelectorAll('.board-square').forEach(sq => sq.classList.remove('selected'));
            const squares = document.querySelectorAll('.board-square');
            squares[row * 8 + col].classList.add('selected');
            return;
        }

        // Move piece
        if (this.selectedPiece) {
            const fromRow = this.selectedPiece.row;
            const fromCol = this.selectedPiece.col;
            
            if (this.isValidMove(fromRow, fromCol, row, col)) {
                this.movePiece(fromRow, fromCol, row, col);
                this.selectedPiece = null;
                this.currentPlayer = 'black';
                document.getElementById('chessTurn').textContent = 'Black (AI)';
                
                if (this.checkWin('white')) {
                    this.endGame(true);
                    return;
                }
                
                setTimeout(() => this.aiMove(), 1000);
            } else {
                this.showMessage('Invalid move!');
            }
            
            document.querySelectorAll('.board-square').forEach(sq => sq.classList.remove('selected'));
            this.selectedPiece = null;
        }
    }

    isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const target = this.board[toRow][toCol];

        if (target && target.color === piece.color) return false;

        // Simplified move validation
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);

        switch(piece.type) {
            case 'pawn':
                if (piece.color === 'white') {
                    return (fromRow - toRow === 1 && colDiff === 0 && !target) ||
                           (fromRow - toRow === 1 && colDiff === 1 && target);
                } else {
                    return (toRow - fromRow === 1 && colDiff === 0 && !target) ||
                           (toRow - fromRow === 1 && colDiff === 1 && target);
                }
            case 'rook':
                return (rowDiff === 0 || colDiff === 0);
            case 'knight':
                return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
            case 'bishop':
                return rowDiff === colDiff;
            case 'queen':
                return rowDiff === colDiff || rowDiff === 0 || colDiff === 0;
            case 'king':
                return rowDiff <= 1 && colDiff <= 1;
        }

        return false;
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        this.board[toRow][toCol] = this.board[fromRow][fromCol];
        this.board[fromRow][fromCol] = null;
        this.renderBoard();
    }

    aiMove() {
        if (!this.gameActive) return;

        // Simple AI: random valid move
        const blackPieces = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] && this.board[row][col].color === 'black') {
                    blackPieces.push({ row, col });
                }
            }
        }

        let moved = false;
        for (let attempt = 0; attempt < 50 && !moved; attempt++) {
            const piece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
            const toRow = Math.floor(Math.random() * 8);
            const toCol = Math.floor(Math.random() * 8);

            if (this.isValidMove(piece.row, piece.col, toRow, toCol)) {
                this.movePiece(piece.row, piece.col, toRow, toCol);
                moved = true;
                this.showMessage('AI moved');
                
                if (this.checkWin('black')) {
                    this.endGame(false);
                    return;
                }
            }
        }

        this.currentPlayer = 'white';
        document.getElementById('chessTurn').textContent = 'White (You)';
    }

    checkWin(player) {
        // Check if opponent's king is captured
        const opponentColor = player === 'white' ? 'black' : 'white';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === 'king' && piece.color === opponentColor) {
                    return false;
                }
            }
        }
        
        return true;
    }

    endGame(won) {
        this.gameActive = false;
        
        if (won) {
            updateBalance(this.betAmount * 2);
            this.showMessage(`Checkmate! You won ${this.betAmount * 2} eGold!`);
        } else {
            this.showMessage(`Checkmate! AI wins. You lost ${this.betAmount} eGold.`);
        }

        setTimeout(() => {
            if (confirm('Play again?')) {
                location.reload();
            }
        }, 2000);
    }

    resign() {
        if (confirm('Are you sure you want to resign?')) {
            this.endGame(false);
        }
    }

    offerDraw() {
        if (confirm('Offer draw? You will get your bet back.')) {
            updateBalance(this.betAmount);
            this.gameActive = false;
            this.showMessage('Draw accepted. Bet returned.');
            setTimeout(() => location.reload(), 2000);
        }
    }

    showMessage(msg) {
        document.getElementById('chessMessages').textContent = msg;
    }
}
