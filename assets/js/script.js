let chartInstance = null;

const resultado = document.getElementById("resultado");
const apiUrl = "https://mindicador.cl/api";
const apiUrlGraficoDolar = "https://mindicador.cl/api/dolar";
const apiUrlGraficoEuro = "https://mindicador.cl/api/euro";

async function getValores() {
  try {
    const res = await fetch(apiUrl);
    const valores = await res.json();
    let usd = valores.dolar.valor;
    let euro = valores.euro.valor;

    const cantidad = document.querySelector('input[type="number"]').value;
    const monedaSeleccionada = document.querySelector(
      'select[name="select"]'
    ).value;

    let resultadoConversion;
    if (monedaSeleccionada === "value1") {
      resultadoConversion = cantidad / usd;

      await ValoresGraficoDolar();
    } else if (monedaSeleccionada === "value2") {
      resultadoConversion = cantidad / euro;

      await ValoresGraficoEuro();
    } else {
      document.getElementById("myChart").style.display = "none"; // Ocultar el gráfico si no se selecciona ninguna moneda válida
      return; // Salir de la función para evitar errores
    }

    resultado.innerText = `${resultadoConversion.toFixed(2)}`;
  } catch (e) {
    alert(e.message);
  }
}

document.querySelector(".button").addEventListener("click", getValores);

async function ValoresGraficoDolar() {
  try {
    const res = await fetch(apiUrlGraficoDolar);
    const usdGrafico = await res.json();

    const ultimos10Dias = usdGrafico.serie.slice(0, 10).reverse();
    const valoresUltimos10Dias = ultimos10Dias.map((item) => item.valor);
    const fechasUltimos10Dias = ultimos10Dias.map((item) =>
      new Date(item.fecha).toLocaleDateString("es-CL")
    );

    crearGrafico(valoresUltimos10Dias, fechasUltimos10Dias);
  } catch (e) {
    alert(e.message);
  }
}

async function ValoresGraficoEuro() {
  try {
    const res = await fetch(apiUrlGraficoEuro);
    const euroGrafico = await res.json();

    const ultimos10Dias = euroGrafico.serie.slice(0, 10).reverse();
    const valoresUltimos10Dias = ultimos10Dias.map((item) => item.valor);
    const fechasUltimos10Dias = ultimos10Dias.map((item) =>
      new Date(item.fecha).toLocaleDateString("es-CL")
    );

    // Crear el gráfico con los datos
    crearGrafico(valoresUltimos10Dias, fechasUltimos10Dias);
  } catch (e) {
    alert(e.message);
  }
}

function crearGrafico(valores, fechas) {
  const ctx = document.getElementById("myChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: fechas,
      datasets: [
        {
          label: "Valor de la Moneda",
          data: valores,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `Valor: $${tooltipItem.raw}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Fecha",
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
        y: {
          title: {
            display: true,
            text: "Valor en CLP",
          },
          beginAtZero: true,
        },
      },
    },
  });

  document.getElementById("myChart").style.display = "block";
}
