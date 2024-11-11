const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const colorInfo = document.getElementById('color-info');

let img = new Image();
let scale = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX, startY;

// Función para cargar la imagen seleccionada en el canvas y ajustarla al tamaño del canvas
upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    img = new Image();
    img.onload = () => {
      scale = 1;
      panX = 0;
      panY = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
      drawImage();
      colorInfo.innerText = "Pulsa en algún lugar de la imagen para detectar color";
      colorInfo.style.color = "#7A6DE3";
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Función para dibujar la imagen con el zoom y desplazamiento
function drawImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(panX, panY);
  ctx.scale(scale, scale);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

// Función para detectar el color del píxel en la posición clicada
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left - panX) / scale);
  const y = Math.floor((e.clientY - rect.top - panY) / scale);

  const pixelData = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b, a] = pixelData;

  const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  const hexColor = rgbToHex(r, g, b);

  colorInfo.innerText = `Color: ${rgbaColor} | HEX: ${hexColor}`;
  colorInfo.style.color = hexColor;
});

// Zoom con la rueda del ratón
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomIntensity = 0.1;
  scale += e.deltaY < 0 ? zoomIntensity : -zoomIntensity;
  scale = Math.min(Math.max(0.5, scale), 3); // Limita el zoom entre 0.5x y 3x
  drawImage();
});

// Desplazamiento de la imagen
canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX - panX;
  startY = e.clientY - panY;
  canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    drawImage();
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.style.cursor = 'grab';
});

// Función para convertir RGB a HEX
function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}
