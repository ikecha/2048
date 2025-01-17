class Game2048 {
    constructor(container, scoreDisplay, aiDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.aiDisplay = aiDisplay;
        this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
        this.score = 0;
        this.init();
    }

    init() {
        this.addNewTile();
        this.addNewTile();
        this.render();
    }

    addNewTile() {
        const emptyCells = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }
        if (emptyCells.length > 0) {
            const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    render() {
        this.container.innerHTML = '';
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const value = this.board[r][c];
                const tile = document.createElement('div');
                tile.className = 'tile';
                if (value > 0) {
                    tile.dataset.value = value;
                    tile.textContent = value;
                }
                this.container.appendChild(tile);
            }
        }
        this.updateScore();
    }

    slide(row) {
        const newRow = row.filter(val => val !== 0);
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                this.score += newRow[i];
                newRow[i + 1] = 0;
            }
        }
        return newRow.filter(val => val !== 0).concat(Array(4 - newRow.filter(val => val !== 0).length).fill(0));
    }

    moveLeft() {
        this.board = this.board.map(row => this.slide(row));
    }

    moveRight() {
        this.board = this.board.map(row => this.slide(row.reverse()).reverse());
    }

    moveUp() {
        this.transpose();
        this.moveLeft();
        this.transpose();
    }

    moveDown() {
        this.transpose();
        this.moveRight();
        this.transpose();
    }

    transpose() {
        this.board = this.board[0].map((_, c) => this.board.map(row => row[c]));
    }

    isMovePossible() {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 0) return true;
                if (c < 3 && this.board[r][c] === this.board[r][c + 1]) return true;
                if (r < 3 && this.board[r][c] === this.board[r + 1][c]) return true;
            }
        }
        return false;
    }

    updateScore() {
        this.scoreDisplay.textContent = `Score: ${this.score}`;
    }

    showAISuggestion(action) {
        this.aiDisplay.textContent = `AI Action: ${action}`;
    }

    findBestMove() {
        const moves = ['left', 'right', 'up', 'down'];
        let bestMove = null;
        let maxScore = -1;

        for (const move of moves) {
            const simulatedGame = new Game2048(null, null, null);
            simulatedGame.board = this.board.map(row => [...row]);
            simulatedGame.score = this.score;

            simulatedGame[`move${move.charAt(0).toUpperCase() + move.slice(1)}`]();

            if (simulatedGame.board.some((row, rIndex) => row.some((val, cIndex) => val !== this.board[rIndex][cIndex]))) {
                const score = simulatedGame.board.flat().reduce((acc, val) => acc + val, 0);
                if (score > maxScore) {
                    maxScore = score;
                    bestMove = move;
                }
            }
        }

        return bestMove;
    }

    makeAIMove() {
        const bestMove = this.findBestMove();
        if (bestMove) {
            this.showAISuggestion(bestMove);
            this[`move${bestMove.charAt(0).toUpperCase() + bestMove.slice(1)}`]();
            this.addNewTile();
            this.render();
            if (!this.isMovePossible()) {
                alert('Game Over!');
                return;
            }
            setTimeout(() => this.makeAIMove(), 500);
        } else {
            alert('No more moves available, AI cannot proceed.');
        }
    }
}

let game;

function startAI() {
    game = new Game2048(
        document.getElementById('game-container'),
        document.getElementById('score'),
        document.getElementById('ai-suggestion')
    );
    game.makeAIMove();
}

document.addEventListener('DOMContentLoaded', () => {
    game = new Game2048(
        document.getElementById('game-container'),
        document.getElementById('score'),
        document.getElementById('ai-suggestion')
    );
});
