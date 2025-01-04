function generateCombinedChart(data) {
  const ctx = document.getElementById('combinedChart').getContext('2d');

  const chart = new Chart(ctx, {
    type: 'bar', // Usamos un gráfico combinado de tipo 'bar' como base
    data: {
      labels: data.map((item) => item.ods), // ODS como etiquetas
      datasets: [
        {
          label: 'Número de Comunidades',
          data: data.map((item) => item.communities), // Datos de comunidades
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color de fondo
          borderColor: 'rgba(75, 192, 192, 1)', // Color del borde
          borderWidth: 1,
          yAxisID: 'y-axis-1',
        },
        {
          label: 'Número de Causas', // Si tuviéramos datos de causas, los incluiríamos aquí
          data: data.map((item) => item.causes), // Reemplaza esta línea con datos reales de causas
          borderColor: 'rgba(153, 102, 255, 1)', // Color de la línea
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          type: 'line', // Configura este dataset como una línea
          fill: false,
          yAxisID: 'y-axis-2',
        },
      ],
    },
    options: {
      responsive: true, // Hacer que el gráfico sea responsivo
      title: {
        // Título del gráfico
        display: true,
        text: 'Número de Comunidades y Causas por ODS',
      },
      scales: {
        y: {
          id: 'y-axis-1',
          ticks: {
            beginAtZero: true,
          },
        },
        y2: {
          id: 'y-axis-2',
          position: 'right',
          ticks: {
            beginAtZero: true,
          },
        },
      },
      plugins: {
        legend: {
          position: 'top', // Ubicación de la leyenda
        },
        tooltip: {
          enabled: true, // Activar tooltips para detalles al pasar el mouse
        },
      },
    },
  });
}
