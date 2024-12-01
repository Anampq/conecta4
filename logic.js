// Variables globales
let board = Array.from({ length: 6 }, () => Array(7).fill(null));
let currentPlayer = 'R'; // Jugador actual ('R' o 'Y')
let currentState = null; // Estado actual del juego

// Estados del juego
const gameStates = {
    INIT: {
        enter: () => {
            console.log("Inicializando juego...");
            resetBoard();
            currentPlayer = 'R';
            transitionTo('PLAYER_TURN');
        }
    },
    PLAYER_TURN: {
        enter: () => {
            console.log(`Turno del jugador: ${currentPlayer}`);
        },
        onColumnClick: (col) => {
            dropPiece(col);
        }
    },
    CHECK_WINNER: {
        enter: () => {
            if (checkWinner()) {
                transitionTo('END');
            } else {
                currentPlayer = currentPlayer === 'R' ? 'Y' : 'R';
                transitionTo('PLAYER_TURN');
            }
        }
    },
    END: {
        enter: () => {
            console.log("Juego terminado.");
            alert(`${currentPlayer} ganó!`);
            setTimeout(() => transitionTo('INIT'), 2000);
        }
    }
};

// Cambiar de estado
function transitionTo(newState) {
    console.log(`Transición de estado: ${currentState} -> ${newState}`);
    currentState = newState;
    gameStates[currentState].enter();
}

// Detectar clic en columna
document.getElementById('board').addEventListener('click', (event) => {
    if (event.target.classList.contains('cell')) {
        const col = Number(event.target.dataset.col);
        if (gameStates[currentState]?.onColumnClick) {
            gameStates[currentState].onColumnClick(col);
        }
    }
});

// Colocar ficha
function dropPiece(col) {
    for (let row = board.length - 1; row >= 0; row--) {
        if (!board[row][col]) {
            board[row][col] = currentPlayer;
            renderBoard();
            setTimeout(() => {
                transitionTo('CHECK_WINNER');
            }, 10); // Retraso para pintar la celda correctamente
            return;
        }
    }
  alert('Columna llena');
}

// Verificar ganador
function checkWinner() {
    // Comprobación horizontal
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            if (
                board[row][col] &&
                board[row][col] === board[row][col + 1] &&
                board[row][col] === board[row][col + 2] &&
                board[row][col] === board[row][col + 3]
            ) {
                return true;
            }
        }
    }

    // Comprobación vertical
    for (let col = 0; col < 7; col++) {
        for (let row = 0; row < 3; row++) {
            if (
                board[row][col] &&
                board[row][col] === board[row + 1][col] &&
                board[row][col] === board[row + 2][col] &&
                board[row][col] === board[row + 3][col]
            ) {
                return true;
            }
        }
    }

    // Comprobación diagonal (\)
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            if (
                board[row][col] &&
                board[row][col] === board[row + 1][col + 1] &&
                board[row][col] === board[row + 2][col + 2] &&
                board[row][col] === board[row + 3][col + 3]
            ) {
                return true;
            }
        }
    }

    // Comprobación diagonal (/)
    for (let row = 3; row < 6; row++) {
        for (let col = 0; col < 4; col++) {
            if (
                board[row][col] &&
                board[row][col] === board[row - 1][col + 1] &&
                board[row][col] === board[row - 2][col + 2] &&
                board[row][col] === board[row - 3][col + 3]
            ) {
                return true;
            }
        }
    }

    return false; // No hay ganador
}

// Reiniciar tablero
function resetBoard() {
    board = Array.from({ length: 6 }, () => Array(7).fill(null));
    renderBoard();
}

// Renderizar tablero
function renderBoard() {
    const container = document.getElementById('board');
    container.innerHTML = '';
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.dataset.row = rowIndex;
            cellDiv.dataset.col = colIndex;
            cellDiv.style.backgroundColor = cell === 'R' ? 'red' : cell === 'Y' ? 'yellow' : 'white';
            container.appendChild(cellDiv);
        });
    });
}

// Iniciar el juego
transitionTo('INIT');

// Selecciona el botón de reinicio
document.getElementById('restartButton').addEventListener('click', () => {
    transitionTo('INIT');
});