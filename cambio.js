// Función para mostrar la pantalla principal
function showMainScreen() {
  document.querySelector('.main-screen').style.display = 'block';
  document.querySelector('.config-screen').style.display = 'none';
}

// Función para mostrar la pantalla de configuración
function showConfigScreen() {
  document.querySelector('.main-screen').style.display = 'none';
  document.querySelector('.config-screen').style.display = 'block';
}
