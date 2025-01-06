function generateColors(count) {
  return Array.from({ length: count }, (_, i) => {
    const h = ((i * 360) / count) % 360;
    return `hsla(${h}, 80%, 60%, 0.2)`;
  });
}

function generateCombinedChart(data, elementId) {
  const ctx = document.getElementById(elementId)?.getContext('2d');
  new Chart(ctx, {
    type: 'bar', // Type of combined chart (bars + line)
    data: {
      labels: data.map((item) => item.ods.title), // ODS as labels on the X axis
      datasets: [
        {
          label: 'Number of Communities',
          data: data.map((item) => item.communitiesCount),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Number of Causes',
          data: data.map((item) => item.causesCount),
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          type: 'line', // Set this dataset as a line
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Number of Communities and Causes by ODS',
        },
        legend: {
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  });
}

function generateSupportsPieChart(labels, data, elementId, title) {
  const backgroundColors = generateColors(data.length);
  const borderColors = backgroundColors.map((color) =>
    color.replace('0.2', '1'),
  );

  const ctx = document.getElementById(elementId)?.getContext('2d');

  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Percentage of Supports',
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
        },
        legend: {
          position: 'top',
        },
      },
    },
  });
}

function generatePolarAreaChart(labels, data, elementId, title) {
  const backgroundColors = generateColors(data.length);
  const borderColors = backgroundColors.map((color) =>
    color.replace('0.2', '1'),
  );

  const ctx = document.getElementById(elementId)?.getContext('2d');

  return new Chart(ctx, {
    type: 'polarArea',
    data: {
      labels: labels, // Etiquetas de las comunidades
      datasets: [
        {
          label: 'Actions progress',
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw + '%'; // Mostrar el progreso en el tooltip
            },
          },
        },
      },
    },
  });
}
