# **Conecta 4 - en Web**

En este proyecto, hemos desarrollado una versión interactiva del clásico juego Conecta 4, utilizando JavaScript, HTML y CSS.
La interfaz permite que dos jugadores se turnen para colocar sus fichas en un tablero dinámico y visualmente atractivo.

**¿Cómo se gana el juego?**
El objetivo es ser el primero en conectar cuatro fichas del mismo color de manera consecutiva en línea horizontal, vertical o diagonal, antes que el oponente.

## **Características**

- **Jugadores**: Dos jugadores se alternan en turnos para colocar fichas. El jugador rojo inicia el juego.

- **Interactividad**: Los jugadores interactúan con el tablero haciendo clic en las columnas para colocar sus fichas.

- **Detección de ganador**: El juego verifica automáticamente si un jugador ha ganado después de cada movimiento.

- **Empates**: Si el tablero se llena sin que ningún jugador conecte cuatro fichas, el juego declara un empate.

- **Animaciones**: Las fichas se colocan en el tablero con animaciones visuales para mejorar la experiencia del usuario.

- **Sonidos**: Reacciones auditivas para movimientos y eventos, como victorias o empates.

- **Reinicio**: Los jugadores pueden reiniciar el juego en cualquier momento.


## **Estructura del Proyecto**

- **index.html**: Contiene la estructura del juego y los elementos de la interfaz de usuario.

- **style.css**: Define el diseño visual y las animaciones del juego.

- **logic.js**: Implementa la lógica del juego, incluyendo la detección de ganadores, el manejo de estados y las interacciones del usuario.
 
- **login.js**: Implementa la lógica del inicio de sesión del juego.


## **Funcionalidades principales**:

### **Tablero dinámico**: 
  Se renderiza dinámicamente con fichas blancas para indicar posiciones vacías. Cada ficha colocada cambia de color según el jugador.

### **Estados del juego**:

- **INIT**: Inicialización del juego.

- **PLAYER_TURN**: Controla el turno actual del jugador.

- **CHECK_WINNER**: Verifica si hay un ganador o empate.

- **END**: Finaliza el juego con un mensaje del ganador o empate.


### **Sonidos y mensajes**:

Hemos añadido sonidos específicos para eventos clave, como colocar una ficha, ganar o empatar. Por ejemplo, los turnos y resultados se anuncian visualmente en la interfaz.


# **Cómo Jugar**

1. Debes de iniciar sesión. Hemos añadido dos usuarios con sus contraseñas. Puedes usar ambos
2. Una vez inicias sesión, el tablero aparecerá delante tuyo.

El juego continuará de la siguiente manera:

1. **Inicio**: El jugador rojo comenzará el juego, por lo que el primer mensaje que verán será el mensaje "AHORA ES EL TURNO DE ROJO".
2. **Turnos**: Uno de los jugadores debe de hacer click en las columnas del tablero para colocar una ficha en la posición más baja disponible. Después de cada movimiento, el turno pasa al otro jugador.
3. **Condiciones de victoria**: Por cada turno, el juego calcula si hay algún ganador (mira si hay 4 fichas seguidas del mismo color en horizontal, vertical o diagonal) o algún empate (en caso que el tablero esté lleno y no haya ganador).
4. **Reinicio**: Os damos la opción de elegir reiniciar el juego desde el botón "Reiniciar".



# **Cómo Ejecutar el Proyecto**

1. Clona o descarga este repositorio en tu máquina local.

2. Abre el archivo index.html en tu navegador preferido.


**¡¡Diviértete!!**
