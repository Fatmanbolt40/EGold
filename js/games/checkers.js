// Checkers Betting Game

let checkersGame;

function initCheckers(container) {
    checkersGame = new CheckersGame();
    checkersGame.init(container);
}

class CheckersGame {
    constructor() {
        this.board = this.initializeBoard();
        this.currentPlayer = 'red';
        this.selectedPiece = null;
        this.betAmount = 30;
        this.gameActive = false;
    }

    initializeBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Set up red pieces (bottom)
        for (let row = 5; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    board[row][col] = { color: 'red', king: false, symbol: '🔴' };
                }
            }
        }

        // Set up black pieces (top)
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 === 1) {
                    board[row][col] = { color: 'black', king: false, symbol: '⚫' };
                }
            }
        }

        return board;
    }

    init(container) {
        container.innerHTML = `
            <div class="game-info">
                <h3>Checkers Betting</h3>
                <p>Capture all opponent pieces to win!</p>
            </div>

            <div class="betting-setup" id="checkersSetup">
                <label for="checkersBet">Bet Amount (eGold):</label>
                <input type="number" id="checkersBet" min="10" max="${currentBalance}" value="30" step="10">
                <button onclick="checkersGame.startGame()" class="btn-play">Start Game</button>
            </div>

            <div class="board-container" id="checkersBoard" style="display: none;">
                <div class="game-info">
                    <p>Turn: <span id="checkersTurn">Red (You)</span> | Bet: <span id="checkersBetAmount">0</span> eGold</p>
                </div>
                <div class="checkers-board" id="checkersGrid"></div>
                <div id="checkersMessages" class="game-message"></div>
            </div>
        `;

        this.container = container;
    }

    startGame() {
        const bet = parseFloat(document.getElementById('checkersBet').value);
        
        if (bet > currentBalance) {
            alert('Insufficient balance!');
            return;
        }

        this.betAmount = bet;
        updateBalance(-bet);
        this.gameActive = true;
        
        document.getElementById('checkersSetup').style.display = 'none';
        document.getElementById('checkersBoard').style.display = 'block';
        document.getElementById('checkersBetAmount').textContent = bet;
        
        this.renderBoard();
        this.showMessage('Your turn! Move red pieces.');
    }

    renderBoard() {
        const grid = document.getElementById('checkersGrid');
        grid.innerHTML = '';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `board-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = this.board[row][col];
                if (piece) {
                    square.textContent = piece.king ? (piece.color === 'red' ? '👑' : '⚫👑') : piece.symbol;
                }

                square.addEventListener('click', () => this.handleSquareClick(row, col));
                grid.appendChild(square);
            }
        }
    }

    handleSquareClick(row, col) {
        if (!this.gameActive || this.currentPlayer !== 'red') return;

        const piece = this.board[row][col];

        // Select piece
        if (!this.selectedPiece && piece && piece.color === 'red') {
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
                
                if (this.checkWin('red')) {
                    this.endGame(true);
                    return;
                }
                
                this.currentPlayer = 'black';
                document.getElementById('checkersTurn').textContent = 'Black (AI)';
                
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
        
        if (!piece) return false;
        if (this.board[toRow][toCol]) return false;
        if ((fromRow + fromCol) % 2 === 0 || (toRow + toCol) % 2 === 0) return false;

        const rowDiff = toRow - fromRow;
        const colDiff = Math.abs(toCol - fromCol);

        // Regular move
        if (colDiff === 1 && Math.abs(rowDiff) === 1) {
            if (piece.king) return true;
            if (piece.color === 'red' && rowDiff === -1) return true;
            if (piece.color === 'black' && rowDiff === 1) return true;
        }

        // Jump move
        if (colDiff === 2 && Math.abs(rowDiff) === 2) {
            const midRow = (fromRow + toRow) / 2;
            const midCol = (fromCol + toCol) / 2;
            const jumpedPiece = this.board[midRow][midCol];
            
            if (jumpedPiece && jumpedPiece.color !== piece.color) {
                if (piece.king) return true;
                if (piece.color === 'red' && rowDiff === -2) return true;
                if (piece.color === 'black' && rowDiff === 2) return true;
            }
        }

        return false;
    }

    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        
        // Check for jump
        if (Math.abs(toRow - fromRow) === 2) {
            const midRow = (fromRow + toRow) / 2;
            const midCol = (fromCol + toCol) / 2;
            this.board[midRow][midCol] = null; // Capture piece
        }

        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;

        // Check for king promotion
        if (piece.color === 'red' && toRow === 0) {
            piece.king = true;
        } else if (piece.color === 'black' && toRow === 7) {
            piece.king = true;
        }

        this.renderBoard();
    }

    aiMove() {
        if (!this.gameActive) return;

        const blackPieces = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] && this.board[row][col].color === 'black') {
                    blackPieces.push({ row, col });
                }
            }
        }

        let moved = false;
        for (let attempt = 0; attempt < 100 && !moved; attempt++) {
            const piece = blackPieces[Math.floor(Math.random() * blackPieces.length)];
            const directions = [[1, 1], [1, -1], [2, 2], [2, -2]];
            const dir = directions[Math.floor(Math.random() * directions.length)];
            const toRow = piece.row + dir[0];
            const toCol = piece.col + dir[1];

            if (toRow >= 0 && toRow < 8 && toCol >= 0 && toCol < 8) {
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
        }

        this.currentPlayer = 'red';
        document.getElementById('checkersTurn').textContent = 'Red (You)';
    }

    checkWin(player) {
        const opponentColor = player === 'red' ? 'black' : 'red';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === opponentColor) {
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
            this.showMessage(`You won ${this.betAmount * 2} eGold!`);
        } else {
            this.showMessage(`AI wins. You lost ${this.betAmount} eGold.`);
        }

        setTimeout(() => {
            if (confirm('Play again?')) {
                location.reload();
            }
        }, 2000);
    }

    showMessage(msg) {
        document.getElementById('checkersMessages').textContent = msg;
    }
}
