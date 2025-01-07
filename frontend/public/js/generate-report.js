const checkbox = document.getElementById('include-graphics');
const chartPlaceholder = document.getElementById('chart-placeholder');
const generatePdfButton = document.getElementById('generate-pdf-button');

checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    chartPlaceholder.style.display = 'block'; // Mostrar el gráfico
  } else {
    chartPlaceholder.style.display = 'none'; // Ocultar el gráfico
  }
});

const ocultarElementos = () => {
  document.getElementById('include-graphics-text').style.display = 'none';
  document.getElementById('include-graphics').style.display = 'none';
  document
    .getElementById('community-details')
    .classList.remove('border', 'border-gray-300', 'bg-gray-50');
};

const restaurarElementos = () => {
  document.getElementById('include-graphics-text').style.display = 'block';
  document.getElementById('include-graphics').style.display = 'block';
  document
    .getElementById('community-details')
    .classList.add('border', 'border-gray-300', 'bg-gray-50');
};
// Función para generar el PDF utilizando html2pdf
generatePdfButton.addEventListener('click', () => {
  // Elemento que contiene el reporte
  const element = document.getElementById('community-details');

  // Configuración para el PDF
  const options = {
    filename: 'community-report.pdf', // Nombre del archivo generado
    jsPDF: {
      unit: 'mm', // Unidad de medida
      format: 'a4', // Formato de página (A4)
      orientation: 'portrait', // Orientación de la página
    },
    html2canvas: {
      scale: 2, // Doble resolución
      backgroundColor: '#ffffff', // Fondo blanco
      useCORS: true, // Usar CORS para imágenes
      logging: false, // Deshabilitar el logging
    },
    image: {
      type: 'jpeg', // Tipo de imagen para las imágenes dentro del PDF
      quality: 0.98, // Calidad de la imagen (0-1)
    },
    margin: [20, 20, 20, 20], // Márgenes de 20mm
    pagebreak: { mode: 'avoid-all', before: '#avoid-page-break' },
  };
  ocultarElementos();
  // Generar el PDF
  html2pdf()
    .from(element)
    .set(options)
    .save()
    .then(() => {
      restaurarElementos();
    });
});
