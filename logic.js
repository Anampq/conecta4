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
            const result = checkWinner();
            if (result === 'WIN') {
                console.log('¡Tenemos un GANADOR!');
                transitionTo('END');
            } else if (result === 'NOWINNER') {
                console.log('Tenemos un EMPATE');
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
            const result = checkWinner();

            const askPlayAgain = () => {
                const playAgain = confirm("¿Quieren jugar de nuevo? 👀");
                if (playAgain) {
                    initializeGame();
                } else {
                    alert('Gracias por jugar. ¡Hasta la próxima!');
                    endGame();
                }
            };

            if (result === 'WIN') {
                console.log("¡Hay un ganador!")
                playSound('winnerSound')
                    .then(() => {
                        const colorSoundId = currentPlayer === 'R' ? 'redSound' : 'yellowSound';
                        return playSound(colorSoundId);
                    })
                    .then(() => setTimeout(askPlayAgain, 500));
            } else if (result === 'NOWINNER') {
                console.log("VAYA, ¡Empataron!");
                // Reproduce el sonido de empate
                playSound('empateSound')
                    .then(() => {
                        const drawMessage ='EMPATE';
                        const utterance = new SpeechSynthesisUtterance(drawMessage);
                        speechSynthesis.speak(utterance);
                        return new Promise((resolve) => {
                            utterance.onend = resolve;
                        });
                    })
                    .then(() => setTimeout(askPlayAgain, 500));
            }
        }
    },
};

function initializeGame() {
    resetBoard();
    currentPlayer = 'R';
    transitionTo('INIT');

    // Añadimos el event listener para el botón de reinicio
    document.getElementById('restartButton').addEventListener('click', () => {
        transitionTo('INIT');
    });
}

// Reproducir sonido
function playSound(id) {
    return new Promise((resolve, reject) => {
        const sound = document.getElementById(id);
        if (sound) {
            sound.play()
                .then(() => {
                    sound.onended = () => resolve();
                })
                .catch((error) => {
                    console.error("Error al reproducir el sonido:", error);
                    reject();
                });
        } else {
            console.error(`No se encontró el audio con ID "${id}"`);
            resolve();
        }
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
                playSound('fichaSound');
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
            currentY += 20; // Velocidad de la animación
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
                return 'WIN';    //Hay un ganador
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
                return 'WIN';    //Hay un ganador
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
                return 'WIN';    //Hay un ganador
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
                return 'WIN';    //Hay un ganador
            }
        }
    }

    // Comprobación de empate
    const isBoardFull = board.every(row => row.every(cell => cell !== null));
    if (isBoardFull) {
        console.log("Tablero lleno!");
        return 'NOWINNER';
    }

    return false; // El juego continua
}

function resetBoard() {
    board = Array.from({ length: 6 }, () => Array(7).fill(null));
    renderBoard();
    console.log('El juego ha sido reiniciado');
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

    // timer de 6 seg
    setTimeout(() => {
        turnIndicator.style.display = 'none';
    }, 6000);
}

function endGame() {
    document.getElementById('game-container').style.display = 'none';   // Ocultar el juego
    document.getElementById('login-container').style.display = 'block'; // Mostrar el login
    resetGame();
}
