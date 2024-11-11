const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const colorInfo = document.getElementById('color-info');

let img = new Image();

// Función para cargar la imagen seleccionada en el canvas y ajustarla al tamaño del canvas
upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    img = new Image();
    img.onload = () => {
      // Ajustar el tamaño del canvas para que coincida con el contenedor y la imagen cargada
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Dibujar la imagen ajustada al tamaño del canvas
      colorInfo.innerText = "Pulsa en algún lugar de la imagen para detectar color";
      colorInfo.style.color = "#7A6DE3";
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Función para detectar el color del píxel en la posición clicada
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) * (img.width / canvas.width));
  const y = Math.floor((e.clientY - rect.top) * (img.height / canvas.height));

  const pixelData = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b, a] = pixelData;

  const rgbaColor = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  const hexColor = rgbToHex(r, g, b);

  colorInfo.innerText = `Color: ${rgbaColor} | HEX: ${hexColor}`;
  colorInfo.style.color = hexColor;
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
