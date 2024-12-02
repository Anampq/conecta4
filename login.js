document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto
  
    // Obtener valores del formulario
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Validar credenciales
    if (username === 'atenea' && password === 'atenea') {
      // Ocultar el contenedor de login y mostrar el juego
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('game-container').style.display = 'block';
    } else {
      // Mostrar mensaje de error
      const errorMessage = document.getElementById('error-message');
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Usuario o contraseña incorrectos';
    }
  });
  