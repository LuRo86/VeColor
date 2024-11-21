const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const colorInfo = document.getElementById('color-info');
const voiceSwitch = document.getElementById('voice-switch'); // Interruptor de voz
let voiceEnabled = false; // Estado del interruptor de voz

let img = new Image();

// Colores básicos definidos en formato RGB
const basicColors = {
  Rojo: [255, 0, 0],
  Verde: [0, 255, 0],
  Azul: [0, 0, 255],
  Amarillo: [255, 255, 0],
  Blanco: [255, 255, 255],
  Negro: [0, 0, 0],
  Rosa: [255, 105, 180],
  Naranja: [255, 165, 0],
  Morado: [128, 0, 128]
};

// Evento para manejar el interruptor de voz
voiceSwitch.addEventListener('change', (e) => {
  voiceEnabled = e.target.checked;
  if (voiceEnabled) {
    speak("Modo de lectura por voz activado. Carga una imagen y pulsa en un color para escucharlo.");
  }
});

// Función para leer texto en voz alta
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES"; // Idioma español
  speechSynthesis.speak(utterance);
}

// Función para cargar la imagen seleccionada en el canvas
upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    img = new Image();
    img.onload = () => {
      const squareSize = Math.min(img.width, img.height);

      // Ajusta el canvas a un cuadrado basado en la menor dimensión de la imagen
      canvas.width = squareSize;
      canvas.height = squareSize;

      const offsetX = (img.width - squareSize) / 2;
      const offsetY = (img.height - squareSize) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
      ctx.drawImage(
        img,
        offsetX, offsetY, squareSize, squareSize, // Recorte de la imagen
        0, 0, canvas.width, canvas.height       // Área del canvas
      );

      colorInfo.innerText = "Pulsa en algún lugar de la imagen para detectar color";
      applyColorInfoStyle("#7A6DE3"); // Color morado predeterminado

      if (voiceEnabled) {
        speak("Imagen cargada correctamente. Pulsa en algún lugar de la imagen para detectar el color.");
      }
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Función para detectar el color del píxel en la posición clicada
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

  const pixelData = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b, a] = pixelData;

  // Verifica si el píxel es válido (no transparente)
  if (a === 0) {
    colorInfo.innerText = "No se detectó color en esta área.";
    applyColorInfoStyle("#000000"); // Fondo negro
    if (voiceEnabled) speak("No se detectó color en esta área.");
  } else {
    const colorName = categorizeColor(r, g, b);

    colorInfo.innerText = `Color Detectado: ${colorName}`;
    const backgroundColor = `rgb(${r}, ${g}, ${b})`; // Usa el color detectado como fondo
    applyColorInfoStyle(backgroundColor);

    if (voiceEnabled) speak(`Color detectado: ${colorName}`);
  }
});

// Función para aplicar el estilo del texto en el óvalo
function applyColorInfoStyle(backgroundColor) {
  colorInfo.style.color = "#FFFFFF"; // Texto blanco
  colorInfo.style.backgroundColor = backgroundColor; // Fondo dinámico basado en el color detectado
  colorInfo.style.borderRadius = "25px"; // Forma de óvalo
  colorInfo.style.padding = "10px 20px"; // Espaciado interno
  colorInfo.style.fontWeight = "bold"; // Texto más grueso
  colorInfo.style.fontSize = "1.2rem"; // Tamaño de fuente
  colorInfo.style.fontFamily = "Arial, sans-serif"; // Misma fuente
  colorInfo.style.textAlign = "center"; // Texto centrado
  colorInfo.style.display = "inline-block"; // Para mantener el óvalo
  colorInfo.style.marginTop = "20px"; // Separación del canvas
}

// Función para categorizar el color en uno de los básicos
function categorizeColor(r, g, b) {
  let closestColor = null;
  let minDistance = Infinity;

  for (const [name, [cr, cg, cb]] of Object.entries(basicColors)) {
    const distance = Math.sqrt(
      Math.pow(r - cr, 2) + Math.pow(g - cg, 2) + Math.pow(b - cb, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = name;
    }
  }

  return closestColor;
}
