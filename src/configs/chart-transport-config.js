import ChartDataLabels from 'chartjs-plugin-datalabels';

export const chartTransportConfig = {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,

  data: {
    labels: [], // types
    datasets: []
  },

  options: [],

  legend: {
    display: false
  },

  title: {
    display: true,
    text: `TRANSPORT`,
    position: `left`,
    color: `rgb(0, 0, 0)`,
    fontSize: `30`,
    fullWidth: true,
    padding: 20
  },

};
