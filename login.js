document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'atenea' && password === 'atenea') {
      // Ocultar el contenedor de login y mostrar el juego
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('game-container').style.display = 'block';
      
      // Inicializar el juego después del login exitoso
      initializeGame();
  } else {
      const errorMessage = document.getElementById('error-message');
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Usuario o contraseña incorrectos';
  }
});
  