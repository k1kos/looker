const container = document.createElement("div");
container.innerHTML = `<canvas id="myChart" width="400" height="300"></canvas>`;
document.body.appendChild(container);

// Load Chart.js and dataLabels plugin
const chartScript = document.createElement("script");
chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
document.head.appendChild(chartScript);

const pluginScript = document.createElement("script");
pluginScript.src = "https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels";
document.head.appendChild(pluginScript);

pluginScript.onload = () => {
  chartScript.onload = () => {
    renderChart(dsComponent.data);
  };
};

function renderChart(data) {
  const ctx = document.getElementById("myChart").getContext("2d");

  // Separate "My brand" from others
  let myBrandRow = null;
  const otherRows = [];

  data.rows.forEach(row => {
    if (row[0].v === "My brand") {
      myBrandRow = row;
    } else {
      otherRows.push(row);
    }
  });

  otherRows.sort((a, b) => b[1].v - a[1].v);

  const finalRows = myBrandRow ? [myBrandRow, ...otherRows] : otherRows;

  const labels = finalRows.map(row => row[0].v);
  const values = finalRows.map(row => row[1].v);

  const backgroundColors = finalRows.map(row =>
    row[0].v === "My brand" ? 'rgba(255, 99, 132, 0.8)' : 'rgba(54, 162, 235, 0.6)'
  );

  const borderColors = finalRows.map(row =>
    row[0].v === "My brand" ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)'
  );

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Brand Performance',
        data: values,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: function(value) {
            return new Intl.NumberFormat('en-US', {
              notation: "compact",
              style: 'currency',
              currency: 'EUR',
              maximumFractionDigits: 1
            }).format(value);
          },
          font: {
            weight: 'bold'
          },
          color: '#333'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}
