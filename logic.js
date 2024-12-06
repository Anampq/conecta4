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
            const message = currentPlayer === 'R' ? 'AHORA ES EL TURNO DE ROJO' : 'AHORA ES EL TURNO DE AMARILLO';
            showTurnMessage(message);
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
    
            // Reproduce el sonido del ganador
            const winnerSound = document.getElementById('winnerSound');
            const redSound = document.getElementById('redSound');
            const yellowSound = document.getElementById('yellowSound');
            
            
            if (winnerSound) {
                winnerSound.play();
                
                winnerSound.onended = () => {
                    const colorSound = currentPlayer === 'R' ? redSound: yellowSound;
                    
                    colorSound.play();
                    colorSound.onended = () => {
                        setTimeout(() => transitionTo('INIT'), 2000);
                    };
                    
                    
                };
                
            }  
        }
    },
    
};
function initializeGame() {
    renderBoard();
    transitionTo('INIT');
    
    
    // Añadimos el event listener para el botón de reinicio
    document.getElementById('restartButton').addEventListener('click', () => {
        transitionTo('INIT');
    });
}
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
            animatePiece(row, col, currentPlayer, () => {
                board[row][col] = currentPlayer;
                renderBoard();
                setTimeout(() => {
                    transitionTo('CHECK_WINNER');
                }, 10); // Delay para pintar la celda correctamente
            });
            return;
        }
    }
    alert('Columna llena');
}

// Animar ficha
function animatePiece(row, col, player, callback) {
    const boardElement = document.getElementById('board');
    const cell = document.querySelector(`.cell[data-row="0"][data-col="${col}"]`);
    const cellRect = cell.getBoundingClientRect();
    const boardRect = boardElement.getBoundingClientRect();

    const cellSize = cellRect.width;
    const startX = cellRect.left - boardRect.left;
    const startY = -cellSize;
    const endY = (row + 1)*cellSize;

    // Crear la ficha animada
    const pieceDiv = document.createElement('div');
    pieceDiv.classList.add('piece');
    pieceDiv.style.backgroundColor = player === 'R' ? 'red' : 'yellow';
    pieceDiv.style.position = 'absolute';
    pieceDiv.style.left = `${startX}px`;
    pieceDiv.style.top = `${startY}px`;
    boardElement.appendChild(pieceDiv);

    // Animar la ficha
    let currentY = startY;
    function animate() {
        if (currentY < endY) {
            currentY += 5; // Velocidad de la animación
            pieceDiv.style.top = `${currentY}px`;
            requestAnimationFrame(animate);
        } else {
            // Finaliza la animación
            pieceDiv.style.top = `${endY}px`;
            callback();
            pieceDiv.remove();
        }
    }
    animate();
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


function resetBoard() {
    board = Array.from({ length: 6 }, () => Array(7).fill(null));
    renderBoard();
}


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

function showTurnMessage(message) {
    const turnIndicator = document.getElementById('turn-indicator');

    // Reinicia animacion
    turnIndicator.style.animation = 'none';
    setTimeout(() => {
        turnIndicator.style.animation = '';
    }, 10);

    turnIndicator.textContent = message;
    turnIndicator.style.display = 'block';

    // timer de 4 seg
    setTimeout(() => {
        turnIndicator.style.display = 'none';
    }, 4000);
}



