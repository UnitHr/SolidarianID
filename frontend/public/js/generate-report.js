const checkbox = document.getElementById('include-graphics');
const chartPlaceholder = document.getElementById('chart-placeholder');
const generatePdfButton = document.getElementById('generate-pdf-button');

checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    chartPlaceholder.style.display = 'block';
  } else {
    chartPlaceholder.style.display = 'none';
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

function captureChartsAsImages() {
  const charts = document.querySelectorAll('canvas');
  charts.forEach((chart) => {
    const img = document.createElement('img');
    img.src = chart.toDataURL('image/png'); // Convert the canvas to an image
    chart.parentNode.replaceChild(img, chart); // Replace the canvas with the image
  });
}
// Function to generate the PDF using html2pdf
generatePdfButton.addEventListener('click', () => {
  const element = document.getElementById('community-details');
  captureChartsAsImages();
  const options = {
    filename: 'community-report.pdf',
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    html2canvas: {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    },
    image: {
      type: 'jpeg',
      quality: 0.98,
    },
    margin: [20, 20, 10, 10],
    pagebreak: { mode: 'avoid-all', before: '#avoid-page-break' },
  };
  ocultarElementos();

  html2pdf()
    .from(element)
    .set(options)
    .save()
    .then(() => {
      restaurarElementos();
    });
});
